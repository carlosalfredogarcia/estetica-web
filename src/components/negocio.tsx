"use client";

import { useEffect, useState } from "react";
import { NEGOCIO, SERVICES, SCHEDULE_MAP, type Service } from "@/lib/data";
import { db } from "@/lib/supabase";

export type Horario = Record<number, { s: number; e: number }[] | null>;
type Negocio = { nombre: string; ciudad: string; whatsapp: string; instagram: string };

export interface Salon {
  // demo: la web de muestra (datos de data.ts, el nombre se puede cambiar con ?salon=…)
  // real: una estética de verdad, leída de la base de datos con ?s=slug
  modo: "demo" | "cargando" | "real" | "no-encontrada";
  slug: string | null;
  negocio: Negocio;
  servicios: Service[];
  horario: Horario;
}

const DEMO: Salon = { modo: "demo", slug: null, negocio: { ...NEGOCIO }, servicios: SERVICES, horario: SCHEDULE_MAP };
const KEY = "estetica-negocio";

// Foto por defecto según el tipo de tratamiento, si la estética aún no ha puesto la suya
const FOTO: Record<string, string> = {
  Facial: "images/tratamientos/facial.webp",
  Corporal: "images/tratamientos/corporal.webp",
  Láser: "images/tratamientos/laser-piernas.webp",
};

// Web de muestra para cada estética: ?salon=Estética Rosa&ciudad=Marbella&ig=esteticarosa
// cambia el nombre, la ciudad y el Instagram solo en ese enlace (se recuerda mientras dure la visita).
function leerDemo(q: URLSearchParams): Salon {
  let salon = "", ciudad = "", ig = "";
  try {
    salon = q.get("salon")?.trim() ?? "";
    ciudad = q.get("ciudad")?.trim() ?? "";
    ig = q.get("ig")?.trim().replace(/^@/, "") ?? "";
    if (salon) sessionStorage.setItem(KEY, JSON.stringify({ salon, ciudad, ig }));
    else {
      const g = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (g) ({ salon, ciudad, ig = "" } = g);
    }
  } catch {}
  return {
    ...DEMO,
    negocio: { ...NEGOCIO, nombre: salon || NEGOCIO.nombre, ciudad: ciudad || NEGOCIO.ciudad, instagram: ig || NEGOCIO.instagram },
  };
}

export async function cargarSalonReal(slug: string): Promise<Salon & { id?: string }> {
  const { data: s } = await db().from("salones").select("*").eq("slug", slug).eq("activo", true).maybeSingle();
  if (!s) return { ...DEMO, modo: "no-encontrada", slug };
  const { data: ts } = await db().from("tratamientos").select("*").eq("salon_id", s.id).eq("activo", true).order("orden");
  const servicios: Service[] = (ts ?? []).map((t) => ({
    cat: t.categoria,
    name: t.nombre,
    price: t.precio_texto || (t.precio != null ? `${Number(t.precio)}€` : ""),
    promo: t.promo || undefined,
    icon: "",
    dur: `${t.duracion_min} min`,
    desc: t.descripcion || "",
    img: t.imagen || FOTO[t.categoria] || FOTO.Facial,
  }));
  const horario: Horario = {};
  for (let d = 0; d < 7; d++) horario[d] = s.horario?.[String(d)] ?? null;
  return {
    id: s.id,
    modo: "real",
    slug,
    negocio: { nombre: s.nombre, ciudad: s.ciudad || "", whatsapp: s.whatsapp || NEGOCIO.whatsapp, instagram: s.instagram || "" },
    servicios,
    horario,
  };
}

// Se carga una sola vez por página y lo comparten todos los componentes
let cargando: Promise<Salon> | null = null;
function cargar(): Promise<Salon> {
  if (!cargando) {
    const q = new URLSearchParams(window.location.search);
    const slug = q.get("s")?.trim().toLowerCase();
    cargando = slug ? cargarSalonReal(slug) : Promise.resolve(leerDemo(q));
  }
  return cargando;
}

export function useSalon(): Salon {
  const [v, setV] = useState<Salon>(DEMO);
  useEffect(() => {
    let vivo = true;
    const q = new URLSearchParams(window.location.search);
    if (q.get("s")) setTimeout(() => vivo && setV((x) => ({ ...x, modo: "cargando" })), 0);
    cargar().then((s) => {
      if (!vivo) return;
      setV(s);
      if (s.negocio.nombre !== NEGOCIO.nombre) document.title = `${s.negocio.nombre} · Estética en ${s.negocio.ciudad}`;
    });
    return () => {
      vivo = false;
    };
  }, []);
  return v;
}

export function useNegocio(): Negocio {
  return useSalon().negocio;
}

// Para usar dentro de componentes de servidor
export function NegocioTexto({ campo }: { campo: "nombre" | "ciudad" }) {
  return <>{useNegocio()[campo]}</>;
}

// Pestañas de tratamientos según lo que tenga cada estética (primero las de siempre)
const ORDEN = ["Facial", "Corporal", "Láser"];
const ETIQUETA: Record<string, string> = { Facial: "Faciales", Corporal: "Corporales", Láser: "Láser" };
export function categorias(servicios: Service[]) {
  const cats = [...new Set(servicios.map((s) => s.cat))].sort(
    (a, b) => (ORDEN.indexOf(a) + 1 || 99) - (ORDEN.indexOf(b) + 1 || 99)
  );
  return cats.map((id) => ({ id, label: ETIQUETA[id] ?? id }));
}

// Horario en texto, juntando los días que tienen las mismas horas: «Lun · Mié · Vie» → «10:00–14:00 y 16:00–20:00»
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export function horarioTexto(h: Horario) {
  const hh = (n: number) => `${String(n).padStart(2, "0")}:00`;
  const grupos: { dias: number[]; h: string }[] = [];
  for (const d of [1, 2, 3, 4, 5, 6, 0]) {
    const t = h[d];
    const txt = t && t.length ? t.map((x) => `${hh(x.s)}–${hh(x.e)}`).join(" y ") : "Cerrado";
    const g = grupos.find((x) => x.h === txt);
    if (g) g.dias.push(d);
    else grupos.push({ dias: [d], h: txt });
  }
  return grupos.map((g) => ({ d: g.dias.map((x) => DIAS[x]).join(" · "), h: g.h }));
}
