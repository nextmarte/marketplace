import { describe, expect, it } from "vitest";
import { leadSchema, orderSchema, partInputSchema } from "./validation";

describe("leadSchema", () => {
  it("aceita dados válidos e coage quantidade", () => {
    const r = leadSchema.safeParse({
      name: "Ana",
      email: "ana@exemplo.com",
      quantity: "3",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.quantity).toBe(3);
  });

  it("usa quantidade 1 por padrão", () => {
    const r = leadSchema.safeParse({ name: "Ana", email: "a@x.com" });
    expect(r.success && r.data.quantity).toBe(1);
  });

  it("rejeita e-mail inválido", () => {
    expect(leadSchema.safeParse({ name: "Ana", email: "nope" }).success).toBe(
      false,
    );
  });

  it("rejeita nome muito curto", () => {
    expect(
      leadSchema.safeParse({ name: "A", email: "a@x.com" }).success,
    ).toBe(false);
  });
});

describe("orderSchema", () => {
  it("exige endereço de entrega", () => {
    expect(
      orderSchema.safeParse({
        customerName: "João",
        customerEmail: "joao@x.com",
        address: "Rua das Flores, 100 - SP",
      }).success,
    ).toBe(true);
    expect(
      orderSchema.safeParse({
        customerName: "João",
        customerEmail: "joao@x.com",
        address: "",
      }).success,
    ).toBe(false);
  });
});

describe("partInputSchema", () => {
  it("coage preço e ids numéricos vindos de formulário", () => {
    const r = partInputSchema.safeParse({
      name: "Peça nova",
      description: "Descrição da peça",
      sku: "XX-1",
      categoryId: "2",
      sellerId: "1",
      priceCents: "12990",
      stockStatus: "em_falta",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.priceCents).toBe(12990);
      expect(r.data.categoryId).toBe(2);
    }
  });
});
