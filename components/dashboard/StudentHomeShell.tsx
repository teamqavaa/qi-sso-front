"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FlaskConical, GraduationCap, House, LogOut, Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserProvider, useUser } from "@/context/UserContext";
import { getMeAction, clearAuthCookies, logoutAction } from "@/actions/auth";
import styles from "@/components/dashboard/Dashboard.module.css";

// The student home is a lighter surface than the dashboard: only two links,
// per product spec. My Learning routes straight into the student dashboard.
const homeNavItems = [
  { href: "/dashboard", label: "My Learning", icon: GraduationCap },
  { href: "/home/settings", label: "Settings", icon: Settings },
];

function HomeSidebar({
  className,
  collapsed = false,
  pathname,
  onNavigate,
}: {
  className?: string;
  collapsed?: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  // Same pattern as the dashboard sidebar: a transition-driven Sign out.
  const [isSigningOut, startSignOut] = useTransition();

  return (
    <aside
      className={cn(
        "flex h-full flex-shrink-0 flex-col bg-zinc-950 text-white transition-[width] duration-200",
        collapsed ? "w-14" : "w-56",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 pt-6 pb-4">
        <Link
          href="/home"
          className="flex items-center gap-2 rounded-md outline-offset-2 hover:opacity-80 focus-visible:outline"
          aria-label="Go to home"
        >
          <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-md bg-white/10">
            <FlaskConical size={13} strokeWidth={2} />
          </div>
          {!collapsed && (
            <span className="text-xs font-semibold tracking-tight">
              Digital Readiness Lab
            </span>
          )}
        </Link>
      </div>
      {!collapsed && (
        <p className="px-5 pb-5 pl-[4.25rem] text-[10px] uppercase tracking-widest text-white/40">
          by Qavaa
        </p>
      )}

      <nav className="flex-1 px-3 py-2">
        {homeNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                "mb-0.5 flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-white font-medium text-zinc-950"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("pb-5", collapsed ? "px-2" : "px-3")}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            // Close the drawer before the redirect so the panel does not cover the page.
            onNavigate?.();
            startSignOut(() => logoutAction());
          }}
          disabled={isSigningOut}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut size={15} strokeWidth={1.5} />
          {!collapsed && (
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default function StudentHomeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Guards against the double-invoke of effects in React strict mode.
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    // Deferred read keeps the SSR markup stable and satisfies the
    // no-setState-in-effect rule.
    const frame = requestAnimationFrame(() => {
      setCollapsed(localStorage.getItem("home-sidebar-collapsed") === "1");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

    function toggleCollapsed() {
    setCollapsed((current) => {
      localStorage.setItem("home-sidebar-collapsed", current ? "0" : "1");
      return !current;
    });
  }

  return (
    <UserProvider initialUser={null}>
      <HomeUserHydrator />
      <div className={cn("flex h-dvh w-full overflow-hidden bg-zinc-50", styles.container)}>
        <HomeSidebar
          className="hidden lg:flex"
          collapsed={collapsed}
          pathname={pathname}
        />
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-white px-4 sm:px-8">
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
                <HomeSidebar pathname={pathname} onNavigate={() => setMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              aria-pressed={collapsed}
              onClick={toggleCollapsed}
              className="hidden shrink-0 rounded-full lg:inline-flex"
            >
              <Menu />
            </Button>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
            >
              <House size={15} strokeWidth={1.5} />
              Home
            </Link>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}

// Mirrors DashboardShell's hydrator: load the profile after first paint so the
// home page can greet by name, and drop to login if the token is invalid.
function HomeUserHydrator() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || user) return;
    startedRef.current = true;

    let cancelled = false;
    getMeAction().then((result) => {
      if (cancelled) return;
      if (result.user) {
        updateUser(result.user);
      } else {
        clearAuthCookies().then(() => router.replace("/"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, updateUser, router]);

  return null;
}