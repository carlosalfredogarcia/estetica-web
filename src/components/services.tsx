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
          {filtered.map((service, i) => (
            <div
              key={service.name}
              className="bg-[var(--background)] p-6 flex flex-col gap-4 tab-enter group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden>
                  {service.icon}
                </span>
                <span className="text-xs font-sans text-muted-foreground">
                  {service.dur}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-serif text-lg font-light mb-2">
                  {service.name}
                </h3>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">
                  {service.desc}
                </p>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-base font-sans font-medium text-[var(--gold)]">
                    {service.price}
                  </p>
                  {service.promo && (
                    <p className="text-xs font-sans text-muted-foreground">
                      {service.promo}
                    </p>
                  )}
                </div>
                <a
                  href={whatsappUrl(
                    `Hola, me gustaría reservar: ${service.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-elegant border border-foreground/60 px-4 py-2 text-[10px] font-sans tracking-[0.15em] uppercase inline-flex items-center gap-1.5"
                >
                  Reservar
                  <ArrowUpRight className="btn-arrow w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
