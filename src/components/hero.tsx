import { ArrowUpRight } from "lucide-react";
import { WHATSAPP } from "@/lib/data";

function whatsappUrl(msg?: string) {
  const text = msg ? encodeURIComponent(msg) : "";
  return `https://wa.me/${WHATSAPP}${text ? `?text=${text}` : ""}`;
}

// Luxury minimal aesthetics treatment room — Unsplash @brookecagle
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=85&auto=format&fit=crop";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-end pb-16 sm:pb-20 px-6 lg:px-8 overflow-hidden"
    >
      {/* Full-screen Unsplash background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        aria-hidden="true"
      />

      {/* Soft beige overlay so text reads well */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(240,232,224,0.55) 0%, rgba(240,232,224,0.30) 40%, rgba(240,232,224,0.75) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative vertical line */}
      <div className="absolute left-8 top-1/3 bottom-1/3 w-px bg-[var(--gold)]/40 hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          <p className="text-xs font-sans font-medium tracking-[0.3em] uppercase text-[var(--gold)] mb-6">
            Estética avanzada · Málaga
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] tracking-wide mb-6">
            Tu piel,
            <br />
            <em className="not-italic text-[var(--gold)]">redefinida</em>
          </h1>

          <p className="text-sm sm:text-base font-sans font-light text-foreground/80 max-w-md leading-relaxed mb-10">
            Tratamientos faciales, corporales y depilación láser de alta gama.
            Resultados visibles desde la primera sesión.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#reservar"
              className="btn-elegant border border-foreground px-8 py-3.5 text-xs font-sans tracking-[0.2em] uppercase inline-flex items-center gap-3"
            >
              Reservar cita
              <ArrowUpRight className="btn-arrow w-3.5 h-3.5" />
            </a>
            <a
              href={whatsappUrl(
                "Hola, me gustaría obtener más información sobre vuestros tratamientos."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-elegant border border-foreground/50 px-8 py-3.5 text-xs font-sans tracking-[0.2em] uppercase"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
