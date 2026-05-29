export type CartItem = {
  partId: number;
  slug: string;
  name: string;
  priceCents: number;
  imageKey: string | null;
  sku: string;
  quantity: number;
};

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "add"; item: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "remove"; partId: number }
  | { type: "setQty"; partId: number; quantity: number }
  | { type: "hydrate"; items: CartItem[] }
  | { type: "clear" };

export const emptyCart: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = action.quantity ?? 1;
      const exists = state.items.some((i) => i.partId === action.item.partId);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.partId === action.item.partId
              ? { ...i, quantity: i.quantity + qty }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.partId !== action.partId) };
    case "setQty": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.partId !== action.partId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.partId === action.partId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      };
    }
    case "hydrate":
      return { items: action.items };
    case "clear":
      return emptyCart;
    default:
      return state;
  }
}

/** Quantidade total de itens (soma das quantidades). */
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Total do carrinho em centavos. */
export function cartTotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}
