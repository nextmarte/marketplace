import { notFound } from "next/navigation";
import { PartForm } from "@/components/part-form";
import { getPartById, listCategories, listSellers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditPartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [part, categories, sellers] = await Promise.all([
    getPartById(Number(id)),
    listCategories(),
    listSellers(),
  ]);

  if (!part) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Editar peça</h1>
      <p className="mt-1 text-muted-fg">{part.name}</p>
      <div className="mt-8">
        <PartForm categories={categories} sellers={sellers} part={part} />
      </div>
    </div>
  );
}
