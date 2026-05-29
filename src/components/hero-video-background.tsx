"use client";

import { useEffect, useState } from "react";

/** Fundo do hero: faz crossfade em loop entre os vídeos (carrossel). */
export function HeroVideoBackground({ sources }: { sources: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (sources.length < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % sources.length),
      7000,
    );
    return () => clearInterval(id);
  }, [sources.length]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {sources.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
