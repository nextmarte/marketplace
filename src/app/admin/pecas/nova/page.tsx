import { PartForm } from "@/components/part-form";
import { listCategories, listSellers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewPartPage() {
  const [categories, sellers] = await Promise.all([
    listCategories(),
    listSellers(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Nova peça</h1>
      <p className="mt-1 text-muted-fg">
        Cadastre uma peça no catálogo. A imagem é opcional.
      </p>
      <div className="mt-8">
        <PartForm categories={categories} sellers={sellers} />
      </div>
    </div>
  );
}
