"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import { SERVICES, WHATSAPP, type Service } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Tilt } from "@/components/tilt";
import { cn } from "@/lib/utils";

type Area = "rostro" | "cuerpo" | "vello";
type Budget = 30 | 60 | 999;

interface Option {
  id: string;
  label: string;
  hint: string;
  picks: { name: string; why: string }[];
}

const AREAS: { id: Area; label: string; hint: string }[] = [
  { id: "rostro", label: "Mi rostro", hint: "Arrugas, manchas, poros, luminosidad" },
  { id: "cuerpo", label: "Mi cuerpo", hint: "Grasa localizada, celulitis, piernas cansadas" },
  { id: "vello", label: "Quitarme el vello", hint: "Depilación láser para ellas y ellos" },
];

const CONCERNS: Record<Area, Option[]> = {
  rostro: [
    { id: "arrugas", label: "Arrugas y falta de firmeza", hint: "Líneas finas, flacidez", picks: [
      { name: "Dermapen", why: "Estimula tu propio colágeno: la piel gana firmeza sesión a sesión." },
      { name: "Radiofrecuencia Facial", why: "Efecto tensor desde el primer día, sin dolor ni recuperación." },
      { name: "Retinal", why: "Acelera la renovación celular y suaviza las líneas finas." },
      { name: "Exsomas", why: "Regeneración a nivel celular para pieles maduras." },
    ] },
    { id: "manchas", label: "Manchas y tono desigual", hint: "Sol, marcas, piel irregular", picks: [
      { name: "Higiene Facial + IPL", why: "La luz pulsada atenúa manchas y unifica el tono." },
      { name: "Glow Up Super Luminosidad", why: "Activos despigmentantes y vitaminas para un tono uniforme." },
      { name: "Retinal", why: "Renueva la superficie de la piel y aclara poco a poco." },
    ] },
    { id: "acne", label: "Poros, granitos o marcas de acné", hint: "Piel grasa o con cicatrices", picks: [
      { name: "Higiene Facial + IPL", why: "Limpieza profunda que cierra poros y calma la piel." },
      { name: "Dermapen", why: "El tratamiento de referencia para cicatrices de acné." },
      { name: "Hidrafacial", why: "Limpia, exfolia e hidrata sin agredir." },
    ] },
    { id: "apagada", label: "Piel apagada o deshidratada", hint: "Sin brillo, tirante, cansada", picks: [
      { name: "Hidrafacial", why: "Hidratación profunda con glow inmediato." },
      { name: "Cóctel de Vitaminas", why: "Vitaminas A, C y E que devuelven vitalidad." },
      { name: "Glow Up Super Luminosidad", why: "Tu piel como iluminada desde dentro." },
    ] },
  ],
  cuerpo: [
    { id: "grasa", label: "Grasa localizada", hint: "Abdomen, cartucheras, flancos", picks: [
      { name: "Cavitación + Maderoterapia", why: "Ultrasonidos que rompen la grasa y madera que redefine contornos." },
      { name: "Body Sculp Vibratorio", why: "Vibración de alta frecuencia sobre la grasa más rebelde." },
      { name: "Presoterapia", why: "Ayuda a eliminar lo que la cavitación moviliza." },
    ] },
    { id: "celulitis", label: "Celulitis y flacidez", hint: "Piel de naranja, falta de firmeza", picks: [
      { name: "Radiofrecuencia + Maderoterapia", why: "Tensa la piel desde dentro y alisa la celulitis." },
      { name: "Radiofrecuencia Corporal", why: "Reafirma muslos, brazos y abdomen de forma progresiva." },
      { name: "Body Sculp Vibratorio", why: "Tonifica y potencia los demás tratamientos." },
    ] },
    { id: "retencion", label: "Retención y piernas cansadas", hint: "Hinchazón, pesadez", picks: [
      { name: "Presoterapia", why: "Drenaje linfático que alivia la pesadez desde la primera sesión." },
      { name: "Cavitación + Maderoterapia", why: "La maderoterapia activa la circulación y drena." },
    ] },
    { id: "tonificar", label: "Tonificar y definir", hint: "Glúteos, piernas, brazos", picks: [
      { name: "Body Sculp Vibratorio", why: "Tonifica y redefine la figura." },
      { name: "Radiofrecuencia Corporal", why: "Mejora la firmeza y textura de la piel." },
      { name: "Radiofrecuencia + Maderoterapia", why: "Esculpe y reafirma a la vez." },
    ] },
  ],
  vello: [
    { id: "completo-ellas", label: "Cuerpo completo · ellas", hint: "Todo en una sesión", picks: [
      { name: "Cuerpo Completo (Ellas)", why: "La opción más completa y la que más compensa." },
      { name: "Piernas + Axilas", why: "Si prefieres empezar por lo más visible." },
    ] },
    { id: "completo-ellos", label: "Cuerpo completo · ellos", hint: "Pecho, espalda, hombros…", picks: [
      { name: "Cuerpo Completo (Ellos)", why: "Adaptado al vello masculino, todo en una cita." },
      { name: "Pecho / Espalda (Ellos)", why: "Si solo te molesta el torso." },
    ] },
    { id: "piernas", label: "Piernas", hint: "Con o sin axilas", picks: [
      { name: "Piernas Completas", why: "Del tobillo a la ingle, piel suave todo el año." },
      { name: "Piernas + Axilas", why: "El combo más pedido, ahorras tiempo y dinero." },
    ] },
    { id: "zonas", label: "Axilas, ingles o pubis", hint: "Zonas pequeñas", picks: [
      { name: "Axilas + Ingles", why: "Las dos zonas más demandadas en un solo pack." },
      { name: "Pubis", why: "Sesión discreta, rápida y cómoda." },
    ] },
    { id: "cara", label: "Rostro o labio", hint: "Bigote, mentón, patillas", picks: [
      { name: "Labio", why: "Sesión express de 5 minutos." },
      { name: "Facial Láser", why: "Precisión en labio, patillas, mentón o entrecejo." },
    ] },
    { id: "torso", label: "Pecho o espalda · ellos", hint: "Vello grueso", picks: [
      { name: "Pecho / Espalda (Ellos)", why: "Elimina el vello grueso de forma definitiva." },
    ] },
  ],
};

