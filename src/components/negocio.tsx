"use client";

import { useEffect, useState } from "react";
import { NEGOCIO } from "@/lib/data";

type Negocio = { nombre: string; ciudad: string; whatsapp: string; instagram: string };
const KEY = "estetica-negocio";

// Web de muestra para cada estética: ?salon=Estética Rosa&ciudad=Marbella&ig=esteticarosa
// cambia el nombre, la ciudad y el Instagram solo en ese enlace (se recuerda mientras dure la visita).
function leer(): Negocio {
  let salon = "", ciudad = "", ig = "";
  try {
    const q = new URLSearchParams(window.location.search);
    salon = q.get("salon")?.trim() ?? "";
    ciudad = q.get("ciudad")?.trim() ?? "";
    ig = q.get("ig")?.trim().replace(/^@/, "") ?? "";
    if (salon) sessionStorage.setItem(KEY, JSON.stringify({ salon, ciudad, ig }));
    else {
      const g = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (g) ({ salon, ciudad, ig = "" } = g);
    }
  } catch {}
  return { ...NEGOCIO, nombre: salon || NEGOCIO.nombre, ciudad: ciudad || NEGOCIO.ciudad, instagram: ig || NEGOCIO.instagram };
}

export function useNegocio(): Negocio {
  const [n, setN] = useState<Negocio>({ ...NEGOCIO });
  useEffect(() => {
    const t = setTimeout(() => {
      const v = leer();
      setN(v);
      if (v.nombre !== NEGOCIO.nombre) document.title = `${v.nombre} · Estética avanzada en ${v.ciudad}`;
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return n;
}

// Para usar dentro de componentes de servidor
export function NegocioTexto({ campo }: { campo: "nombre" | "ciudad" }) {
  return <>{useNegocio()[campo]}</>;
}
