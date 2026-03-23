import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/app/generated/prisma/client";

// Fixed color per category name (matches globals.css)
const CATEGORY_COLORS: Record<string, string> = {
  "Food & Beverage": "#F7B731",
  "Transportation":  "#4B6584",
  "Shopping":        "#fd9644",
  "Housing & Bills": "#3B3B98",
  "Health":          "#FC5C65",
  "Entertainment":   "#a55eea",
  "Education":       "#45aaf2",
  "Travel":          "#2bcbba",
  "Personal Care":   "#ff6b9d",
  "Others":          "#b2bec3",
  // Income categories
  "Salary":          "#A8E6CF",
  "Business":        "#26de81",
  "Investment":      "#45aaf2",
  "Gift & Transfer": "#fd9644",
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function pctChange(current: number, prev: number): number | null {
  if (prev === 0) return null;
  return Math.round(((current - prev) / prev) * 100);
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "monthly";
  const year   = parseInt(searchParams.get("year")  ?? String(new Date().getFullYear()));
  const month  = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));

  if (period === "yearly") {
    return Response.json(await getYearlyData(userId, year));
  }
  return Response.json(await getMonthlyData(userId, year, month));
}

// ─── Monthly ──────────────────────────────────────────────────────────────────

async function getMonthlyData(userId: string, year: number, month: number) {
  const start    = new Date(year, month - 1, 1);
  const end      = new Date(year, month, 1);
  const prevStart = new Date(year, month - 2, 1);
  const prevEnd   = new Date(year, month - 1, 1);

  // Current + previous period totals
  const [curIncome, curExpense, prevIncome, prevExpense] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.INCOME,  date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.EXPENSE, date: { gte: start, lt: end } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.INCOME,  date: { gte: prevStart, lt: prevEnd } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.EXPENSE, date: { gte: prevStart, lt: prevEnd } }, _sum: { amount: true } }),
  ]);

  const income  = Number(curIncome._sum.amount  ?? 0);
  const expense = Number(curExpense._sum.amount ?? 0);
  const pIncome  = Number(prevIncome._sum.amount  ?? 0);
  const pExpense = Number(prevExpense._sum.amount ?? 0);

  // Expense breakdown by category
  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: TransactionType.EXPENSE, date: { gte: start, lt: end } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categoryIds = grouped.map((r) => r.categoryId);
  const categories  = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
  const catMap      = Object.fromEntries(categories.map((c) => [c.id, c]));

  const categoryBreakdown = grouped.map((r) => {
    const cat = catMap[r.categoryId];
    return {
      name:   cat?.name ?? "Unknown",
      icon:   cat?.icon ?? "circle",
      amount: Number(r._sum.amount ?? 0),
      color:  CATEGORY_COLORS[cat?.name ?? ""] ?? "#b2bec3",
    };
  });

  const totalExpense = categoryBreakdown.reduce((s, c) => s + c.amount, 0);
  const topCategories = categoryBreakdown.slice(0, 3).map((c) => ({
    ...c,
    percentage: totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0,
  }));

  // Daily spending
  const expenseRows = await prisma.transaction.findMany({
    where:  { userId, type: TransactionType.EXPENSE, date: { gte: start, lt: end } },
    select: { date: true, amount: true },
  });

  const dailyMap: Record<number, number> = {};
  for (const t of expenseRows) {
    const day = new Date(t.date).getDate();
    dailyMap[day] = (dailyMap[day] ?? 0) + Number(t.amount);
  }
  const dailySpending = Object.entries(dailyMap)
    .map(([day, amount]) => ({ day: parseInt(day), amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => a.day - b.day);

  // Recent 3 transactions
  const recentTransactions = await getRecentTransactions(userId);

  return {
    summary: {
      income,
      expense,
      net: income - expense,
      incomeChangePct:  pctChange(income, pIncome),
      expenseChangePct: pctChange(expense, pExpense),
    },
    categoryBreakdown,
    dailySpending,
    recentTransactions,
    topCategories,
  };
}

// ─── Yearly ───────────────────────────────────────────────────────────────────

async function getYearlyData(userId: string, year: number) {
  const start    = new Date(year, 0, 1);
  const end      = new Date(year + 1, 0, 1);
  const prevStart = new Date(year - 1, 0, 1);
  const prevEnd   = new Date(year, 0, 1);

  const [allRows, prevIncome, prevExpense] = await Promise.all([
    prisma.transaction.findMany({
      where:  { userId, date: { gte: start, lt: end } },
      select: { date: true, amount: true, type: true, categoryId: true },
    }),
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.INCOME,  date: { gte: prevStart, lt: prevEnd } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: TransactionType.EXPENSE, date: { gte: prevStart, lt: prevEnd } }, _sum: { amount: true } }),
  ]);

  // Aggregate by month
  const monthlyMap: Record<number, { income: number; expense: number }> = {};
  for (let m = 1; m <= 12; m++) monthlyMap[m] = { income: 0, expense: 0 };

  let totalIncome = 0;
  let totalExpense = 0;
  const catTotals: Record<string, number> = {};

  for (const t of allRows) {
    const m      = new Date(t.date).getMonth() + 1;
    const amount = Number(t.amount);
    if (t.type === TransactionType.INCOME) {
      monthlyMap[m].income += amount;
      totalIncome += amount;
    } else {
      monthlyMap[m].expense += amount;
      totalExpense += amount;
      catTotals[t.categoryId] = (catTotals[t.categoryId] ?? 0) + amount;
    }
  }

  const monthlyOverview = Object.entries(monthlyMap).map(([m, v]) => ({
    month:     parseInt(m),
    monthName: MONTH_NAMES[parseInt(m) - 1],
    income:    Math.round(v.income  * 100) / 100,
    expense:   Math.round(v.expense * 100) / 100,
    net:       Math.round((v.income - v.expense) * 100) / 100,
  }));

  // Top categories for the year
  const categoryIds = Object.keys(catTotals);
  const categories  = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
  const catMap      = Object.fromEntries(categories.map((c) => [c.id, c]));

  const topCategories = Object.entries(catTotals)
    .map(([id, amount]) => {
      const cat = catMap[id];
      return { name: cat?.name ?? "Unknown", icon: cat?.icon ?? "circle", amount, color: CATEGORY_COLORS[cat?.name ?? ""] ?? "#b2bec3" };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((c) => ({ ...c, percentage: totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0 }));

  const pIncome  = Number(prevIncome._sum.amount  ?? 0);
  const pExpense = Number(prevExpense._sum.amount ?? 0);

  const recentTransactions = await getRecentTransactions(userId);

  return {
    summary: {
      income:  Math.round(totalIncome  * 100) / 100,
      expense: Math.round(totalExpense * 100) / 100,
      net:     Math.round((totalIncome - totalExpense) * 100) / 100,
      incomeChangePct:  pctChange(totalIncome,  pIncome),
      expenseChangePct: pctChange(totalExpense, pExpense),
    },
    monthlyOverview,
    recentTransactions,
    topCategories,
  };
}

// ─── Shared ───────────────────────────────────────────────────────────────────

async function getRecentTransactions(userId: string) {
  const rows = await prisma.transaction.findMany({
    where:   { userId },
    orderBy: { date: "desc" },
    take:    3,
    include: { category: true, subcategory: true },
  });

  return rows.map((t) => ({
    id:          t.id,
    date:        t.date.toISOString(),
    amount:      Number(t.amount),
    type:        t.type,
    note:        t.note,
    category:    { name: t.category.name, icon: t.category.icon },
    subcategory: t.subcategory ? { name: t.subcategory.name } : null,
  }));
}
