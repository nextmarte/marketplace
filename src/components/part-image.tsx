import Image from "next/image";
import { cn } from "@/lib/cn";
import { publicImageUrl } from "@/lib/r2";

export function PartImage({
  imageKey,
  alt,
  className,
  sizes,
  priority,
}: {
  imageKey: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const url = publicImageUrl(imageKey);

  if (!url) {
    return (
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden bg-ink",
          className,
        )}
      >
        <div className="absolute inset-0 amp-grid opacity-30" />
        <div className="absolute inset-0 amp-glow" />
        <span className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-brand-300">
          Amperia
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
