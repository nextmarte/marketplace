"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fundo do hero: carrossel em loop com crossfade entre os vídeos.
 * Só o vídeo ativo toca (os demais ficam pausados) para economizar
 * banda/CPU — os inativos usam preload leve até entrarem em cena.
 */
export function HeroVideoBackground({ sources }: { sources: string[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (sources.length < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % sources.length),
      6000,
    );
    return () => clearInterval(id);
  }, [sources.length]);

  useEffect(() => {
    refs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) void video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {sources.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={src}
          muted
          loop
          playsInline
          autoPlay={i === 0}
          preload={i === 0 ? "auto" : "metadata"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
