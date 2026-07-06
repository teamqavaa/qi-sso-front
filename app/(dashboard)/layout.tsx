"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import styles from "@/components/dashboard/Dashboard.module.css";
import { User, NavItem, Stat, Lab } from "@/components/dashboard/types";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider, UserProfile, useUser } from "@/components/contexts/UserContext";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockUserLegacy: User = {
  name: "Amara Osei",
  displayName: "amara.o",
  city: "Accra",
  country: "Ghana",
  bio: "Aspiring full-stack developer passionate about building for Africa.",
  birthDate: "1999-04-12",
  language: "English",
  avatar: "AO",
};

const initialUserProfile: UserProfile = {
  fullName: mockUserLegacy.name,
  displayName: mockUserLegacy.displayName,
  avatar: mockUserLegacy.avatar,
  bio: mockUserLegacy.bio,
  birthDate: mockUserLegacy.birthDate,
  city: mockUserLegacy.city,
  country: mockUserLegacy.country,
  language: mockUserLegacy.language,
};

const mockStats: Stat[] = [
  { label: "Labs Completed", value: 14, iconName: "Award" },
  { label: "Hours Practiced", value: 38, iconName: "BarChart2" },
  { label: "Current Streak", value: "6 days", iconName: "FlaskConical" },
];

const mockInProgressLabs: Lab[] = [
  { id: 1, title: "React State Management", lang: "React", progress: 68 },
  { id: 2, title: "Python Data Structures", lang: "Python", progress: 41 },
  { id: 3, title: "REST API Design", lang: "Node.js", progress: 85 },
  { id: 4, title: "SQL Query Optimization", lang: "SQL", progress: 22 },
];

const mockRecommendedLabs: Lab[] = [
  { id: 5, title: "TypeScript Fundamentals", lang: "TypeScript" },
  { id: 6, title: "CSS Grid Mastery", lang: "CSS" },
  { id: 7, title: "Git & Collaboration", lang: "Git" },
  { id: 8, title: "Async JavaScript", lang: "JavaScript" },
];

const mockNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
  { id: "labs", label: "My Labs", iconName: "FlaskConical" },
  { id: "courses", label: "Courses", iconName: "BookOpen" },
  { id: "progress", label: "Progress", iconName: "BarChart2" },
  { id: "settings", label: "Settings", iconName: "Settings" },
];

const mockLangColors: Record<string, string> = {
  React: "text-blue-600 bg-blue-50",
  Python: "text-indigo-600 bg-indigo-50",
  "Node.js": "text-green-700 bg-green-50",
  SQL: "text-orange-600 bg-orange-50",
  TypeScript: "text-blue-700 bg-blue-50",
  CSS: "text-pink-600 bg-pink-50",
  Git: "text-gray-700 bg-gray-100",
  JavaScript: "text-yellow-700 bg-yellow-50",
};

const navIconMap = {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
};

// Sidebar Component that uses UserContext
function Sidebar({ activeNav, onNavClick }: { activeNav: string; onNavClick: (id: string) => void }) {
  const { user } = useUser();

  return (
    <aside className={`flex flex-col w-56 flex-shrink-0 h-full ${styles.sidebar}`}>
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
          {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <p className="text-sm font-medium text-foreground leading-snug">{user.fullName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{user.city}, {user.country}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {mockNavItems.map(({ id, label, iconName }) => {
          const Icon = navIconMap[iconName];
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavClick(id)}
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
  );
}

// Header Component that uses UserContext
function Header({ title }: { title: string }) {
  const { user } = useUser();

  return (
    <header className={`flex items-center justify-between px-8 h-14 flex-shrink-0 ${styles.header}`}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#f0f2f5] transition-colors">
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#007bff]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-xs">
          {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get activeNav from the pathname (e.g., '/dashboard' → 'dashboard', '/dashboard/labs' → 'labs')
  const segments = pathname.split("/").filter(Boolean);
  const activeNav = segments.length > 1 ? segments[1] : "dashboard";
  
  const pageTitle: Record<string, string> = {
    dashboard: "Dashboard",
    labs: "My Labs",
    courses: "Courses",
    progress: "Progress",
    settings: "Settings",
  };

  function handleNavClick(id: string) {
    router.push(`/${id === "dashboard" ? "dashboard" : `dashboard/${id}`}`);
  }

  return (
    <UserProvider initialUser={initialUserProfile}>
      <div className={`flex h-screen w-full overflow-hidden ${styles.container}`}>
        <Sidebar activeNav={activeNav} onNavClick={handleNavClick} />
        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <Header title={pageTitle[activeNav] || ""} />
          {/* Scrollable content */}
          <main className={`flex-1 overflow-y-auto ${styles.scrollbarHidden}`}>
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

// Export mock data for use in pages
export { mockUserLegacy as mockUser, initialUserProfile, mockStats, mockInProgressLabs, mockRecommendedLabs, mockLangColors };
