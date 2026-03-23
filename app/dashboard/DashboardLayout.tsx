"use client";

import { useState } from "react";
import Sidebar          from "./Sidebar";
import DashboardContent from "./DashboardContent";

type Props = {
  user:     { name: string; email: string };
  userName: string;
};

export default function DashboardLayout({ user, userName }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <DashboardContent
        userName={userName}
        onMenuToggle={() => setMobileOpen((o) => !o)}
      />
    </div>
  );
}
