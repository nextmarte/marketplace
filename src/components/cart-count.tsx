"use client";

import { useCart } from "./cart-provider";

export function CartCount() {
  const { count } = useCart();
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-brand-300 ring-2 ring-brand-500">
      {count}
    </span>
  );
}
