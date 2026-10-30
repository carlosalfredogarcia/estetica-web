"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Booking } from "@/components/booking";
import { fijarSalon } from "@/components/negocio";
import { Catalogo } from "./catalogo";
import { Cabecera, Pie, Visitanos } from "./comunes";
import { IconoGotero, IconoTijeras, IconoWhatsApp } from "./marca";
import { GRUPOS, HORARIO, INSTAGRAM, NEGOCIOS, RESENAS, nombreReserva, type Parte, type Tratamiento } from "../_datos/catalogo";

// Lo que la agenda necesita: una línea por cada opción que se puede reservar
function servicios(parte: Parte, tratamientos: Tratamiento[]) {
  return tratamientos.flatMap((t) =>
    t.variantes.map((va) => ({
      cat: GRUPOS[parte].find((g) => g.id === t.grupo)?.nombre ?? t.grupo,
      name: nombreReserva(t, va),
      price: va.precio.replace(/desde\s*/i, "desde "),
      icon: "",
      dur: `${va.min} min`,
      desc: t.resumen,
      img: t.img.includes("/") ? t.img : undefined,
    }))
  );
}

// Abre la ventana de reserva sin tratamiento elegido (desde la cabecera o la portada)
const abrirReserva = () => window.dispatchEvent(new Event("rashpont:reservar"));

