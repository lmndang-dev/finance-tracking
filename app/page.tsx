const transactions = [
  { label: "Salary", amount: "+$6,000", type: "income" },
  { label: "Freelance", amount: "+$2,240", type: "income" },
  { label: "Rent", amount: "-$1,500", type: "expense" },
  { label: "Groceries", amount: "-$420", type: "expense" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">

      {/* Navbar */}
      <nav className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-primary font-bold text-xl">FinTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-5 py-2 text-primary font-medium rounded-full border border-primary hover:bg-primary hover:text-white transition-colors text-sm"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-[#2d2d7a] transition-colors text-sm"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <span className="text-sm font-semibold text-secondary bg-surface px-4 py-1.5 rounded-full shadow-sm mb-6">
          Personal Finance, Simplified
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight max-w-3xl mb-6">
          Take Control of Your{" "}
          <span className="text-secondary">Financial Future</span>
        </h1>
        <p className="text-lg text-secondary max-w-xl mb-10 leading-relaxed">
          Track your income, manage expenses, and get personalized advice from
          certified finance advisors — all in one place.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/signup"
            className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-[#2d2d7a] transition-colors shadow-md"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 border border-secondary text-secondary font-semibold rounded-full hover:bg-surface transition-colors"
          >
            See How It Works
          </a>
        </div>

        {/* Preview card */}
        <div className="mt-20 bg-surface rounded-2xl shadow-lg p-6 w-full max-w-sm text-left">
          <p className="text-xs text-secondary font-medium mb-4 uppercase tracking-wide">
            March 2026 Overview
          </p>
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs text-secondary mb-1">Total Income</p>
              <p className="text-2xl font-bold text-primary">$8,240</p>
              <span className="text-xs font-medium text-[#1a7a52] bg-income/30 px-2 py-0.5 rounded-full">
                + Income
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-primary">$3,580</p>
              <span className="text-xs font-medium text-expense bg-expense/10 px-2 py-0.5 rounded-full">
                − Expense
              </span>
            </div>
          </div>
          <div className="space-y-0">
            {transactions.map((tx) => (
              <div
                key={tx.label}
                className="flex justify-between items-center py-2.5 border-b border-background last:border-0"
              >
                <span className="text-sm text-secondary">{tx.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "income" ? "text-[#1a7a52]" : "text-expense"
                  }`}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary text-center mb-4">
            Everything you need
          </h2>
          <p className="text-secondary text-center mb-14 max-w-lg mx-auto">
            A complete toolkit to understand, track, and grow your personal
            finances.
          </p>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Income */}
            <div className="bg-background rounded-2xl p-8">
              <div className="w-12 h-12 bg-income rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-[#1a7a52]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Income Tracking
              </h3>
              <p className="text-secondary leading-relaxed text-sm">
                Log salaries, freelance payments, dividends, and any other
                income streams. See exactly where your money comes from.
              </p>
            </div>

            {/* Expense */}
            <div className="bg-background rounded-2xl p-8">
              <div className="w-12 h-12 bg-expense/15 rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-expense"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Expense Management
              </h3>
              <p className="text-secondary leading-relaxed text-sm">
                Categorize and monitor your spending habits. Set budgets and get
                alerts before you overspend.
              </p>
            </div>

            {/* Advisors */}
            <div className="bg-background rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Finance Advisors
              </h3>
              <p className="text-secondary leading-relaxed text-sm">
                Connect with certified financial advisors who review your data
                and provide personalized, actionable guidance.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center text-white">
          <div>
            <p className="text-4xl font-bold mb-2">$2.4B+</p>
            <p className="text-income text-sm">Transactions tracked</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">50K+</p>
            <p className="text-income text-sm">Active users</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">200+</p>
            <p className="text-income text-sm">Certified advisors</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Start your financial journey today
          </h2>
          <p className="text-secondary mb-8">
            Join thousands of people who have already taken control of their
            finances.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/signup"
              className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-[#2d2d7a] transition-colors shadow-md"
            >
              Create Free Account
            </a>
            <a
              href="/login"
              className="px-8 py-3.5 border border-primary text-primary font-semibold rounded-full hover:bg-surface transition-colors"
            >
              Log In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-background py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-primary font-bold">FinTrack</span>
          </div>
          <p className="text-xs text-secondary">
            © 2026 FinTrack. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