const BUDGETS: { id: Budget; label: string; hint: string }[] = [
  { id: 30, label: "Hasta 30 €", hint: "por sesión" },
  { id: 60, label: "Hasta 60 €", hint: "por sesión" },
  { id: 999, label: "Lo que haga falta", hint: "quiero el mejor resultado" },
];

function priceOf(s: Service) {
  return parseFloat(s.price) || 0;
}

export function Diagnostico() {
  const [area, setArea] = useState<Area | null>(null);
  const [concern, setConcern] = useState<Option | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);

  const step = !area ? 1 : !concern ? 2 : !budget ? 3 : 4;

  const results =
    concern && budget
      ? concern.picks
          .map((p) => ({ ...p, service: SERVICES.find((s) => s.name === p.name)! }))
          .filter((r) => r.service)
          .map((r) => ({ ...r, fits: priceOf(r.service) <= budget }))
          .sort((a, b) => Number(b.fits) - Number(a.fits))
          .slice(0, 3)
      : [];

  function reset() {
    setArea(null);
    setConcern(null);
    setBudget(null);
  }

  function back() {
    if (budget) setBudget(null);
    else if (concern) setConcern(null);
    else setArea(null);
  }

  function book(s: Service) {
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("dimux:select-service", { detail: { name: s.name, cat: s.cat } }));
  }

  const waText =
    concern && results.length
      ? `Hola Lucía, he hecho el diagnóstico de la web.\n\n*Quiero mejorar:* ${concern.label}\n*Me recomienda:* ${results.map((r) => r.service.name).join(", ")}\n\n¿Me ayudas a elegir?`
      : "";

  const choiceCls =
    "text-left p-5 border border-border bg-[var(--card)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all duration-300 group";

  return (
    <section id="diagnostico" className="relative py-24 lg:py-32 px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 light-beam opacity-60" aria-hidden />
      <div className="relative max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Diagnóstico en 30 segundos"
            title="¿Qué necesita tu piel?"
            description="Responde tres preguntas y te decimos qué tratamientos encajan contigo. Es orientativo: Lucía lo confirma en tu primera visita."
            center
            className="mb-12 [&>p:last-child]:mx-auto"
          />
        </Reveal>

        {/* Progreso */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={cn(
                "h-0.5 transition-all duration-500",
                n <= step ? "w-12 bg-[var(--gold)]" : "w-6 bg-border"
              )}
            />
          ))}
        </div>

        {step > 1 && (
          <button
            onClick={back}
            className="mb-6 inline-flex items-center gap-2 text-xs font-sans tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Atrás
          </button>
        )}

        {step === 1 && (
          <div key="s1" className="grid sm:grid-cols-3 gap-4 tab-enter">
            {AREAS.map((a) => (
              <button key={a.id} onClick={() => setArea(a.id)} className={choiceCls}>
                <p className="font-serif text-2xl font-light mb-2 group-hover:text-[var(--gold)] transition-colors">{a.label}</p>
                <p className="text-xs font-sans text-muted-foreground">{a.hint}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && area && (
          <div key="s2" className="tab-enter">
            <p className="font-serif text-2xl font-light text-center mb-6">¿Qué te gustaría mejorar?</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {CONCERNS[area].map((c) => (
                <button key={c.id} onClick={() => setConcern(c)} className={choiceCls}>
                  <p className="font-serif text-xl font-light mb-1 group-hover:text-[var(--gold)] transition-colors">{c.label}</p>
                  <p className="text-xs font-sans text-muted-foreground">{c.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="tab-enter">
            <p className="font-serif text-2xl font-light text-center mb-6">¿Cuánto quieres invertir?</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {BUDGETS.map((b) => (
                <button key={b.id} onClick={() => setBudget(b.id)} className={choiceCls}>
                  <p className="font-serif text-2xl font-light mb-1 group-hover:text-[var(--gold)] transition-colors">{b.label}</p>
                  <p className="text-xs font-sans text-muted-foreground">{b.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div key="s4" className="tab-enter space-y-8">
            <p className="text-center font-serif text-2xl font-light">
              <Sparkles className="inline w-5 h-5 text-[var(--gold)] mr-2 -mt-1" />
              Tu selección personal
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {results.map((r, i) => (
                <div key={r.service.name} className="tab-enter" style={{ animationDelay: `${i * 120}ms` }}>
                  <Tilt className="h-full bg-[var(--card)] border border-border overflow-hidden flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={r.service.img} alt={r.service.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent" />
                      {i === 0 && r.fits && (
                        <span className="pop-z absolute top-3 left-3 bg-[var(--gold)] text-black text-[10px] font-sans font-medium tracking-[0.1em] uppercase px-2 py-1">
                          El más indicado
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <h3 className="font-serif text-xl font-light">{r.service.name}</h3>
                      <p className="text-sm font-sans text-muted-foreground leading-relaxed flex-1">{r.why}</p>
                      <div className="flex items-baseline justify-between pt-3 border-t border-border">
                        <span className="font-serif text-2xl text-[var(--gold)] tabular-nums">{r.service.price}</span>
                        <span className="text-xs font-sans text-muted-foreground">
                          {r.fits ? r.service.dur : "Algo más de tu presupuesto"}
                        </span>
                      </div>
                      <button
                        onClick={() => book(r.service)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] font-sans tracking-[0.15em] uppercase text-black font-medium bg-[var(--gold)] hover:brightness-110 transition rounded-full"
                      >
                        Reservar este <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Tilt>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-elegant border border-[var(--gold)] text-[var(--gold)] hover:text-black px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase"
              >
                Enviar mi diagnóstico a Lucía
              </a>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Empezar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
