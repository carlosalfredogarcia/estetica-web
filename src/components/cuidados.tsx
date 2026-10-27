"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const GUIDES = [
  {
    id: "laser",
    label: "Depilación láser",
    antes: [
      "Rasura la zona 24 horas antes (nunca cera ni pinzas en el último mes).",
      "Evita el sol y las cabinas de bronceado 15 días antes.",
      "Ven con la piel limpia, sin cremas, desodorante ni maquillaje en la zona.",
      "Avísanos si tomas medicación fotosensibilizante o antibióticos.",
    ],
    despues: [
      "Protector solar SPF 50 durante al menos 15 días.",
      "Nada de sauna, piscina ni deporte intenso las primeras 24–48 h.",
      "Hidrata con aloe vera si notas calor o rojez.",
      "El vello tratado se cae solo en 1–3 semanas: no lo arranques.",
    ],
  },
  {
    id: "facial",
    label: "Faciales (Dermapen, Retinal, IPL…)",
    antes: [
      "Suspende retinoides y exfoliantes 3–5 días antes.",
      "No tomes el sol los días previos.",
      "Cuéntanos si tienes herpes, embarazo o alguna alergia.",
    ],
    despues: [
      "Sin maquillaje las primeras 12–24 h tras Dermapen.",
      "Protector solar cada día; es la mitad del resultado.",
      "Agua termal y crema calmante si notas tirantez.",
      "Evita sauna, piscina y sol directo durante 48 h.",
    ],
  },
  {
    id: "corporal",
    label: "Corporales (cavitación, presoterapia…)",
    antes: [
      "Bebe al menos 1,5 l de agua el día anterior y el mismo día.",
      "Ven con ropa cómoda y sin comidas copiosas justo antes.",
      "Avísanos si tienes marcapasos, varices importantes o estás embarazada.",
    ],
    despues: [
      "Sigue bebiendo agua para ayudar a eliminar líquidos.",
      "Un paseo de 20–30 minutos multiplica el efecto drenante.",
      "Reduce sal y azúcar los días de tratamiento.",
    ],
  },
];

const FAQ = [
  { q: "¿Cuántas sesiones necesito?", a: "Depende del tratamiento y de tu piel. Como orientación: láser entre 6 y 10 sesiones, faciales de colágeno entre 3 y 6, y corporales entre 8 y 10. En la primera visita te hacemos un plan a medida." },
  { q: "¿Duele el láser?", a: "Nuestro láser de diodo tiene enfriamiento, así que la mayoría de clientas lo describen como un pequeño pellizco caliente. Las zonas pequeñas duran apenas unos minutos." },
  { q: "¿Merece la pena un bono?", a: "Si vas a hacer varias sesiones, sí: los bonos te ahorran hasta un 40 % frente a pagar sesión a sesión. Verás el ahorro exacto en cada tratamiento." },
  { q: "¿Puedo cambiar o cancelar mi cita?", a: "Claro. Escríbenos por WhatsApp con al menos 24 horas de antelación y te buscamos otro hueco sin coste." },
  { q: "¿Cómo pago?", a: "En el centro, con tarjeta, Bizum o efectivo. Los bonos se pagan el primer día." },
];

export function Cuidados() {
  const [guide, setGuide] = useState(GUIDES[0].id);
  const [open, setOpen] = useState<number | null>(0);
  const g = GUIDES.find((x) => x.id === guide)!;

  return (
    <section id="cuidados" className="py-24 lg:py-32 px-6 lg:px-8 bg-[var(--secondary)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Antes y después"
              title="Cuida tu resultado"
              description="Lo que haces en casa cuenta tanto como la sesión. Esta es nuestra guía."
              className="mb-8"
            />
          </Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {GUIDES.map((x) => (
              <button
                key={x.id}
                onClick={() => setGuide(x.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-sans tracking-[0.15em] uppercase rounded-full border transition-colors",
                  guide === x.id
                    ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div key={g.id} className="grid sm:grid-cols-2 gap-px bg-border tab-enter">
            {(["antes", "despues"] as const).map((k) => (
              <div key={k} className="bg-[var(--card)] p-6">
                <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-4">
                  {k === "antes" ? "Antes de venir" : "Después"}
                </p>
                <ul className="space-y-3">
                  {g[k].map((t) => (
                    <li key={t} className="text-sm font-sans font-light text-foreground/80 leading-relaxed flex gap-3">
                      <span className="text-[var(--gold)]">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que más nos preguntáis" className="mb-8" />
          </Reveal>
          <div className="border-t border-border">
            {FAQ.map((f, i) => (
              <div key={f.q} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-serif text-xl font-light">{f.q}</span>
                  <Plus
                    className={cn(
                      "w-4 h-4 text-[var(--gold)] flex-shrink-0 transition-transform duration-500",
                      open === i && "rotate-45"
                    )}
                  />
                </button>
                <div
                  className="grid transition-all duration-500"
                  style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
                >
                  <p className="overflow-hidden text-sm font-sans font-light text-muted-foreground leading-relaxed">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
