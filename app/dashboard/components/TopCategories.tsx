import { getIcon } from "./icon-map";

type Category = { name: string; icon: string; amount: number; percentage: number; color: string };

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TopCategories({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-background flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary">Top Spending</h3>

      {categories.length === 0 ? (
        <p className="text-sm text-secondary text-center py-6">No expenses this period</p>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => {
            const IconComponent = getIcon(cat.icon);
            return (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {/* Rank */}
                  <span className="text-xs font-bold text-secondary w-4">{i + 1}</span>

                  {/* Icon */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.color + "22" }}>
                    {IconComponent ? (
                      <IconComponent className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    ) : (
                      <span className="text-xs">{cat.name[0]}</span>
                    )}
                  </div>

                  {/* Name + amount */}
                  <span className="text-sm font-medium text-primary flex-1">{cat.name}</span>
                  <span className="text-sm font-semibold text-primary">${fmt(cat.amount)}</span>
                  <span className="text-xs text-secondary w-9 text-right">{cat.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="ml-6 h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
