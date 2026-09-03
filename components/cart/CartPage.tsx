import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import CartItemRow from "./CartItemRow";
import type { Cart } from "@/actions/cart";

export default function CartPage({
  cart,
  error,
  hrefBase = "/browse-courses",
}: {
  cart: Cart | null;
  error: string | null;
  hrefBase?: string;
}) {
  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-6 sm:px-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Your cart</h1>
        <Link
          href={hrefBase}
          className="text-xs font-semibold text-blue-600 underline-offset-4 hover:underline"
        >
          Continue browsing
        </Link>
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-4 text-xs text-red-600">
          {error}. Cart could not be loaded.
        </p>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Your cart is empty</p>
            <p className="mt-1 text-xs text-neutral-500">
              Browse courses and add something to get started.
            </p>
          </div>
          <Link
            href={hrefBase}
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-700"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white px-5">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} hrefBase={hrefBase} />
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Total ({cart.items_count} {cart.items_count === 1 ? "item" : "items"})
              </p>
              <p className="text-2xl font-bold text-foreground">${cart.total_price}</p>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700 sm:w-auto"
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
