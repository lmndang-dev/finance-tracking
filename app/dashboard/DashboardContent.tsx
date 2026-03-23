"use client";

import { useEffect, useRef, useState } from "react";
import SummaryCards        from "./components/SummaryCards";
import PeriodSelector      from "./components/PeriodSelector";
import MonthlyCharts       from "./components/MonthlyCharts";
import YearlyChart         from "./components/YearlyChart";
import RecentTransactions  from "./components/RecentTransactions";
import TopCategories       from "./components/TopCategories";

type Period =
  | { type: "monthly"; year: number; month: number }
  | { type: "yearly";  year: number };

type DashboardData = {
  summary: {
    income: number;
    expense: number;
    net: number;
    incomeChangePct: number | null;
    expenseChangePct: number | null;
  };
  categoryBreakdown?: { name: string; icon: string; amount: number; color: string }[];
  dailySpending?:     { day: number; amount: number }[];
  monthlyOverview?:   { month: number; monthName: string; income: number; expense: number; net: number }[];
  recentTransactions: {
    id: string; date: string; amount: number; type: "INCOME" | "EXPENSE";
    note: string | null;
    category: { name: string; icon: string };
    subcategory: { name: string } | null;
  }[];
  topCategories: { name: string; icon: string; amount: number; percentage: number; color: string }[];
};

function buildUrl(period: Period) {
  const base = `/api/dashboard?period=${period.type}&year=${period.year}`;
  return period.type === "monthly" ? `${base}&month=${period.month}` : base;
}

function now() {
  const d = new Date();
  return { type: "monthly" as const, year: d.getFullYear(), month: d.getMonth() + 1 };
}

type RecentTransaction = DashboardData["recentTransactions"][number];

export default function DashboardContent({
  userName,
  onMenuToggle,
}: {
  userName: string;
  onMenuToggle: () => void;
}) {
  const [period,  setPeriod]  = useState<Period>(now);
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const recentLoaded = useRef(false);
  // Bumping this forces a refetch without changing period (used for bfcache restore)
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    setLoading(true);

    fetch(buildUrl(period), { signal: controller.signal, cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: DashboardData) => {
        if (!mounted) return;
        setData(d);
        if (!recentLoaded.current) {
          setRecentTransactions(d.recentTransactions);
          recentLoaded.current = true;
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return; // unmounted — don't touch state
        setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [period, refetchKey]);

  // Re-fetch when browser restores page from bfcache (back button)
  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        recentLoaded.current = false;
        setRefetchKey((k) => k + 1);
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-background text-secondary hover:text-primary transition-colors shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-secondary text-sm mt-0.5">Welcome back, {userName}!</p>
          </div>
        </div>
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-secondary text-sm">
          Loading...
        </div>
      ) : !data ? (
        <div className="flex items-center justify-center h-64 text-secondary text-sm">
          Failed to load data.
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Summary cards — 1 col mobile, 3 col sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCards summary={data.summary} />
          </div>

          {/* Charts — 1 col mobile, 2 col xl+ */}
          {period.type === "monthly" ? (
            <MonthlyCharts
              categoryBreakdown={data.categoryBreakdown ?? []}
              dailySpending={data.dailySpending ?? []}
            />
          ) : (
            <YearlyChart monthlyOverview={data.monthlyOverview ?? []} />
          )}

          {/* Bottom row — 1 col mobile, 2 col lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentTransactions transactions={recentTransactions} />
            <TopCategories      categories={data.topCategories} />
          </div>
        </div>
      )}
    </main>
  );
}
