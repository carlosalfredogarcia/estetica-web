"use client";

import { ArrowUpRight } from "lucide-react";
import { OpenNow } from "@/components/open-now";
import { NegocioTexto, useNegocio } from "@/components/negocio";

function whatsappUrl(wa: string, msg?: string) {
  const text = msg ? encodeURIComponent(msg) : "";
  return `https://wa.me/${wa}${text ? `?text=${text}` : ""}`;
}

// Fotos de la portada (pantallas grandes)
const FLOATING = [
  { src: "images/tratamientos/facial.webp", alt: "Tratamiento facial", cls: "right-[6%] top-[16%] w-[30vw] max-w-[440px]" },
  { src: "images/tratamientos/laser-facial.webp", alt: "Láser facial", cls: "right-[30%] top-[52%] w-[17vw] max-w-[240px]" },
  { src: "images/tratamientos/maderoterapia.webp", alt: "Maderoterapia", cls: "right-[3%] top-[60%] w-[19vw] max-w-[270px]" },
];

export function Hero() {
  const wa = useNegocio().whatsapp;

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex flex-col justify-end pt-24 pb-16 sm:pb-24 px-6 lg:px-8 overflow-hidden bg-[var(--background)]"
    >
      {/* Fondo: la sala, con movimiento lento de cámara */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="images/salon.webp"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(240,232,224,0.92) 0%, rgba(240,232,224,0.7) 45%, rgba(240,232,224,0.15) 100%), linear-gradient(to top, #F0E8E0 0%, transparent 35%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[var(--background)]/40 md:hidden" aria-hidden />

      {/* Fotos flotando en 3D (solo pantallas grandes) */}
      <div className="absolute inset-0 hidden md:block" aria-hidden>
        <div className="absolute inset-0">
          {FLOATING.map((f) => (
            <div
              key={f.src}
              className={`absolute ${f.cls}`}
            >
              <div>
                <img
                  src={f.src}
                  alt={f.alt}
                  className="w-full aspect-[4/5] object-cover rounded-sm border border-[var(--gold)]/30 shadow-[0_40px_80px_-20px_rgba(26,26,26,0.45)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-8 top-1/3 bottom-1/3 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/60 to-transparent hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* El nombre de la estética, bien grande: es lo primero que tiene que ver */}
          <div className="mb-8 tab-enter" style={{ animationDelay: "200ms" }}>
            <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] text-[var(--gold)] text-balance">
              <NegocioTexto campo="nombre" />
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="h-px w-10 bg-[var(--gold)]" />
              <p className="text-[11px] sm:text-xs font-sans font-medium tracking-[0.3em] uppercase text-foreground/70">
                Estética avanzada · <NegocioTexto campo="ciudad" />
              </p>
            </div>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.95] tracking-wide mb-8 tab-enter" style={{ animationDelay: "350ms" }}>
            Tu piel,
            <br />
            <em className="italic gold-shine pr-2">redefinida</em>
          </h1>

          <p className="text-sm sm:text-base font-sans font-light text-foreground/80 max-w-md leading-relaxed mb-10 tab-enter" style={{ animationDelay: "500ms" }}>
            Tratamientos faciales, corporales y depilación láser de alta gama.
            Resultados visibles desde la primera sesión.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 tab-enter" style={{ animationDelay: "650ms" }}>
            <a
              href="#reservar"
              className="btn-gold px-8 py-4 text-xs font-sans tracking-[0.25em] uppercase inline-flex items-center justify-center gap-3"
            >
              Reservar cita
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#servicios"
              className="btn-elegant border border-foreground px-8 py-4 text-xs font-sans tracking-[0.25em] uppercase inline-flex items-center justify-center gap-3"
            >
              Ver tratamientos
            </a>
          </div>
          <a
            href={whatsappUrl(wa, "Hola, me gustaría obtener más información sobre vuestros tratamientos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-xs font-sans tracking-[0.2em] uppercase text-foreground/60 hover:text-[var(--gold)] transition-colors"
          >
            o escríbenos por WhatsApp →
          </a>
          <OpenNow className="mt-8 text-xs font-sans tracking-[0.15em] uppercase text-foreground/80" />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-sans tracking-[0.4em] uppercase text-foreground/40 hidden sm:block">
        Desliza
      </div>
    </section>
  );
}
