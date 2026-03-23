"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

type CategoryBreakdown = { name: string; icon: string; amount: number; color: string };
type DailySpending     = { day: number; amount: number };

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DonutTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-background rounded-xl px-3 py-2 shadow-sm text-sm">
      <p className="font-semibold text-primary">{payload[0].name}</p>
      <p className="text-secondary">{fmt(payload[0].value)}</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-background rounded-xl px-3 py-2 shadow-sm text-sm">
      <p className="font-semibold text-primary">Day {label}</p>
      <p className="text-[#FC5C65]">{fmt(payload[0].value)}</p>
    </div>
  );
}

export default function MonthlyCharts({
  categoryBreakdown,
  dailySpending,
}: {
  categoryBreakdown: CategoryBreakdown[];
  dailySpending: DailySpending[];
}) {
  const hasCategories = categoryBreakdown.length > 0;
  const hasDaily      = dailySpending.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Donut — Expense by Category */}
      <div className="bg-surface rounded-2xl p-5 border border-background">
        <h3 className="text-sm font-semibold text-primary mb-4">Spending by Category</h3>
        {hasCategories ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-secondary">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[260px] flex items-center justify-center text-sm text-secondary">
            No expenses this period
          </div>
        )}
      </div>

      {/* Bar — Daily Spending */}
      <div className="bg-surface rounded-2xl p-5 border border-background">
        <h3 className="text-sm font-semibold text-primary mb-4">Daily Spending</h3>
        {hasDaily ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailySpending} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#4B6584" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Day", position: "insideBottom", offset: -2, fontSize: 11, fill: "#4B6584" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#4B6584" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={55}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "#F5F5F7" }} />
              <Bar dataKey="amount" fill="#FC5C65" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[260px] flex items-center justify-center text-sm text-secondary">
            No expenses this period
          </div>
        )}
      </div>
    </div>
  );
}
