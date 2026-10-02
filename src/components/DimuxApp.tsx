"use client";

import { useState } from "react";
import Image from "next/image";
import Lotus from "./Lotus";
import Particles from "./Particles";
import {
  COLORS as C,
  SERVICES,
  CATEGORIES,
  SCHEDULE,
  SCHEDULE_MAP,
  TESTIMONIALS,
  DAYS,
  MONTHS,
  WHATSAPP,
  INSTAGRAM,
} from "@/lib/data";

type Section = "home" | "servicios" | "reservar";
type Tab = "Facial" | "Corporal" | "Láser";

const TAB_GRADIENTS: Record<Tab, string> = {
  Facial: `linear-gradient(135deg,#5C2D3A 0%,#8B4A60 100%)`,
  Corporal: `linear-gradient(135deg,#2D4A3E 0%,#4A7A64 100%)`,
  Láser: `linear-gradient(135deg,#2D3050 0%,#4A5080 100%)`,
};

// Pre-set bookings for demo
const INIT_BOOKINGS = [
  { date: "2026-07-27", time: 10 },
  { date: "2026-07-27", time: 11 },
  { date: "2026-07-28", time: 9 },
  { date: "2026-07-28", time: 10 },
  { date: "2026-07-29", time: 11 },
  { date: "2026-07-30", time: 10 },
  { date: "2026-07-30", time: 16 },
];

