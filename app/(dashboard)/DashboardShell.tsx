"use client";

import { useState, useTransition } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Search,
  Sparkles,
  ChevronDown,
  Menu,
  Route,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";
import type { User } from "@/types/user";
import { logoutAction } from "@/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import styles from "@/components/dashboard/Dashboard.module.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", iconName: "LayoutDashboard" as const },
  { id: "learning-path", label: "Learning Path", iconName: "Route" as const },
  { id: "labs", label: "My Labs", iconName: "FlaskConical" as const },
  { id: "courses", label: "Courses", iconName: "BookOpen" as const },
  { id: "progress", label: "Progress", iconName: "BarChart2" as const },
  { id: "settings", label: "Settings", iconName: "Settings" as const },
];

const navIconMap = {
  LayoutDashboard,
  Route,
  FlaskConical,
  BookOpen,
  BarChart2,
  Settings,
};

const learningPathItems = [
  { path: "/learning-path/skill", label: "Skill Path" },
  { path: "/learning-path/career", label: "Career Path" },
];

function getInitials(name: string | null | undefined): string {
  return (name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function lowercase(value: string | null | undefined): string {
  return value ? value.toLowerCase() : "";
}

function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const navSegment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const [isSigningOut, startSignOut] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    navSegment === "learning-path" ? "learning-path" : null
  );

  const initials = getInitials(user?.display_name || user?.full_name);
  const location = user?.city
    ? `${user.city.toUpperCase()}, ${user.country?.toUpperCase() ?? ""}`
    : user?.country?.toUpperCase();

  return (
    <aside
      className={cn(
        "flex h-full w-56 flex-shrink-0 flex-col bg-zinc-950 text-white",
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-6 pb-4">
        <div className="flex size-6 items-center justify-center rounded-md bg-white/10">
          <FlaskConical size={13} strokeWidth={2} />
        </div>
        <span className="text-xs font-semibold tracking-tight">Digital Readiness Lab</span>
      </div>
      <p className="px-5 pb-5 pl-[4.25rem] text-[10px] uppercase tracking-widest text-white/40">
        by Qavaa
      </p>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <Avatar className="size-10 bg-white">
            <AvatarFallback className="bg-white text-zinc-950">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">
              {user?.display_name || user?.full_name || "User"}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-white/60">
              {location ? `${location} · ${lowercase(user?.language)}` : ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navItems.map(({ id, label, iconName }) => {
          const Icon = navIconMap[iconName];
          const isActive = navSegment === id;
          const hasChildren = id === "learning-path";
          const isExpanded = expandedId === id;

          const buttonClass = cn(
            "mb-0.5 h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
            isActive
              ? "bg-white font-medium text-zinc-950 hover:bg-white hover:text-zinc-950"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          );

          if (hasChildren) {
            return (
              <div key={id}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setExpandedId((current) => (current === id ? null : id))
                  }
                  aria-expanded={isExpanded}
                  aria-current={isActive ? "page" : undefined}
                  className={buttonClass}
                >
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  <span>{label}</span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={cn(
                      "ml-auto transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </Button>
                {isExpanded && (
                  <div className="mb-0.5">
                    {learningPathItems.map((item) => {
                      const isSubActive = pathname === item.path;
                      return (
                        <Button
                          key={item.path}
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            router.push(item.path);
                            onNavigate?.();
                          }}
                          aria-current={isSubActive ? "page" : undefined}
                          className={cn(
                            "h-auto w-full justify-start gap-3 rounded-lg py-2.5 pl-11 pr-3 text-left text-sm",
                            isSubActive
                              ? "bg-white font-medium text-zinc-950 hover:bg-white hover:text-zinc-950"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <span>{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Button
              key={id}
              type="button"
              variant="ghost"
              onClick={() => {
                router.push(id === "dashboard" ? "/dashboard" : `/${id}`);
                onNavigate?.();
              }}
              aria-current={isActive ? "page" : undefined}
              className={buttonClass}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span>{label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            // Close the drawer before the redirect so the panel does not cover the login page.
            onNavigate?.();
            startSignOut(() => logoutAction());
          }}
          disabled={isSigningOut}
          className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={15} strokeWidth={1.5} />
          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </Button>
      </div>
    </aside>
  );
}

function Header() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();
  const router = useRouter();
  const initials = getInitials(user?.display_name || user?.full_name);

  return (
    <header
      className={cn(
        "flex h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-8",
        styles.header
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Open menu"
              className="shrink-0 rounded-full lg:hidden"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-zinc-950 p-0 text-white">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar
              className="h-full w-full"
              onNavigate={() => setMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Search is decorative and too wide for small screens, so it hides below md. */}
        <div className="relative hidden w-64 md:block">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search labs, courses, skills..."
            aria-label="Search"
            className="h-8 rounded-full border-transparent bg-zinc-100 pl-8 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="hidden rounded-full font-mono text-[11px] uppercase tracking-widest lg:inline-flex"
        >
          <Sparkles />
          Recommended
        </Button>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Account menu"
              className="h-auto gap-2 rounded-full p-0.5 pr-2"
            >
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown size={14} strokeWidth={1.5} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {user?.display_name || user?.full_name || "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => router.push("/settings")}
            >
              <Settings size={15} strokeWidth={1.5} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => startSignOut(() => logoutAction())}
              disabled={isSigningOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut size={15} strokeWidth={1.5} />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
  return (
    <UserProvider initialUser={initialUser}>
      <div className={cn("flex h-dvh w-full overflow-hidden bg-zinc-50", styles.container)}>
        {/* The drawer in Header replaces this sidebar below lg. */}
        <Sidebar className="hidden lg:flex" />
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <Header />
          <main className={cn("flex-1 overflow-y-auto", styles.scrollbarHidden)}>
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}