"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { getDb } from "@/db";
import { leads, orderItems, parts } from "@/db/schema";
import { uploadToR2 } from "@/lib/r2-server";
import { slugify } from "@/lib/slug";
import { partInputSchema } from "@/lib/validation";

export type PartActionResult = { ok: false; error: string } | null;

function reaisToCents(raw: string): number {
  let s = raw.trim();
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(",", ".");
  }
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

/** Otimiza e envia a imagem ao R2. Retorna key, null (sem imagem) ou erro. */
async function processImage(
  formData: FormData,
  name: string,
): Promise<string | null | { ok: false; error: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const out = await sharp(buf)
      .resize(1000, 750, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();
    const key = `parts/${slugify(name)}-${Date.now()}.webp`;
    await uploadToR2(key, out, "image/webp");
    return key;
  } catch {
    return {
      ok: false,
      error: "Falha ao enviar a imagem. Configure o R2 no .env ou salve sem imagem.",
    };
  }
}

function parsePart(formData: FormData) {
  return partInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    sellerId: formData.get("sellerId"),
    priceCents: reaisToCents(String(formData.get("price") ?? "")),
    stockStatus: formData.get("stockStatus"),
    featured: formData.get("featured") === "on",
  });
}

export async function createPart(formData: FormData): Promise<PartActionResult> {
  const parsed = parsePart(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const img = await processImage(formData, parsed.data.name);
  if (img && typeof img === "object") return img;

  try {
    await getDb()
      .insert(parts)
      .values({
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description,
        sku: parsed.data.sku,
        categoryId: parsed.data.categoryId,
        sellerId: parsed.data.sellerId,
        priceCents: parsed.data.priceCents,
        stockStatus: parsed.data.stockStatus,
        featured: parsed.data.featured ?? false,
        imageKey: typeof img === "string" ? img : null,
      });
  } catch {
    return {
      ok: false,
      error: "Não foi possível criar a peça (nome/SKU pode já existir).",
    };
  }

  revalidatePath("/admin/pecas");
  revalidatePath("/pecas");
  redirect("/admin/pecas");
}

export async function updatePart(formData: FormData): Promise<PartActionResult> {
  const id = Number(formData.get("id"));
  if (!id) return { ok: false, error: "Peça inválida" };

  const parsed = parsePart(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const img = await processImage(formData, parsed.data.name);
  if (img && typeof img === "object") return img;

  const base = {
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description,
    sku: parsed.data.sku,
    categoryId: parsed.data.categoryId,
    sellerId: parsed.data.sellerId,
    priceCents: parsed.data.priceCents,
    stockStatus: parsed.data.stockStatus,
    featured: parsed.data.featured ?? false,
  };

  try {
    await getDb()
      .update(parts)
      .set(typeof img === "string" ? { ...base, imageKey: img } : base)
      .where(eq(parts.id, id));
  } catch {
    return { ok: false, error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/admin/pecas");
  revalidatePath("/pecas");
  redirect("/admin/pecas");
}

export async function deletePart(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!id) return;
  const db = getDb();
  // Solta as referências antes de excluir (part_brands é cascade).
  await db.update(leads).set({ partId: null }).where(eq(leads.partId, id));
  await db.delete(orderItems).where(eq(orderItems.partId, id));
  await db.delete(parts).where(eq(parts.id, id));
  revalidatePath("/admin/pecas");
  revalidatePath("/pecas");
}
