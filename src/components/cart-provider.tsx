"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  cartCount,
  cartReducer,
  cartTotalCents,
  emptyCart,
  type CartItem,
} from "@/lib/cart";

const STORAGE_KEY = "amperia-cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (partId: number) => void;
  setQty: (partId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", items: JSON.parse(raw) as CartItem[] });
      }
    } catch {
      // ignora carrinho corrompido
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state]);

  const value: CartContextValue = {
    items: state.items,
    count: cartCount(state.items),
    totalCents: cartTotalCents(state.items),
    add: (item, quantity) => dispatch({ type: "add", item, quantity }),
    remove: (partId) => dispatch({ type: "remove", partId }),
    setQty: (partId, quantity) => dispatch({ type: "setQty", partId, quantity }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  }
  return ctx;
}
