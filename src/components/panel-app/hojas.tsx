"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Ban, CalendarPlus, ChevronRight, ExternalLink, KeyRound, List, LogOut, MessageCircle, Phone, Plus, Star, Bell, Send } from "lucide-react";
import { db } from "@/lib/supabase";
import { PanelCtx } from "./ctx";
import { cn } from "@/lib/utils";
import { duracion, categorias } from "@/components/negocio";
import type { Borrador, BorradorBloqueo } from "@/components/panel";
import { Avatar, Boton, Etiqueta, Ficha, Hoja } from "./ui";
import {
  C, type Cita, type Bloqueo, DIAS, MESES, parseD, sumarDias, hhmm, fechaCorta, fechaLarga, duracionTxt, euros, waTo, estadoCita,
} from "./tema";

const campo =
  "w-full h-[50px] px-4 rounded-2xl bg-white text-[16px] outline-none border border-[#E9DFD5] focus:border-[#B8922A] placeholder:text-[#B5A99F]";

// Fichas de días: Hoy, Mañana, Vie 30…
function Dias({ desde, valor, onCambio, cerrado }: { desde: string; valor: string; onCambio: (ds: string) => void; cerrado: (ds: string) => boolean }) {
  const dias = Array.from({ length: 28 }, (_, i) => sumarDias(desde, i));
  // El día elegido siempre a la vista en la franja
  const franja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    franja.current?.querySelector<HTMLElement>("[data-on='1']")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [valor]);
  return (
    <>
      <div ref={franja} className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none]">
        {dias.map((ds, i) => {
          const d = parseD(ds);
          const on = ds === valor;
          return (
            <button
              key={ds}
              data-on={on ? "1" : "0"}
              onClick={() => onCambio(ds)}
              className={cn("w-[60px] flex-shrink-0 rounded-2xl py-2 border-[1.5px] transition", on ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "bg-white border-[#E9DFD5]")}
              style={{ opacity: cerrado(ds) && !on ? 0.4 : 1 }}
            >
              <span className="block text-[11px] font-semibold uppercase">{i === 0 ? "Hoy" : i === 1 ? "Mañ." : DIAS[d.getDay()]}</span>
              <span className="block text-[20px] font-bold leading-tight">{d.getDate()}</span>
              <span className="block text-[11px]">{MESES[d.getMonth()].slice(0, 3).toLowerCase()}</span>
            </button>
          );
        })}
      </div>
      <label className="flex items-center gap-2 mt-2 text-[13px] text-[#8A7A70]">
        ¿Otro día?
        <input type="date" value={valor} onChange={(e) => e.target.value && onCambio(e.target.value)} className="h-9 px-2 rounded-xl bg-white border border-[#E9DFD5] text-[14px] text-[#1A1A1A]" />
      </label>
    </>
  );
}

// Fichas de horas, separadas en mañana y tarde
function Horas({ libres, valor, onCambio, color = C.tinta }: { libres: number[]; valor: number | null; onCambio: (m: number) => void; color?: string }) {
  const grupos: [string, number[]][] = [
    ["Mañana", libres.filter((m) => m < 14 * 60)],
    ["Tarde", libres.filter((m) => m >= 14 * 60)],
  ];
  return (
    <div className="space-y-3">
      {grupos.map(
        ([t, lista]) =>
          lista.length > 0 && (
            <div key={t}>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8A7A70] mb-1.5">{t}</p>
              <div className="grid grid-cols-4 gap-2">
                {lista.map((m) => {
                  const on = valor === m;
                  return (
                    <button
                      key={m}
                      onClick={() => onCambio(m)}
                      className="h-11 rounded-xl text-[15px] font-bold tabular-nums border-[1.5px] transition"
                      style={{ background: on ? color : "#fff", borderColor: on ? color : "#E9DFD5", color: on ? "#fff" : C.tinta }}
                    >
                      {hhmm(m / 60)}
                    </button>
                  );
                })}
              </div>
            </div>
          )
      )}
    </div>
  );
}

