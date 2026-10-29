"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Clock, CalendarDays, User } from "lucide-react";
import { DAYS, MONTHS, NEGOCIO } from "@/lib/data";
import { useSalon, categorias, duracion, huecosLibres, hhmm } from "@/components/negocio";
import { db } from "@/lib/supabase";
import { guardarReservaDemo, ocupadoDemo } from "@/components/panel-app/demo";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const ds = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const DIAS_CORTOS = ["L", "M", "X", "J", "V", "S", "D"];
const PASOS = [
  { n: 1 as Step, t: "Tratamiento", icon: User },
  { n: 2 as Step, t: "Día y hora", icon: CalendarDays },
  { n: 3 as Step, t: "Tus datos", icon: Check },
];

export function Booking() {
  const salon = useSalon();
  const { negocio, servicios, horario } = salon;
  const real = salon.modo === "real";
  const TABS = categorias(servicios);

  const [step, setStep] = useState<Step>(1);
  const [catElegida, setCat] = useState("");
  const cat = TABS.some((t) => t.id === catElegida) ? catElegida : TABS[0]?.id ?? "";
  const [servicio, setServicio] = useState("");
  const [mes, setMes] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [dia, setDia] = useState<Date | null>(null);
  const [inicio, setInicio] = useState<number | null>(null); // minutos del día
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [hecho, setHecho] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  // Citas y bloqueos de la estética real: { "2026-11-02": [{ini, fin}] }
  const [ocupado, setOcupado] = useState<Record<string, { ini: number; fin: number }[]>>({});
  const caja = useRef<HTMLDivElement>(null);
  const [mover, setMover] = useState(0); // cada cambio vuelve a enseñar el bloque de reserva
  useEffect(() => {
    if (mover) caja.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mover]);

  const elegido = servicios.find((s) => s.name === servicio);
  const dur = duracion(elegido?.dur);
  const telOk = telefono.replace(/\D/g, "").length >= 9;

  // Cada vez que cambia el paso, el bloque de reserva vuelve a verse entero
  const irA = (n: Step) => {
    setStep(n);
    setError("");
    setMover((n) => n + 1);
  };

  // Desde las tarjetas de tratamientos: ya está elegido, se pasa directo al día y la hora
  useEffect(() => {
    function elegir(e: Event) {
      const { name, cat } = (e as CustomEvent<{ name: string; cat: string }>).detail;
      setCat(cat);
      setServicio(name);
      setInicio(null);
      setHecho(false);
      irA(2);
    }
    window.addEventListener("estetica:select-service", elegir);
    return () => window.removeEventListener("estetica:select-service", elegir);
  }, []);

  const cargarOcupado = useCallback(async () => {
    if (!real) {
      // Web de muestra: no ofrece las horas que ya están ocupadas en el panel de muestra
      const h = new Date();
      h.setHours(0, 0, 0, 0);
      setOcupado(ocupadoDemo(h));
      return;
    }
    if (!salon.slug) return;
    const desde = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const hasta = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
    const { data } = await db().rpc("horas_ocupadas", { p_slug: salon.slug, p_desde: ds(desde), p_hasta: ds(hasta) });
    const m: Record<string, { ini: number; fin: number }[]> = {};
    for (const r of (data ?? []) as { fecha: string; hora: number; minuto: number; duracion_min: number }[]) {
      const ini = r.hora * 60 + (r.minuto || 0);
      (m[r.fecha] ??= []).push({ ini, fin: ini + (r.duracion_min || 60) });
    }
    setOcupado(m);
  }, [real, salon.slug, mes]);

  useEffect(() => {
    const t = setTimeout(cargarOcupado, 0);
    return () => clearTimeout(t);
  }, [cargarOcupado, step]);

  /* --- Calendario (empieza en lunes) --- */
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const celdas = useMemo(() => {
    const primero = (new Date(mes.getFullYear(), mes.getMonth(), 1).getDay() + 6) % 7;
    const n = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    return [...Array<null>(primero).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
  }, [mes]);
  const huecos = (d: Date) => huecosLibres(horario, d, dur, ocupado[ds(d)] ?? [], salon.intervalo);
  const diaLibre = (n: number) => {
    const d = new Date(mes.getFullYear(), mes.getMonth(), n);
    return d >= hoy && huecos(d).length > 0;
  };
  const mesAnteriorBloqueado = mes.getFullYear() === hoy.getFullYear() && mes.getMonth() === hoy.getMonth();

  const horas = dia ? huecos(dia) : [];
  const manana = horas.filter((m) => m < 14 * 60);
  const tarde = horas.filter((m) => m >= 14 * 60);

  const fechaLarga = (d: Date) => `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()}`;
  const fin = inicio != null ? inicio + dur : 0;

  /* --- Mensaje y calendario de la clienta --- */
  function mensaje() {
    if (!dia || inicio == null) return "";
    return `Hola! Me gustaría reservar:\n\n*Tratamiento:* ${servicio}\n*Fecha:* ${fechaLarga(dia)} de ${dia.getFullYear()}\n*Hora:* ${hhmm(inicio)}h\n*Nombre:* ${nombre.trim()}\n*Teléfono:* ${telefono.trim()}`;
  }
  // En la web de muestra con el WhatsApp de la estética (?tel=), la reserva de prueba también le llega a ella
  const waPropio = negocio.whatsapp !== NEGOCIO.whatsapp;
  const waUrl = () => `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje())}`;

  function descargarIcs() {
    if (!dia || inicio == null) return;
    const ini = new Date(dia);
    ini.setHours(0, inicio, 0, 0);
    const finD = new Date(ini.getTime() + dur * 60000);
    const f = (d: Date) =>
      `${ds(d).replace(/-/g, "")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Estetica//Reservas//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@estetica`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;TZID=Europe/Madrid:${f(ini)}`,
      `DTEND;TZID=Europe/Madrid:${f(finD)}`,
      `SUMMARY:${servicio} · ${negocio.nombre}`,
      `LOCATION:${negocio.nombre}\\, ${negocio.ciudad}`,
      "DESCRIPTION:Si no puedes venir\\, avísanos con 24 h.",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Mañana tienes cita en ${negocio.nombre}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-cita.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function confirmar() {
    if (!elegido || !dia || inicio == null) return;
    if (nombre.trim().length < 2) return setError("Escribe tu nombre.");
    if (!telOk) return setError("Escribe tu teléfono (9 cifras) para poder confirmarte la cita.");
    setError("");
    if (!real) {
      // Web de muestra: la reserva aparece en el panel de muestra de este mismo móvil
      if (waPropio) window.open(waUrl(), "_blank", "noopener,noreferrer");
      guardarReservaDemo({
        date: ds(dia), time: inicio / 60, dur, client: nombre.trim(), phone: telefono.trim(),
        service: servicio, price: `${parseInt(elegido.price) || 0}€`,
      });
      setHecho(true);
      setMover((n) => n + 1);
      return;
    }
    setEnviando(true);
    const { error: e } = await db().rpc("reservar", {
      p_slug: salon.slug,
      p_fecha: ds(dia),
      p_hora: Math.floor(inicio / 60),
      p_minuto: inicio % 60,
      p_tratamiento: servicio,
      p_nombre: nombre.trim(),
      p_telefono: telefono.trim(),
    });
    setEnviando(false);
    if (e) {
      if (/disponible|cerrado|pasado/i.test(e.message)) {
        // Alguien la cogió o la bloquearon mientras tanto: se vuelve a elegir hora con el aviso a la vista
        setInicio(null);
        cargarOcupado();
        irA(2);
        setError("Lo sentimos, esa hora ya no está disponible. Elige otra, por favor.");
      } else {
        setError(e.message || "No se pudo guardar la reserva. Inténtalo de nuevo.");
      }
      return;
    }
    setHecho(true);
    setMover((n) => n + 1);
  }

  function otra() {
    setHecho(false);
    setServicio("");
    setDia(null);
    setInicio(null);
    irA(1);
  }

  /* --- Barra de abajo: lo elegido y el botón para seguir, siempre a la vista --- */
  const barra =
    step === 1
      ? { texto: elegido ? `${elegido.name} · ${elegido.price}` : "Elige un tratamiento", ok: !!elegido, accion: () => irA(2), boton: "Siguiente" }
      : step === 2
        ? {
            texto: dia && inicio != null ? `${DAYS[dia.getDay()]} ${dia.getDate()} · ${hhmm(inicio)}` : dia ? "Elige una hora" : "Elige un día",
            ok: !!dia && inicio != null,
            accion: () => irA(3),
            boton: "Siguiente",
          }
        : {
            texto: !nombre.trim() || !telOk ? "Faltan tus datos" : "Todo listo",
            ok: nombre.trim().length >= 2 && telOk && !enviando,
            accion: confirmar,
            boton: enviando ? "Guardando…" : real ? "Reservar" : "Enviar reserva",
          };

  const titulo = hecho
    ? real && !salon.confirmarAuto
      ? "¡Reserva recibida!"
      : "¡Cita reservada!"
    : "";
  const subtitulo = real
    ? salon.confirmarAuto
      ? "En breve te llegará un WhatsApp con los detalles de tu cita. Si no puedes venir, avísanos con 24 horas."
      : "Ya la tenemos apuntada. En breve te llegará un WhatsApp para confirmártela."
    : waPropio
      ? "Esta es una web de muestra: te hemos abierto WhatsApp con la reserva y ya ha llegado al panel de la dueña."
      : "Esta es una web de muestra: tu reserva ya ha llegado al panel de la dueña. Míralo tú misma.";

  return (
    <section id="reservar" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Reservas"
          title="Reserva tu cita"
          description="Elige tratamiento, día y hora. En un minuto lo tienes."
          className="mb-8 px-2"
        />

        <div ref={caja} className="scroll-mt-20 bg-white/70 border border-border rounded-2xl shadow-[0_20px_50px_-30px_rgba(26,26,26,0.35)] font-sans">
          {hecho && dia && inicio != null ? (
            /* ---------- Confirmación ---------- */
            <div className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--gold)] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl">{titulo}</h3>
                <p className="text-[15px] text-muted-foreground max-w-md mx-auto">{subtitulo}</p>
              </div>
              <div className="bg-[var(--secondary)] rounded-xl p-5 text-left max-w-sm mx-auto space-y-2 text-[15px]">
                <p className="font-semibold">{servicio}</p>
                <p className="text-foreground/80">
                  {fechaLarga(dia)} · {hhmm(inicio)} – {hhmm(fin)}
                </p>
                <p className="text-foreground/80">{nombre}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={descargarIcs} className="btn-gold px-6 py-3.5 rounded-full text-sm font-medium">
                  Añadir a mi calendario
                </button>
                {real ? (
                  <a
                    href={`https://wa.me/${negocio.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full text-sm font-medium border border-foreground/30"
                  >
                    Escribirnos por WhatsApp
                  </a>
                ) : (
                  <a href="/admin" className="px-6 py-3.5 rounded-full text-sm font-medium border border-foreground/30">
                    Ver la reserva en el panel
                  </a>
                )}
                {!real && waPropio && (
                  <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 rounded-full text-sm font-medium border border-foreground/30">
                    ¿No se abrió? Enviar por WhatsApp
                  </a>
                )}
              </div>
              <button onClick={otra} className="text-sm text-muted-foreground underline underline-offset-4">
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <>
              {/* ---------- Pasos ---------- */}
              <div className="flex border-b border-border">
                {PASOS.map((p) => {
                  const activo = step === p.n;
                  const pasado = step > p.n;
                  return (
                    <button
                      key={p.n}
                      disabled={!pasado}
                      onClick={() => irA(p.n)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-4 text-[13px] sm:text-sm border-b-2 -mb-px transition-colors",
                        activo ? "border-[var(--gold)] text-foreground font-semibold" : "border-transparent",
                        pasado ? "text-[var(--gold)] cursor-pointer" : !activo && "text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                          activo ? "bg-foreground text-white" : pasado ? "bg-[var(--gold)] text-white" : "bg-[var(--secondary)]"
                        )}
                      >
                        {pasado ? <Check className="w-3.5 h-3.5" /> : p.n}
                      </span>
                      <span className={cn(!activo && "hidden sm:inline")}>{p.t}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 sm:p-6 min-h-[320px]">
                {/* ---------- 1. Tratamiento ---------- */}
                {step === 1 && (
                  <div className="space-y-4 tab-enter">
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                      {TABS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setCat(t.id)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors",
                            cat === t.id ? "bg-foreground text-white border-foreground" : "border-border text-foreground/70"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {servicios
                        .filter((s) => s.cat === cat)
                        .map((s) => {
                          const sel = servicio === s.name;
                          return (
                            <button
                              key={s.name}
                              onClick={() => {
                                setServicio(s.name);
                                setInicio(null);
                              }}
                              className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                sel ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-border bg-white hover:border-foreground/30"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold leading-snug">{s.name}</p>
                                <p className="text-[13px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {s.dur}
                                  {s.promo && <span className="text-[var(--gold)]">· {s.promo}</span>}
                                </p>
                              </div>
                              <p className="text-[15px] font-semibold tabular-nums whitespace-nowrap">{s.price}</p>
                              <span
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                  sel ? "border-[var(--gold)] bg-[var(--gold)]" : "border-border"
                                )}
                              >
                                {sel && <Check className="w-3 h-3 text-white" />}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* ---------- 2. Día y hora ---------- */}
                {step === 2 && (
                  <div className="space-y-6 tab-enter">
                    {error && (
                      <p className="text-[15px] font-medium text-[#b42318] bg-[#b42318]/8 border border-[#b42318]/20 rounded-xl px-4 py-3">
                        {error}
                      </p>
                    )}
                    {elegido && (
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-semibold">{elegido.name}</span> · dura {dur} min
                      </p>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
                          disabled={mesAnteriorBloqueado}
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--secondary)] disabled:opacity-25"
                          aria-label="Mes anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <p className="text-base font-semibold">
                          {MONTHS[mes.getMonth()]} {mes.getFullYear()}
                        </p>
                        <button
                          onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--secondary)]"
                          aria-label="Mes siguiente"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {DIAS_CORTOS.map((d) => (
                          <span key={d} className="text-xs text-muted-foreground py-1 font-medium">
                            {d}
                          </span>
                        ))}
                        {celdas.map((n, i) => {
                          if (!n) return <span key={`v${i}`} />;
                          const d = new Date(mes.getFullYear(), mes.getMonth(), n);
                          const libre = diaLibre(n);
                          const sel = dia && ds(dia) === ds(d);
                          const esHoy = ds(d) === ds(hoy);
                          return (
                            <button
                              key={n}
                              disabled={!libre}
                              onClick={() => {
                                setDia(d);
                                setInicio(null);
                              }}
                              className={cn(
                                "aspect-square max-h-12 w-full rounded-full text-[15px] tabular-nums transition-colors flex items-center justify-center mx-auto",
                                sel
                                  ? "bg-foreground text-white font-semibold"
                                  : libre
                                    ? "font-medium hover:bg-[var(--gold)]/15"
                                    : "text-foreground/25 line-through decoration-transparent",
                                esHoy && !sel && "ring-1 ring-[var(--gold)]"
                              )}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {dia && (
                      <div className="space-y-4">
                        <p className="text-sm font-semibold">Horas libres el {fechaLarga(dia)}</p>
                        {horas.length === 0 && <p className="text-sm text-muted-foreground">No quedan horas libres ese día. Prueba con otro.</p>}
                        {[
                          ["Mañana", manana],
                          ["Tarde", tarde],
                        ].map(
                          ([t, lista]) =>
                            (lista as number[]).length > 0 && (
                              <div key={t as string}>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t as string}</p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                  {(lista as number[]).map((m) => (
                                    <button
                                      key={m}
                                      onClick={() => {
                                        setInicio(m);
                                        setError("");
                                      }}
                                      className={cn(
                                        "py-2.5 rounded-lg border text-[15px] tabular-nums font-medium transition-colors",
                                        inicio === m
                                          ? "bg-foreground text-white border-foreground"
                                          : "border-border bg-white hover:border-[var(--gold)]"
                                      )}
                                    >
                                      {hhmm(m)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- 3. Tus datos ---------- */}
                {step === 3 && elegido && dia && inicio != null && (
                  <div className="space-y-5 tab-enter">
                    <div className="bg-[var(--secondary)] rounded-xl p-4 flex items-start justify-between gap-4">
                      <div className="text-[15px] space-y-1">
                        <p className="font-semibold">{elegido.name}</p>
                        <p className="text-foreground/75">
                          {fechaLarga(dia)} · {hhmm(inicio)} – {hhmm(fin)}
                        </p>
                      </div>
                      <p className="text-[15px] font-semibold tabular-nums">{elegido.price}</p>
                    </div>
                    <label className="block">
                      <span className="text-sm font-medium">Nombre y apellido</span>
                      <input
                        type="text"
                        autoComplete="name"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej.: Laura García"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-base outline-none focus:border-[var(--gold)]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">Teléfono (WhatsApp)</span>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="600 000 000"
                        className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-base outline-none focus:border-[var(--gold)]"
                      />
                      <span className="text-xs text-muted-foreground mt-1.5 block">
                        Solo para confirmarte la cita y avisarte el día antes.
                      </span>
                    </label>
                  </div>
                )}

                {error && step !== 2 && <p className="mt-4 text-[15px] font-medium text-[#b42318] bg-[#b42318]/8 border border-[#b42318]/20 rounded-xl px-4 py-3">{error}</p>}
              </div>

              {/* ---------- Barra fija abajo ---------- */}
              <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-border rounded-b-2xl px-4 sm:px-6 py-3 flex items-center gap-3">
                {step > 1 && (
                  <button
                    onClick={() => irA((step - 1) as Step)}
                    className="w-11 h-11 rounded-full border border-border flex items-center justify-center flex-shrink-0"
                    aria-label="Volver"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <p className={cn("flex-1 min-w-0 text-sm truncate", barra.ok ? "font-semibold" : "text-muted-foreground")}>
                  {barra.texto}
                </p>
                <button
                  disabled={!barra.ok}
                  onClick={() => barra.accion()}
                  className="btn-gold px-6 py-3 rounded-full text-sm font-semibold flex-shrink-0 disabled:opacity-35 disabled:pointer-events-none inline-flex items-center gap-1"
                >
                  {barra.boton}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
