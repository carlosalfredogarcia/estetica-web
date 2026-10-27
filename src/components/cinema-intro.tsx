"use client";

import { useEffect, useState } from "react";
import { NegocioTexto } from "@/components/negocio";

// Apertura de cine: dos franjas negras que se abren dejando ver la web.
// Solo la primera vez de cada visita; un toque la salta.
export function CinemaIntro() {
  const [phase, setPhase] = useState<"title" | "open" | "done">("title");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("estetica-intro") === "1";
      sessionStorage.setItem("estetica-intro", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase("open"), 1900);
    const t2 = setTimeout(() => setPhase("done"), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;
  const open = phase === "open";

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer intro-failsafe"
      onClick={() => setPhase("done")}
      aria-hidden
    >
      <div className="letterbox top-0" style={{ transform: open ? "translateY(-100%)" : "none" }} />
      <div className="letterbox bottom-0" style={{ transform: open ? "translateY(100%)" : "none" }} />
      <div
        className="absolute inset-0 z-[101] flex flex-col items-center justify-center gap-4 transition-opacity duration-700"
        style={{ opacity: open ? 0 : 1 }}
      >
        <p className="text-[10px] font-sans tracking-[0.6em] uppercase text-[#6b645b] tab-enter">
          Estética avanzada · <NegocioTexto campo="ciudad" />
        </p>
        <p
          className="font-serif text-4xl sm:text-6xl font-light tracking-[0.3em] uppercase gold-shine text-center px-6 tab-enter"
          style={{ animationDelay: "300ms" }}
        >
          <NegocioTexto campo="nombre" />
        </p>
        <div className="h-px w-24 bg-[#B8922A]/60 tab-enter" style={{ animationDelay: "600ms" }} />
      </div>
    </div>
  );
}
