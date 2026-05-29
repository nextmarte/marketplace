"use server";

import { inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, parts } from "@/db/schema";
import { orderSchema } from "@/lib/validation";

export type OrderResult =
  | { ok: true; orderId: number }
  | { ok: false; error: string };

export async function submitOrder(input: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  items: { partId: number; quantity: number }[];
}): Promise<OrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Seu carrinho está vazio" };
  }

  const db = getDb();
  const ids = input.items.map((i) => i.partId);

  // Recalcula os preços a partir do banco (não confia no cliente).
  const rows = await db
    .select({ id: parts.id, priceCents: parts.priceCents })
    .from(parts)
    .where(inArray(parts.id, ids));
  const priceById = new Map(rows.map((r) => [r.id, r.priceCents]));

  const lineItems = input.items
    .filter((i) => priceById.has(i.partId) && i.quantity > 0)
    .map((i) => ({
      partId: i.partId,
      quantity: i.quantity,
      unitPriceCents: priceById.get(i.partId) as number,
    }));

  if (lineItems.length === 0) {
    return { ok: false, error: "Itens inválidos" };
  }

  const totalCents = lineItems.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0,
  );

  const [order] = await db
    .insert(orders)
    .values({
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      address: parsed.data.address,
      totalCents,
    })
    .returning();

  await db
    .insert(orderItems)
    .values(lineItems.map((i) => ({ orderId: order.id, ...i })));

  return { ok: true, orderId: order.id };
}
