/** Formata um valor em centavos como moeda brasileira (R$). */
export function formatPriceBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export type StockStatus = "em_falta" | "sob_encomenda" | "disponivel";

const STOCK_LABELS: Record<StockStatus, string> = {
  em_falta: "Em falta na concessionária",
  sob_encomenda: "Sob encomenda",
  disponivel: "Disponível",
};

/** Rótulo legível para o status de estoque de uma peça. */
export function stockStatusLabel(status: StockStatus): string {
  return STOCK_LABELS[status];
}
