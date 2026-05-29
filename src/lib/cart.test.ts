import { describe, expect, it } from "vitest";
import {
  cartCount,
  cartReducer,
  cartTotalCents,
  emptyCart,
  type CartItem,
} from "./cart";

const base: Omit<CartItem, "quantity"> = {
  partId: 1,
  slug: "pastilha",
  name: "Pastilha",
  priceCents: 10000,
  imageKey: null,
  sku: "FR-1",
};

describe("cartReducer", () => {
  it("adiciona um item novo com quantidade 1", () => {
    const s = cartReducer(emptyCart, { type: "add", item: base });
    expect(s.items).toHaveLength(1);
    expect(s.items[0].quantity).toBe(1);
  });

  it("incrementa a quantidade ao adicionar item existente", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base, quantity: 2 });
    s = cartReducer(s, { type: "add", item: base, quantity: 3 });
    expect(s.items).toHaveLength(1);
    expect(s.items[0].quantity).toBe(5);
  });

  it("remove um item", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base });
    s = cartReducer(s, { type: "remove", partId: 1 });
    expect(s.items).toHaveLength(0);
  });

  it("setQty com 0 remove o item", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base });
    s = cartReducer(s, { type: "setQty", partId: 1, quantity: 0 });
    expect(s.items).toHaveLength(0);
  });

  it("setQty define a quantidade", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base });
    s = cartReducer(s, { type: "setQty", partId: 1, quantity: 7 });
    expect(s.items[0].quantity).toBe(7);
  });

  it("clear esvazia o carrinho", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base });
    s = cartReducer(s, { type: "clear" });
    expect(s.items).toHaveLength(0);
  });
});

describe("cartCount / cartTotalCents", () => {
  it("soma quantidades e totais", () => {
    let s = cartReducer(emptyCart, { type: "add", item: base, quantity: 2 });
    s = cartReducer(s, {
      type: "add",
      item: { ...base, partId: 2, priceCents: 5000 },
      quantity: 1,
    });
    expect(cartCount(s.items)).toBe(3);
    expect(cartTotalCents(s.items)).toBe(2 * 10000 + 5000);
  });
});
