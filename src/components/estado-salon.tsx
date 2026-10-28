"use client";

import { useSalon } from "@/components/negocio";

// Mientras se carga una estética real (?s=…) tapa la web de muestra; si no existe, lo dice.
export function EstadoSalon() {
  const { modo } = useSalon();
  if (modo !== "cargando" && modo !== "no-encontrada") return null;
  return (
    <div className="fixed inset-0 z-[90] bg-[var(--background)] flex flex-col items-center justify-center gap-4 px-6 text-center">
      {modo === "cargando" ? (
        <div className="w-10 h-10 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
      ) : (
        <>
          <p className="font-serif text-3xl font-light">Esta web no existe</p>
          <p className="text-sm font-sans text-muted-foreground">Revisa el enlace o escríbenos por WhatsApp.</p>
        </>
      )}
    </div>
  );
}
