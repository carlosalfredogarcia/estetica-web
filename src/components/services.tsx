"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, WHATSAPP } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

type Category = "Facial" | "Corporal" | "Láser";

const TABS: { id: Category; label: string }[] = [
  { id: "Facial", label: "Faciales" },
  { id: "Corporal", label: "Corporales" },
  { id: "Láser", label: "Láser" },
];

// Curated Unsplash images per treatment (w=600, crop)
const SERVICE_IMAGES: Record<string, string> = {
  // Faciales
  Dermapen:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
  Exsomas:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
  "Glow Up Super Luminosidad":
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop",
  "Cóctel de Vitaminas":
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80&auto=format&fit=crop",
  Retinal:
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80&auto=format&fit=crop",
  "Radiofrecuencia Facial":
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop",
  "Higiene Facial + IPL":
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format&fit=crop",
  Hidrafacial:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80&auto=format&fit=crop",
  // Corporales
  "Cavitación + Maderoterapia":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop",
  "Radiofrecuencia + Maderoterapia":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
  "Radiofrecuencia Corporal":
    "https://images.unsplash.com/photo-1520334363174-ed6b96b8a80a?w=600&q=80&auto=format&fit=crop",
  Presoterapia:
    "https://images.unsplash.com/photo-1505944357431-27579db47558?w=600&q=80&auto=format&fit=crop",
  "Body Sculp Vibratorio":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop",
  // Láser
  "Cuerpo Completo (Ellas)":
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&auto=format&fit=crop",
  "Cuerpo Completo (Ellos)":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
  "Axilas + Ingles":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
  "Facial Láser":
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
  Labio:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop",
  "Piernas Completas":
    "https://images.unsplash.com/photo-1520334363174-ed6b96b8a80a?w=600&q=80&auto=format&fit=crop",
  "Piernas + Axilas":
    "https://images.unsplash.com/photo-1505944357431-27579db47558?w=600&q=80&auto=format&fit=crop",
  Pubis:
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&auto=format&fit=crop",
  "Pecho / Espalda (Ellos)":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop",
};

// Fallback per category
const CATEGORY_FALLBACK: Record<Category, string> = {
  Facial:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
  Corporal:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop",
  Láser:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop",
};

function whatsappUrl(msg: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export function Services() {
  const [active, setActive] = useState<Category>("Facial");

  const filtered = SERVICES.filter((s) => s.cat === active);

  return (
    <section id="servicios" className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Tratamientos"
            title="Nuestros servicios"
            description="Desde tratamientos faciales rejuvenecedores hasta depilación láser definitiva. Encuentra el tratamiento perfecto para ti."
            className="mb-10"
          />
        </Reveal>

        {/* Tabs */}
        <Reveal delay={100}>
          <div className="flex gap-1 border-b border-border mb-10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "px-6 py-3 text-xs font-sans tracking-[0.15em] uppercase transition-all duration-300 border-b-2 -mb-px",
                  active === tab.id
                    ? "border-[var(--gold)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
          {filtered.map((service, i) => {
            const img =
              SERVICE_IMAGES[service.name] ?? CATEGORY_FALLBACK[service.cat];
            return (
              <div
                key={service.name}
                className="bg-[var(--background)] flex flex-col tab-enter group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Treatment image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={img}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[var(--background)]/10" />
                  {service.promo && (
                    <span className="absolute top-3 left-3 bg-[var(--gold)] text-white text-[10px] font-sans tracking-[0.1em] uppercase px-2 py-1">
                      {service.promo}
                    </span>
                  )}
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between">
                    <span className="text-lg" aria-hidden>
                      {service.icon}
                    </span>
                    <span className="text-xs font-sans text-muted-foreground">
                      {service.dur}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-base font-light mb-1.5">
                      {service.name}
                    </h3>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
                    <p className="text-base font-sans font-medium text-[var(--gold)]">
                      {service.price}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href="#reservar"
                        className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-sans tracking-[0.15em] uppercase text-white font-medium"
                        style={{ background: "#B8922A", borderRadius: 20 }}
                      >
                        Reservar
                      </a>
                      <a
                        href="https://wa.me/34644376744"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-sans tracking-[0.15em] uppercase font-medium"
                        style={{ background: "transparent", border: "1px solid #B8922A", color: "#B8922A", borderRadius: 20 }}
                      >
                        Consultar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
