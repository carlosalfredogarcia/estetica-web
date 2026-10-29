"use client";

import { useContext, useEffect, useState } from "react";
import { Ban, ChevronLeft, ChevronRight } from "lucide-react";
import { PanelCtx } from "./ctx";
import { cn } from "@/lib/utils";
import { Cifras, Segmentos } from "./ui";
import {
  C, type Cita, type Bloqueo, DIAS, MESES, toDS, parseD, sumarDias, hhmm, fechaLarga, euros, nombrePila, estadoCita,
} from "./tema";

function Flecha({ izq, onClick, label }: { izq?: boolean; onClick: () => void; label: string }) {
  const I = izq ? ChevronLeft : ChevronRight;
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="w-11 h-11 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] flex items-center justify-center flex-shrink-0 active:scale-95"
    >
      <I className="w-6 h-6" style={{ color: C.oro }} />
    </button>
  );
}

// Cabecera con flechas: «‹  Miércoles, 28 de octubre  ›»
function Navegar({ titulo, sub, onAntes, onDespues }: { titulo: string; sub?: React.ReactNode; onAntes: () => void; onDespues: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Flecha izq label="Anterior" onClick={onAntes} />
      <div className="text-center min-w-0">
        <p className="text-[18px] font-bold leading-tight truncate">{titulo}</p>
        {sub && <div className="text-[13px] mt-0.5">{sub}</div>}
      </div>
      <Flecha label="Siguiente" onClick={onDespues} />
    </div>
  );
}

export function Agenda() {
  const P = useContext(PanelCtx);
  return (
    <div className="space-y-4">
      <Segmentos
        valor={P.modo}
        onCambio={P.setModo}
        opciones={[
          { id: "dia", txt: "Día" },
          { id: "semana", txt: "Semana" },
          { id: "mes", txt: "Mes" },
        ]}
      />
      {P.modo === "dia" && <VistaDia />}
      {P.modo === "semana" && <VistaSemana />}
      {P.modo === "mes" && <VistaMes />}
    </div>
  );
}

/* ================= DÍA ================= */
function VistaDia() {
  const P = useContext(PanelCtx);
  const ds: string = P.selDate;
  const k = P.cifras([ds]);
  const cerrado = !(P.HOR[parseD(ds).getDay()] || []).length;
  const esHoy = ds === P.today;
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Navegar
        titulo={fechaLarga(ds)}
        sub={
          esHoy ? (
            <span className="text-[#8A7A70]">Hoy</span>
          ) : (
            <button onClick={() => P.setSelDate(P.today)} className="font-semibold" style={{ color: C.oro }}>
              Volver a hoy
            </button>
          )
        }
        onAntes={() => P.setSelDate(sumarDias(ds, -1))}
        onDespues={() => P.setSelDate(sumarDias(ds, 1))}
      />
      {!cerrado && (
        <Cifras
          items={[
            { n: k.n, l: k.n === 1 ? "cita" : "citas" },
            { n: `${k.pct}%`, l: "ocupación", color: k.pct > 80 ? C.rojo : k.pct > 40 ? C.ambar : C.verde },
            { n: euros(k.ingresos), l: "previsto", color: "#8B2252" },
          ]}
        />
      )}
      <div className="flex justify-between items-center">
        <p className="text-[13px] text-[#8A7A70]">Toca una hora libre para apuntar o bloquear</p>
        <button
          onClick={() => P.setBloqueo({ date: ds, min: null, dur: 60, reason: "" })}
          className="h-9 px-3 rounded-full bg-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] flex-shrink-0"
          style={{ color: C.rojo }}
        >
          <Ban className="w-4 h-4" /> Bloquear
        </button>
      </div>
      {cerrado && !P.citasDe(ds).length ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-[17px] font-bold">Cerrado</p>
          <p className="text-[14px] text-[#8A7A70] mt-1">Este día no se abre.</p>
        </div>
      ) : (
        <Rejilla dias={[ds]} />
      )}
    </div>
  );
}

