"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartContextValue = {
  itemCount: number;
  setItemCount: (count: number) => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
  initialItemCount,
  children,
}: {
  initialItemCount: number;
  children: ReactNode;
}) {
  const [itemCount, setItemCount] = useState<number>(initialItemCount);

  const value = useMemo(
    () => ({ itemCount, setItemCount }),
    [itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
