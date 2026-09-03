"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { removeFromCartAction } from "@/actions/cart";
import { resolveThumbnail } from "@/lib/image";
import { useCart } from "@/context/CartContext";
import type { CartItemDetail } from "@/actions/cart";

export default function CartItemRow({
  item,
  hrefBase,
}: {
  item: CartItemDetail;
  hrefBase: string;
}) {
  const router = useRouter();
  const { itemCount, setItemCount } = useCart();
  const [pending, startTransition] = useTransition();

  const remove = () => {
    startTransition(async () => {
      const result = await removeFromCartAction(item.course);
      if (result.ok) {
        setItemCount(Math.max(0, itemCount - 1));
        router.refresh();
      }
    });
  };

  return (
    <li className="flex flex-col gap-4 border-b border-neutral-100 py-5 last:border-b-0 sm:flex-row sm:items-center">
      <Link href={`${hrefBase}/${item.course_details.slug}`} className="block shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveThumbnail(item.course_details.thumbnail)}
          alt={item.course_details.title}
          className="h-24 w-36 rounded-xl border border-neutral-200 object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`${hrefBase}/${item.course_details.slug}`}
          className="text-sm font-bold text-neutral-900 transition-colors hover:text-blue-600"
        >
          {item.course_details.title}
        </Link>
        <p className="line-clamp-1 text-xs text-neutral-500">
          {item.course_details.subtitle || item.course_details.description}
        </p>
        <span className="mt-1 text-sm font-semibold text-neutral-900">${Number(item.price) || 0}</span>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={remove}
        className="flex w-fit items-center gap-1.5 self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:self-center"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {pending ? "Removing..." : "Remove"}
      </button>
    </li>
  );
}
