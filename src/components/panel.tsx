"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CalendarDays, ChartColumn, Menu, Plus, Users } from "lucide-react";
import { SERVICES, type Service } from "@/lib/data";
import { useNegocio, huecosLibres, duracion, type Horario } from "@/components/negocio";
import { db } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { SCHED, generarDemo, demoBlocked } from "./panel-app/demo";
import { PanelCtx } from "./panel-app/ctx";
import { C, type Cita, type Bloqueo, toDS, parseD, hhmm, fechaLarga, nombrePila, precio } from "./panel-app/tema";
import { Agenda } from "./panel-app/agenda";
import { Avisos, Clientas, Resumen, Todas } from "./panel-app/listas";
import { HojaCita, EditorCita, HojaBloqueo, HojaHueco, HojaMas, HojaClienta } from "./panel-app/hojas";

// Estética real (desde /panel, con la dueña ya dentro). Sin esto, el panel es la demo con datos inventados.
export interface PanelReal {
  salonId: string;
  slug: string;
  nombre: string;
  horario: Horario;
  servicios: Service[];
  onSalir: () => void;
}

// Fila de la base de datos → la forma que usa el panel
const deCita = (c: any): Cita => ({
  id: c.id, date: c.fecha, time: c.hora + (c.minuto || 0) / 60, dur: c.duracion_min || 60,
  client: c.nombre, phone: c.telefono || "", service: c.tratamiento, price: `${Number(c.precio || 0)}€`,
  status: c.estado, notes: c.notas || "", origen: c.origen,
  aviso: !!c.aviso_enviado, rec: !!c.recordatorio_enviado, res: !!c.resena_pedida,
});
const deBloqueo = (b: any): Bloqueo => ({
  id: b.id, date: b.fecha, time: b.hora + (b.minuto || 0) / 60, dur: b.duracion_min || 60, reason: b.motivo || "",
});

const STORE = "estetica-panel-v1";
type Vista = "agenda" | "avisos" | "clientas" | "resumen" | "todas";
// Lo que se edita en la hoja de cita: una cita nueva o una existente
export interface Borrador {
  id?: Cita["id"];
  client: string;
  phone: string;
  service: string;
  date: string;
  min: number | null; // minutos del día en que empieza
  notes: string;
}
// Lo que se edita en la hoja de bloqueo
export interface BorradorBloqueo {
  original?: Bloqueo;
  date: string;
  min: number | null;
  dur: number;
  reason: string;
}


