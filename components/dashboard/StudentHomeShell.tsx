"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { UserProvider, useUser } from "@/context/UserContext";
import { getMeAction, clearAuthCookies } from "@/actions/auth";
import type { User } from "@/types/user";
import StudentTopBar from "@/components/dashboard/StudentTopBar";
import StudentMobileTopBar from "@/components/dashboard/StudentMobileTopBar";

// The student home uses the public-homepage pill top bar on desktop and a
// compact bar on mobile. Both carry the same nav links and profile avatar.
export default function StudentHomeShell({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserProvider initialUser={initialUser}>
      <HomeUserHydrator />
      <div className="flex min-h-dvh w-full flex-col bg-zinc-50">
        <StudentTopBar />
        <StudentMobileTopBar />
        <main className="flex-1">
          {/* Offset below the fixed bars; the pill bar is taller on desktop. */}
          <div className="pt-24 md:pt-24">{children}</div>
        </main>
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
    getMeAction()
      .then((result) => {
        if (cancelled) return;
        if (result.user) {
          updateUser(result.user);
        } else {
          clearAuthCookies().then(() => router.replace("/"));
        }
      })
      .catch(() => {
        // A transient failure must not pin the shell to a null user forever;
        // reset the guard so the next render retries.
        startedRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [user, updateUser, router]);

  return null;
}
