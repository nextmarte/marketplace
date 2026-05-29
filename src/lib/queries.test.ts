import { beforeAll, describe, expect, it, vi } from "vitest";

// holder compartilhado entre o mock e o beforeAll (PGlite é assíncrono)
const holder = vi.hoisted(() => ({ db: undefined as unknown as never }));

vi.mock("@/db", () => ({
  getDb: () => holder.db,
}));

import { brands, categories, partBrands, parts, sellers } from "@/db/schema";
import { createTestDb } from "@/db/test-utils";
import { getFeaturedParts, getPartBySlug, listParts } from "@/lib/queries";

beforeAll(async () => {
  const db = await createTestDb();
  holder.db = db as never;

  const inserted = await db
    .insert(brands)
    .values([
      { name: "BYD", slug: "byd", country: "China" },
      { name: "GWM", slug: "gwm", country: "China" },
    ])
    .returning();
  const byd = inserted[0];
  const gwm = inserted[1];

  const cats = await db
    .insert(categories)
    .values([
      { name: "Freios", slug: "freios" },
      { name: "Recarga", slug: "recarga" },
    ])
    .returning();
  const freios = cats[0];
  const recarga = cats[1];

  const sell = await db
    .insert(sellers)
    .values([{ name: "EV Parts", slug: "ev-parts" }])
    .returning();
  const seller = sell[0];

  const [pastilha] = await db
    .insert(parts)
    .values({
      name: "Pastilha de Freio Dianteira",
      slug: "pastilha-de-freio-dianteira",
      description: "Pastilha cerâmica dianteira",
      sku: "FR-001",
      categoryId: freios.id,
      sellerId: seller.id,
      priceCents: 38900,
      stockStatus: "em_falta",
      featured: true,
      imageKey: "parts/pastilha-freio.webp",
    })
    .returning();

  const [conector] = await db
    .insert(parts)
    .values({
      name: "Conector Tipo 2",
      slug: "conector-tipo-2",
      description: "Conector de recarga Mennekes",
      sku: "RC-010",
      categoryId: recarga.id,
      sellerId: seller.id,
      priceCents: 89900,
      stockStatus: "sob_encomenda",
      featured: false,
      imageKey: "parts/conector.webp",
    })
    .returning();

  await db.insert(partBrands).values([
    { partId: pastilha.id, brandId: byd.id, model: "Dolphin" },
    { partId: conector.id, brandId: gwm.id, model: "Ora 03" },
  ]);
});

describe("listParts", () => {
  it("lista todas as peças sem filtro", async () => {
    expect(await listParts()).toHaveLength(2);
  });

  it("filtra por categoria", async () => {
    const r = await listParts({ category: "freios" });
    expect(r.map((p) => p.slug)).toEqual(["pastilha-de-freio-dianteira"]);
  });

  it("filtra por status", async () => {
    const r = await listParts({ status: "sob_encomenda" });
    expect(r.map((p) => p.slug)).toEqual(["conector-tipo-2"]);
  });

  it("busca por texto (descrição)", async () => {
    const r = await listParts({ q: "mennekes" });
    expect(r.map((p) => p.slug)).toEqual(["conector-tipo-2"]);
  });

  it("filtra por marca (slug)", async () => {
    const r = await listParts({ brand: "byd" });
    expect(r.map((p) => p.slug)).toEqual(["pastilha-de-freio-dianteira"]);
  });

  it("inclui relações (categoria, vendedor, marcas)", async () => {
    const [p] = await listParts({ category: "freios" });
    expect(p.category.slug).toBe("freios");
    expect(p.seller.name).toBe("EV Parts");
    expect(p.partBrands[0].brand.slug).toBe("byd");
  });
});

describe("getPartBySlug", () => {
  it("retorna a peça com relações", async () => {
    const p = await getPartBySlug("conector-tipo-2");
    expect(p?.name).toBe("Conector Tipo 2");
    expect(p?.category.slug).toBe("recarga");
  });

  it("retorna undefined para slug inexistente", async () => {
    expect(await getPartBySlug("nao-existe")).toBeUndefined();
  });
});

describe("getFeaturedParts", () => {
  it("retorna apenas peças em destaque", async () => {
    const r = await getFeaturedParts();
    expect(r.map((p) => p.slug)).toEqual(["pastilha-de-freio-dianteira"]);
  });
});