/* ================= DETALLE DE UNA CITA ================= */
export function HojaCita({ cita }: { cita: Cita }) {
  const P = useContext(PanelCtx);
  const c: Cita = P.bookings.find((b: Cita) => b.id === cita.id) ?? cita;
  const [nota, setNota] = useState(c.notes || "");
  const st = estadoCita(c.status);
  const porAvisar = P.porAvisar.some((x: Cita) => x.id === c.id);
  const acciones = [
    { k: "conf", txt: "Enviar confirmación", Icono: Send, m: P.msg.detalles(c) },
    { k: "rec", txt: "Recordar cita", Icono: Bell, m: P.msg.recordar(c) },
    { k: "res", txt: "Pedir reseña", Icono: Star, m: P.msg.resena(c) },
    { k: "", txt: "Escribir", Icono: MessageCircle, m: "" },
  ];
  return (
    <Hoja
      titulo="Cita"
      onCerrar={() => P.setDetalle(null)}
      accion={
        <button onClick={() => P.editarCita(c)} className="h-10 px-3 rounded-full text-[15px] font-bold" style={{ color: C.oro }}>
          Editar
        </button>
      }
      pie={
        <div className="space-y-2">
          {c.status === "pendiente" && (
            <Boton tipo="verde" onClick={() => P.cambiarEstado(c.id, "confirmada")}>
              Marcar como confirmada
            </Boton>
          )}
          <Boton tipo="bordeRojo" onClick={() => P.cancelarCita(c)}>
            Cancelar cita
          </Boton>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <Avatar nombre={c.client} grande />
        <div className="flex-1 min-w-0">
          <p className="text-[22px] font-bold leading-tight">{c.client}</p>
          <p className="text-[15px] text-[#8A7A70]">{c.service}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ color: st.color, background: st.fondo }}>
              {st.txt}
            </span>
            {porAvisar && (
              <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ color: C.azul, background: "#E7EEFB" }}>
                Falta enviarle la confirmación
              </span>
            )}
            {c.origen === "web" && <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-white text-[#8A7A70]">Reservó en la web</span>}
          </div>
        </div>
      </div>

      <Ficha className="mt-4 divide-y divide-[#F3ECE4]">
        {[
          ["Día", fechaLarga(c.date)],
          ["Hora", `${hhmm(c.time)} – ${hhmm(c.time + c.dur / 60)} (${duracionTxt(c.dur)})`],
          ["Precio", c.price],
          ["Teléfono", c.phone || "Sin teléfono"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-3 text-[15px]">
            <span className="text-[#8A7A70]">{k}</span>
            <span className={cn("font-semibold text-right", v === "Sin teléfono" && "font-normal text-[#8A7A70]")}>{v}</span>
          </div>
        ))}
      </Ficha>

      {c.phone ? (
        <>
          <Etiqueta>Mandarle un WhatsApp</Etiqueta>
          <div className="grid grid-cols-2 gap-2">
            {acciones.map(({ k, txt, Icono, m }) => {
              const hecho = k && P.enviado(`${k}-${c.id}`, c);
              return (
                <a
                  key={txt}
                  href={waTo(c.phone, m)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    if (!k) return;
                    P.marcarEnviado(`${k}-${c.id}`, c);
                    if (k === "conf" && c.status === "pendiente") P.cambiarEstado(c.id, "confirmada");
                  }}
                  className="h-[52px] rounded-2xl bg-white flex items-center justify-center gap-2 text-[14px] font-bold border border-[#E9DFD5]"
                  style={{ color: C.verde }}
                >
                  <Icono className="w-[18px] h-[18px]" />
                  {txt}
                  {hecho && <span className="text-[11px]">✓</span>}
                </a>
              );
            })}
          </div>
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="mt-2 h-12 rounded-2xl bg-white flex items-center justify-center gap-2 text-[15px] font-bold border border-[#E9DFD5]">
            <Phone className="w-[18px] h-[18px]" /> Llamar
          </a>
        </>
      ) : (
        <p className="text-[14px] text-[#8A7A70] mt-4">Sin teléfono no se le pueden mandar mensajes. Pulsa «Editar» para añadirlo.</p>
      )}

      <Etiqueta>Notas (alergias, bono, preferencias)</Etiqueta>
      <textarea
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        placeholder="Solo lo ves tú"
        className="w-full min-h-[84px] p-4 rounded-2xl bg-white text-[16px] outline-none border border-[#E9DFD5] focus:border-[#B8922A]"
      />
      {nota !== (c.notes || "") && (
        <button onClick={() => P.guardarNota(c, nota)} className="mt-2 h-10 px-4 rounded-full text-[14px] font-bold text-white" style={{ background: C.oro }}>
          Guardar nota
        </button>
      )}

      <button onClick={() => P.setClienta(c.client)} className="mt-4 w-full flex items-center justify-between px-4 h-12 rounded-2xl bg-white text-[15px] font-semibold">
        Ver ficha de {c.client.split(" ")[0]} <ChevronRight className="w-5 h-5 text-[#C9BDB2]" />
      </button>
    </Hoja>
  );
}

