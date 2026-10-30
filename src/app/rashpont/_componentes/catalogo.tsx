"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { FotoIcono, IconoWhatsApp } from "./marca";
import { nombreReserva, type Grupo, type Tratamiento, type Variante } from "../_datos/catalogo";


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
  const [abierto, setAbierto] = useState<string | null>(null); // grupo desplegado entero
  const [ficha, setFicha] = useState<Tratamiento | null>(null);
  const cerrarFicha = useCallback(() => setFicha(null), []);
  const filas = useRef<Record<string, HTMLDivElement | null>>({});
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

  // Ir al principio de un grupo (después de recogerlo o desde los botones de arriba)
  const irAlGrupo = (id: string) =>
    setTimeout(() => document.getElementById(`g-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  const desplegar = (id: string) => {
    setAbierto(id);
    irAlGrupo(id);
  };
  const recoger = () => {
    const id = abierto;
    setAbierto(null);
    if (id) irAlGrupo(id);
  };
  const deslizar = (id: string, lado: number) => {
    const f = filas.current[id];
    f?.scrollBy({ left: lado * f.clientWidth * 0.85, behavior: "smooth" });
  };

  const tarjeta = (t: Tratamiento, i: number) => {
    const { desde, precio } = precioDesde(t);
    const unica = t.variantes.length === 1;
    return (
      <article key={t.id} className="rp-card rp-sube" style={{ "--d": `${Math.min(i, 6) * 60}ms` } as React.CSSProperties}>
        <div className="rp-card-foto" onClick={() => setFicha(t)}>
          <Foto t={t} />
          {t.destacado && <span className="rp-sello-card">Destacado</span>}
          {t.bonos && <span className="rp-sello-card rp-sello-bono">Bonos</span>}
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

  return (
    <div style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0, 1fr)" }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0, 1fr)" }}>
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
          <div className="rp-chips" role="group" aria-label="Ir a un grupo">
            {grupos.map((g) => (
              <button
                key={g.id}
                className="rp-chip"
                type="button"
                aria-pressed={abierto === g.id}
                onClick={() => (abierto && abierto !== g.id ? (setAbierto(null), irAlGrupo(g.id)) : irAlGrupo(g.id))}
              >
                {g.nombre}<small>{tratamientos.filter((t) => t.grupo === g.id).length}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {encontrados ? (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 1fr)" }}>
          <div className="rp-barra-grupo">
            <button className="rp-volver" type="button" onClick={() => setQ("")}>← Volver</button>
            <p className="rp-nude" style={{ fontSize: 13, minWidth: 0 }}>
              {encontrados.length
                ? `${encontrados.length} ${encontrados.length === 1 ? "resultado" : "resultados"} para «${q.trim()}»`
                : `No encontramos «${q.trim()}». Prueba con otra palabra o escríbenos por WhatsApp.`}
            </p>
          </div>
          <div className="rp-grid">{encontrados.map(tarjeta)}</div>
        </div>
      ) : (
        grupos.map((g) => {
          const lista = delGrupo(g.id);
          const entero = abierto === g.id;
          return (
            <section key={g.id} id={`g-${g.id}`} className="rp-grupo" aria-labelledby={`t-${g.id}`}>
              {entero ? (
                <div className="rp-barra-grupo rp-barra-fija">
                  <button className="rp-volver" type="button" onClick={recoger}>← Volver</button>
                  <h3 id={`t-${g.id}`} className="rp-titulo" style={{ fontSize: "clamp(20px, 4vw, 28px)", minWidth: 0, textAlign: "right" }}>{g.nombre}</h3>
                </div>
              ) : (
                <div className="rp-grupo-cab">
                  <div style={{ minWidth: 0 }}>
                    <h3 id={`t-${g.id}`} className="rp-titulo" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>{g.nombre}</h3>
                    <p className="rp-nude" style={{ fontSize: 13, marginTop: 4 }}>{g.frase} · {lista.length} {palabra}</p>
                  </div>
                  <div className="rp-flechas">
                    <button type="button" aria-label="Anteriores" onClick={() => deslizar(g.id, -1)}>‹</button>
                    <button type="button" aria-label="Siguientes" onClick={() => deslizar(g.id, 1)}>›</button>
                  </div>
                </div>
              )}

              {entero ? (
                <>
                  <div className="rp-grid">{lista.map(tarjeta)}</div>
                  <div className="rp-mas">
                    <button className="rp-volver" type="button" onClick={recoger}>← Volver</button>
                  </div>
                </>
              ) : (
                <div
                  className="rp-fila"
                  ref={(el) => {
                    filas.current[g.id] = el;
                  }}
                >
                  {lista.map(tarjeta)}
                  {lista.length > 1 && (
                    <button className="rp-ver-todos" type="button" onClick={() => desplegar(g.id)}>
                      <span className="rp-precio" style={{ fontSize: 44 }}>{lista.length}</span>
                      <span className="rp-eyebrow">Ver todos</span>
                      <span className="rp-nude" style={{ fontSize: 12 }}>{g.nombre}</span>
                    </button>
                  )}
                </div>
              )}
              {!entero && lista.length > 1 && <p className="rp-desliza">Desliza para ver más →</p>}
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
          <button className="rp-volver rp-ficha-volver" type="button" onClick={cerrar}>← Volver</button>
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
                <div key={b} className="rp-bono-fila">
                  <p className="rp-bono">
                    {b.startsWith("Ahorras") ? (
                      <>
                        <strong className="rp-ahorro">{b.split(" · ")[0]}</strong> {b.split(" · ").slice(1).join(" · ")}
                      </>
                    ) : (
                      b
                    )}
                  </p>
                  <a
                    className="rp-leer"
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, me interesa el bono «${b}» de ${t.nombre}. ¿Me dais más información?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lo quiero
                  </a>
                </div>
              ))}
              <p className="rp-nude" style={{ fontSize: 12 }}>
                Los bonos se piden por WhatsApp y se pagan en el centro. La primera sesión del bono la puedes reservar aquí arriba.
              </p>
            </div>
          )}

          {t.texto && (
            <div style={{ display: "grid", gap: 10 }}>
              <p className="rp-eyebrow">En detalle</p>
              <div className="rp-descripcion">{t.texto}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="rp-btn" href={wa} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp className="w-4 h-4" /> Preguntar por WhatsApp
            </a>
            <button className="rp-volver" type="button" onClick={cerrar}>← Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
}
