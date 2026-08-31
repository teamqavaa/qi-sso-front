"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { GraduationCap, House, LogOut, ShoppingCart, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchTrigger from "@/components/search/SearchTrigger";
import { useUser } from "@/context/UserContext";
import { logoutAction } from "@/actions/auth";
import { SSO_PUBLIC_HOME_ORIGIN } from "@/lib/sso";
import { cn } from "@/lib/utils";

// Mirrors the contents-lab pill top bar so the student home shares the look of
// the public landing page. "My Learning" is the single primary destination.
export default function StudentTopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isSigningOut, startSignOut] = useTransition();

  const displayName = user?.display_name || user?.full_name || "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 hidden bg-[#f8fafc] pt-6 pb-2 md:block">
      <div className="mx-auto w-[92%] max-w-5xl">
        <div className="flex items-center justify-between gap-8 rounded-full border border-gray-300 bg-white p-1.5 pl-2 shadow-lg shadow-gray-200/50">
          <div className="flex items-center gap-5">
            <Link
              href="/home"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black transition-transform hover:scale-105"
              aria-label="Go to home"
            >
              <span className="text-2xl font-bold text-white">QI</span>
            </Link>

            <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
              <Link
                href="/home"
                aria-current={pathname === "/home" ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  pathname === "/home" ? "text-blue-400" : "text-black hover:text-blue-400"
                )}
              >
                <House size={14} strokeWidth={2} />
                Home
              </Link>
              <Link
                href="/dashboard"
                aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  pathname.startsWith("/dashboard") ? "text-blue-400" : "text-black hover:text-blue-400"
                )}
              >
                <GraduationCap size={14} strokeWidth={2} />
                My Learning
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <SearchTrigger />
            <a
              href={`${SSO_PUBLIC_HOME_ORIGIN}/cart`}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center focus:outline-none"
                  aria-label="User menu"
                >
                  <Avatar className="size-8 border border-gray-200 bg-gray-100">
                    <AvatarFallback className="bg-gray-100 font-medium text-gray-500">
                      {initials || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px] p-2">
                <DropdownMenuLabel className="px-1 pt-1 pb-2">
                  <span className="block truncate text-xs font-semibold text-gray-800">
                    {displayName || "User"}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600">Online</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => startSignOut(() => logoutAction())}
                  disabled={isSigningOut}
                  className="text-xs font-medium text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
