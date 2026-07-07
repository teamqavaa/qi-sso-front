"use client";

import { useState, useTransition } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";
import type { User } from "@/types/user";
import { logoutAction } from "@/actions/auth";
import styles from "@/components/dashboard/Dashboard.module.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", iconName: "LayoutDashboard" as const },
  { id: "labs", label: "My Labs", iconName: "FlaskConical" as const },
  { id: "courses", label: "Courses", iconName: "BookOpen" as const },
  { id: "progress", label: "Progress", iconName: "BarChart2" as const },
  { id: "settings", label: "Settings", iconName: "Settings" as const },
];

const navIconMap = {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
};

function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const navSegment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const [isSigningOut, startSignOut] = useTransition();

  function getInitials(name: string | null, displayName: string | null): string {
    const target = displayName || name || "User";
    return target
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <aside className={`flex flex-col w-56 flex-shrink-0 h-full ${styles.sidebar}`}>
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#007bff] flex items-center justify-center">
            <FlaskConical size={13} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-xs font-semibold text-foreground tracking-tight">Digital Readiness Lab</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 pl-8">by Qavaa Innovate</p>
      </div>

      <div className="px-5 py-5 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-sm mb-2">
          {getInitials(user?.full_name ?? null, user?.display_name ?? null)}
        </div>
        <p className="text-sm font-medium text-foreground leading-tight">
          {user?.display_name || user?.full_name || "User"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {user?.city ? `${user.city}${user?.country ? `, ${user.country}` : ""}` : user?.country || ""}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map(({ id, label, iconName }) => {
          const Icon = navIconMap[iconName];
          const isActive = navSegment === id;
          return (
            <button
              key={id}
              onClick={() => router.push(id === "dashboard" ? "/dashboard" : `/${id}`)}
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

      <div className="px-3 pb-5">
        <button
          onClick={() => startSignOut(() => logoutAction())}
          disabled={isSigningOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors text-left disabled:opacity-50"
        >
          <LogOut size={15} strokeWidth={1.5} />
          <span className="text-sm">{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </aside>
  );
}

function Header({ title }: { title: string }) {
  const { user } = useUser();
  const displayName = user?.display_name || user?.full_name || "User";

  return (
    <header className={`flex items-center justify-between px-8 h-14 flex-shrink-0 ${styles.header}`}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#f0f2f5] transition-colors">
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#007bff]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-xs">
          {displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default function DashboardShell({
  initialUser,
  children,
}: {
  initialUser: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeNav = pathname.split("/").filter(Boolean)[0] || "dashboard";

  const pageTitle: Record<string, string> = {
    dashboard: "Dashboard",
    labs: "My Labs",
    courses: "Courses",
    progress: "Progress",
    settings: "Settings",
  };

  return (
    <UserProvider initialUser={initialUser}>
      <div className={`flex h-screen w-full overflow-hidden ${styles.container}`}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <Header title={pageTitle[activeNav] || ""} />
          <main className={`flex-1 overflow-y-auto ${styles.scrollbarHidden}`}>
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