export function Panel({ real }: { real?: PanelReal }) {
  const demoNegocio = useNegocio();
  const nombre = real ? real.nombre : demoNegocio.nombre;
  const HOR: Horario = real ? real.horario : SCHED;
  const SV: Service[] = real ? real.servicios : SERVICES;
  const salonId = real?.salonId;
  const storeKey = real ? `${STORE}-${real.slug}` : STORE;

  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [bookings, setBookings] = useState<Cita[]>([]);
  const [blocked, setBlocked] = useState<Bloqueo[]>([]);
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [vista, setVista] = useState<Vista>("agenda");
  const [modo, setModo] = useState<"dia" | "semana" | "mes">("dia");
  const [selDate, setSelDate] = useState("");
  const [toast, setToast] = useState<{ msg: string; accion?: { txt: string; fn: () => void } } | null>(null);

  // Hojas abiertas
  const [detalle, setDetalle] = useState<Cita | null>(null);
  const [editor, setEditor] = useState<Borrador | null>(null);
  const [bloqueo, setBloqueo] = useState<BorradorBloqueo | null>(null);
  const [hueco, setHueco] = useState<{ date: string; min: number } | null>(null);
  const [clienta, setClienta] = useState<string | null>(null);
  const [mas, setMas] = useState(false);

  /* ---------- Avisos breves abajo, con «Deshacer» cuando hace falta ---------- */
  const ultimoToast = useRef(0);
  const avisar = useCallback((msg: string, accion?: { txt: string; fn: () => void }) => {
    const id = Date.now();
    ultimoToast.current = id;
    setToast({ msg, accion });
    setTimeout(() => {
      if (ultimoToast.current === id) setToast(null);
    }, accion ? 7000 : 2600);
  }, []);

  /* ---------- Cargar datos ---------- */
  const cargarDB = useCallback(
    async (avisarNuevas = false) => {
      if (!salonId) return;
      const [c, b] = await Promise.all([
        db().from("citas").select("*").eq("salon_id", salonId).neq("estado", "cancelada"),
        db().from("bloqueos").select("*").eq("salon_id", salonId),
      ]);
      if (c.error || b.error) {
        avisar("No se pudo cargar. Revisa la conexión.");
        return;
      }
      const nuevas = (c.data ?? []).map(deCita);
      setBookings((antes) => {
        if (avisarNuevas) {
          const ya = new Set(antes.map((x) => x.id));
          const n = nuevas.filter((x) => !ya.has(x.id) && x.origen === "web").length;
          if (n) setTimeout(() => avisar(`🔔 ${n} reserva${n > 1 ? "s" : ""} nueva${n > 1 ? "s" : ""} desde la web`), 0);
        }
        return nuevas;
      });
      setBlocked((b.data ?? []).map(deBloqueo));
    },
    [salonId, avisar]
  );

  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    let saved: any = null;
    try {
      saved = JSON.parse(localStorage.getItem(storeKey) || "null");
    } catch {}
    const t = setTimeout(async () => {
      setToday(toDS(hoy));
      setSelDate(toDS(hoy));
      if (salonId) await cargarDB();
      else {
        setBookings(saved?.bookings ?? generarDemo(hoy));
        setBlocked(saved?.blocked ?? demoBlocked(hoy));
      }
      setSent(saved?.sent ?? {});
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, [salonId, storeKey, cargarDB]);

  // Cada minuto y al volver a la app, mira si han entrado reservas nuevas
  useEffect(() => {
    if (!salonId) return;
    const id = setInterval(() => cargarDB(true), 60000);
    const foco = () => {
      if (document.visibilityState === "visible") cargarDB(true);
    };
    document.addEventListener("visibilitychange", foco);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", foco);
    };
  }, [salonId, cargarDB]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storeKey, JSON.stringify(salonId ? { sent } : { bookings, blocked, sent }));
    } catch {}
  }, [ready, bookings, blocked, sent, salonId, storeKey]);

  /* ---------- El botón «atrás» del móvil cierra la hoja abierta ---------- */
  const algunaHoja = !!(detalle || editor || bloqueo || hueco || clienta || mas);
  const enHistorial = useRef(false);
  const cerrarArriba = useRef<() => void>(() => {});
  useEffect(() => {
    cerrarArriba.current = () => {
      if (editor) setEditor(null);
      else if (bloqueo) setBloqueo(null);
      else if (hueco) setHueco(null);
      else if (detalle) setDetalle(null);
      else if (clienta) setClienta(null);
      else if (mas) setMas(false);
    };
  });
  useEffect(() => {
    if (algunaHoja && !enHistorial.current) {
      history.pushState({ hojaPanel: true }, "");
      enHistorial.current = true;
    } else if (!algunaHoja && enHistorial.current) {
      enHistorial.current = false;
      if (history.state?.hojaPanel) history.back();
    }
  }, [algunaHoja]);
  useEffect(() => {
    const atras = () => {
      if (!enHistorial.current) return;
      enHistorial.current = false;
      cerrarArriba.current();
    };
    window.addEventListener("popstate", atras);
    return () => window.removeEventListener("popstate", atras);
  }, []);

  /* ---------- Cálculos ---------- */
  const citasDe = (ds: string) => bookings.filter((b) => b.date === ds).sort((a, b) => a.time - b.time);
  const ocupadoDia = (ds: string, sinCita?: Cita["id"], sinBloqueo?: Bloqueo) => [
    ...bookings
      .filter((b) => b.date === ds && b.id !== sinCita)
      .map((b) => ({ ini: Math.round(b.time * 60), fin: Math.round(b.time * 60) + (b.dur || 60) })),
    ...blocked
      .filter((b) => b.date === ds && b !== sinBloqueo)
      .map((b) => ({ ini: Math.round(b.time * 60), fin: Math.round(b.time * 60) + (b.dur || 60) })),
  ];
  // Minutos abiertos, ocupados (citas + bloqueos dentro del horario), libres e ingresos de unos días
  const cifras = (dias: string[]) => {
    let abierto = 0,
      ocupado = 0,
      ingresos = 0,
      n = 0;
    for (const ds of dias) {
      const tramos = HOR[parseD(ds).getDay()] || [];
      for (const { s, e } of tramos) {
        abierto += (e - s) * 60;
        for (const o of ocupadoDia(ds)) ocupado += Math.max(0, Math.min(o.fin, e * 60) - Math.max(o.ini, s * 60));
      }
      for (const b of citasDe(ds)) {
        n++;
        ingresos += precio(b.price);
      }
    }
    return { n, ingresos, abierto, ocupado, libre: Math.max(0, abierto - ocupado), pct: abierto ? Math.round((ocupado / abierto) * 100) : 0 };
  };

  // ¿Ya se le mandó ese WhatsApp? conf = detalles de la cita, rec = recordatorio, res = reseña
  const COL: Record<string, string> = { conf: "aviso_enviado", rec: "recordatorio_enviado", res: "resena_pedida" };
  const CAMPO: Record<string, keyof Cita> = { conf: "aviso", rec: "rec", res: "res" };
  const enviado = (k: string, b?: any) => !!sent[k] || !!(b && b[CAMPO[k.split("-")[0]]]);
  const marcarEnviado = (k: string, b?: Cita) => {
    setSent((p) => ({ ...p, [k]: true }));
    const tipo = k.split("-")[0];
    if (b && COL[tipo]) {
      setBookings((p) => p.map((x) => (x.id === b.id ? { ...x, [CAMPO[tipo]]: true } : x)));
      if (salonId) db().from("citas").update({ [COL[tipo]]: true }).eq("id", b.id).then(() => {});
    }
  };
  // Reservas a las que aún no se les ha mandado el WhatsApp con los detalles
  const porAvisar = bookings
    .filter((b) => b.date >= today && (b.origen === "web" || b.status === "pendiente") && !enviado(`conf-${b.id}`, b))
    .sort((a, b) => (a.date === b.date ? a.time - b.time : a.date.localeCompare(b.date)));

  // Clientas: se calculan solas a partir de las citas
  const clientas = (() => {
    const m: Record<string, any> = {};
    for (const b of bookings) {
      const k = b.client.toLowerCase();
      const c = (m[k] ||= { client: b.client, phone: b.phone, visits: 0, spent: 0, last: "", next: "", first: "", services: {} as Record<string, number>, citas: [] as Cita[] });
      if (b.phone) c.phone = b.phone;
      c.citas.push(b);
      if (b.date < today) {
        c.visits++;
        c.spent += precio(b.price);
        if (b.date > c.last) c.last = b.date;
        if (!c.first || b.date < c.first) c.first = b.date;
        c.services[b.service] = (c.services[b.service] || 0) + 1;
      } else if (!c.next || b.date < c.next) c.next = b.date;
    }
    return Object.values(m).map((c: any) => ({
      ...c,
      fav: (Object.entries(c.services) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      daysAway: c.last ? Math.round((parseD(today).getTime() - parseD(c.last).getTime()) / 86400000) : null,
    }));
  })();

  /* ---------- Mensajes de WhatsApp listos para enviar ---------- */
  const msg = {
    detalles: (b: Cita) =>
      `Hola ${nombrePila(b.client)}! Te confirmo tu cita en ${nombre}: ${b.service}, el ${fechaLarga(b.date).toLowerCase()} a las ${hhmm(b.time)}. ¡Te esperamos!`,
    recordar: (b: Cita) =>
      `Hola ${nombrePila(b.client)}! Te recuerdo que mañana tienes cita a las ${hhmm(b.time)} para ${b.service}. Si no puedes venir, avísame por aquí. ¡Gracias!`,
    resena: (b: Cita) =>
      `Hola ${nombrePila(b.client)}! Gracias por venir a ${nombre}. Si te gustó, me ayudaría mucho que dejaras una reseña en Google. ¡Un abrazo!`,
    echamosDeMenos: (c: any) =>
      `Hola ${nombrePila(c.client)}! Hace tiempo que no te vemos por ${nombre}. ¿Te reservo un hueco esta semana?`,
  };

  /* ---------- Guardar cambios ---------- */
  const guardar = async (q: PromiseLike<{ error: any }>) => {
    const { error } = await q;
    if (error) {
      avisar(/duplicate|unique|disponible/i.test(error.message) ? "Esa hora ya está ocupada" : "No se pudo guardar. Inténtalo de nuevo.");
      cargarDB();
      return false;
    }
    return true;
  };

  const cambiarEstado = (id: Cita["id"], status: string) => {
    setBookings((p) => p.map((b) => (b.id === id ? { ...b, status } : b)));
    if (salonId) guardar(db().from("citas").update({ estado: status }).eq("id", id));
  };

  const cancelarCita = (c: Cita) => {
    setBookings((p) => p.filter((b) => b.id !== c.id));
    if (salonId) guardar(db().from("citas").update({ estado: "cancelada" }).eq("id", c.id));
    setDetalle(null);
    avisar(`Cita de ${nombrePila(c.client)} cancelada`, {
      txt: "Deshacer",
      fn: async () => {
        if (salonId && !(await guardar(db().from("citas").update({ estado: c.status }).eq("id", c.id)))) return;
        setBookings((p) => [...p, c]);
        avisar("Cita recuperada ✓");
      },
    });
  };

  const guardarNota = (c: Cita, notes: string) => {
    setBookings((p) => p.map((b) => (b.id === c.id ? { ...b, notes } : b)));
    setDetalle((d) => (d && d.id === c.id ? { ...d, notes } : d));
    if (salonId) guardar(db().from("citas").update({ notas: notes }).eq("id", c.id));
    avisar("Nota guardada ✓");
  };

  const guardarCita = async (e: Borrador) => {
    if (e.min == null) return;
    const sv = SV.find((x) => x.name === e.service);
    const dur = duracion(sv?.dur);
    const datos = {
      date: e.date, time: e.min / 60, dur, client: e.client.trim(), phone: e.phone.trim(), service: e.service,
      price: `${precio(sv?.price || "0")}€`, notes: e.notes.trim(),
    };
    const fila = {
      fecha: e.date, hora: Math.floor(e.min / 60), minuto: e.min % 60, duracion_min: dur, nombre: datos.client,
      telefono: datos.phone || null, tratamiento: e.service, precio: precio(sv?.price || "0") || null, notas: datos.notes || null,
    };
    if (e.id != null) {
      // Editar
      if (salonId) {
        const { error } = await db().from("citas").update(fila).eq("id", e.id);
        if (error) return avisar(/disponible|unique/i.test(error.message) ? "Esa hora ya está ocupada" : "No se pudo guardar");
      }
      setBookings((p) => p.map((b) => (b.id === e.id ? { ...b, ...datos } : b)));
      setDetalle((d) => (d && d.id === e.id ? { ...d, ...datos } : d));
      avisar("Cita cambiada ✓");
    } else {
      let id: Cita["id"] = Date.now();
      if (salonId) {
        const { data, error } = await db().from("citas").insert({ salon_id: salonId, ...fila, estado: "confirmada", origen: "panel" }).select("id").single();
        if (error) return avisar(/disponible|unique/i.test(error.message) ? "Esa hora ya está ocupada" : "No se pudo guardar la cita");
        id = data.id;
      }
      setBookings((p) => [...p, { id, ...datos, status: "confirmada", origen: "panel" }]);
      avisar("Cita apuntada ✓");
    }
    setEditor(null);
    setSelDate(e.date);
  };

  const guardarBloqueo = async (b: BorradorBloqueo) => {
    if (b.min == null) return;
    const nuevo: Bloqueo = { id: b.original?.id, date: b.date, time: b.min / 60, dur: b.dur, reason: b.reason.trim() };
    const fila = { fecha: b.date, hora: Math.floor(b.min / 60), minuto: b.min % 60, duracion_min: b.dur, motivo: nuevo.reason || null };
    if (salonId) {
      if (b.original?.id) {
        if (!(await guardar(db().from("bloqueos").update(fila).eq("id", b.original.id)))) return;
      } else {
        const { data, error } = await db().from("bloqueos").insert({ salon_id: salonId, ...fila }).select("id").single();
        if (error) return avisar("No se pudo bloquear. Inténtalo de nuevo.");
        nuevo.id = data.id;
      }
    }
    setBlocked((p) => [...p.filter((x) => x !== b.original), nuevo]);
    setBloqueo(null);
    avisar(`${b.original ? "Bloqueo cambiado" : "Bloqueado"}: ${hhmm(nuevo.time)} – ${hhmm(nuevo.time + nuevo.dur / 60)}`);
  };

  const quitarBloqueo = (b: Bloqueo) => {
    setBlocked((p) => p.filter((x) => x !== b));
    if (salonId && b.id) guardar(db().from("bloqueos").delete().eq("id", b.id));
    setBloqueo(null);
    avisar(`Liberado ${hhmm(b.time)} – ${hhmm(b.time + b.dur / 60)}`, {
      txt: "Deshacer",
      fn: async () => {
        let v = b;
        if (salonId) {
          const { data, error } = await db()
            .from("bloqueos")
            .insert({ salon_id: salonId, fecha: b.date, hora: Math.floor(b.time), minuto: Math.round((b.time % 1) * 60), duracion_min: b.dur, motivo: b.reason || null })
            .select("id")
            .single();
          if (error) return avisar("No se pudo deshacer");
          v = { ...b, id: data.id };
        }
        setBlocked((p) => [...p, v]);
      },
    });
  };

  const nuevaCita = (date?: string, min?: number, base?: Partial<Borrador>) =>
    setEditor({ client: "", phone: "", service: SV[0]?.name ?? "", date: date || selDate || today, min: min ?? null, notes: "", ...base });
  const editarCita = (c: Cita) =>
    setEditor({ id: c.id, client: c.client, phone: c.phone, service: c.service, date: c.date, min: Math.round(c.time * 60), notes: c.notes });

  const exportCSV = (rows: Cita[], archivo: string) => {
    const head = "Fecha;Hora;Clienta;Teléfono;Tratamiento;Precio;Estado;Notas";
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const body = rows.map((b) => [b.date, hhmm(b.time), b.client, b.phone, b.service, precio(b.price), b.status, b.notes].map(esc).join(";"));
    const url = URL.createObjectURL(new Blob(["﻿" + [head, ...body].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = archivo;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) return <div className="min-h-screen bg-[#F6F1EC]" />;

  const ctx = {
    real, nombre, HOR, SV, today, selDate, setSelDate, vista, setVista, modo, setModo,
    bookings, setBookings, blocked, setBlocked, citasDe, ocupadoDia, cifras, clientas, porAvisar, enviado, marcarEnviado, msg,
    cambiarEstado, cancelarCita, guardarNota, guardarCita, guardarBloqueo, quitarBloqueo, nuevaCita, editarCita, exportCSV,
    setDetalle, setEditor, setBloqueo, setHueco, setClienta, setMas, avisar, huecosLibres,
    reset: (vacio: boolean) => {
      const h = parseD(today);
      setBookings(vacio ? [] : generarDemo(h));
      setBlocked(vacio ? [] : demoBlocked(h));
      setSent({});
      avisar(vacio ? "Panel vacío. ¡A por las primeras citas!" : "Datos de ejemplo cargados");
    },
  };

  const TABS = [
    { id: "agenda", txt: "Agenda", Icono: CalendarDays },
    { id: "avisos", txt: "Avisos", Icono: Bell },
    { id: "clientas", txt: "Clientas", Icono: Users },
    { id: "resumen", txt: "Resumen", Icono: ChartColumn },
    { id: "mas", txt: "Más", Icono: Menu },
  ] as const;

  return (
    <PanelCtx.Provider value={ctx}>
      <div className="min-h-screen bg-[#F6F1EC] text-[#1A1A1A] font-sans overflow-x-clip">
        {/* Barra de arriba */}
        <header className="sticky top-0 z-[200] bg-white/95 backdrop-blur border-b border-[#EAE1D8] pt-[env(safe-area-inset-top)]">
          <div className="max-w-2xl mx-auto h-14 px-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[17px] font-bold leading-tight truncate">{nombre}</p>
              <p className="text-[12px] text-[#8A7A70] leading-tight">Panel de gestión</p>
            </div>
            <button
              onClick={() => setVista("avisos")}
              className="relative w-11 h-11 rounded-full flex items-center justify-center bg-[#F6F1EC] active:scale-95"
              aria-label="Avisos"
            >
              <Bell className="w-[22px] h-[22px]" />
              {porAvisar.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-[#B54A4A] text-white text-[11px] font-bold flex items-center justify-center">
                  {porAvisar.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pt-4 pb-[calc(150px+env(safe-area-inset-bottom))]">
          {vista === "agenda" && <Agenda />}
          {vista === "avisos" && <Avisos />}
          {vista === "clientas" && <Clientas />}
          {vista === "resumen" && <Resumen />}
          {vista === "todas" && <Todas />}
        </main>

        {/* Botón «Nueva cita», siempre a la vista */}
        {!algunaHoja && (
          <button
            onClick={() => nuevaCita(vista === "agenda" && modo === "dia" ? selDate : undefined)}
            className="fixed right-4 z-[300] h-14 pl-4 pr-5 rounded-full bg-[#B8922A] text-white text-[16px] font-bold flex items-center gap-2 shadow-[0_10px_28px_rgba(184,146,42,0.45)] active:scale-95 transition"
            style={{ bottom: "calc(78px + env(safe-area-inset-bottom))" }}
          >
            <Plus className="w-6 h-6" /> Nueva cita
          </button>
        )}

        {/* Menú de abajo */}
        <nav className="fixed inset-x-0 bottom-0 z-[400] bg-white border-t border-[#EAE1D8] pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto grid grid-cols-5">
            {TABS.map(({ id, txt, Icono }) => {
              const activo = id === "mas" ? mas || vista === "todas" : vista === id && !mas;
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "mas") return setMas(true);
                    if (id === "agenda" && vista === "agenda") {
                      setModo("dia");
                      setSelDate(today);
                    }
                    setVista(id);
                    window.scrollTo(0, 0);
                  }}
                  className="relative h-16 flex flex-col items-center justify-center gap-0.5"
                >
                  <span className={cn("w-14 h-8 rounded-full flex items-center justify-center transition", activo && "bg-[#F1E6D2]")}>
                    <Icono className="w-[22px] h-[22px]" style={{ color: activo ? C.oro : C.gris }} strokeWidth={activo ? 2.4 : 1.9} />
                  </span>
                  <span className="text-[11.5px]" style={{ color: activo ? C.tinta : C.gris, fontWeight: activo ? 700 : 500 }}>
                    {txt}
                  </span>
                  {id === "avisos" && porAvisar.length > 0 && (
                    <span className="absolute top-1.5 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B54A4A] text-white text-[10.5px] font-bold flex items-center justify-center">
                      {porAvisar.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Hojas */}
        {clienta && <HojaClienta nombre={clienta} />}
        {detalle && <HojaCita cita={detalle} />}
        {hueco && <HojaHueco date={hueco.date} min={hueco.min} />}
        {bloqueo && <HojaBloqueo inicial={bloqueo} />}
        {editor && <EditorCita inicial={editor} />}
        {mas && <HojaMas />}

        {/* Aviso breve */}
        {toast && (
          <div
            className="fixed inset-x-4 z-[900] mx-auto max-w-md flex items-center justify-between gap-4 rounded-2xl bg-[#1A1A1A] text-white px-5 py-3.5 text-[15px] shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200"
            style={{ bottom: "calc(148px + env(safe-area-inset-bottom))" }}
          >
            <span>{toast.msg}</span>
            {toast.accion && (
              <button
                className="font-bold whitespace-nowrap"
                style={{ color: C.oro }}
                onClick={() => {
                  toast.accion!.fn();
                  setToast(null);
                }}
              >
                {toast.accion.txt}
              </button>
            )}
          </div>
        )}
      </div>
    </PanelCtx.Provider>
  );
}
