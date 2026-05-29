import { cn } from "@/lib/cn";
import { stockStatusLabel, type StockStatus } from "@/lib/format";

const ring: Record<StockStatus, string> = {
  em_falta: "bg-scarce/10 text-scarce ring-scarce/30",
  sob_encomenda: "bg-order/10 text-order ring-order/30",
  disponivel: "bg-brand-500/10 text-brand-700 ring-brand-600/30",
};

const dot: Record<StockStatus, string> = {
  em_falta: "bg-scarce",
  sob_encomenda: "bg-order",
  disponivel: "bg-brand-500",
};

export function StockBadge({
  status,
  className,
}: {
  status: StockStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        ring[status],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dot[status],
          status === "em_falta" && "animate-pulse",
        )}
      />
      {stockStatusLabel(status)}
    </span>
  );
}