/* ================= SEMANA ================= */
function VistaSemana() {
  const P = useContext(PanelCtx);
  const d = parseD(P.selDate);
  const lunes = sumarDias(P.selDate, -((d.getDay() + 6) % 7));
  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
  const k = P.cifras(dias);
  const a = parseD(dias[0]),
    z = parseD(dias[6]);
  const titulo = `${a.getDate()} ${MESES[a.getMonth()].slice(0, 3).toLowerCase()} – ${z.getDate()} ${MESES[z.getMonth()].slice(0, 3).toLowerCase()}`;
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Navegar
        titulo={titulo}
        sub={
          dias.includes(P.today) ? (
            <span className="text-[#8A7A70]">Esta semana</span>
          ) : (
            <button onClick={() => P.setSelDate(P.today)} className="font-semibold" style={{ color: C.oro }}>
              Volver a esta semana
            </button>
          )
        }
        onAntes={() => P.setSelDate(sumarDias(P.selDate, -7))}
        onDespues={() => P.setSelDate(sumarDias(P.selDate, 7))}
      />
      <Cifras
        items={[
          { n: k.n, l: "citas" },
          { n: `${k.pct}%`, l: "ocupación", color: k.pct > 80 ? C.rojo : k.pct > 40 ? C.ambar : C.verde },
          { n: euros(k.ingresos), l: "previsto", color: "#8B2252" },
        ]}
      />
      <p className="text-[13px] text-[#8A7A70]">Toca un día para verlo en grande</p>
      <Rejilla dias={dias} />
    </div>
  );
}

