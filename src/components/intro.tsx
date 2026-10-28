"use client";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { NegocioTexto, useSalon, categorias } from "@/components/negocio";

const ETIQUETA: Record<string, string> = {
  Facial: "Tratamientos Faciales",
  Corporal: "Tratamientos Corporales",
  Láser: "Zonas Láser",
};

export function Intro() {
  const { servicios } = useSalon();
  const STATS = categorias(servicios)
    .slice(0, 3)
    .map((c) => ({ value: String(servicios.filter((s) => s.cat === c.id).length), label: ETIQUETA[c.id] ?? c.label }));
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--secondary)] overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Fotos en capas con profundidad */}
        <Reveal>
          <div className="relative aspect-[4/5]">
            <img
              src="images/tratamientos/serum.webp"
              alt="Sala de tratamientos"
              className="absolute inset-0 w-[85%] h-[85%] object-cover border border-border"
            />
            <img
              src="images/tratamientos/radiofrecuencia.webp"
              alt="Radiofrecuencia facial"
              className="pop-z absolute right-0 bottom-0 w-[55%] aspect-square object-cover border border-[var(--gold)]/40 shadow-[0_30px_60px_-15px_rgba(26,26,26,0.4)]"
            />
            <div
              className="absolute left-4 bottom-[18%] bg-[var(--background)]/90 backdrop-blur-md px-6 py-4 border-l-2 border-[var(--gold)]"
            >
              <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">
                <NegocioTexto campo="nombre" />
              </p>
              <p className="text-sm font-light text-foreground/80 mt-1"><NegocioTexto campo="ciudad" /></p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="space-y-8">
          <Reveal>
            <SectionHeading
              eyebrow="Sobre nosotros"
              title="La estética como arte"
              description="Combinamos tecnología de vanguardia con un trato cercano y personalizado. Cada tratamiento está diseñado para realzar tu belleza natural con resultados reales y duraderos."
            />
          </Reveal>

          {/* Stats */}
          <Reveal delay={150}>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-4xl font-light text-[var(--gold)]">
                    {stat.value}
                  </p>
                  <p className="text-xs font-sans text-muted-foreground mt-1 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <a
              href="#servicios"
              className="btn-elegant border border-foreground px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase inline-flex items-center"
            >
              Ver tratamientos
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