/* ================= NUEVA CITA / EDITAR CITA ================= */
export function EditorCita({ inicial }: { inicial: Borrador }) {
  const P = useContext(PanelCtx);
  const [e, setE] = useState<Borrador>(inicial);
  const editando = inicial.id != null;
  const sv = P.SV.find((x: any) => x.name === e.service);
  const dur = duracion(sv?.dur);
  const libres: number[] = P.huecosLibres(P.HOR, parseD(e.date), dur, P.ocupadoDia(e.date, inicial.id), 30);
  // Al editar, la hora que ya tenía siempre se puede mantener aunque ya haya pasado
  if (editando && e.date === inicial.date && inicial.min != null && !libres.includes(inicial.min)) {
    const encaja = !P.ocupadoDia(e.date, inicial.id).some((o: any) => o.ini < inicial.min! + dur && o.fin > inicial.min!);
    if (encaja) libres.push(inicial.min);
    libres.sort((a, b) => a - b);
  }
  const horaOk = e.min != null && libres.includes(e.min);
  const listo = e.client.trim().length >= 2 && horaOk;
  const cerrado = (ds: string) => !(P.HOR[parseD(ds).getDay()] || []).length;

  return (
    <Hoja
      titulo={editando ? "Editar cita" : "Nueva cita"}
      onCerrar={() => P.setEditor(null)}
      pie={
        <Boton onClick={() => P.guardarCita(e)} disabled={!listo}>
          {listo ? `${editando ? "Guardar cambios" : "Guardar cita"} · ${fechaCorta(e.date)} · ${hhmm(e.min! / 60)}` : "Elige clienta y hora"}
        </Boton>
      }
    >
      <Etiqueta>Clienta</Etiqueta>
      <input
        className={campo}
        list="panel-clientas"
        value={e.client}
        placeholder="Nombre y apellido"
        onChange={(ev) => {
          const v = ev.target.value;
          const c = P.clientas.find((x: any) => x.client.toLowerCase() === v.toLowerCase());
          setE((x) => ({ ...x, client: v, phone: c && !x.phone ? c.phone : x.phone, service: c?.fav && !editando ? c.fav : x.service }));
        }}
      />
      <datalist id="panel-clientas">
        {P.clientas.map((c: any) => (
          <option key={c.client} value={c.client} />
        ))}
      </datalist>
      <input className={cn(campo, "mt-2")} inputMode="tel" value={e.phone} placeholder="Teléfono (para mandarle WhatsApp)" onChange={(ev) => setE((x) => ({ ...x, phone: ev.target.value }))} />

      <Etiqueta>Tratamiento</Etiqueta>
      <select className={campo} value={e.service} onChange={(ev) => setE((x) => ({ ...x, service: ev.target.value }))}>
        {categorias(P.SV).map(({ id, label }) => (
          <optgroup key={id} label={label}>
            {P.SV.filter((x: any) => x.cat === id).map((x: any) => (
              <option key={x.name} value={x.name}>
                {x.name} · {x.dur} · {x.price}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <Etiqueta>Día</Etiqueta>
      <Dias desde={P.today} valor={e.date} cerrado={cerrado} onCambio={(ds) => setE((x) => ({ ...x, date: ds, min: ds === inicial.date ? inicial.min : null }))} />

      <Etiqueta>
        Hora <span className="font-normal text-[#8A7A70]">· dura {duracionTxt(dur)}</span>
      </Etiqueta>
      {libres.length === 0 ? (
        <p className="text-[14px] text-[#8A7A70] bg-white/60 rounded-2xl px-4 py-3">No hay hueco ese día para este tratamiento. Prueba con otro día.</p>
      ) : (
        <Horas libres={libres} valor={e.min} onCambio={(m) => setE((x) => ({ ...x, min: m }))} />
      )}
      {e.min != null && !horaOk && <p className="text-[13px] mt-2" style={{ color: C.rojo }}>Esa hora no cabe con este tratamiento: elige otra.</p>}

      <Etiqueta>
        Notas <span className="font-normal text-[#8A7A70]">(opcional)</span>
      </Etiqueta>
      <input className={campo} value={e.notes} placeholder="Alergias, bono, preferencias…" onChange={(ev) => setE((x) => ({ ...x, notes: ev.target.value }))} />
    </Hoja>
  );
}

/* ================= BLOQUEAR HORAS / EDITAR BLOQUEO ================= */
export function HojaBloqueo({ inicial }: { inicial: BorradorBloqueo }) {
  const P = useContext(PanelCtx);
  const [b, setB] = useState<BorradorBloqueo>(inicial);
  const editando = !!inicial.original;
  const DURACIONES = [30, 60, 90, 120, 180, 240];
  const ocupado = P.ocupadoDia(b.date, undefined, inicial.original);
  const inicios: number[] = P.huecosLibres(P.HOR, parseD(b.date), b.dur, ocupado, 30);
  if (editando && b.date === inicial.date && inicial.min != null && !inicios.includes(inicial.min)) {
    if (!ocupado.some((o: any) => o.ini < inicial.min! + b.dur && o.fin > inicial.min!)) inicios.push(inicial.min);
    inicios.sort((x, y) => x - y);
  }
  const valido = b.min != null && inicios.includes(b.min);
  const cerrado = (ds: string) => !(P.HOR[parseD(ds).getDay()] || []).length;
  return (
    <Hoja
      titulo={editando ? "Editar bloqueo" : "Bloquear horas"}
      onCerrar={() => P.setBloqueo(null)}
      pie={
        <Boton tipo="rojo" onClick={() => P.guardarBloqueo(b)} disabled={!valido}>
          {valido ? `${editando ? "Guardar" : "Bloquear"} ${hhmm(b.min! / 60)} – ${hhmm((b.min! + b.dur) / 60)}` : "Elige desde qué hora"}
        </Boton>
      }
    >
      <p className="text-[14px] text-[#8A7A70]">Ese rato deja de salir en la web y nadie podrá reservarlo.</p>

      <Etiqueta>Día</Etiqueta>
      <Dias desde={P.today} valor={b.date} cerrado={cerrado} onCambio={(ds) => setB((x) => ({ ...x, date: ds, min: null }))} />

      <Etiqueta>¿Cuánto tiempo?</Etiqueta>
      <div className="grid grid-cols-3 gap-2">
        {DURACIONES.map((d) => (
          <button
            key={d}
            onClick={() => setB((x) => ({ ...x, dur: d }))}
            className="h-11 rounded-xl text-[15px] font-bold border-[1.5px]"
            style={{ background: b.dur === d ? C.rojo : "#fff", borderColor: b.dur === d ? C.rojo : "#E9DFD5", color: b.dur === d ? "#fff" : C.tinta }}
          >
            {duracionTxt(d)}
          </button>
        ))}
      </div>

      <Etiqueta>¿Desde qué hora?</Etiqueta>
      {inicios.length === 0 ? (
        <p className="text-[14px] text-[#8A7A70] bg-white/60 rounded-2xl px-4 py-3">No hay {duracionTxt(b.dur)} seguidos libres ese día.</p>
      ) : (
        <Horas libres={inicios} valor={b.min} color={C.rojo} onCambio={(m) => setB((x) => ({ ...x, min: m }))} />
      )}

      <Etiqueta>
        Motivo <span className="font-normal text-[#8A7A70]">(solo lo ves tú)</span>
      </Etiqueta>
      <input className={campo} value={b.reason} placeholder="Comida, formación, descanso…" onChange={(ev) => setB((x) => ({ ...x, reason: ev.target.value }))} />

      {editando && (
        <Boton tipo="bordeRojo" className="mt-6" onClick={() => P.quitarBloqueo(inicial.original as Bloqueo)}>
          <Ban className="w-5 h-5" /> Quitar bloqueo
        </Boton>
      )}
    </Hoja>
  );
}

/* ================= UNA HORA LIBRE ================= */
export function HojaHueco({ date, min }: { date: string; min: number }) {
  const P = useContext(PanelCtx);
  return (
    <Hoja titulo="Hora libre" onCerrar={() => P.setHueco(null)}>
      <div className="text-center py-2">
        <p className="text-[34px] font-bold tabular-nums">{hhmm(min / 60)}</p>
        <p className="text-[15px] text-[#8A7A70]">{fechaLarga(date)}</p>
      </div>
      <div className="space-y-2 mt-4">
        <Boton
          onClick={() => {
            P.setHueco(null);
            P.nuevaCita(date, min);
          }}
        >
          <Plus className="w-5 h-5" /> Nueva cita a las {hhmm(min / 60)}
        </Boton>
        <Boton
          tipo="bordeRojo"
          onClick={() => {
            P.setHueco(null);
            P.setBloqueo({ date, min, dur: 60, reason: "" });
          }}
        >
          <Ban className="w-5 h-5" /> Bloquear desde las {hhmm(min / 60)}
        </Boton>
      </div>
    </Hoja>
  );
}

/* ================= FICHA DE UNA CLIENTA ================= */
export function HojaClienta({ nombre }: { nombre: string }) {
  const P = useContext(PanelCtx);
  const c = P.clientas.find((x: any) => x.client === nombre);
  if (!c) return null;
  const citas: Cita[] = [...c.citas].sort((a: Cita, b: Cita) => (a.date === b.date ? b.time - a.time : b.date.localeCompare(a.date)));
  return (
    <Hoja titulo="Clienta" onCerrar={() => P.setClienta(null)}>
      <div className="flex flex-col items-center text-center">
        <Avatar nombre={c.client} grande />
        <p className="text-[22px] font-bold mt-2">{c.client}</p>
        <p className="text-[15px] text-[#8A7A70]">{c.phone || "Sin teléfono"}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          [c.visits, "visitas"],
          [euros(c.spent), "gastado"],
          [c.last ? `${c.daysAway} d` : "—", "desde la última"],
        ].map(([n, l]) => (
          <div key={l as string} className="bg-white rounded-2xl py-3 text-center">
            <p className="text-[19px] font-bold">{n}</p>
            <p className="text-[12px] text-[#8A7A70]">{l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {c.phone && (
          <a href={waTo(c.phone, "")} target="_blank" rel="noreferrer" className="h-14 rounded-2xl bg-white flex flex-col items-center justify-center text-[12.5px] font-bold" style={{ color: C.verde }}>
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
        )}
        {c.phone && (
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="h-14 rounded-2xl bg-white flex flex-col items-center justify-center text-[12.5px] font-bold">
            <Phone className="w-5 h-5" /> Llamar
          </a>
        )}
        <button
          onClick={() => P.nuevaCita(P.today, undefined, { client: c.client, phone: c.phone, service: c.fav || P.SV[0]?.name })}
          className={cn("h-14 rounded-2xl bg-white flex flex-col items-center justify-center text-[12.5px] font-bold", !c.phone && "col-span-3")}
          style={{ color: C.oro }}
        >
          <CalendarPlus className="w-5 h-5" /> Nueva cita
        </button>
      </div>
      {c.fav && <p className="text-[14px] text-[#8A7A70] mt-4">Suele hacerse: <b className="text-[#1A1A1A]">{c.fav}</b></p>}
      <Etiqueta>Historial</Etiqueta>
      <div className="space-y-2">
        {citas.map((b) => (
          <Ficha key={b.id} onClick={() => P.setDetalle(b)} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold truncate">{b.service}</p>
              <p className="text-[13px] text-[#8A7A70]">
                {fechaCorta(b.date)} · {hhmm(b.time)}
                {b.date >= P.today ? " · próxima" : ""}
              </p>
            </div>
            <p className="text-[14px] font-bold" style={{ color: "#8B2252" }}>
              {b.price}
            </p>
          </Ficha>
        ))}
      </div>
    </Hoja>
  );
}

/* ================= MENÚ «MÁS» ================= */
function Item({ Icono, txt, sub, onClick, href, color }: { Icono: any; txt: string; sub?: string; onClick?: () => void; href?: string; color?: string }) {
    const dentro = (
      <>
        <span className="w-10 h-10 rounded-xl bg-[#F6F1EC] flex items-center justify-center flex-shrink-0">
          <Icono className="w-5 h-5" style={{ color: color ?? C.oro }} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[16px] font-bold" style={{ color: color ?? C.tinta }}>
            {txt}
          </span>
          {sub && <span className="block text-[13px] text-[#8A7A70]">{sub}</span>}
        </span>
        <ChevronRight className="w-5 h-5 text-[#C9BDB2]" />
      </>
    );
    const cls = "w-full flex items-center gap-3 p-3 bg-white rounded-2xl";
    return href ? (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {dentro}
      </a>
    ) : (
      <button onClick={onClick} className={cls}>
        {dentro}
      </button>
    );
  }

// Webs a medida que no van en «/?s=slug»
const WEB_PROPIA: Record<string, string> = {
  "rashpont-estetica": "/rashpont/estetica",
  "rashpont-barberia": "/rashpont/barberia",
};

export function HojaMas() {
  const P = useContext(PanelCtx);
  const [correo, setCorreo] = useState("");
  const [cambiando, setCambiando] = useState(false);
  const [clave, setClave] = useState("");
  const [estado, setEstado] = useState("");
  useEffect(() => {
    if (!P.real) return;
    db().auth.getUser().then(({ data }) => setCorreo(data.user?.email ?? ""));
  }, [P.real]);

  async function guardarClave(e: React.FormEvent) {
    e.preventDefault();
    if (clave.length < 8) return setEstado("La contraseña tiene que tener al menos 8 caracteres.");
    setEstado("Guardando…");
    const { error } = await db().auth.updateUser({ password: clave });
    if (error) return setEstado("No se pudo cambiar. Prueba con otra contraseña.");
    setClave("");
    setCambiando(false);
    setEstado("Contraseña cambiada. La próxima vez entra con la nueva.");
  }

  return (
    <Hoja titulo={P.real ? "Mi cuenta" : "Más"} onCerrar={() => P.setMas(false)}>
      <div className="space-y-2">
        {P.real && (
          <div className="p-4 bg-white rounded-2xl">
            <p className="text-[13px] text-[#8A7A70]">Has entrado como</p>
            <p className="text-[16px] font-bold break-all">{correo || "…"}</p>
          </div>
        )}
        <Item
          Icono={List}
          txt="Todas las citas"
          sub="Próximas y pasadas, en lista"
          onClick={() => {
            P.setMas(false);
            P.setVista("todas");
            window.scrollTo(0, 0);
          }}
        />
        {P.real && (
          <Item Icono={ExternalLink} txt="Ver mi web" sub="La página donde reservan tus clientas" href={WEB_PROPIA[P.real.slug] ?? `/?s=${P.real.slug}`} />
        )}
        {P.real && <Item Icono={KeyRound} txt="Cambiar contraseña" sub="Pon una que solo sepas tú" onClick={() => setCambiando((v) => !v)} />}
        {P.real && cambiando && (
          <form onSubmit={guardarClave} className="p-4 bg-white rounded-2xl space-y-3">
            <label className="block">
              <span className="text-[14px] font-medium">Nueva contraseña</span>
              <input
                id="nueva-clave"
                type="password"
                autoComplete="new-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="mt-1 w-full h-12 px-4 rounded-xl border border-[#EAE1D8] text-[16px]"
              />
            </label>
            <Boton>Guardar contraseña</Boton>
          </form>
        )}
        {estado && <p className="px-2 text-[14px] text-[#8A7A70]">{estado}</p>}
        {P.real && <Item Icono={LogOut} txt="Salir" sub="Cerrar sesión en este móvil" color={C.rojo} onClick={P.real.onSalir} />}
      </div>
    </Hoja>
  );
}
