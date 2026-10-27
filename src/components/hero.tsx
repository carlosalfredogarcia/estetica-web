"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { WHATSAPP } from "@/lib/data";

function whatsappUrl(msg?: string) {
  const text = msg ? encodeURIComponent(msg) : "";
  return `https://wa.me/${WHATSAPP}${text ? `?text=${text}` : ""}`;
}

// Fotos que flotan en el espacio, cada una a una profundidad distinta
const FLOATING = [
  { src: "images/tratamientos/facial.webp", alt: "Tratamiento facial", cls: "right-[6%] top-[16%] w-[30vw] max-w-[440px]", z: 120, delay: "0s" },
  { src: "images/tratamientos/laser-facial.webp", alt: "Láser facial", cls: "right-[30%] top-[52%] w-[17vw] max-w-[240px]", z: 220, delay: "1.2s" },
  { src: "images/tratamientos/maderoterapia.webp", alt: "Maderoterapia", cls: "right-[3%] top-[60%] w-[19vw] max-w-[270px]", z: 60, delay: "2.1s" },
];

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = 0, my = 0, sy = 0, raf = 0;

    const paint = () => {
      raf = 0;
      scene.style.transform = `rotateY(${mx * 8}deg) rotateX(${-my * 6}deg) translateZ(0)`;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${-mx * 20}px, ${sy * 0.35 - my * 14}px, 0)`;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      queue();
    };
    const onScroll = () => { sy = window.scrollY; queue(); };
    // En móvil: inclinar con el giroscopio
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mx = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
      my = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60));
      queue();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onTilt);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex flex-col justify-end pb-16 sm:pb-24 px-6 lg:px-8 overflow-hidden bg-[var(--background)]"
    >
      {/* Fondo: la sala, con movimiento lento de cámara */}
      <div ref={bgRef} className="absolute -inset-10 layer-3d" aria-hidden>
        <img
          src="images/salon.webp"
          alt=""
          className="w-full h-full object-cover ken-burns"
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
      <div className="absolute inset-0 light-beam" aria-hidden />
      <div className="absolute inset-0 vignette" aria-hidden />

      {/* Fotos flotando en 3D (solo pantallas grandes) */}
      <div className="absolute inset-0 hidden md:block" style={{ perspective: "1400px" }} aria-hidden>
        <div ref={sceneRef} className="absolute inset-0 layer-3d">
          {FLOATING.map((f) => (
            <div
              key={f.src}
              className={`absolute ${f.cls}`}
              style={{ transform: `translateZ(${f.z}px)`, transformStyle: "preserve-3d" }}
            >
              <div style={{ animation: `float-y 7s ease-in-out ${f.delay} infinite` }}>
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
          <p className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-[var(--gold)] mb-6 tab-enter" style={{ animationDelay: "200ms" }}>
            Estética avanzada · Málaga
          </p>

          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.95] tracking-wide mb-8 tab-enter" style={{ animationDelay: "350ms" }}>
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
              href="#diagnostico"
              className="btn-elegant border border-foreground px-8 py-4 text-xs font-sans tracking-[0.25em] uppercase inline-flex items-center justify-center gap-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ¿Qué necesita mi piel?
            </a>
          </div>
          <a
            href={whatsappUrl("Hola, me gustaría obtener más información sobre vuestros tratamientos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-xs font-sans tracking-[0.2em] uppercase text-foreground/60 hover:text-[var(--gold)] transition-colors"
          >
            o escríbenos por WhatsApp →
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-sans tracking-[0.4em] uppercase text-foreground/40 hidden sm:block">
        Desliza
      </div>
    </section>
  );
}
