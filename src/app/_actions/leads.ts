"use server";

import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { leadSchema } from "@/lib/validation";

export type LeadResult = { ok: true } | { ok: false; error: string };

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const partIdRaw = formData.get("partId");
  const parsed = leadSchema.safeParse({
    partId: partIdRaw ? Number(partIdRaw) : undefined,
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    quantity: formData.get("quantity") || 1,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos",
    };
  }

  await getDb()
    .insert(leads)
    .values({
      partId: parsed.data.partId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      quantity: parsed.data.quantity,
      message: parsed.data.message,
    });

  return { ok: true };
}
