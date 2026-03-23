type Summary = {
  income: number;
  expense: number;
  net: number;
  incomeChangePct: number | null;
  expenseChangePct: number | null;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ChangeBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  return (
    <span className={`text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct)}% vs last period
    </span>
  );
}

export default function SummaryCards({ summary }: { summary: Summary }) {
  const savingsRate =
    summary.income > 0 ? Math.round((summary.net / summary.income) * 100) : 0;

  const cards = [
    {
      label: "Total Income",
      value: `+$${fmt(summary.income)}`,
      valueColor: "text-green-600",
      bg: "bg-[#A8E6CF]/20",
      border: "border-[#A8E6CF]",
      change: <ChangeBadge pct={summary.incomeChangePct} />,
    },
    {
      label: "Total Expenses",
      value: `-$${fmt(summary.expense)}`,
      valueColor: "text-[#FC5C65]",
      bg: "bg-[#FC5C65]/10",
      border: "border-[#FC5C65]",
      change: <ChangeBadge pct={summary.expenseChangePct} />,
    },
    {
      label: "Net Savings",
      value: `${summary.net >= 0 ? "+" : "-"}$${fmt(Math.abs(summary.net))}`,
      valueColor: summary.net >= 0 ? "text-primary" : "text-[#FC5C65]",
      bg: "bg-primary/5",
      border: "border-primary",
      change: (
        <span className="text-xs text-secondary">
          Savings rate: <span className="font-semibold text-primary">{savingsRate}%</span>
        </span>
      ),
    },
  ];

  return (
    <>
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.bg} border ${c.border} border-opacity-50 rounded-2xl p-5 flex flex-col gap-1`}
        >
          <span className="text-xs font-medium text-secondary uppercase tracking-wide">
            {c.label}
          </span>
          <span className={`text-2xl font-bold ${c.valueColor}`}>{c.value}</span>
          {c.change}
        </div>
      ))}
    </>
  );
}
