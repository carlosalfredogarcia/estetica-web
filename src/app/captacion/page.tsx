"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Tu lista de estéticas visitadas. Solo para ti: se guarda en este móvil y no está enlazada desde la web.
type Estado = "Por visitar" | "Visitada" | "Interesada" | "Cliente" | "No interesada";
const ESTADOS: Estado[] = ["Por visitar", "Visitada", "Interesada", "Cliente", "No interesada"];
const COLOR: Record<Estado, string> = {
  "Por visitar": "#8A7A70",
  Visitada: "#C98A3E",
  Interesada: "#B8922A",
  Cliente: "#4A7A64",
  "No interesada": "#B54A4A",
};

interface Salon {
  id: number;
  salon: string;
  duena: string;
  telefono: string;
  zona: string;
  instagram?: string;
  estado: Estado;
  regalo: boolean;
  visita: string;
  proximo: string;
  notas: string;
}

const KEY = "alfrega-captacion";
const PLAZAS_FUNDADORA = 10;
const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const enDias = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fecha = (s: string) =>
  s ? new Date(s + "T12:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }) : "";
const vacio = (): Omit<Salon, "id"> => ({
  salon: "", duena: "", telefono: "", zona: "", instagram: "", estado: "Por visitar", regalo: false, visita: "", proximo: "", notas: "",
});
const waTo = (phone: string, msg: string) => {
  let n = phone.replace(/\D/g, "");
  if (n.length === 9) n = "34" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
};

export default function Captacion() {
  const [lista, setLista] = useState<Salon[]>([]);
  const [listo, setListo] = useState(false);
  const [form, setForm] = useState<(Omit<Salon, "id"> & { id?: number }) | null>(null);
  const [filtro, setFiltro] = useState<Estado | "Todas">("Todas");
  const [aviso, setAviso] = useState("");
  const [origen, setOrigen] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setLista(JSON.parse(localStorage.getItem(KEY) || "[]"));
      } catch {}
      setOrigen(window.location.origin);
      setListo(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (listo) try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch {}
  }, [listo, lista]);

  const decir = (m: string) => {
    setAviso(m);
    setTimeout(() => setAviso(""), 2400);
  };

  // Su web de muestra con su nombre, su Instagram y su WhatsApp (las reservas de prueba le llegan a ella)
  type Enlace = { salon: string; zona: string; instagram?: string; telefono?: string };
  const enlaceWeb = (s: Enlace) => {
    const tel = (s.telefono ?? "").replace(/\D/g, "");
    return `${origen}/?salon=${encodeURIComponent(s.salon)}${s.zona ? `&ciudad=${encodeURIComponent(s.zona)}` : ""}${
      s.instagram ? `&ig=${encodeURIComponent(s.instagram.replace(/^@/, ""))}` : ""}${tel ? `&tel=${tel}` : ""}`;
  };
  const enlacePanel = (s: Enlace) => enlaceWeb(s).replace("/?", "/admin?");

  const msgSeguimiento = (s: Salon) =>
    `Hola${s.duena ? ` ${s.duena}` : ""}, soy Carlos, el de la web y el dispensador 😊 ¿Pudiste verla con calma? Aquí la tienes: ${enlaceWeb(s)}\n\nSi te animas, esta semana te la dejo lista con tus tratamientos y precios.`;
  const msgPrecios = (s: Salon) =>
    `Hola${s.duena ? ` ${s.duena}` : ""}, te dejo tu web de muestra: ${enlaceWeb(s)}\n\nY aquí tienes los planes y precios para verlo con calma: ${origen}/alfrega`;

  function guardar() {
    if (!form || !form.salon.trim()) return decir("Pon al menos el nombre de la estética");
    if (form.id) setLista((l) => l.map((x) => (x.id === form.id ? ({ ...form } as Salon) : x)));
    else setLista((l) => [...l, { ...form, id: Date.now() } as Salon]);
    setForm(null);
    decir("Guardado ✓");
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      decir("Enlace copiado ✓");
    } catch {
      window.prompt("Copia el enlace:", texto);
    }
  }

  const clientes = lista.filter((s) => s.estado === "Cliente").length;
  const toca = lista.filter((s) => s.proximo && s.proximo <= hoy() && s.estado !== "Cliente" && s.estado !== "No interesada");
  const vistas = useMemo(() => {
    const l = filtro === "Todas" ? lista : lista.filter((s) => s.estado === filtro);
    return [...l].sort((a, b) => (a.proximo || "9999").localeCompare(b.proximo || "9999"));
  }, [lista, filtro]);

  const campo = "w-full px-3 py-2.5 bg-white border border-border text-sm font-sans outline-none focus:border-[var(--gold)]";
  const etiqueta = "block text-[10px] font-sans tracking-[0.15em] uppercase text-muted-foreground mb-1.5 mt-4";

  return (
    <div className="cine">
      <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md border-b border-border px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="font-serif text-xl tracking-[0.25em] uppercase leading-none">Alfrega</p>
            <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[var(--gold)] mt-1">Captación · solo para ti</p>
          </div>
          <button
            onClick={() => setForm({ ...vacio(), visita: hoy(), estado: "Visitada", proximo: enDias(3) })}
            className="btn-gold px-4 py-2.5 text-[11px] font-sans tracking-[0.15em] uppercase inline-flex items-center gap-1.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" /> Estética
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        {/* Resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border mb-8">
          {[
            [lista.filter((s) => s.estado !== "Por visitar").length, "Visitadas"],
            [lista.filter((s) => s.regalo).length, "Regalos entregados"],
            [clientes, "Clientes"],
            [Math.max(0, PLAZAS_FUNDADORA - clientes), "Plazas fundadora"],
          ].map(([n, l]) => (
            <div key={l} className="bg-[var(--card)] p-5 text-center">
              <p className="font-sans font-light text-4xl text-[var(--gold)] tabular-nums">{n}</p>
              <p className="text-[10px] font-sans tracking-[0.15em] uppercase text-muted-foreground mt-1">{l}</p>
            </div>
          ))}
        </div>

        {toca.length > 0 && (
          <div className="mb-8 p-5 border-l-2 border-[#C98A3E] bg-[#C98A3E]/10">
            <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#C98A3E] mb-1">Hoy toca escribir</p>
            <p className="text-sm font-sans">{toca.map((s) => s.salon).join(" · ")}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {(["Todas", ...ESTADOS] as const).map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[10px] font-sans tracking-[0.12em] uppercase border whitespace-nowrap",
                filtro === e ? "bg-foreground text-[var(--background)] border-foreground" : "border-border text-muted-foreground"
              )}
            >
              {e} {e === "Todas" ? lista.length : lista.filter((s) => s.estado === e).length}
            </button>
          ))}
        </div>

        {listo && lista.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="font-serif text-2xl font-light mb-2">Tu lista está vacía</p>
            <p className="text-sm font-sans text-muted-foreground">
              Apunta aquí cada estética que visites. Te avisa cuándo toca escribir y te prepara su web de muestra.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {vistas.map((s) => {
            const atrasada = s.proximo && s.proximo <= hoy() && s.estado !== "Cliente" && s.estado !== "No interesada";
            return (
              <div key={s.id} className="bg-[var(--card)] border border-border p-5" style={{ borderLeft: `3px solid ${COLOR[s.estado]}` }}>
                <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setForm(s)}>
                  <div className="min-w-0">
                    <p className="font-serif text-xl font-light">{s.salon}</p>
                    <p className="text-xs font-sans text-muted-foreground">
                      {[s.duena, s.zona, s.telefono].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-sans tracking-[0.1em] uppercase px-2 py-1 rounded-full" style={{ color: COLOR[s.estado], background: `${COLOR[s.estado]}18` }}>
                      {s.estado}
                    </span>
                    {s.regalo && <p className="text-[10px] font-sans text-muted-foreground mt-1.5">🎁 Regalo dado</p>}
                  </div>
                </div>
                {s.notas && <p className="text-sm font-sans font-light text-foreground/80 mt-3 whitespace-pre-line">{s.notas}</p>}
                <p className={cn("text-xs font-sans mt-3", atrasada ? "text-[#C98A3E] font-medium" : "text-muted-foreground")}>
                  {s.visita && `Visita: ${fecha(s.visita)}`}
                  {s.proximo && ` · Volver a escribir: ${fecha(s.proximo)}${atrasada ? " (toca ya)" : ""}`}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a href={enlaceWeb(s)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase border border-[var(--gold)] text-[var(--gold)] rounded-full">
                    <ExternalLink className="w-3 h-3" /> Su web
                  </a>
                  <a href={enlacePanel(s)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase border border-[var(--gold)] text-[var(--gold)] rounded-full">
                    <ExternalLink className="w-3 h-3" /> Su panel
                  </a>
                  <button onClick={() => copiar(enlaceWeb(s))} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase border border-border text-muted-foreground rounded-full">
                    <Copy className="w-3 h-3" /> Copiar enlace
                  </button>
                  {s.telefono && (
                    <>
                      <a href={waTo(s.telefono, msgSeguimiento(s))} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase text-white bg-[#4A7A64] rounded-full">
                        Seguimiento
                      </a>
                      <a href={waTo(s.telefono, msgPrecios(s))} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-[10px] font-sans tracking-[0.12em] uppercase text-[#4A7A64] border border-[#4A7A64] rounded-full">
                        Mandar web y precios
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Hoja para añadir o editar */}
      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setForm(null)}>
          <div className="bg-[var(--background)] w-full sm:max-w-md max-h-[92vh] overflow-y-auto p-6 tab-enter" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl font-light">{form.id ? "Editar estética" : "Nueva estética"}</p>
              <button onClick={() => setForm(null)} aria-label="Cerrar"><X className="w-5 h-5" /></button>
            </div>
            <label className={etiqueta}>Nombre de la estética</label>
            <input className={campo} value={form.salon} onChange={(e) => setForm({ ...form, salon: e.target.value })} placeholder="Estética Rosa" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={etiqueta}>Dueña</label>
                <input className={campo} value={form.duena} onChange={(e) => setForm({ ...form, duena: e.target.value })} placeholder="Nombre" />
              </div>
              <div>
                <label className={etiqueta}>WhatsApp</label>
                <input className={campo} inputMode="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="600 000 000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={etiqueta}>Zona o ciudad</label>
                <input className={campo} value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} placeholder="Málaga" />
              </div>
              <div>
                <label className={etiqueta}>Su Instagram</label>
                <input className={campo} value={form.instagram ?? ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@esteticarosa" />
              </div>
            </div>
            <p className="text-[11px] font-sans text-muted-foreground mt-2">El nombre, la zona y su Instagram salen en su web de muestra.</p>
            <label className={etiqueta}>Cómo va</label>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm({ ...form, estado: e })}
                  className="px-3 py-1.5 rounded-full text-[10px] font-sans tracking-[0.1em] uppercase border"
                  style={form.estado === e ? { background: COLOR[e], color: "#fff", borderColor: COLOR[e] } : { borderColor: "var(--border)" }}
                >
                  {e}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-3 mt-5 text-sm font-sans">
              <input type="checkbox" checked={form.regalo} onChange={(e) => setForm({ ...form, regalo: e.target.checked })} className="w-4 h-4 accent-[var(--gold)]" />
              Le he dado el regalo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={etiqueta}>Día de la visita</label>
                <input type="date" className={campo} value={form.visita} onChange={(e) => setForm({ ...form, visita: e.target.value })} />
              </div>
              <div>
                <label className={etiqueta}>Volver a escribir</label>
                <input type="date" className={campo} value={form.proximo} onChange={(e) => setForm({ ...form, proximo: e.target.value })} />
              </div>
            </div>
            <label className={etiqueta}>Qué te dijo</label>
            <textarea
              className={cn(campo, "min-h-24")}
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Cómo le llegan las citas, cuántas le fallan, precio medio, dudas…"
            />
            <div className="flex gap-3 mt-6">
              {form.id && (
                <button
                  onClick={() => {
                    if (!confirm(`¿Borrar ${form.salon}?`)) return;
                    setLista((l) => l.filter((x) => x.id !== form.id));
                    setForm(null);
                  }}
                  className="px-4 py-3 text-xs font-sans tracking-[0.15em] uppercase text-[#B54A4A] border border-[#B54A4A]/40 rounded-full"
                >
                  Borrar
                </button>
              )}
              <button onClick={guardar} className="flex-1 btn-gold py-3 text-xs font-sans tracking-[0.2em] uppercase rounded-full">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {aviso && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-foreground text-[var(--background)] px-5 py-3 text-sm font-sans">
          {aviso}
        </div>
      )}
    </div>
  );
}
