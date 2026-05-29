import { z } from "zod";

export const leadSchema = z.object({
  partId: z.number().int().positive().optional(),
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().max(40).optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  message: z.string().max(1000).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const orderSchema = z.object({
  customerName: z.string().min(2, "Informe seu nome"),
  customerEmail: z.string().email("E-mail inválido"),
  customerPhone: z.string().max(40).optional(),
  address: z.string().min(5, "Informe o endereço de entrega"),
});
export type OrderInput = z.infer<typeof orderSchema>;

const stock = z.enum(["em_falta", "sob_encomenda", "disponivel"]);

export const partInputSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  description: z.string().min(5, "Descrição muito curta"),
  sku: z.string().min(1, "Informe o SKU"),
  categoryId: z.coerce.number().int().positive("Selecione a categoria"),
  sellerId: z.coerce.number().int().positive("Selecione o vendedor"),
  priceCents: z.coerce.number().int().min(0, "Preço inválido"),
  stockStatus: stock,
  featured: z.coerce.boolean().optional().default(false),
});
export type PartInput = z.infer<typeof partInputSchema>;
