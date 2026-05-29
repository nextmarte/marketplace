import { getDb } from "@/db";
import { categories } from "@/db/schema";
import type { StockStatus } from "@/lib/format";

export type PartFilters = {
  brand?: string;
  category?: string;
  status?: StockStatus;
  q?: string;
};

const withRelations = {
  category: true,
  seller: true,
  partBrands: { with: { brand: true } },
} as const;

/** Lista peças aplicando filtros de marca, categoria, status e busca textual. */
export async function listParts(filters: PartFilters = {}) {
  const db = getDb();

  const rows = await db.query.parts.findMany({
    with: withRelations,
    where: (p, { and, eq, or, ilike, inArray }) =>
      and(
        filters.status ? eq(p.stockStatus, filters.status) : undefined,
        filters.q
          ? or(
              ilike(p.name, `%${filters.q}%`),
              ilike(p.description, `%${filters.q}%`),
              ilike(p.sku, `%${filters.q}%`),
            )
          : undefined,
        filters.category
          ? inArray(
              p.categoryId,
              db
                .select({ id: categories.id })
                .from(categories)
                .where(eq(categories.slug, filters.category)),
            )
          : undefined,
      ),
    orderBy: (p, { desc }) => [desc(p.featured), desc(p.createdAt)],
  });

  if (filters.brand) {
    return rows.filter((r) =>
      r.partBrands.some((pb) => pb.brand.slug === filters.brand),
    );
  }
  return rows;
}

export type PartWithRelations = Awaited<ReturnType<typeof listParts>>[number];

/** Busca uma peça pelo slug, com todas as relações. */
export async function getPartBySlug(slug: string) {
  return getDb().query.parts.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
    with: withRelations,
  });
}

/** Peças marcadas como destaque (home). */
export async function getFeaturedParts(limit = 6) {
  return getDb().query.parts.findMany({
    where: (p, { eq }) => eq(p.featured, true),
    with: withRelations,
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit,
  });
}

export async function listBrands() {
  return getDb().query.brands.findMany({
    orderBy: (b, { asc }) => [asc(b.name)],
  });
}

export async function listCategories() {
  return getDb().query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });
}

export async function listSellers() {
  return getDb().query.sellers.findMany({
    orderBy: (s, { asc }) => [asc(s.name)],
  });
}

/** Pedido com itens e peças (tela de sucesso do checkout). */
export async function getOrderById(id: number) {
  return getDb().query.orders.findFirst({
    where: (o, { eq }) => eq(o.id, id),
    with: { items: { with: { part: true } } },
  });
}
