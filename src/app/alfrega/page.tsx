import type { Metadata } from "next";
import Link from "next/link";
import { ALFREGA } from "@/lib/data";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "ALFREGA · Webs y reservas para estéticas",
  description: "Tu web con reservas por WhatsApp y un panel para llevar tu agenda, tus clientas y tus recordatorios. Sin comisiones y sin permanencia.",
};

const wa = (msg: string) => `https://wa.me/${ALFREGA.whatsapp}?text=${encodeURIComponent(msg)}`;

const INCLUYE = [
  ["Tu web, con tu nombre", "Tus tratamientos, tus precios y tus fotos. Bonita en el móvil, que es donde te buscan."],
  ["Reservas a tu WhatsApp", "La clienta elige tratamiento, día y hora, y te llega el mensaje listo. Sin comisiones por reserva."],
  ["Tu agenda en el móvil", "El día, la semana y el mes de un vistazo, con los huecos libres y lo que vas a facturar."],
  ["Recordatorios con un toque", "Cada tarde avisas a las clientas de mañana. Menos citas a las que no viene nadie."],
  ["Fichas de clientas", "Cuántas veces vino, cuánto gastó, su tratamiento habitual y notas como alergias o bonos."],
  ["Más reseñas en Google", "Con un toque pides la reseña a las que vinieron hoy. Las reseñas traen clientas nuevas."],
];

const PLANES = [
  {
    nombre: "Fundadora",
    precio: "25",
    nota: "Solo para las 10 primeras estéticas, y para siempre",
    items: ["Todo lo del plan Esencial", "El mismo precio mientras sigas conmigo"],
    destacado: true,
  },
  {
    nombre: "Esencial",
    precio: "35",
    nota: "Para tener la agenda en orden",
    items: ["Tu web con reservas online", "Panel de citas y clientas", "Recordatorios con un toque", "Soporte por WhatsApp"],
  },
  {
    nombre: "Pro",
    precio: "55",
    nota: "Para que vuelvan más clientas",
    items: ["Todo lo del Esencial", "Recordatorios automáticos por WhatsApp", "Fidelización: bonos y cumpleaños", "Campañas e informes"],
  },
];

const PREGUNTAS = [
  ["¿Hay permanencia?", "No. Te quedas porque te sirve; si un mes no te convence, lo dejas."],
  ["¿Cobras comisión por cada reserva?", "Ninguna. Pagas la cuota y ya está."],
  ["¿Tengo que saber de ordenadores?", "No. Yo lo monto todo con tus tratamientos y precios. Tú solo miras tu agenda."],
  ["¿Cuánto tarda?", "En pocos días tienes tu web lista. Antes de publicarla la revisamos juntos."],
  ["¿Hay plan anual?", "Sí: pagando el año entero tienes 2 meses gratis."],
];

