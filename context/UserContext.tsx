"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";

type UserContextValue = {
  user: User | null;
  updateUser: (partial: Partial<User>) => void;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, ...partial } : currentUser,
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [updateUser, user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
