"use client";

import { useContext, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { PanelCtx } from "./ctx";
import { cn } from "@/lib/utils";
import { Avatar, Cifras, Ficha, Vacio } from "./ui";
import { C, type Cita, MESES, parseD, toDS, sumarDias, hhmm, fechaCorta, euros, precio, waTo, estadoCita } from "./tema";

function Titulo({ titulo, sub }: { titulo: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-[24px] font-bold leading-tight">{titulo}</h1>
      {sub && <p className="text-[14px] text-[#8A7A70] mt-1">{sub}</p>}
    </div>
  );
}

/* ================= AVISOS ================= */
function Grupo({ titulo, ayuda, items, fila }: { titulo: string; ayuda: string; items: any[]; fila: (x: any) => React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-[17px] font-bold">{titulo}</h2>
        {items.length > 0 && <span className="text-[13px] font-semibold text-[#8A7A70]">{items.length}</span>}
      </div>
      <p className="text-[13px] text-[#8A7A70] mb-3">{ayuda}</p>
      {items.length === 0 ? (
        <p className="text-[14px] text-[#8A7A70] bg-white/60 rounded-2xl px-4 py-3">Nada pendiente ✓</p>
      ) : (
        <div className="space-y-2">{items.map(fila)}</div>
      )}
    </section>
  );
}

function Fila({ b, clave, txt, mensaje, sub, alEnviar }: { b: any; clave: string; txt: string; mensaje: string; sub: string; alEnviar?: () => void }) {
  const P = useContext(PanelCtx);
    const hecho = P.enviado(clave, b.id ? b : undefined);
    return (
      <Ficha className="flex items-center gap-3 p-3">
        <Avatar nombre={b.client} />
        <div className="flex-1 min-w-0" onClick={() => b.id && P.setDetalle(b)}>
          <p className="text-[15px] font-bold truncate">{b.client}</p>
          <p className="text-[13px] text-[#8A7A70] truncate">{sub}</p>
        </div>
        {!b.phone ? (
          <span className="text-[12px] text-[#8A7A70]">Sin teléfono</span>
        ) : hecho ? (
          <a
            href={waTo(b.phone, mensaje)}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3 rounded-full text-[13px] font-bold flex items-center"
            style={{ color: C.verde, background: "#E6F0EA" }}
          >
            ✓ Enviado
          </a>
        ) : (
          <a
            href={waTo(b.phone, mensaje)}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              P.marcarEnviado(clave, b.id ? b : undefined);
              alEnviar?.();
            }}
            className="h-9 px-4 rounded-full text-[13px] font-bold text-white flex items-center flex-shrink-0"
            style={{ background: C.verde }}
          >
            {txt}
          </a>
        )}
      </Ficha>
    );
  }

export function Avisos() {
  const P = useContext(PanelCtx);
  const manana = sumarDias(P.today, 1);
  const ayer = sumarDias(P.today, -1);
  const horaAhora = new Date().getHours();
  const recordar: Cita[] = P.citasDe(manana);
  const resena: Cita[] = P.bookings
    .filter((b: Cita) => b.date === ayer || (b.date === P.today && b.time < horaAhora))
    .sort((a: Cita, b: Cita) => a.time - b.time);
  const lejos = P.clientas
    .filter((c: any) => !c.next && c.daysAway !== null && c.daysAway >= 30)
    .sort((a: any, b: any) => b.spent - a.spent)
    .slice(0, 8);

  return (
    <div className="animate-in fade-in duration-200">
      <Titulo titulo="Avisos" sub="Cada botón abre WhatsApp con el mensaje ya escrito: solo tienes que enviarlo." />
      <Grupo
        titulo="Reservas nuevas"
        ayuda="Envíales la confirmación de su cita (la web les dice que les llegará un WhatsApp)."
        items={P.porAvisar}
        fila={(b: Cita) => (
          <Fila
            key={b.id}
            b={b}
            clave={`conf-${b.id}`}
            txt="Enviar confirmación"
            mensaje={P.msg.detalles(b)}
            sub={`${fechaCorta(b.date)} · ${hhmm(b.time)} · ${b.service}`}
            alEnviar={() => b.status === "pendiente" && P.cambiarEstado(b.id, "confirmada")}
          />
        )}
      />
      <Grupo
        titulo="Recordar las citas de mañana"
        ayuda="Un recordatorio el día antes evita muchas citas a las que no viene nadie."
        items={recordar}
        fila={(b: Cita) => (
          <Fila key={b.id} b={b} clave={`rec-${b.id}`} txt="Recordar" mensaje={P.msg.recordar(b)} sub={`${hhmm(b.time)} · ${b.service}`} />
        )}
      />
      <Grupo
        titulo="Pedir reseña"
        ayuda="Clientas que vinieron ayer u hoy. Las reseñas en Google traen clientas nuevas."
        items={resena}
        fila={(b: Cita) => (
          <Fila key={b.id} b={b} clave={`res-${b.id}`} txt="Pedir reseña" mensaje={P.msg.resena(b)} sub={`${fechaCorta(b.date)} · ${b.service}`} />
        )}
      />
      <Grupo
        titulo="Hace tiempo que no vienen"
        ayuda="Más de 30 días sin venir y sin cita. Primero las que más gastan."
        items={lejos}
        fila={(c: any) => (
          <Fila
            key={c.client}
            b={c}
            clave={`miss-${c.client}-${c.last}`}
            txt="Escribir"
            mensaje={P.msg.echamosDeMenos(c)}
            sub={`${c.daysAway} días sin venir · ${c.visits} visitas · ${euros(c.spent)}`}
          />
        )}
      />
    </div>
  );
}

