import { getIcon } from "./icon-map";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  note: string | null;
  category: { name: string; icon: string };
  subcategory: { name: string } | null;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-background flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary">Recent Transactions</h3>

      {transactions.length === 0 ? (
        <p className="text-sm text-secondary text-center py-6">No transactions yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((t) => {
            const IconComponent = getIcon(t.category.icon);
            const isIncome = t.type === "INCOME";

            return (
              <div key={t.id} className="flex items-center gap-3">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isIncome ? "bg-[#A8E6CF]/30" : "bg-[#FC5C65]/10"
                }`}>
                  {IconComponent ? (
                    <IconComponent className={`w-4 h-4 ${isIncome ? "text-green-700" : "text-[#FC5C65]"}`} />
                  ) : (
                    <span className="text-xs">{t.category.name[0]}</span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {t.note ?? t.subcategory?.name ?? t.category.name}
                  </p>
                  <p className="text-xs text-secondary">
                    {t.category.name}{t.subcategory ? ` · ${t.subcategory.name}` : ""} · {fmtDate(t.date)}
                  </p>
                </div>

                {/* Amount */}
                <span className={`text-sm font-semibold shrink-0 ${isIncome ? "text-green-600" : "text-[#FC5C65]"}`}>
                  {isIncome ? "+" : "-"}${fmt(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
