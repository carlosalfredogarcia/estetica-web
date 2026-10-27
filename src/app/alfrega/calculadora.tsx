"use client";

import { useState } from "react";

const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;

export function Calculadora() {
  const [porSemana, setPorSemana] = useState(2);
  const [precio, setPrecio] = useState(45);
  const alMes = Math.round(porSemana * precio * 4.3);

  const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, step: number, fmt: (n: number) => string) => (
    <label className="block">
      <span className="flex justify-between text-sm font-sans mb-3">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
    </label>
  );

  return (
    <div className="bg-[var(--card)] border border-border p-8 space-y-8">
      {slider("Citas que fallan a la semana", porSemana, setPorSemana, 0, 10, 1, (n) => `${n}`)}
      {slider("Precio medio de la cita", precio, setPrecio, 10, 150, 5, eur)}
      <div className="pt-6 border-t border-border text-center">
        <p className="text-xs font-sans tracking-[0.2em] uppercase text-muted-foreground mb-2">Se te escapan al mes</p>
        <p className="font-serif text-6xl font-light text-[var(--gold)] tabular-nums">{eur(alMes)}</p>
        <p className="text-sm font-sans text-muted-foreground mt-4">
          {alMes >= 25
            ? `Con que el servicio te salve una sola cita al mes, ya se paga solo.`
            : "Aun así, tu web te trae clientas nuevas y te ahorra tiempo cada día."}
        </p>
      </div>
    </div>
  );
}