// La agenda de siempre, en una ventana negra y dorada encima de la página.
// Se abre al pulsar «Reservar» (con el tratamiento ya elegido) y al cerrarla sigues donde estabas.
function VentanaReserva({ titulo }: { titulo: string }) {
  const [abierta, setAbierta] = useState(false);
  useEffect(() => {
    const abrir = () => setAbierta(true);
    addEventListener("estetica:select-service", abrir);
    addEventListener("rashpont:reservar", abrir);
    return () => {
      removeEventListener("estetica:select-service", abrir);
      removeEventListener("rashpont:reservar", abrir);
    };
  }, []);
  useEffect(() => {
    if (!abierta) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(false);
    addEventListener("keydown", tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [abierta]);

  return (
    <div className="rp-reserva-fondo" hidden={!abierta} onClick={() => setAbierta(false)}>
      <div className="rp-reserva" role="dialog" aria-modal="true" aria-label={`Reservar · ${titulo}`} onClick={(e) => e.stopPropagation()}>
        <div className="rp-reserva-cab">
          <button className="rp-volver" type="button" onClick={() => setAbierta(false)}>← Volver</button>
          <span className="rp-eyebrow" style={{ minWidth: 0, textAlign: "center" }}>Reservar · {titulo}</span>
          <button className="rp-ficha-cerrar" style={{ position: "static" }} type="button" onClick={() => setAbierta(false)} aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rp-reserva-in">
          <Booking enVentana />
        </div>
      </div>
    </div>
  );
}

export function ParteWeb({ parte, tratamientos }: { parte: Parte; tratamientos: Tratamiento[] }) {
  const n = NEGOCIOS[parte];
  const otra = parte === "estetica" ? "barberia" : "estetica";
  const estetica = parte === "estetica";

  // La agenda y el panel son los de siempre, con el negocio de esta parte
  fijarSalon(n.slug, {
    negocio: { nombre: n.nombre, ciudad: "Fuengirola", whatsapp: n.whatsapp, instagram: INSTAGRAM },
    servicios: servicios(parte, tratamientos),
    horario: HORARIO,
    confirmarAuto: true,
    intervalo: 30,
  });

  const wa = `https://wa.me/${n.whatsapp}`;

  return (
    <>
      <Cabecera
        enlaces={[
          { href: "#tratamientos", texto: estetica ? "Tratamientos" : "Servicios" },
          { href: "#opiniones", texto: "Opiniones" },
          { href: `/rashpont/${otra}`, texto: otra === "barberia" ? "Barbería" : "Estética" },
        ]}
        accion={
          <button className="rp-btn rp-btn-sm rp-btn-oro" type="button" onClick={abrirReserva}>Reservar</button>
        }
      />

      <main>
        {/* Portada de la parte */}
        <section
          className="rp-sec rp-grano"
          style={{
            position: "relative", overflow: "hidden",
            background: estetica
              ? "linear-gradient(90deg, #0B0B0B 30%, rgba(11,11,11,.55) 70%, rgba(11,11,11,.2)), url(/images/rashpont/facial.webp) center right / cover no-repeat"
              : "radial-gradient(ellipse 60% 80% at 80% 40%, #2a2219 0%, #0B0B0B 65%)",
          }}
        >
          <div className="rp-in" style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", alignItems: "center", minHeight: "min(70vh, 640px)" }}>
            <div style={{ display: "grid", gap: 20, alignContent: "center" }}>
              <p className="rp-eyebrow rp-sube">Rash Pont · {n.para}</p>
              <h1 className="rp-titulo rp-sube" style={{ fontSize: "clamp(44px, 9vw, 92px)", "--d": ".1s" } as React.CSSProperties}>
                <span className="rp-oro rp-oro-vivo">{n.titulo}</span>
              </h1>
              <p className="rp-texto rp-sube" style={{ maxWidth: "48ch", fontSize: 16, "--d": ".2s" } as React.CSSProperties}>{n.lema}</p>
              <p className="rp-sube" style={{ fontFamily: "var(--rp-display)", fontStyle: "italic", fontSize: 22, "--d": ".25s" } as React.CSSProperties}>
                Con {n.persona}
                {estetica && <span className="rp-nude" style={{ fontFamily: "var(--rp-label)", fontStyle: "normal", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", marginLeft: 14 }}>Primera valoración gratis</span>}
              </p>
              <div className="rp-sube" style={{ display: "flex", gap: 12, flexWrap: "wrap", "--d": ".3s" } as React.CSSProperties}>
                <button className="rp-btn rp-btn-oro" type="button" onClick={abrirReserva}>Reservar cita</button>
                <a className="rp-btn" href={wa} target="_blank" rel="noopener noreferrer">
                  <IconoWhatsApp className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
            {!estetica && (
              <div style={{ display: "grid", placeItems: "center" }}>
                <span className="rp-medal" style={{ width: "min(70vw, 340px)" }}>
                  <IconoTijeras />
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Tratamientos */}
        <section id="tratamientos" className="rp-sec" style={{ scrollMarginTop: 60 }}>
          <div className="rp-in" style={{ display: "grid", gap: 32, gridTemplateColumns: "minmax(0, 1fr)" }}>
            <div style={{ display: "grid", gap: 12 }}>
              <p className="rp-eyebrow">{estetica ? "Tratamientos" : "Servicios"}</p>
              <h2 className="rp-titulo" style={{ fontSize: "clamp(34px, 6vw, 58px)" }}>
                {estetica ? "Encuentra tu tratamiento" : "Tu estilo, al detalle"}
              </h2>
              <p className="rp-texto" style={{ maxWidth: "60ch" }}>
                {estetica
                  ? "Busca lo que quieres mejorar o elige un grupo. Pulsa cualquier tratamiento para ver en qué consiste, sus opciones y sus bonos."
                  : "Cortes, rituales de barba, color y detalles. Pulsa un servicio para ver en qué consiste y reservarlo."}
              </p>
            </div>
            <Catalogo
              tratamientos={tratamientos}
              grupos={GRUPOS[parte]}
              whatsapp={n.whatsapp}
              palabra={estetica ? "tratamientos" : "servicios"}
            />
          </div>
        </section>


        {/* Opiniones */}
        <section id="opiniones" className="rp-sec" style={{ background: "#0e0d0b" }}>
          <div className="rp-in" style={{ display: "grid", gap: 36 }}>
            <div style={{ display: "grid", gap: 12, justifyItems: "center", textAlign: "center" }}>
              <p className="rp-eyebrow">5,0 en Booksy</p>
              <h2 className="rp-titulo" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>Lo que dicen de {n.persona}</h2>
            </div>
            <div className="rp-resenas">
              {RESENAS[parte].map((r) => (
                <figure key={r.nombre} className="rp-resena">
                  <span className="rp-estrellas" aria-label="5 estrellas">★★★★★</span>
                  <blockquote>«{r.texto}»</blockquote>
                  <figcaption className="rp-nude" style={{ fontSize: 12 }}>{r.nombre} · {r.servicio}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* La otra puerta */}
        <section className="rp-sec" style={{ paddingBlock: 56, borderTop: "1px solid rgba(201,169,110,.12)" }}>
          <a href={`/rashpont/${otra}`} className="rp-in rp-puerta" style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", flexWrap: "wrap", textAlign: "left" }}>
            <span className="rp-medal" style={{ width: 96 }}>
              {otra === "barberia" ? <IconoTijeras animada /> : <><span className="rp-ola" /><span className="rp-ola" /><IconoGotero /></>}
            </span>
            <span style={{ display: "grid", gap: 6 }}>
              <span className="rp-eyebrow rp-nude">{NEGOCIOS[otra].para} · en el mismo local</span>
              <span className="rp-puerta-nombre rp-oro" style={{ fontSize: "clamp(24px, 5vw, 34px)" }}>{NEGOCIOS[otra].titulo}</span>
              <span className="rp-entrar">Entrar</span>
            </span>
          </a>
        </section>

        <Visitanos />
      </main>

      <Pie />
      <VentanaReserva titulo={n.titulo} />
      <a className="rp-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp de ${n.titulo}`}>
        <IconoWhatsApp className="w-6 h-6" />
      </a>
    </>
  );
}
