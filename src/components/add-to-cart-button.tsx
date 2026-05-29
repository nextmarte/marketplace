"use client";

import { useState } from "react";
import type { CartItem } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  item,
  className,
}: {
  item: Omit<CartItem, "quantity">;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(item, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors",
        added
          ? "bg-brand-700 text-paper"
          : "bg-brand-500 text-ink hover:bg-brand-400",
        className,
      )}
    >
      {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