/* ================= CLIENTAS ================= */
export function Clientas() {
  const P = useContext(PanelCtx);
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const lista = P.clientas
    .filter((c: any) => !t || c.client.toLowerCase().includes(t) || (c.phone || "").replace(/\s/g, "").includes(t.replace(/\s/g, "")))
    .sort((a: any, b: any) => a.client.localeCompare(b.client, "es"));
  return (
    <div className="animate-in fade-in duration-200">
      <Titulo titulo="Clientas" sub={`${P.clientas.length} clientas · se crean solas al apuntar citas`} />
      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7A70]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o teléfono"
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white text-[16px] outline-none border border-transparent focus:border-[#B8922A]"
        />
      </div>
      {lista.length === 0 ? (
        <Vacio titulo={t ? "Nadie con ese nombre" : "Aún no hay clientas"} texto={t ? undefined : "Aparecerán al apuntar citas."} />
      ) : (
        <div className="space-y-2">
          {lista.map((c: any) => (
            <Ficha key={c.client} onClick={() => P.setClienta(c.client)} className="flex items-center gap-3 p-3">
              <Avatar nombre={c.client} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold truncate">{c.client}</p>
                <p className="text-[13px] text-[#8A7A70] truncate">
                  {c.next ? `Próxima: ${fechaCorta(c.next)}` : c.last ? `Última vez hace ${c.daysAway} días` : "Aún no ha venido"}
                  {c.fav ? ` · ${c.fav}` : ""}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-bold tabular-nums" style={{ color: "#8B2252" }}>
                  {euros(c.spent)}
                </p>
                <p className="text-[12px] text-[#8A7A70]">{c.visits} visitas</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C9BDB2] flex-shrink-0" />
            </Ficha>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= RESUMEN ================= */
export function Resumen() {
  const P = useContext(PanelCtx);
  const [mes, setMes] = useState(() => {
    const d = parseD(P.today);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const y = mes.getFullYear(),
    m = mes.getMonth();
  const pre = `${y}-${String(m + 1).padStart(2, "0")}-`;
  const dias = Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => toDS(new Date(y, m, i + 1)));
  const citas: Cita[] = P.bookings.filter((b: Cita) => b.date.startsWith(pre));
  const suma = (a: Cita[]) => a.reduce((s, b) => s + precio(b.price), 0);
  const pasadas = citas.filter((b) => b.date < P.today);
  const k = P.cifras(dias);
  const nuevas = P.clientas.filter((c: any) => c.first && c.first.startsWith(pre)).length;
  const porTrat: Record<string, { n: number; e: number }> = {};
  for (const b of citas) {
    const x = (porTrat[b.service] ||= { n: 0, e: 0 });
    x.n++;
    x.e += precio(b.price);
  }
  const top = Object.entries(porTrat)
    .sort((a, b) => b[1].e - a[1].e)
    .slice(0, 6);
  const maxE = top[0]?.[1].e || 1;
  const porTipo: Record<string, number> = {};
  for (const b of citas) {
    const c = P.SV.find((x: any) => x.name === b.service)?.cat || "Otros";
    porTipo[c] = (porTipo[c] || 0) + precio(b.price);
  }
  const total = suma(citas) || 1;
  const NOMBRE_TIPO: Record<string, string> = { Facial: "Faciales", Corporal: "Corporales", Láser: "Depilación láser" };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-2">
        <button aria-label="Mes anterior" onClick={() => setMes(new Date(y, m - 1, 1))} className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <ChevronLeft className="w-6 h-6" style={{ color: C.oro }} />
        </button>
        <h1 className="text-[20px] font-bold">
          {MESES[m]} {y}
        </h1>
        <button aria-label="Mes siguiente" onClick={() => setMes(new Date(y, m + 1, 1))} className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <ChevronRight className="w-6 h-6" style={{ color: C.oro }} />
        </button>
      </div>
      <Cifras
        items={[
          { n: euros(suma(pasadas)), l: "ya facturado", color: "#8B2252" },
          { n: euros(suma(citas) - suma(pasadas)), l: "por cobrar", color: C.ambar },
        ]}
      />
      <Cifras
        items={[
          { n: citas.length, l: "citas" },
          { n: `${k.pct}%`, l: "ocupación" },
          { n: euros(pasadas.length ? suma(pasadas) / pasadas.length : 0), l: "ticket medio" },
          { n: nuevas, l: "nuevas", color: C.verde },
        ]}
      />

      <Ficha className="p-4">
        <h2 className="text-[16px] font-bold mb-3">Lo que más factura</h2>
        {top.length === 0 && <p className="text-[14px] text-[#8A7A70]">Sin citas este mes</p>}
        <div className="space-y-3">
          {top.map(([n, v]) => (
            <div key={n}>
              <div className="flex justify-between text-[14px] mb-1 gap-3">
                <span className="truncate">
                  {n} <span className="text-[#8A7A70]">· {v.n}</span>
                </span>
                <span className="font-semibold tabular-nums" style={{ color: "#8B2252" }}>
                  {euros(v.e)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#F3ECE4] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(v.e / maxE) * 100}%`, background: C.oro }} />
              </div>
            </div>
          ))}
        </div>
      </Ficha>

      <Ficha className="p-4">
        <h2 className="text-[16px] font-bold mb-2">Por tipo de tratamiento</h2>
        {Object.entries(porTipo)
          .sort((a, b) => b[1] - a[1])
          .map(([c, e]) => (
            <div key={c} className="flex justify-between items-baseline py-2.5 border-b border-[#F3ECE4] last:border-0 text-[15px]">
              <span>{NOMBRE_TIPO[c] ?? c}</span>
              <span>
                <span className="text-[13px] text-[#8A7A70] mr-3">{Math.round((e / total) * 100)}%</span>
                <span className="font-semibold tabular-nums" style={{ color: "#8B2252" }}>
                  {euros(e)}
                </span>
              </span>
            </div>
          ))}
      </Ficha>

      <button
        onClick={() => P.exportCSV(citas, `citas-${y}-${String(m + 1).padStart(2, "0")}.csv`)}
        className="w-full h-12 rounded-2xl bg-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        style={{ color: C.oro }}
      >
        <Download className="w-5 h-5" /> Descargar las citas del mes (Excel)
      </button>

      {!P.real && (
        <div className="border border-dashed border-[#E2D6CB] rounded-2xl p-4 text-[13px] text-[#8A7A70] space-y-3">
          <p>Panel de muestra: los datos son inventados y se guardan solo en este dispositivo.</p>
          <div className="flex gap-2">
            <button onClick={() => P.reset(false)} className="flex-1 h-10 rounded-xl bg-white font-semibold" style={{ color: C.oro }}>
              Cargar ejemplo
            </button>
            <button
              onClick={() => confirm("¿Borrar todas las citas de muestra?") && P.reset(true)}
              className="flex-1 h-10 rounded-xl bg-white font-semibold"
              style={{ color: C.rojo }}
            >
              Empezar de cero
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TODAS LAS CITAS ================= */
export function Todas() {
  const P = useContext(PanelCtx);
  const [pasadas, setPasadas] = useState(false);
  const lista: Cita[] = P.bookings
    .filter((b: Cita) => (pasadas ? b.date < P.today : b.date >= P.today))
    .sort((a: Cita, b: Cita) => (a.date === b.date ? a.time - b.time : pasadas ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  const porDia: Record<string, Cita[]> = {};
  for (const b of lista) (porDia[b.date] ||= []).push(b);
  return (
    <div className="animate-in fade-in duration-200">
      <Titulo titulo="Todas las citas" />
      <div className="grid grid-cols-2 bg-[#ECE3DA] rounded-2xl p-1 mb-4">
        {[
          [false, "Próximas"],
          [true, "Pasadas"],
        ].map(([v, txt]) => (
          <button
            key={String(v)}
            onClick={() => setPasadas(v as boolean)}
            className={cn("h-10 rounded-xl text-[15px] font-bold", pasadas === v ? "bg-white shadow-sm" : "text-[#8A7A70]")}
          >
            {txt as string}
          </button>
        ))}
      </div>
      {lista.length === 0 && <Vacio titulo="No hay citas" />}
      <div className="space-y-5">
        {Object.entries(porDia).map(([ds, citas]) => (
          <section key={ds}>
            <h2 className="text-[14px] font-bold text-[#8A7A70] mb-2 uppercase tracking-wide">
              {ds === P.today ? "Hoy" : fechaCorta(ds)} · {citas.length}
            </h2>
            <div className="space-y-2">
              {citas.map((c) => {
                const st = estadoCita(c.status);
                return (
                  <Ficha key={c.id} onClick={() => P.setDetalle(c)} className="flex items-center gap-3 p-3">
                    <div className="w-14 text-center flex-shrink-0">
                      <p className="text-[16px] font-bold tabular-nums">{hhmm(c.time)}</p>
                      <p className="text-[11px] text-[#8A7A70]">{c.dur} min</p>
                    </div>
                    <div className="w-[3px] self-stretch rounded-full" style={{ background: st.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold truncate">{c.client}</p>
                      <p className="text-[13px] text-[#8A7A70] truncate">{c.service}</p>
                    </div>
                    <p className="text-[14px] font-bold tabular-nums" style={{ color: "#8B2252" }}>
                      {c.price}
                    </p>
                  </Ficha>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
