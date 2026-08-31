"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { BookOpen, GraduationCap, House, LogOut, Route, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

// Lightweight mobile bar: logo, avatar, and a drawer for the nav links. Kept
// separate from the desktop pill bar because small screens need a compact tap
// target instead of a wide search input.
export default function StudentMobileTopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();

  const displayName = user?.display_name || user?.full_name || "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-neutral-200/60 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link href="/home" className="flex items-center gap-2" aria-label="Go to home">
            <div className="flex size-9 items-center justify-center rounded-full bg-black text-white">
              <span className="text-base font-bold">QI</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Avatar className="size-9 border border-gray-200 bg-gray-100">
              <AvatarFallback className="bg-gray-100 font-medium text-gray-500">
                {initials || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[61px] z-30 bg-white p-6 md:hidden">
          <nav className="flex flex-col gap-4 text-lg font-bold">
            <Link
              href="/home"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === "/home" ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b border-neutral-100 py-2",
                pathname === "/home" ? "text-blue-400" : "text-neutral-900"
              )}
            >
              <House className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b border-neutral-100 py-2",
                pathname.startsWith("/dashboard") ? "text-blue-400" : "text-neutral-900"
              )}
            >
              <GraduationCap className="h-5 w-5" />
              My Learning
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === "/courses" ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b border-neutral-100 py-2",
                pathname === "/courses" ? "text-blue-400" : "text-neutral-900"
              )}
            >
              <BookOpen className="h-5 w-5" />
              Courses
            </Link>
            <Link
              href="/learning-path"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname.startsWith("/learning-path") ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b border-neutral-100 py-2",
                pathname.startsWith("/learning-path") ? "text-blue-400" : "text-neutral-900"
              )}
            >
              <Route className="h-5 w-5" />
              Tracks
            </Link>
            <button
              type="button"
              onClick={() => startSignOut(() => logoutAction())}
              disabled={isSigningOut}
              className="flex items-center gap-2 border-b border-neutral-100 py-2 text-left text-lg font-bold text-red-600"
            >
              <LogOut className="h-5 w-5" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
