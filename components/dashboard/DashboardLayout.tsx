"use client";

import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import { User, NavItem } from "./types";

const navIconMap = {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
};

export default function DashboardLayout({
  user,
  navItems,
  activeNav,
  setActiveNav,
  children,
}: {
  user: User;
  navItems: NavItem[];
  activeNav: string;
  setActiveNav: (nav: string) => void;
  children: React.ReactNode;
}) {
  const pageTitle: Record<string, string> = {
    dashboard: "Dashboard",
    labs: "My Labs",
    courses: "Courses",
    progress: "Progress",
    settings: "Settings",
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${styles.container}`}>
      {/* Sidebar */}
      <aside
        className={`flex flex-col w-56 flex-shrink-0 h-full ${styles.sidebar}`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#007bff] flex items-center justify-center">
              <FlaskConical size={13} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold text-foreground tracking-tight">Digital Readiness Lab</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 pl-8">by Qavaa Innovate</p>
        </div>

        {/* Avatar */}
        <div className="px-5 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-sm mb-2">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.city}, {user.country}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map(({ id, label, iconName }) => {
            const Icon = navIconMap[iconName];
            const isActive = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 transition-colors relative group ${
                  isActive ? styles.navItemActive : styles.navItemInactive
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{ color: isActive ? "#007bff" : "#8a8fa3" }}
                />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors text-left">
            <LogOut size={15} strokeWidth={1.5} />
            <span className="text-sm">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <header
          className={`flex items-center justify-between px-8 h-14 flex-shrink-0 ${styles.header}`}
        >
          <h2 className="text-sm font-semibold text-foreground">{pageTitle[activeNav]}</h2>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#f0f2f5] transition-colors">
              <Bell size={16} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#007bff]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-xs">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className={`flex-1 overflow-y-auto ${styles.scrollbarHidden}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