export default function Alfrega() {
  return (
    <div className="cine">
      <header className="px-6 lg:px-8 py-6 border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="font-serif text-2xl tracking-[0.3em] uppercase">Alfrega</p>
          <a
            href={wa("Hola Carlos, he visto tu página y me interesa la web con reservas.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-5 py-2 text-xs font-sans tracking-[0.15em] uppercase"
          >
            Hablar con Carlos
          </a>
        </div>
      </header>

      <main>
        <section className="relative px-6 lg:px-8 py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 light-beam" aria-hidden />
          <div className="relative max-w-5xl mx-auto">
            <p className="text-xs font-sans tracking-[0.35em] uppercase text-[var(--gold)] mb-6 tab-enter">
              Webs y reservas para estéticas
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl font-light leading-[1] mb-8 tab-enter" style={{ animationDelay: "150ms" }}>
              Que no se te escape
              <br />
              <em className="italic gold-shine pr-2">ni una cita</em>
            </h1>
            <p className="text-base sm:text-lg font-sans font-light text-foreground/80 max-w-xl leading-relaxed mb-10 tab-enter" style={{ animationDelay: "300ms" }}>
              Tu web con reservas por WhatsApp y un panel para llevar tu agenda, tus clientas y tus
              recordatorios. Te lo dejo todo montado. Sin comisiones y sin permanencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 tab-enter" style={{ animationDelay: "450ms" }}>
              <Link href="/" className="btn-gold px-8 py-4 text-xs font-sans tracking-[0.25em] uppercase text-center">
                Ver una web de ejemplo
              </Link>
              <Link href="/admin" className="btn-elegant border border-foreground px-8 py-4 text-xs font-sans tracking-[0.25em] uppercase">
                Ver el panel
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-8 py-20 bg-[var(--secondary)]">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-3">Qué incluye</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light mb-12">Todo lo que necesitas, nada que no</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {INCLUYE.map(([t, d]) => (
                <div key={t} className="bg-[var(--card)] p-7">
                  <p className="font-serif text-2xl font-light mb-2">{t}</p>
                  <p className="text-sm font-sans font-light text-muted-foreground leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-3 text-center">Haz la cuenta</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light mb-4 text-center">¿Cuánto te cuestan las citas perdidas?</h2>
            <p className="text-sm font-sans text-muted-foreground text-center mb-10">
              Mueve los valores y mira cuánto se te escapa cada mes.
            </p>
            <Calculadora />
          </div>
        </section>

        <section id="precios" className="px-6 lg:px-8 py-20 bg-[var(--secondary)]">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-3">Precios</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light mb-3">Claros y sin sorpresas</h2>
            <p className="text-sm font-sans text-muted-foreground mb-12">
              Montaje gratis · Sin permanencia · Sin comisiones · Plan anual con 2 meses gratis
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANES.map((p) => (
                <div
                  key={p.nombre}
                  className={`relative p-8 flex flex-col bg-[var(--card)] border ${p.destacado ? "border-[var(--gold)] shadow-[0_30px_60px_-30px_rgba(184,146,42,0.6)]" : "border-border"}`}
                >
                  {p.destacado && (
                    <span className="absolute -top-3 left-8 bg-[var(--gold)] text-white text-[10px] font-sans tracking-[0.15em] uppercase px-3 py-1">
                      Plazas limitadas
                    </span>
                  )}
                  <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-4">{p.nombre}</p>
                  <p className="font-serif text-6xl font-light tabular-nums">
                    {p.precio}
                    <span className="text-2xl">&nbsp;€</span>
                    <span className="text-base font-sans text-muted-foreground"> /mes</span>
                  </p>
                  <p className="text-sm font-sans text-muted-foreground mt-2 mb-6">{p.nota}</p>
                  <ul className="space-y-3 flex-1">
                    {p.items.map((i) => (
                      <li key={i} className="text-sm font-sans font-light flex gap-3">
                        <span className="text-[var(--gold)]">✓</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={wa(`Hola Carlos, me interesa el plan ${p.nombre}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 text-center px-6 py-3 text-xs font-sans tracking-[0.2em] uppercase ${p.destacado ? "btn-gold" : "btn-elegant border border-foreground"}`}
                  >
                    Lo quiero
                  </a>
                </div>
              ))}
            </div>
            <p className="text-sm font-sans text-muted-foreground mt-10 leading-relaxed max-w-2xl">
              <span className="text-foreground">¿Prefieres olvidarte de todo?</span> Con la gestión completa te llevo
              también tu ficha de Google y las reseñas, las publicaciones y las campañas: desde 60&nbsp;€ al mes más,
              según lo que necesites.
            </p>
          </div>
        </section>

        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-3">Quién soy</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-light mb-6">Soy Carlos</h2>
              <div className="space-y-4 text-base font-sans font-light text-foreground/80 leading-relaxed">
                <p>
                  Programo webs y aplicaciones: ahora mismo estoy terminando una app de finanzas personales para Android.
                </p>
                <p>
                  Ahora ayudo a las estéticas de la zona a tener su web y su agenda en orden, para que dediquen el
                  tiempo a sus clientas y no al móvil.
                </p>
                <p>
                  Trato directo conmigo, sin centralitas: me escribes por WhatsApp y te contesto yo.
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-sans tracking-[0.2em] uppercase text-[var(--gold)] mb-3">Preguntas</p>
              <div className="border-t border-border">
                {PREGUNTAS.map(([q, a]) => (
                  <div key={q} className="border-b border-border py-5">
                    <p className="font-serif text-xl font-light mb-1">{q}</p>
                    <p className="text-sm font-sans font-light text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-8 py-24 bg-[var(--secondary)] text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-light mb-6">¿Lo hablamos?</h2>
          <p className="text-base font-sans font-light text-foreground/80 mb-10">
            Escríbeme y te preparo tu web de muestra, con tu nombre, sin compromiso.
          </p>
          <a
            href={wa("Hola Carlos, me gustaría ver mi web de muestra.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-10 py-4 text-xs font-sans tracking-[0.25em] uppercase"
          >
            Escribir por WhatsApp
          </a>
        </section>
      </main>

      <footer className="px-6 py-10 text-center text-xs font-sans text-muted-foreground border-t border-border">
        ALFREGA · Webs y reservas para estéticas
      </footer>
    </div>
  );
}
