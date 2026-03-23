"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getIcon } from "./components/icon-map";

const navItems = [
  { label: "Overview", href: "/dashboard",         icon: "layout-dashboard" },
  { label: "Income",   href: "/dashboard/income",  icon: "trending-up"      },
  { label: "Expenses", href: "/dashboard/expenses", icon: "trending-down"   },
];

type Props = {
  user:         { name: string; email: string };
  mobileOpen:   boolean;
  onClose:      () => void;
};

export default function Sidebar({ user, mobileOpen, onClose }: Props) {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        // Base
        "bg-surface border-r border-background flex flex-col transition-all duration-300",
        // Mobile: fixed overlay, controlled by mobileOpen
        "fixed inset-y-0 left-0 z-30",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: back in flow, always visible, collapse controls width
        "lg:relative lg:z-auto lg:inset-auto lg:translate-x-0",
        collapsed ? "lg:w-16" : "lg:w-64",
        // Mobile always full width sidebar (not collapsed)
        "w-64",
      ].join(" ")}
    >
      {/* Logo + toggle */}
      <div className="px-3 py-5 border-b border-background flex items-center justify-between min-h-[72px]">
        {/* Logo */}
        <div className={`flex items-center gap-2 ${collapsed ? "pl-0 mx-auto" : "pl-1"}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          {!collapsed && (
            <span className="text-primary font-bold text-lg">FinTrack</span>
          )}
        </div>

        {/* Desktop: collapse or expand toggle */}
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-primary transition-colors shrink-0"
            title="Expand"
          >
            ›
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-primary transition-colors shrink-0"
            title="Collapse"
          >
            ‹
          </button>
        )}

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-background transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active        = pathname === item.href;
          const IconComponent = getIcon(item.icon);
          const isCollapsed   = collapsed;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isCollapsed ? "lg:justify-center" : "",
                active
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-background hover:text-primary",
              ].join(" ")}
            >
              {IconComponent && <IconComponent className="w-5 h-5 shrink-0" />}
              <span className={isCollapsed ? "lg:hidden" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-4 border-t border-background">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-primary truncate">{user.name}</p>
            <p className="text-xs text-secondary truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Log Out" : undefined}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
            "text-secondary hover:bg-background hover:text-expense transition-colors",
            collapsed ? "lg:justify-center" : "",
          ].join(" ")}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={collapsed ? "lg:hidden" : ""}>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
