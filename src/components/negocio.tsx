"use client";

import { useEffect, useState } from "react";
import { NEGOCIO } from "@/lib/data";

type Negocio = typeof NEGOCIO;
const KEY = "estetica-negocio";

// Web de muestra para cada estética: ?salon=Estética Rosa&ciudad=Marbella
// cambia el nombre y la ciudad solo en ese enlace (se recuerda mientras dure la visita).
function leer(): Negocio {
  let salon = "", ciudad = "";
  try {
    const q = new URLSearchParams(window.location.search);
    salon = q.get("salon")?.trim() ?? "";
    ciudad = q.get("ciudad")?.trim() ?? "";
    if (salon) sessionStorage.setItem(KEY, JSON.stringify({ salon, ciudad }));
    else {
      const g = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (g) ({ salon, ciudad } = g);
    }
  } catch {}
  return { ...NEGOCIO, nombre: salon || NEGOCIO.nombre, ciudad: ciudad || NEGOCIO.ciudad };
}

export function useNegocio(): Negocio {
  const [n, setN] = useState<Negocio>(NEGOCIO);
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