export default function DimuxApp() {
  const [sec, setSec] = useState<Section>("home");
  const [tab, setTab] = useState<Tab>("Facial");
  const [service, setService] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [done, setDone] = useState(false);
  const [calM, setCalM] = useState(new Date(2026, 6, 1));
  const [hovCat, setHovCat] = useState<string | null>(null);

  const today = new Date(2026, 6, 24);
  const yr = calM.getFullYear();
  const mo = calM.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const dIM = new Date(yr, mo + 1, 0).getDate();

  const toDS = (d: number) =>
    `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const dayOk = (d: number) => {
    const dt = new Date(toDS(d));
    return dt >= today && SCHEDULE_MAP[dt.getDay()] !== null;
  };

  const getSlots = (ds: string) => {
    const sc = SCHEDULE_MAP[new Date(ds).getDay()];
    if (!sc) return [];
    const sl: { h: number; taken: boolean }[] = [];
    for (const { s, e } of sc)
      for (let h = s; h < e; h++)
        sl.push({ h, taken: bookings.some((b) => b.date === ds && b.time === h) });
    return sl;
  };

  const confirm = () => {
    if (date && time !== null) {
      setBookings((p) => [...p, { date, time }]);
      setDone(true);
    }
  };

  const reset = () => {
    setDone(false);
    setDate(null);
    setTime(null);
    setService("");
    setName("");
    setPhone("");
    setStep(1);
  };

  const nav = (s: Section, preselect?: string) => {
    setSec(s);
    if (s === "reservar") {
      reset();
      if (preselect) {
        setTimeout(() => {
          setService(preselect);
          setStep(2);
        }, 0);
      }
    }
    window.scrollTo?.(0, 0);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= dIM; d++) cells.push(d);
  const slots = date ? getSlots(date) : [];

  // Inline style shortcuts
  const serif = "font-serif";
  const sans = "font-sans";

  return (
    <div className={`${sans} min-h-screen`} style={{ background: C.bg, color: C.charcoal }}>
      {/* ═══ NAV ═══ */}
      <nav
        className="sticky top-0 z-[300] flex items-center justify-between px-4 sm:px-8"
        style={{
          background: `${C.dark}F5`,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.gold}20`,
          height: 68,
        }}
      >
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => nav("home")}
        >
          <div className="float">
            <Lotus size={26} />
          </div>
          <div>
            <div
              className={`${serif} text-white`}
              style={{ fontSize: 17, fontWeight: 400, letterSpacing: "7px", lineHeight: 1 }}
            >
              DIMUX
            </div>
            <div
              style={{ fontSize: 7, letterSpacing: "3.5px", color: C.gold, marginTop: 2 }}
            >
              ESTÉTICA AVANZADA
            </div>
          </div>
        </div>

        <div className="hidden sm:flex gap-8" style={{ fontSize: 10, letterSpacing: "2.5px" }}>
          {([["home", "Inicio"], ["servicios", "Servicios"], ["reservar", "Reservar"]] as const).map(
            ([id, l]) => (
              <span
                key={id}
                className="nav-link cursor-pointer transition-colors"
                onClick={() => nav(id)}
                style={{
                  color: sec === id ? C.gold : "#ffffffAA",
                  borderBottom: `1px solid ${sec === id ? C.gold : "transparent"}`,
                  paddingBottom: 3,
                }}
              >
                {l.toUpperCase()}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => nav("reservar")}
          className="cursor-pointer"
          style={{
            background: C.gold,
            color: C.dark,
            border: "none",
            padding: "10px 22px",
            fontSize: 10,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Reservar Cita
        </button>
      </nav>

      {/* ═══════════ HOME ═══════════ */}
      {sec === "home" && (
        <div>
          {/* HERO */}
          <div
            className="relative overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
              background: `linear-gradient(160deg,${C.dark} 0%,#1C1008 60%,${C.dark} 100%)`,
              minHeight: "95vh",
              padding: "100px 24px 80px",
            }}
          >
            <Particles />

            {/* Big bg text */}
            <div
              className={`${serif} absolute pointer-events-none whitespace-nowrap`}
              style={{
                fontSize: "clamp(70px,20vw,220px)",
                fontWeight: 300,
                letterSpacing: "0.18em",
                color: `${C.gold}06`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                lineHeight: 1,
              }}
            >
              DIMUX
            </div>

            <div className="fu float relative z-10">
              <Lotus size={60} />
            </div>
            <div
              className="fu relative z-10"
              style={{
                fontSize: 9,
                letterSpacing: "6px",
                color: `${C.gold}BB`,
                marginTop: 20,
                marginBottom: 6,
              }}
            >
              TU BIENESTAR · NUESTRA PASIÓN
            </div>
            <div
              className={`${serif} fu relative z-10`}
              style={{
                fontSize: "clamp(60px,14vw,120px)",
                fontWeight: 300,
                letterSpacing: "14px",
                color: "#fff",
                lineHeight: 0.9,
                marginBottom: 12,
              }}
            >
              DIMUX
            </div>
            <div
              className="fu relative z-10"
              style={{
                fontSize: 9,
                letterSpacing: "5px",
                color: `${C.gold}77`,
                marginBottom: 32,
              }}
            >
              ESTÉTICA AVANZADA
            </div>

            <div className="fu2 flex items-center gap-4 mb-10 relative z-10">
              <div style={{ width: 48, height: 1, background: `${C.gold}44` }} />
              <div
                className={`${serif} italic`}
                style={{
                  fontSize: "clamp(18px,3.5vw,28px)",
                  color: C.gold,
                  fontWeight: 300,
                  lineHeight: 1.4,
                }}
              >
                Un nuevo espacio,
                <br />
                dedicado a ti.
              </div>
              <div style={{ width: 48, height: 1, background: `${C.gold}44` }} />
            </div>

            <div className="fu3 flex gap-4 flex-wrap justify-center relative z-10">
              <button
                className="cursor-pointer"
                onClick={() => nav("reservar")}
                style={{
                  background: C.gold,
                  color: C.dark,
                  border: "none",
                  padding: "14px 32px",
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Reservar Cita
              </button>
              <button
                className="cursor-pointer"
                onClick={() => nav("servicios")}
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.5)",
                  padding: "14px 32px",
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Ver Tratamientos
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
              <div style={{ fontSize: 9, letterSpacing: "3px", color: "#fff" }}>SCROLL</div>
              <div style={{ width: 1, height: 36, background: "#fff" }} />
            </div>
          </div>

          {/* GOLD BAR */}
          <div style={{ background: C.gold }}>
            <div className="flex justify-center flex-wrap">
              {[
                ["500+", "Clientas satisfechas"],
                ["20+", "Tratamientos exclusivos"],
                ["★★★★★", "Valoración perfecta"],
              ].map(([n, l], i) => (
                <div
                  key={i}
                  className="text-center"
                  style={{
                    padding: "22px 36px",
                    borderRight: i < 2 ? `1px solid ${C.dark}20` : "none",
                  }}
                >
                  <div
                    className={serif}
                    style={{
                      fontSize: "clamp(22px,4vw,30px)",
                      fontWeight: 400,
                      color: C.dark,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "1.5px",
                      color: `${C.dark}88`,
                      marginTop: 5,
                    }}
                  >
                    {l.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRATAMIENTOS HOME */}
          <div style={{ background: C.dark2, padding: "88px 24px" }}>
            <div className="text-center mb-14">
              <div style={{ fontSize: 9, letterSpacing: "5px", color: C.gold, marginBottom: 12 }}>
                NUESTROS SERVICIOS
              </div>
              <div
                className={serif}
                style={{
                  fontSize: "clamp(30px,5vw,50px)",
                  color: "#fff",
                  fontWeight: 300,
                  marginBottom: 16,
                }}
              >
                Cada tratamiento,
                <br />
                una transformación
              </div>
              <div
                className="mx-auto"
                style={{ width: 40, height: 1, background: C.gold }}
              />
            </div>

            <div className="grid gap-[3px] max-w-[1000px] mx-auto" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="svc-card relative overflow-hidden flex flex-col justify-end cursor-pointer"
                  style={{ minHeight: 320 }}
                  onMouseEnter={() => setHovCat(cat.id)}
                  onMouseLeave={() => setHovCat(null)}
                  onClick={() => {
                    setTab(cat.id);
                    nav("servicios");
                  }}
                >
                  <div
                    className="svc-bg absolute inset-0 transition-transform duration-500"
                    style={{
                      background:
                        cat.id === "Facial"
                          ? "linear-gradient(150deg,#5C2D3A 0%,#8B4A60 100%)"
                          : cat.id === "Corporal"
                            ? "linear-gradient(150deg,#2D4A3E 0%,#4A7A64 100%)"
                            : "linear-gradient(150deg,#2D3050 0%,#4A5080 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-colors duration-400"
                    style={{
                      background:
                        hovCat === cat.id ? "rgba(0,0,0,.1)" : "rgba(0,0,0,.35)",
                    }}
                  />
                  <div className="relative p-7">
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "3px",
                        color: "rgba(255,255,255,.6)",
                        marginBottom: 12,
                      }}
                    >
                      {cat.num} / TRATAMIENTOS
                    </div>
                    <div
                      className={serif}
                      style={{
                        fontSize: 26,
                        color: "#fff",
                        fontWeight: 300,
                        marginBottom: 10,
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,.75)",
                        lineHeight: 1.8,
                        marginBottom: 20,
                      }}
                    >
                      {cat.desc}
                    </div>
                    <div
                      className="inline-flex items-center gap-2.5"
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        color: "#fff",
                        borderBottom: "1px solid rgba(255,255,255,.5)",
                        paddingBottom: 3,
                      }}
                    >
                      <span className="svc-arrow inline-block transition-transform duration-300">
                        VER PRECIOS →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHY US */}
          <div style={{ background: C.bg, padding: "80px 24px" }}>
            <div className="text-center mb-13">
              <div style={{ fontSize: 9, letterSpacing: "5px", color: C.gold, marginBottom: 12 }}>
                POR QUÉ ELEGIRNOS
              </div>
              <div
                className={serif}
                style={{
                  fontSize: "clamp(26px,4vw,40px)",
                  fontWeight: 300,
                  marginBottom: 16,
                }}
              >
                Tu cuidado, nuestra prioridad
              </div>
              <div className="mx-auto" style={{ width: 40, height: 1, background: C.gold }} />
            </div>
            <div
              className="grid gap-[2px] max-w-[900px] mx-auto"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
                background: `${C.gold}22`,
              }}
            >
              {[
                { icon: "◈", t: "Tecnología Avanzada", d: "Equipos de última generación para resultados visibles desde la primera sesión." },
                { icon: "✦", t: "Trato Personalizado", d: "Cada cliente es única. Adaptamos cada tratamiento a tus necesidades concretas." },
                { icon: "❋", t: "Ambiente Exclusivo", d: "Un espacio pensado para que te desconectes del mundo y te centres en ti." },
                { icon: "♡", t: "Resultados Garantizados", d: "Más de 500 clientas avalan nuestros tratamientos. La próxima eres tú." },
              ].map((item) => (
                <div
                  key={item.t}
                  className="why-card text-center transition-transform duration-300"
                  style={{ background: C.bg, padding: "36px 24px" }}
                >
                  <div className={serif} style={{ fontSize: 32, color: C.gold, marginBottom: 16 }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: "1.5px", marginBottom: 12, fontWeight: 500 }}>
                    {item.t.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HORARIO */}
          <div style={{ background: C.dark, padding: "80px 24px" }}>
            <div className="max-w-[560px] mx-auto text-center">
              <div style={{ fontSize: 9, letterSpacing: "5px", color: C.gold, marginBottom: 12 }}>
                HORARIO
              </div>
              <div
                className={serif}
                style={{
                  fontSize: "clamp(26px,4vw,40px)",
                  color: "#fff",
                  fontWeight: 300,
                  marginBottom: 8,
                }}
              >
                Horario de Verano
              </div>
              <div
                className={`${serif} italic`}
                style={{ fontSize: 16, color: `${C.gold}88`, marginBottom: 36 }}
              >
                Siempre disponibles para cuidarte
              </div>
              {SCHEDULE.map(({ d, h }) => (
                <div
                  key={d}
                  className="flex justify-between"
                  style={{
                    padding: "16px 0",
                    borderBottom: `1px solid ${C.gold}18`,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "#ffffff88" }}>{d}</span>
                  <span
                    style={{
                      color: h === "Cerrado" ? C.rose : "#fff",
                      letterSpacing: h === "Cerrado" ? "1px" : "normal",
                    }}
                  >
                    {h}
                  </span>
                </div>
              ))}
              <div className="mt-10 flex gap-4 justify-center flex-wrap">
                <button
                  className="cursor-pointer"
                  onClick={() => nav("reservar")}
                  style={{
                    background: C.gold,
                    color: C.dark,
                    border: "none",
                    padding: "14px 32px",
                    fontSize: 11,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Reservar Ahora
                </button>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                  <button
                    className="cursor-pointer"
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,.5)",
                      padding: "14px 32px",
                      fontSize: 11,
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    WhatsApp
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div style={{ background: C.bg2, padding: "80px 24px" }}>
            <div className="text-center mb-13">
              <div style={{ fontSize: 9, letterSpacing: "5px", color: C.gold, marginBottom: 12 }}>
                TESTIMONIOS
              </div>
              <div
                className={serif}
                style={{
                  fontSize: "clamp(26px,4vw,40px)",
                  fontWeight: 300,
                  marginBottom: 16,
                }}
              >
                Ellas ya confían en DIMUX
              </div>
              <div className="mx-auto" style={{ width: 40, height: 1, background: C.gold }} />
            </div>
            <div
              className="grid gap-[3px] max-w-[960px] mx-auto"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                background: `${C.gold}22`,
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="tc transition-transform duration-300"
                  style={{
                    background: C.bg,
                    padding: "36px 28px",
                    borderTop: `2px solid ${C.gold}`,
                  }}
                >
                  <div style={{ color: C.gold, fontSize: 18, letterSpacing: 3, marginBottom: 16 }}>
                    ★★★★★
                  </div>
                  <div
                    className={`${serif} italic`}
                    style={{
                      fontSize: 17,
                      color: C.charcoal,
                      lineHeight: 1.85,
                      marginBottom: 20,
                    }}
                  >
                    &ldquo;{t.text}&rdquo;
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: "2px", color: C.gold }}>
                    — {t.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="relative overflow-hidden text-center"
            style={{
              background: `linear-gradient(135deg,${C.dark} 0%,#2A1A12 50%,${C.dark} 100%)`,
              padding: "72px 24px",
              borderTop: `1px solid ${C.gold}25`,
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 400,
                height: 400,
                background: `radial-gradient(${C.gold}18,transparent 70%)`,
              }}
            />
            <div
              className={`${serif} relative`}
              style={{
                fontSize: "clamp(24px,4.5vw,44px)",
                color: "#fff",
                fontWeight: 300,
                marginBottom: 12,
              }}
            >
              ¿Lista para tu transformación?
            </div>
            <div
              className={`${serif} italic relative`}
              style={{ fontSize: 16, color: C.gold, marginBottom: 32 }}
            >
              Un nuevo espacio, dedicado a ti.
            </div>
            <div className="flex gap-4 justify-center flex-wrap relative">
              <button
                className="cursor-pointer"
                onClick={() => nav("reservar")}
                style={{
                  background: C.gold,
                  color: C.dark,
                  border: "none",
                  padding: "14px 32px",
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Reservar Cita
              </button>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                <button
                  className="cursor-pointer"
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.5)",
                    padding: "14px 32px",
                    fontSize: 11,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  📱 WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SERVICIOS ═══════════ */}
      {sec === "servicios" && (
        <div>
          {/* Header */}
          <div
            className="relative overflow-hidden text-center"
            style={{
              background: `linear-gradient(160deg,${C.dark} 0%,#1C1008 100%)`,
              padding: "80px 24px 56px",
            }}
          >
            <Particles />
            <div className="float relative z-10">
              <Lotus size={48} />
            </div>
            <div
              className="relative z-10"
              style={{
                fontSize: 9,
                letterSpacing: "5px",
                color: C.gold,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              CATÁLOGO COMPLETO
            </div>
            <div
              className={`${serif} relative z-10`}
              style={{
                fontSize: "clamp(34px,6vw,60px)",
                color: "#fff",
                fontWeight: 300,
                marginBottom: 8,
              }}
            >
              Lista de Precios
            </div>
            <div
              className={`${serif} italic relative z-10`}
              style={{ fontSize: 16, color: `${C.gold}88` }}
            >
              Calidad que se nota desde la primera sesión
            </div>
          </div>

          {/* Tabs */}
          <div
            className="sticky top-[68px] z-[100]"
            style={{ background: C.dark, borderBottom: `1px solid ${C.gold}20` }}
          >
            <div className="flex max-w-[960px] mx-auto px-6">
              {(["Facial", "Corporal", "Láser"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTab(cat)}
                  className="cursor-pointer"
                  style={{
                    padding: "17px 24px",
                    border: "none",
                    background: "none",
                    fontSize: 11,
                    letterSpacing: "2px",
                    color: tab === cat ? C.gold : "#ffffff77",
                    borderBottom: `2px solid ${tab === cat ? C.gold : "transparent"}`,
                    marginBottom: -1,
                    fontWeight: tab === cat ? 500 : 400,
                    transition: "color .2s",
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Treatment Cards */}
          <div className="max-w-[960px] mx-auto px-6 py-12">
            <div className="grid gap-5">
              {SERVICES.filter((s) => s.cat === tab).map((svc) => (
                <div
                  key={svc.name}
                  className="trt-card overflow-hidden"
                  style={{
                    background: "white",
                    border: `1px solid ${C.gold}22`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image area */}
                    <div
                      className="relative w-full sm:w-[280px] h-[200px] sm:h-auto flex-shrink-0"
                      style={{ background: TAB_GRADIENTS[tab] }}
                    >
                      {svc.img ? (
                        <Image
                          src={svc.img}
                          alt={svc.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 280px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span style={{ fontSize: 48, opacity: 0.6 }}>{svc.icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3
                            className={sans}
                            style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}
                          >
                            {svc.name}
                          </h3>
                          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.5px" }}>
                            ⏱ {svc.dur}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div
                            className={serif}
                            style={{ fontSize: 26, color: C.darkRed, fontWeight: 400, lineHeight: 1 }}
                          >
                            {svc.price}
                          </div>
                          {svc.promo && (
                            <div style={{ fontSize: 11, color: C.gold, marginTop: 4 }}>
                              {svc.promo}
                            </div>
                          )}
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: 14,
                          color: C.muted,
                          lineHeight: 1.85,
                          marginBottom: 18,
                        }}
                      >
                        {svc.desc}
                      </p>

                      <div className="flex gap-3 flex-wrap">
                        <button
                          className="cursor-pointer"
                          onClick={() => nav("reservar", svc.name)}
                          style={{
                            background: C.gold,
                            color: C.dark,
                            border: "none",
                            padding: "10px 22px",
                            fontSize: 10,
                            letterSpacing: "2.5px",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          Reservar
                        </button>
                        <a
                          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                            `Hola Lucía, me interesa el tratamiento de ${svc.name}. ¿Podrías darme más información?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <button
                            className="cursor-pointer"
                            style={{
                              background: "transparent",
                              color: C.gold,
                              border: `1px solid ${C.gold}`,
                              padding: "10px 22px",
                              fontSize: 10,
                              letterSpacing: "2.5px",
                              textTransform: "uppercase",
                              fontWeight: 500,
                            }}
                          >
                            Consultar
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-13">
              <div
                className={`${serif} italic`}
                style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}
              >
                ¿Tienes dudas sobre algún tratamiento? Escríbenos.
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  className="cursor-pointer"
                  onClick={() => nav("reservar")}
                  style={{
                    background: C.gold,
                    color: C.dark,
                    border: "none",
                    padding: "14px 32px",
                    fontSize: 11,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Reservar Ahora
                </button>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                  <button
                    className="cursor-pointer"
                    style={{
                      background: "transparent",
                      color: C.gold,
                      border: `1px solid ${C.gold}`,
                      padding: "14px 32px",
                      fontSize: 11,
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    📱 Consultar
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ RESERVAR ═══════════ */}
      {sec === "reservar" && (
        <div>
          <div
            className="relative overflow-hidden text-center"
            style={{
              background: `linear-gradient(160deg,${C.dark} 0%,#1C1008 100%)`,
              padding: "80px 24px 48px",
            }}
          >
            <Particles />
            <div className="float relative z-10">
              <Lotus size={48} />
            </div>
            <div
              className="relative z-10"
              style={{
                fontSize: 9,
                letterSpacing: "5px",
                color: C.gold,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              CITA ONLINE
            </div>
            <div
              className={`${serif} relative z-10`}
              style={{
                fontSize: "clamp(30px,5vw,52px)",
                color: "#fff",
                fontWeight: 300,
              }}
            >
              Reservar Cita
            </div>
            <div
              className={`${serif} italic relative z-10`}
              style={{ fontSize: 15, color: `${C.gold}88`, marginTop: 8 }}
            >
              Rápido, sencillo, sin complicaciones
            </div>
          </div>

          <div className="max-w-[680px] mx-auto px-6 py-13">
            {done ? (
              <div
                className="text-center"
                style={{
                  padding: "52px 28px",
                  background: C.bg2,
                  border: `1px solid ${C.gold}33`,
                }}
              >
                <div className="float">
                  <Lotus size={52} />
                </div>
                <div
                  className={serif}
                  style={{ fontSize: 30, marginTop: 20, marginBottom: 10, fontWeight: 300 }}
                >
                  ¡Reserva Realizada!
                </div>
                <div className="mx-auto" style={{ width: 36, height: 1, background: C.gold, marginBottom: 24 }} />
                <p style={{ color: C.muted, lineHeight: 1.9, fontSize: 15 }}>
                  Hola <strong style={{ color: C.charcoal }}>{name}</strong>, tu cita para
                  <br />
                  <strong className={`${serif} italic`} style={{ color: C.darkRed, fontSize: 18 }}>
                    {service}
                  </strong>
                  <br />
                  el <strong>{date}</strong> a las{" "}
                  <strong>{String(time).padStart(2, "0")}:00h</strong>
                  <br />
                  ha sido registrada con éxito.
                </p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 14, lineHeight: 1.9 }}>
                  Lucía se pondrá en contacto al <strong>{phone}</strong>
                  <br />
                  para confirmar tu cita.
                </p>
                <div className="mt-9 flex gap-4 justify-center flex-wrap">
                  <button
                    className="cursor-pointer"
                    onClick={reset}
                    style={{
                      background: C.gold,
                      color: C.dark,
                      border: "none",
                      padding: "14px 32px",
                      fontSize: 11,
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Nueva Reserva
                  </button>
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
                    <button
                      className="cursor-pointer"
                      style={{
                        background: "transparent",
                        color: C.gold,
                        border: `1px solid ${C.gold}`,
                        padding: "14px 32px",
                        fontSize: 11,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      📱 WhatsApp
                    </button>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {/* Steps indicator */}
                <div className="flex items-center justify-center mb-11">
                  {([
                    [1, "Tratamiento"],
                    [2, "Fecha y Hora"],
                    [3, "Tus Datos"],
                  ] as const).map(([s, l], i) => (
                    <div key={s} className="flex items-center">
                      <div className="text-center">
                        <div
                          className="flex items-center justify-center mx-auto mb-1.5"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: step >= s ? C.gold : "transparent",
                            border: `1.5px solid ${step >= s ? C.gold : C.gold + "33"}`,
                            fontSize: 12,
                            color: step >= s ? C.dark : `${C.muted}66`,
                            fontWeight: 500,
                            boxShadow: step >= s ? `0 0 16px ${C.gold}44` : "none",
                            transition: "all .3s",
                          }}
                        >
                          {s}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: "1px",
                            color: step >= s ? C.gold : `${C.muted}66`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {l.toUpperCase()}
                        </div>
                      </div>
                      {i < 2 && (
                        <div
                          style={{
                            width: 48,
                            height: 1,
                            background: step > s ? C.gold : `${C.gold}22`,
                            margin: "0 10px 14px",
                            transition: "background .3s",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="fu">
                    <div className={serif} style={{ fontSize: 24, marginBottom: 6, fontWeight: 300 }}>
                      ¿Qué tratamiento deseas?
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
                      Selecciona el servicio para el que quieres tu cita.
                    </div>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="cursor-pointer"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: `1px solid ${C.gold}44`,
                        borderRadius: 2,
                        background: "white",
                        color: C.charcoal,
                        fontSize: 15,
                        outline: "none",
                        marginBottom: 24,
                      }}
                    >
                      <option value="">Selecciona un tratamiento...</option>
                      {(
                        [
                          ["Tratamientos Faciales", "Facial"],
                          ["Tratamientos Corporales", "Corporal"],
                          ["Depilación Láser", "Láser"],
                        ] as const
                      ).map(([g, c]) => (
                        <optgroup key={g} label={g}>
                          {SERVICES.filter((s) => s.cat === c).map((s) => (
                            <option key={s.name} value={s.name}>
                              {s.name} — {s.price}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <button
                      className="cursor-pointer w-full"
                      onClick={() => service && setStep(2)}
                      style={{
                        background: C.gold,
                        color: C.dark,
                        border: "none",
                        padding: "14px 32px",
                        fontSize: 11,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        opacity: service ? 1 : 0.4,
                      }}
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <div
                      style={{
                        background: C.bg2,
                        padding: 24,
                        marginBottom: 20,
                        border: `1px solid ${C.gold}22`,
                      }}
                    >
                      <div className="flex justify-between items-center mb-5">
                        <button
                          className="cursor-pointer"
                          onClick={() => setCalM(new Date(yr, mo - 1, 1))}
                          style={{
                            background: "transparent",
                            color: C.gold,
                            border: `1px solid ${C.gold}`,
                            padding: "6px 16px",
                            fontSize: 18,
                          }}
                        >
                          ‹
                        </button>
                        <div className={serif} style={{ fontSize: 15, letterSpacing: "3px" }}>
                          {MONTHS[mo].toUpperCase()} {yr}
                        </div>
                        <button
                          className="cursor-pointer"
                          onClick={() => setCalM(new Date(yr, mo + 1, 1))}
                          style={{
                            background: "transparent",
                            color: C.gold,
                            border: `1px solid ${C.gold}`,
                            padding: "6px 16px",
                            fontSize: 18,
                          }}
                        >
                          ›
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((d) => (
                          <div
                            key={d}
                            className="text-center"
                            style={{
                              fontSize: 9,
                              color: C.muted,
                              letterSpacing: "1px",
                              padding: "4px 0",
                            }}
                          >
                            {d.toUpperCase()}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {cells.map((d, i) => {
                          if (!d) return <div key={`e${i}`} />;
                          const ds = toDS(d);
                          const ok = dayOk(d);
                          const sel = date === ds;
                          return (
                            <button
                              key={d}
                              onClick={() => {
                                if (ok) {
                                  setDate(ds);
                                  setTime(null);
                                }
                              }}
                              className="cursor-pointer"
                              style={{
                                padding: "10px 4px",
                                border: "none",
                                borderRadius: 1,
                                background: sel ? C.gold : ok ? "white" : "transparent",
                                color: sel ? C.dark : ok ? C.charcoal : `${C.muted}33`,
                                cursor: ok ? "pointer" : "default",
                                fontSize: 13,
                                boxShadow: sel ? `0 2px 14px ${C.gold}66` : "none",
                                fontWeight: sel ? 500 : 400,
                                transition: "all .2s",
                              }}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3.5 flex gap-5" style={{ fontSize: 11, color: C.muted }}>
                        <span>⬜ Libre</span>
                        <span style={{ color: C.gold }}>⬛ Seleccionado</span>
                        <span style={{ color: `${C.muted}55` }}>— No disponible</span>
                      </div>
                    </div>

                    {date && (
                      <div className="fu mb-5">
                        <div
                          style={{
                            fontSize: 10,
                            letterSpacing: "3px",
                            color: C.muted,
                            marginBottom: 14,
                          }}
                        >
                          HORAS DISPONIBLES · {date}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(({ h, taken }) => (
                            <button
                              key={h}
                              className="slot-btn cursor-pointer"
                              onClick={() => !taken && setTime(h)}
                              disabled={taken}
                              style={{
                                padding: "12px 20px",
                                border: `1px solid ${taken ? C.muted + "22" : time === h ? C.gold : C.gold + "44"}`,
                                borderRadius: 1,
                                background: taken ? C.bg2 : time === h ? C.gold : "white",
                                color: taken ? `${C.muted}44` : time === h ? C.dark : C.charcoal,
                                cursor: taken ? "not-allowed" : "pointer",
                                fontSize: 13,
                                textDecoration: taken ? "line-through" : "none",
                                transition: "all .2s",
                                boxShadow: time === h ? `0 2px 12px ${C.gold}55` : "none",
                              }}
                            >
                              {String(h).padStart(2, "0")}:00
                              {taken && <span style={{ fontSize: 10, marginLeft: 3 }}>✕</span>}
                            </button>
                          ))}
                        </div>
                        <div style={{ marginTop: 10, fontSize: 11, color: C.muted }}>
                          Las horas tachadas ya tienen cita reservada.
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        className="cursor-pointer"
                        onClick={() => setStep(1)}
                        style={{
                          background: "transparent",
                          color: C.gold,
                          border: `1px solid ${C.gold}`,
                          padding: "14px 24px",
                          fontSize: 11,
                          letterSpacing: "2.5px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          minWidth: 100,
                        }}
                      >
                        ← Atrás
                      </button>
                      <button
                        className="cursor-pointer flex-1"
                        onClick={() => date && time !== null && setStep(3)}
                        style={{
                          background: C.gold,
                          color: C.dark,
                          border: "none",
                          padding: "14px 32px",
                          fontSize: 11,
                          letterSpacing: "2.5px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          opacity: date && time !== null ? 1 : 0.4,
                        }}
                      >
                        Continuar →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <div
                      style={{
                        background: C.dark,
                        padding: "20px 24px",
                        marginBottom: 28,
                        borderLeft: `3px solid ${C.gold}`,
                      }}
                    >
                      <div style={{ fontSize: 9, letterSpacing: "3px", color: C.gold, marginBottom: 10 }}>
                        RESUMEN DE TU CITA
                      </div>
                      <div className={serif} style={{ fontSize: 20, color: "#fff", fontWeight: 300, marginBottom: 4 }}>
                        {service}
                      </div>
                      <div style={{ fontSize: 13, color: "#ffffff77" }}>
                        {date} · {String(time).padStart(2, "0")}:00h
                      </div>
                    </div>

                    <div className="flex flex-col gap-4.5 mb-6">
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: "2.5px", color: C.muted, marginBottom: 8 }}>
                          NOMBRE COMPLETO
                        </label>
                        <input
                          style={{
                            width: "100%",
                            padding: "14px 16px",
                            border: `1px solid ${C.gold}44`,
                            borderRadius: 2,
                            background: "white",
                            color: C.charcoal,
                            fontSize: 15,
                            outline: "none",
                          }}
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: "2.5px", color: C.muted, marginBottom: 8 }}>
                          TELÉFONO
                        </label>
                        <input
                          type="tel"
                          style={{
                            width: "100%",
                            padding: "14px 16px",
                            border: `1px solid ${C.gold}44`,
                            borderRadius: 2,
                            background: "white",
                            color: C.charcoal,
                            fontSize: 15,
                            outline: "none",
                          }}
                          placeholder="Tu número de teléfono"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: C.muted,
                        marginBottom: 24,
                        lineHeight: 1.9,
                        padding: "14px 18px",
                        background: C.bg2,
                        borderLeft: `2px solid ${C.gold}44`,
                      }}
                    >
                      ✓ Lucía te contactará para confirmar la cita.
                      <br />
                      ✓ Cancelaciones con mínimo 24h de antelación.
                      <br />
                      ✓ Tus datos son estrictamente confidenciales.
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="cursor-pointer"
                        onClick={() => setStep(2)}
                        style={{
                          background: "transparent",
                          color: C.gold,
                          border: `1px solid ${C.gold}`,
                          padding: "14px 24px",
                          fontSize: 11,
                          letterSpacing: "2.5px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          minWidth: 100,
                        }}
                      >
                        ← Atrás
                      </button>
                      <button
                        className="cursor-pointer flex-1"
                        onClick={() => name && phone && confirm()}
                        style={{
                          background: C.gold,
                          color: C.dark,
                          border: "none",
                          padding: "14px 32px",
                          fontSize: 11,
                          letterSpacing: "2.5px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          opacity: name && phone ? 1 : 0.4,
                        }}
                      >
                        Confirmar Reserva ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="text-center" style={{ background: "#080604", padding: "64px 24px 32px" }}>
        <div className="float inline-block">
          <Lotus size={38} />
        </div>
        <div className={serif} style={{ fontSize: 22, letterSpacing: "8px", color: "#fff", marginTop: 16 }}>
          DIMUX
        </div>
        <div style={{ fontSize: 8, letterSpacing: "4px", color: C.gold, marginTop: 4, marginBottom: 28 }}>
          ESTÉTICA AVANZADA
        </div>
        <div className="mx-auto" style={{ width: 36, height: 1, background: `${C.gold}33`, marginBottom: 28 }} />
        <div style={{ fontSize: 13, color: "#ffffff55", lineHeight: 2.6 }}>
          <div>
            <a href="tel:644376744" style={{ color: "#ffffff77" }}>
              📞 644 376 744
            </a>
          </div>
          <div>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#ffffff77" }}
            >
              📸 @{INSTAGRAM}
            </a>
          </div>
        </div>
        <div className="mx-auto" style={{ width: 36, height: 1, background: `${C.gold}18`, margin: "28px auto 20px" }} />
        <div className={`${serif} italic`} style={{ fontSize: 14, color: `${C.gold}66` }}>
          Tu bienestar, nuestra pasión ♡
        </div>
        <div style={{ fontSize: 10, color: "#ffffff18", marginTop: 12 }}>
          © 2026 DIMUX Estética Avanzada
        </div>
      </footer>
    </div>
  );
}
