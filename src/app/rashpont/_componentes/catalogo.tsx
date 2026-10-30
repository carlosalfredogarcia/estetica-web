"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { FotoIcono, IconoWhatsApp } from "./marca";
import { nombreReserva, type Grupo, type Tratamiento, type Variante } from "../_datos/catalogo";

const POR_GRUPO = 3; // tarjetas que se ven de cada grupo antes de «Ver todos»

const normal = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const euros = (p: string) => parseFloat(p.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

function precioDesde(t: Tratamiento) {
  const min = t.variantes.reduce((a, v) => (euros(v.precio) < euros(a.precio) ? v : a));
  const desde = t.variantes.length > 1 || /desde/i.test(min.precio);
  return { desde, precio: min.precio.replace(/desde\s*/i, "") };
}
function minutos(t: Tratamiento) {
  const m = t.variantes.map((v) => v.min);
  const a = Math.min(...m), b = Math.max(...m);
  return a === b ? `${a} min` : `${a}–${b} min`;
}

// Reservar: la agenda (componente Booking) escucha este aviso y salta al día y la hora
export function reservar(t: Tratamiento, va: Variante, grupo: string) {
  window.dispatchEvent(new CustomEvent("estetica:select-service", { detail: { name: nombreReserva(t, va), cat: grupo } }));
}

function Foto({ t }: { t: Tratamiento }) {
  return t.img.includes("/") ? <img src={t.img} alt="" loading="lazy" /> : <FotoIcono tipo={t.img} />;
}

export function Catalogo({
  tratamientos, grupos, whatsapp, palabra,
}: {
  tratamientos: Tratamiento[];
  grupos: Grupo[];
  whatsapp: string;
  palabra: string; // «tratamientos» o «servicios»
}) {
  const [q, setQ] = useState("");
  const [grupo, setGrupo] = useState("todos");
  const [abiertos, setAbiertos] = useState<string[]>([]);
  const [ficha, setFicha] = useState<Tratamiento | null>(null);
  const cerrarFicha = useCallback(() => setFicha(null), []);
  const nombreGrupo = (id: string) => grupos.find((g) => g.id === id)?.nombre ?? id;

  const encontrados = useMemo(() => {
    const palabras = normal(q).split(/\s+/).filter(Boolean);
    if (!palabras.length) return null;
    return tratamientos.filter((t) => {
      const todo = normal([t.nombre, t.resumen, t.texto ?? "", nombreGrupo(t.grupo), ...(t.etiquetas ?? []), ...t.variantes.map((v) => v.nombre)].join(" "));
      return palabras.every((p) => todo.includes(p));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tratamientos]);

  const delGrupo = (id: string) => {
    const l = tratamientos.filter((t) => t.grupo === id);
    return [...l.filter((t) => t.destacado), ...l.filter((t) => !t.destacado)];
  };

  const tarjeta = (t: Tratamiento, i: number) => {
    const { desde, precio } = precioDesde(t);
    const unica = t.variantes.length === 1;
    return (
      <article key={t.id} className="rp-card rp-sube" style={{ "--d": `${Math.min(i, 6) * 60}ms` } as React.CSSProperties}>
        <div className="rp-card-foto" onClick={() => setFicha(t)}>
          <Foto t={t} />
          {t.destacado && <span className="rp-sello-card">Destacado</span>}
          <div className="rp-card-dato">
            <span className="rp-precio">{desde && <small>desde</small>}{precio}</span>
            <span className="rp-min">{minutos(t)}</span>
          </div>
        </div>
        <div className="rp-card-cuerpo">
          <h3>{t.nombre}</h3>
          <p>{t.resumen}</p>
          <div className="rp-card-acciones">
            <button className="rp-leer" type="button" onClick={() => setFicha(t)}>Ver más</button>
            <button
              className="rp-btn rp-btn-sm rp-btn-oro"
              type="button"
              onClick={() => (unica ? reservar(t, t.variantes[0], nombreGrupo(t.grupo)) : setFicha(t))}
            >
              Reservar
            </button>
          </div>
        </div>
      </article>
    );
  };

  const visibles = grupo === "todos" ? grupos : grupos.filter((g) => g.id === grupo);

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div style={{ display: "grid", gap: 16 }}>
        <label className="rp-buscar">
          <Search aria-hidden="true" />
          <input
            id="rp-buscar"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={palabra === "tratamientos" ? "¿Qué quieres mejorar? Papada, celulitis, acné…" : "Busca: barba, canas, niño…"}
            aria-label={`Buscar ${palabra}`}
          />
        </label>
        {!encontrados && (
          <div className="rp-chips" role="group" aria-label="Grupos">
            <button className="rp-chip" type="button" aria-pressed={grupo === "todos"} onClick={() => setGrupo("todos")}>
              Todos<small>{tratamientos.length}</small>
            </button>
            {grupos.map((g) => (
              <button key={g.id} className="rp-chip" type="button" aria-pressed={grupo === g.id} onClick={() => setGrupo(g.id)}>
                {g.nombre}<small>{tratamientos.filter((t) => t.grupo === g.id).length}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {encontrados ? (
        <div style={{ display: "grid", gap: 18 }}>
          <p className="rp-nude" style={{ fontSize: 13 }}>
            {encontrados.length
              ? `${encontrados.length} ${encontrados.length === 1 ? "resultado" : "resultados"} para «${q.trim()}»`
              : `No encontramos «${q.trim()}». Prueba con otra palabra o escríbenos por WhatsApp y te asesoramos.`}
          </p>
          <div className="rp-grid">{encontrados.map(tarjeta)}</div>
        </div>
      ) : (
        visibles.map((g) => {
          const lista = delGrupo(g.id);
          const todo = grupo !== "todos" || abiertos.includes(g.id);
          const ver = todo ? lista : lista.slice(0, POR_GRUPO);
          return (
            <section key={g.id} style={{ display: "grid", gap: 18, paddingTop: 12 }} aria-labelledby={`g-${g.id}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", borderBottom: "1px solid rgba(201,169,110,.16)", paddingBottom: 12 }}>
                <h3 id={`g-${g.id}`} className="rp-titulo" style={{ fontSize: "clamp(26px, 4vw, 34px)" }}>{g.nombre}</h3>
                <span className="rp-nude" style={{ fontSize: 13 }}>{g.frase} · {lista.length} {palabra}</span>
              </div>
              <div className="rp-grid">{ver.map(tarjeta)}</div>
              {!todo && lista.length > POR_GRUPO && (
                <div className="rp-mas">
                  <button className="rp-btn" type="button" onClick={() => setAbiertos((a) => [...a, g.id])}>
                    Ver los {lista.length} {palabra} de {g.nombre.toLowerCase()}
                  </button>
                </div>
              )}
            </section>
          );
        })
      )}

      {ficha && <Ficha t={ficha} grupo={nombreGrupo(ficha.grupo)} whatsapp={whatsapp} cerrar={cerrarFicha} />}
    </div>
  );
}

function Ficha({ t, grupo, whatsapp, cerrar }: { t: Tratamiento; grupo: string; whatsapp: string; cerrar: () => void }) {
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    boton.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    addEventListener("keydown", tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [cerrar]);

  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, me gustaría información sobre: ${t.nombre}`)}`;

  return (
    <div className="rp-ficha-fondo" onClick={cerrar}>
      <div className="rp-ficha" role="dialog" aria-modal="true" aria-labelledby="rp-ficha-titulo" onClick={(e) => e.stopPropagation()}>
        <div className="rp-ficha-foto">
          <Foto t={t} />
          <button ref={boton} className="rp-ficha-cerrar" type="button" onClick={cerrar} aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rp-ficha-in">
          <div style={{ display: "grid", gap: 10 }}>
            <p className="rp-eyebrow">{grupo}</p>
            <h2 id="rp-ficha-titulo" className="rp-titulo" style={{ fontSize: "clamp(28px, 5vw, 40px)" }}>{t.nombre}</h2>
            <p className="rp-texto" style={{ fontSize: 15 }}>{t.resumen}</p>
          </div>

          <div>
            <p className="rp-eyebrow" style={{ marginBottom: 4 }}>{t.variantes.length > 1 ? "Elige tu opción" : "Precio y duración"}</p>
            {t.variantes.map((va) => (
              <div key={va.nombre || "unica"} className="rp-opcion">
                <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
                  {va.nombre && <span className="rp-opcion-nombre">{va.nombre}</span>}
                  <span className="rp-opcion-dato">
                    <span className="rp-oro" style={{ fontFamily: "var(--rp-display)", fontSize: 22 }}>{va.precio}</span> · {va.min} min
                  </span>
                </div>
                <button
                  className="rp-btn rp-btn-sm rp-btn-oro"
                  type="button"
                  onClick={() => {
                    cerrar();
                    reservar(t, va, grupo);
                  }}
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>

          {t.bonos && (
            <div style={{ display: "grid", gap: 10 }}>
              <p className="rp-eyebrow">Bonos</p>
              {t.bonos.map((b) => (
                <p key={b} className="rp-bono">{b}</p>
              ))}
              <p className="rp-nude" style={{ fontSize: 12 }}>Pregunta por los bonos en el centro o por WhatsApp.</p>
            </div>
          )}

          {t.texto && (
            <div style={{ display: "grid", gap: 10 }}>
              <p className="rp-eyebrow">En detalle</p>
              <div className="rp-descripcion">{t.texto}</div>
            </div>
          )}

          <a className="rp-btn" href={wa} target="_blank" rel="noopener noreferrer" style={{ justifySelf: "start" }}>
            <IconoWhatsApp className="w-4 h-4" /> Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
