"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Line, ComposedChart,
} from "recharts";

type MonthlyOverview = {
  month: number;
  monthName: string;
  income: number;
  expense: number;
  net: number;
};

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function YearlyTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-background rounded-xl px-3 py-2 shadow-sm text-sm space-y-1">
      <p className="font-semibold text-primary">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function YearlyChart({ monthlyOverview }: { monthlyOverview: MonthlyOverview[] }) {
  const hasData = monthlyOverview.some((m) => m.income > 0 || m.expense > 0);

  return (
    <div className="bg-surface rounded-2xl p-5 border border-background">
      <h3 className="text-sm font-semibold text-primary mb-4">Income vs Expenses</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyOverview} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" vertical={false} />
            <XAxis
              dataKey="monthName"
              tick={{ fontSize: 11, fill: "#4B6584" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#4B6584" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={60}
            />
            <Tooltip content={<YearlyTooltip />} cursor={{ fill: "#F5F5F7" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-secondary capitalize">{value}</span>
              )}
            />
            <Bar dataKey="income"  name="Income"   fill="#A8E6CF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expenses"  fill="#FC5C65" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="#3B3B98"
              strokeWidth={2}
              dot={{ fill: "#3B3B98", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-sm text-secondary">
          No data for this year
        </div>
      )}
    </div>
  );
}
