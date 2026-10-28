"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { C } from "./tema";

// Hoja que sube desde abajo, siempre con «Volver» arriba y la acción principal abajo
export function Hoja({
  titulo,
  onCerrar,
  accion,
  pie,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  accion?: React.ReactNode;
  pie?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/40 animate-in fade-in duration-200"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-lg max-h-[94dvh] flex flex-col bg-[#F6F1EC] rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 px-2 pt-2.5 pb-2 border-b border-[#EAE1D8]">
          <button
            onClick={onCerrar}
            className="flex items-center gap-0.5 h-11 pl-1 pr-3 rounded-full text-[15px] font-semibold active:bg-black/5"
            style={{ color: C.oro }}
          >
            <ChevronLeft className="w-6 h-6" /> Volver
          </button>
          <h2 className="flex-1 text-center text-[17px] font-bold truncate">{titulo}</h2>
          <div className="min-w-[92px] flex justify-end pr-2">{accion}</div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {pie && (
          <div className="px-5 pt-3 pb-[calc(14px+env(safe-area-inset-bottom))] border-t border-[#EAE1D8] bg-[#F6F1EC] rounded-b-none sm:rounded-b-[28px]">
            {pie}
          </div>
        )}
      </div>
    </div>
  );
}

export function Boton({
  children,
  onClick,
  tipo = "oro",
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tipo?: "oro" | "rojo" | "borde" | "bordeRojo" | "verde";
  disabled?: boolean;
  className?: string;
}) {
  const estilos = {
    oro: "bg-[#B8922A] text-white",
    verde: "bg-[#3F7A5E] text-white",
    rojo: "bg-[#B54A4A] text-white",
    borde: "bg-white text-[#1A1A1A] border border-[#E2D6CB]",
    bordeRojo: "bg-white text-[#B54A4A] border border-[#B54A4A]/40",
  }[tipo];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-[52px] rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100",
        estilos,
        className
      )}
    >
      {children}
    </button>
  );
}

// Fila de cifras: «7 citas · 79 % ocupación…»
export function Cifras({ items }: { items: { n: React.ReactNode; l: string; color?: string }[] }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))` }}>
      {items.map((x) => (
        <div key={x.l} className="bg-white rounded-2xl px-2 py-3 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="text-[20px] font-bold leading-tight tabular-nums" style={{ color: x.color ?? C.tinta }}>
            {x.n}
          </div>
          <div className="text-[11.5px] text-[#8A7A70] mt-0.5 leading-tight">{x.l}</div>
        </div>
      ))}
    </div>
  );
}

export function Segmentos<T extends string>({
  valor,
  opciones,
  onCambio,
}: {
  valor: T;
  opciones: { id: T; txt: string }[];
  onCambio: (v: T) => void;
}) {
  return (
    <div className="grid bg-[#ECE3DA] rounded-2xl p-1" style={{ gridTemplateColumns: `repeat(${opciones.length},1fr)` }}>
      {opciones.map((o) => (
        <button
          key={o.id}
          onClick={() => onCambio(o.id)}
          className={cn(
            "h-10 rounded-xl text-[15px] font-bold transition",
            valor === o.id ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#8A7A70]"
          )}
        >
          {o.txt}
        </button>
      ))}
    </div>
  );
}

export function Avatar({ nombre, grande }: { nombre: string; grande?: boolean }) {
  const ini = (nombre || "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-[#F1E6D2] text-[#9A7720]",
        grande ? "w-16 h-16 text-[22px]" : "w-11 h-11 text-[15px]"
      )}
    >
      {ini}
    </div>
  );
}

export function Etiqueta({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] font-semibold mb-2 mt-5 first:mt-0">{children}</p>;
}

export function Ficha({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        onClick && "cursor-pointer active:scale-[0.99] transition",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Vacio({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div className="text-center py-10 px-6 bg-white/60 border border-dashed border-[#E2D6CB] rounded-2xl">
      <p className="text-[16px] font-bold">{titulo}</p>
      {texto && <p className="text-[14px] text-[#8A7A70] mt-1">{texto}</p>}
    </div>
  );
}
