const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type Period = { type: "monthly"; year: number; month: number } | { type: "yearly"; year: number };

export default function PeriodSelector({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  function prev() {
    if (period.type === "yearly") {
      onChange({ type: "yearly", year: period.year - 1 });
    } else {
      const newMonth = period.month === 1 ? 12 : period.month - 1;
      const newYear  = period.month === 1 ? period.year - 1 : period.year;
      onChange({ type: "monthly", year: newYear, month: newMonth });
    }
  }

  function next() {
    if (period.type === "yearly") {
      onChange({ type: "yearly", year: period.year + 1 });
    } else {
      const newMonth = period.month === 12 ? 1 : period.month + 1;
      const newYear  = period.month === 12 ? period.year + 1 : period.year;
      onChange({ type: "monthly", year: newYear, month: newMonth });
    }
  }

  const label =
    period.type === "monthly"
      ? `${MONTHS[period.month - 1]} ${period.year}`
      : String(period.year);

  return (
    <div className="flex items-center gap-3">
      {/* Toggle */}
      <div className="flex bg-surface border border-background rounded-xl overflow-hidden">
        {(["monthly", "yearly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === period.type) return;
              if (t === "monthly") {
                const now = new Date();
                onChange({ type: "monthly", year: now.getFullYear(), month: now.getMonth() + 1 });
              } else {
                onChange({ type: "yearly", year: period.year });
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
              period.type === t
                ? "bg-primary text-white"
                : "text-secondary hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Navigator */}
      <div className="flex items-center gap-2 bg-surface border border-background rounded-xl px-1 py-1">
        <button
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-primary transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-primary min-w-[120px] text-center">
          {label}
        </span>
        <button
          onClick={next}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-primary transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