/* ================= MES ================= */
function VistaMes() {
  const P = useContext(PanelCtx);
  const base = parseD(P.selDate);
  const y = base.getFullYear(),
    m = base.getMonth();
  const n = new Date(y, m + 1, 0).getDate();
  const dias = Array.from({ length: n }, (_, i) => toDS(new Date(y, m, i + 1)));
  const k = P.cifras(dias);
  const huecoInicial = (new Date(y, m, 1).getDay() + 6) % 7;
  const cambiarMes = (d: number) => P.setSelDate(toDS(new Date(y, m + d, 1)));
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Navegar titulo={`${MESES[m]} ${y}`} onAntes={() => cambiarMes(-1)} onDespues={() => cambiarMes(1)} />
      <Cifras
        items={[
          { n: k.n, l: "citas" },
          { n: `${k.pct}%`, l: "ocupación", color: k.pct > 80 ? C.rojo : k.pct > 40 ? C.ambar : C.verde },
          { n: euros(k.ingresos), l: "previsto", color: "#8B2252" },
        ]}
      />
      <div className="bg-white rounded-2xl p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-[#8A7A70] py-1.5">
          {["L", "M", "X", "J", "V", "S", "D"].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: huecoInicial }).map((_, i) => (
            <span key={`v${i}`} />
          ))}
          {dias.map((ds) => {
            const c = P.cifras([ds]);
            const cerrado = !(P.HOR[parseD(ds).getDay()] || []).length;
            const hoy = ds === P.today;
            return (
              <button
                key={ds}
                onClick={() => {
                  P.setSelDate(ds);
                  P.setModo("dia");
                }}
                className={cn("rounded-xl pt-1.5 pb-2 flex flex-col items-center gap-1 min-h-[58px] active:scale-95 transition", cerrado ? "bg-[#F6F1EC]" : "bg-[#FBF8F5]")}
              >
                <span
                  className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold", hoy && "text-white")}
                  style={{ background: hoy ? C.oro : "transparent", color: hoy ? "#fff" : cerrado ? "#C9BDB2" : C.tinta }}
                >
                  {parseD(ds).getDate()}
                </span>
                {c.n > 0 && <span className="text-[11px] font-semibold text-[#8A7A70] leading-none">{c.n}</span>}
                {!cerrado && (
                  <span className="w-7 h-1 rounded-full bg-[#EFE7DF] overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${c.pct}%`, background: c.pct > 80 ? C.rojo : c.pct > 40 ? C.ambar : C.verde }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-[13px] text-[#8A7A70]">El número es la cantidad de citas; la barra, lo lleno que está el día.</p>
    </div>
  );
}

/* ================= REJILLA DE HORAS ================= */
// Una fila por media hora, de la apertura al cierre. Las citas y bloqueos ocupan su duración.
// Con 7 días (semana) se ven en columnas de lunes a domingo.
function Rejilla({ dias }: { dias: string[] }) {
  const P = useContext(PanelCtx);
  const semana = dias.length > 1;
  const FILA = semana ? 26 : 40; // alto de media hora en px
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  let ini = 24 * 60,
    fin = 0;
  for (const ds of dias) {
    for (const { s, e } of P.HOR[parseD(ds).getDay()] || []) {
      ini = Math.min(ini, s * 60);
      fin = Math.max(fin, e * 60);
    }
    for (const o of P.ocupadoDia(ds)) {
      ini = Math.min(ini, Math.floor(o.ini / 30) * 30);
      fin = Math.max(fin, Math.ceil(o.fin / 30) * 30);
    }
  }
  if (fin <= ini) {
    ini = 10 * 60;
    fin = 20 * 60;
  }
  const filas = Array.from({ length: (fin - ini) / 30 }, (_, i) => ini + i * 30);
  const abierto = (ds: string, m: number) =>
    (P.HOR[parseD(ds).getDay()] || []).some(({ s, e }: { s: number; e: number }) => m >= s * 60 && m < e * 60);
  const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const cols = `${semana ? 34 : 48}px repeat(${dias.length},minmax(0,1fr))`;

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      {semana && (
        <div className="grid border-b border-[#EAE1D8]" style={{ gridTemplateColumns: cols }}>
          <span />
          {dias.map((ds) => {
            const d = parseD(ds);
            const hoy = ds === P.today;
            const n = P.citasDe(ds).length;
            return (
              <button
                key={ds}
                onClick={() => {
                  P.setSelDate(ds);
                  P.setModo("dia");
                }}
                className="py-2 flex flex-col items-center active:bg-black/5"
              >
                <span className="text-[11px] font-semibold uppercase" style={{ color: hoy ? C.oro : C.gris }}>
                  {DIAS[d.getDay()].slice(0, 2)}
                </span>
                <span
                  className="w-7 h-7 mt-0.5 rounded-full flex items-center justify-center text-[15px] font-bold"
                  style={{ background: hoy ? C.oro : "transparent", color: hoy ? "#fff" : C.tinta }}
                >
                  {d.getDate()}
                </span>
                <span className="text-[10px] text-[#8A7A70] h-3 leading-3">{n ? `${n} cita${n > 1 ? "s" : ""}` : ""}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {/* Horas */}
        <div>
          {filas.map((m) => (
            <div
              key={m}
              className="pr-1.5 text-right tabular-nums"
              style={{ height: FILA, fontSize: semana ? 10.5 : 12.5, color: C.gris, fontWeight: m % 60 === 0 ? 700 : 400, lineHeight: "14px", paddingTop: 2 }}
            >
              {m % 60 === 0 || !semana ? hhmm(m / 60) : ""}
            </div>
          ))}
        </div>
        {/* Días */}
        {dias.map((ds) => {
          const citas: Cita[] = P.citasDe(ds);
          const bloqueos: Bloqueo[] = P.blocked.filter((b: Bloqueo) => b.date === ds);
          const ocup = P.ocupadoDia(ds);
          const lleno = (m: number) => ocup.some((o: { ini: number; fin: number }) => o.ini < m + 30 && o.fin > m);
          const pos = (t: number, dur: number) => ({
            top: (Math.round(t * 60) - ini) / 30 * FILA + 1,
            height: Math.max(FILA - 2, (dur / 30) * FILA - 2),
          });
          return (
            <div key={ds} className="relative border-l border-[#EFE7DF]">
              {filas.map((m) => {
                const ab = abierto(ds, m);
                const pasado = ds < P.today || (ds === P.today && m + 30 <= minAhora);
                return (
                  <div
                    key={m}
                    onClick={() => {
                      if (ab && !lleno(m) && !pasado) P.setHueco({ date: ds, min: m });
                    }}
                    className={cn(ab && !pasado && "cursor-pointer active:bg-[#F1E6D2]")}
                    style={{
                      height: FILA,
                      borderTop: `1px solid ${m % 60 === 0 ? "#EAE1D8" : "#F5F0EA"}`,
                      background: ab ? "transparent" : "repeating-linear-gradient(45deg,#F7F2ED,#F7F2ED 4px,#F1EAE2 4px,#F1EAE2 8px)",
                    }}
                  />
                );
              })}
              {ds === P.today && minAhora >= ini && minAhora <= fin && (
                <div className="absolute inset-x-0 z-[3] pointer-events-none" style={{ top: ((minAhora - ini) / 30) * FILA }}>
                  <div className="h-[2px] bg-[#B54A4A]" />
                  <div className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-[#B54A4A]" />
                </div>
              )}
              {bloqueos.map((b, i) => {
                const p = pos(b.time, b.dur);
                return (
                  <button
                    key={`b${i}`}
                    onClick={() => P.setBloqueo({ original: b, date: b.date, min: Math.round(b.time * 60), dur: b.dur, reason: b.reason })}
                    className="absolute left-[2px] right-[2px] z-[2] rounded-lg text-left overflow-hidden"
                    style={{
                      ...p,
                      background: "repeating-linear-gradient(45deg,#FBEDED,#FBEDED 5px,#F6E0E0 5px,#F6E0E0 10px)",
                      borderLeft: `3px solid ${C.rojo}`,
                      padding: semana ? "2px 3px" : "6px 10px",
                    }}
                  >
                    {semana ? (
                      <span className="block text-[10px] font-bold whitespace-nowrap overflow-hidden" style={{ color: C.rojo }}>
                        Bloq.
                      </span>
                    ) : (
                      <span className="block text-[13.5px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: C.rojo }}>
                        <b>Bloqueado</b> · {hhmm(b.time)} – {hhmm(b.time + b.dur / 60)}
                        {b.reason ? ` · ${b.reason}` : ""}
                      </span>
                    )}
                  </button>
                );
              })}
              {citas.map((c) => {
                const p = pos(c.time, c.dur);
                const st = estadoCita(c.status);
                const avisar = P.porAvisar.some((x: Cita) => x.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => P.setDetalle(c)}
                    className="absolute left-[2px] right-[2px] z-[2] rounded-lg text-left overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.08)] active:scale-[0.98] transition"
                    style={{ ...p, background: st.fondo, borderLeft: `3px solid ${st.color}`, padding: semana ? "2px 3px" : "6px 10px" }}
                  >
                    {semana ? (
                      <>
                        {p.height > 30 && (
                          <span className="block text-[9.5px] font-semibold tabular-nums whitespace-nowrap overflow-hidden" style={{ color: st.color }}>
                            {hhmm(c.time)}
                          </span>
                        )}
                        <span className="block text-[10.5px] font-bold text-[#1A1A1A] whitespace-nowrap overflow-hidden text-ellipsis">
                          {nombrePila(c.client)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1A1A1A] whitespace-nowrap overflow-hidden">
                          {avisar && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C.azul }} />}
                          <span className="overflow-hidden text-ellipsis">{c.client}</span>
                        </span>
                        <span className="block text-[13px] text-[#6F625A] whitespace-nowrap overflow-hidden text-ellipsis">
                          {hhmm(c.time)} – {hhmm(c.time + c.dur / 60)} · {c.service}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
