import { PrismaClient, TransactionType, RecurringType } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const USER_ID = "95208967-921c-4f46-8161-052c8bdefccc";

async function getCat(name: string, type: TransactionType) {
  const cat = await prisma.category.findFirst({ where: { name, type } });
  if (!cat) throw new Error(`Category not found: ${name}`);
  return cat;
}

async function getSub(name: string, categoryId: string) {
  return prisma.subcategory.findFirst({ where: { name, categoryId } });
}

async function main() {
  // ─── EXPENSE transactions ──────────────────────────────────────────────────
  const foodCat        = await getCat("Food & Beverage", TransactionType.EXPENSE);
  const transportCat   = await getCat("Transportation",  TransactionType.EXPENSE);
  const housingCat     = await getCat("Housing & Bills", TransactionType.EXPENSE);
  const entertainCat   = await getCat("Entertainment",   TransactionType.EXPENSE);
  const otherExpCat    = await getCat("Others",          TransactionType.EXPENSE);

  const supermarketSub = await getSub("Supermarket",   foodCat.id);
  const restaurantSub  = await getSub("Restaurant",    foodCat.id);
  const fastFoodSub    = await getSub("Fast Food",     foodCat.id);
  const coffeeShopSub  = await getSub("Coffee Shop",   foodCat.id);
  const gasSub         = await getSub("Gas",           transportCat.id);
  const rideSub        = await getSub("Ride Share",    transportCat.id);
  const rentSub        = await getSub("Rent",          housingCat.id);
  const electricSub    = await getSub("Electricity",   housingCat.id);
  const internetSub    = await getSub("Internet",      housingCat.id);
  const streamingSub   = await getSub("Streaming",     entertainCat.id);

  // ─── INCOME transactions ───────────────────────────────────────────────────
  const salaryCat      = await getCat("Salary",         TransactionType.INCOME);
  const investCat      = await getCat("Investment",     TransactionType.INCOME);
  const giftCat        = await getCat("Gift & Transfer",TransactionType.INCOME);

  const fullTimeSub    = await getSub("Full-time",  salaryCat.id);
  const dividendsSub   = await getSub("Dividends",  investCat.id);
  const giftSub        = await getSub("Gift",       giftCat.id);

  const transactions = [
    // March salary
    {
      userId: USER_ID, type: TransactionType.INCOME,
      categoryId: salaryCat.id, subcategoryId: fullTimeSub?.id,
      amount: 3500.00, date: new Date("2026-03-15"),
      note: "March paycheck",
      isRecurring: true, recurringType: RecurringType.SALARY,
    },
    // Rent
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: housingCat.id, subcategoryId: rentSub?.id,
      amount: 1200.00, date: new Date("2026-03-01"),
      note: "March rent",
      isRecurring: true, recurringType: RecurringType.RENT,
    },
    // Electricity bill
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: housingCat.id, subcategoryId: electricSub?.id,
      amount: 85.50, date: new Date("2026-03-03"),
      note: "March electricity",
      isRecurring: true, recurringType: RecurringType.BILL,
    },
    // Internet bill
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: housingCat.id, subcategoryId: internetSub?.id,
      amount: 59.99, date: new Date("2026-03-03"),
      note: null,
      isRecurring: true, recurringType: RecurringType.BILL,
    },
    // Netflix
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: entertainCat.id, subcategoryId: streamingSub?.id,
      amount: 15.99, date: new Date("2026-03-05"),
      note: "Netflix subscription",
      isRecurring: true, recurringType: RecurringType.SUBSCRIPTION,
    },
    // Grocery run
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: foodCat.id, subcategoryId: supermarketSub?.id,
      amount: 112.40, date: new Date("2026-03-08"),
      note: "Weekly groceries",
      isRecurring: false, recurringType: null,
    },
    // Coffee
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: foodCat.id, subcategoryId: coffeeShopSub?.id,
      amount: 6.50, date: new Date("2026-03-10"),
      note: "Starbucks",
      isRecurring: false, recurringType: null,
    },
    // Gas
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: transportCat.id, subcategoryId: gasSub?.id,
      amount: 55.00, date: new Date("2026-03-11"),
      note: null,
      isRecurring: false, recurringType: null,
    },
    // Restaurant dinner
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: foodCat.id, subcategoryId: restaurantSub?.id,
      amount: 78.30, date: new Date("2026-03-14"),
      note: "Dinner with friends",
      isRecurring: false, recurringType: null,
    },
    // Dividends
    {
      userId: USER_ID, type: TransactionType.INCOME,
      categoryId: investCat.id, subcategoryId: dividendsSub?.id,
      amount: 220.00, date: new Date("2026-03-15"),
      note: "Q1 dividends",
      isRecurring: false, recurringType: null,
    },
    // Fast food
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: foodCat.id, subcategoryId: fastFoodSub?.id,
      amount: 14.80, date: new Date("2026-03-17"),
      note: "McDonald's",
      isRecurring: false, recurringType: null,
    },
    // Uber
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: transportCat.id, subcategoryId: rideSub?.id,
      amount: 22.50, date: new Date("2026-03-18"),
      note: "Uber to airport",
      isRecurring: false, recurringType: null,
    },
    // Birthday gift received
    {
      userId: USER_ID, type: TransactionType.INCOME,
      categoryId: giftCat.id, subcategoryId: giftSub?.id,
      amount: 150.00, date: new Date("2026-03-20"),
      note: "Birthday gift from parents",
      isRecurring: false, recurringType: null,
    },
    // Grocery run 2
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: foodCat.id, subcategoryId: supermarketSub?.id,
      amount: 95.20, date: new Date("2026-03-21"),
      note: "Weekly groceries",
      isRecurring: false, recurringType: null,
    },
    // Others - misc expense
    {
      userId: USER_ID, type: TransactionType.EXPENSE,
      categoryId: otherExpCat.id, subcategoryId: null,
      amount: 30.00, date: new Date("2026-03-22"),
      note: "Miscellaneous expense",
      isRecurring: false, recurringType: null,
    },
  ];

  await prisma.transaction.createMany({ data: transactions });

  console.log(`✓ Created ${transactions.length} test transactions for user ${USER_ID}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
