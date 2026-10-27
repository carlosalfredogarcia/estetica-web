"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, WHATSAPP } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/tilt";

type Category = "Facial" | "Corporal" | "Láser";

const TABS: { id: Category; label: string }[] = [
  { id: "Facial", label: "Faciales" },
  { id: "Corporal", label: "Corporales" },
  { id: "Láser", label: "Láser" },
];

// Cuánto se ahorra con un bono frente a pagar sesión a sesión
export function bonoSaving(price: string, promo?: string) {
  const m = promo?.match(/Bono\s*(\d+)\s*ses\.?\s*·\s*(\d+)\s*€/i);
  const unit = parseFloat(price);
  if (!m || isNaN(unit)) return null;
  const n = Number(m[1]);
  const total = Number(m[2]);
  const saving = unit * n - total;
  if (saving <= 0) return null;
  return { n, total, perSession: Math.round((total / n) * 100) / 100, saving, pct: Math.round((saving / (unit * n)) * 100) };
}

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((service, i) => {
            const saving = bonoSaving(service.price, service.promo);
            return (
              <div
                key={service.name}
                className="tab-enter h-full"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Tilt className="h-full bg-[var(--card)] border border-border flex flex-col group overflow-hidden">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={service.img}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
                    {service.promo && (
                      <span className="pop-z absolute top-3 left-3 bg-[var(--gold)] text-white text-[10px] font-sans font-medium tracking-[0.1em] uppercase px-2 py-1">
                        {service.promo}
                      </span>
                    )}
                    <span className="pop-z absolute bottom-3 right-3 text-[10px] font-sans tracking-[0.15em] uppercase bg-[var(--background)]/85 backdrop-blur px-2 py-1 text-foreground/80">
                      {service.dur}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-light mb-1.5">
                        {service.name}
                      </h3>
                      <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">
                        {service.desc}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-3 border-t border-border mt-auto">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-serif text-2xl text-[var(--gold)] tabular-nums">
                          {service.price}
                        </p>
                        {saving && (
                          <p className="text-[10px] font-sans tracking-[0.08em] uppercase text-[#4A7A64] text-right">
                            Con bono ahorras {saving.saving}€
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
                            window.dispatchEvent(new CustomEvent("dimux:select-service", { detail: { name: service.name, cat: service.cat } }));
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] font-sans tracking-[0.15em] uppercase text-white font-medium bg-[var(--gold)] hover:brightness-110 transition rounded-full"
                        >
                          Reservar <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <a
                          href={whatsappUrl(`Hola, me gustaría consultar sobre: ${service.name}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-[10px] font-sans tracking-[0.15em] uppercase font-medium border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)]/10 transition rounded-full"
                        >
                          Consultar
                        </a>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
