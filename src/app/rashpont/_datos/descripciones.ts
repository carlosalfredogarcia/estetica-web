import fs from "node:fs";
import path from "node:path";
import { TRATAMIENTOS, type Parte, type Tratamiento } from "./catalogo";

// Se ejecuta al construir la web: lee las descripciones completas copiadas de Booksy
// (docs/clientes/rashpont-descripciones/parte-*.md) y se las pone a cada tratamiento.
const CARPETA = path.join(process.cwd(), "docs/clientes/rashpont-descripciones");

const normal = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[“”"«»']/g, "").replace(/\s+/g, " ").trim().toUpperCase();

function leerBooksy(): { titulo: string; texto: string }[] {
  let ficheros: string[] = [];
  try {
    ficheros = fs.readdirSync(CARPETA).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return [];
  }
  const out: { titulo: string; texto: string }[] = [];
  for (const f of ficheros) {
    const md = fs.readFileSync(path.join(CARPETA, f), "utf8");
    for (const bloque of md.split(/^### /m).slice(1)) {
      const titulo = bloque.split("\n")[0];
      const m = bloque.match(/"""\n([\s\S]*?)\n"""/);
      if (m) out.push({ titulo, texto: limpiar(m[1]) });
    }
  }
  return out;
}

// Fuera el teléfono fijo (no se enseña por ahora), los hashtags y los huecos dobles
function limpiar(t: string) {
  return t
    .split("\n")
    .filter((l) => !/951\s?73\s?83\s?24/.test(l) && !/^\s*#\w/.test(l))
    .join("\n")
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function tratamientosConTexto(parte: Parte): Tratamiento[] {
  const booksy = leerBooksy();
  return TRATAMIENTOS[parte].map((t) => {
    if (!t.booksy) return t;
    const clave = normal(t.booksy);
    const hallado = booksy.find((b) => normal(b.titulo).startsWith(clave));
    return hallado ? { ...t, texto: hallado.texto } : t;
  });
}
