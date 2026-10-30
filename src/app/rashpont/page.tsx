import { IntroOro } from "./_componentes/intro-oro";
import { Sello, IconoGotero, IconoTijeras } from "./_componentes/marca";
import { Cabecera, Pie, Visitanos } from "./_componentes/comunes";
import { NEGOCIOS, RESENAS } from "./_datos/catalogo";

// Portada común de Rash Pont: dos puertas, Estética (ellas) y Barbería (ellos)
export default function RashPont() {
  const resenas = [RESENAS.estetica[0], RESENAS.barberia[0], RESENAS.estetica[1], RESENAS.barberia[1]];
  return (
    <>
      <IntroOro />
      <Cabecera
        enlaces={[
          { href: "/rashpont/estetica", texto: "Estética" },
          { href: "/rashpont/barberia", texto: "Barbería" },
          { href: "#visitanos", texto: "Dónde estamos" },
        ]}
      />

      <main>
        {/* Portada */}
        <section className="rp-sec rp-grano" style={{ position: "relative", overflow: "hidden", background: "radial-gradient(ellipse 70% 60% at 50% 30%, #241e16 0%, #0B0B0B 70%)" }}>
          <div className="rp-in" style={{ display: "grid", justifyItems: "center", textAlign: "center", gap: 22 }}>
            <p className="rp-eyebrow rp-sube">Fuengirola · Estética regenerativa y barbería</p>
            <Sello className="rp-sello-grande rp-sube" grosor={2} />
            <h1 className="rp-caps rp-oro rp-oro-vivo rp-sube" style={{ fontSize: "clamp(44px, 11vw, 104px)", marginRight: "-0.28em", "--d": ".1s" } as React.CSSProperties}>
              Rash Pont
            </h1>
            <p className="rp-sube" style={{ fontFamily: "var(--rp-display)", fontStyle: "italic", fontSize: "clamp(19px, 4vw, 26px)", maxWidth: "32ch", "--d": ".2s" } as React.CSSProperties}>
              Un espacio donde la belleza y el bienestar se encuentran.
            </p>
            <div className="rp-raya" />
            <p className="rp-eyebrow rp-nude" style={{ marginBottom: 18 }}>Elige tu espacio</p>

            <div className="rp-puertas">
              <a className="rp-puerta rp-sube" href="/rashpont/estetica" style={{ "--d": ".3s" } as React.CSSProperties}>
                <span className="rp-medal">
                  <span className="rp-ola" />
                  <span className="rp-ola" />
                  <IconoGotero />
                </span>
                <span className="rp-eyebrow rp-nude">{NEGOCIOS.estetica.para}</span>
                <span className="rp-puerta-nombre rp-oro">Estética</span>
                <span className="rp-puerta-sub">Regenerativa, facial, corporal y spa · con Raquel</span>
                <span className="rp-entrar">Entrar</span>
              </a>
              <a className="rp-puerta rp-sube" href="/rashpont/barberia" style={{ "--d": ".45s" } as React.CSSProperties}>
                <span className="rp-medal">
                  <IconoTijeras animada />
                </span>
                <span className="rp-eyebrow rp-nude">{NEGOCIOS.barberia.para}</span>
                <span className="rp-puerta-nombre rp-oro">Barbería</span>
                <span className="rp-puerta-sub">Corte, barba y rituales · con Andrés</span>
                <span className="rp-entrar">Entrar</span>
              </a>
            </div>
          </div>
        </section>

        {/* La casa */}
        <section className="rp-sec" style={{ borderTop: "1px solid rgba(201,169,110,.12)" }}>
          <div className="rp-in" style={{ display: "grid", gap: 48, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", alignItems: "center" }}>
            <div style={{ display: "grid", gap: 18 }}>
              <p className="rp-eyebrow">La casa</p>
              <h2 className="rp-titulo" style={{ fontSize: "clamp(34px, 6vw, 56px)" }}>
                Belleza que se nota.<br />
                <em className="rp-oro">Bienestar que se siente.</em>
              </h2>
              <p className="rp-texto" style={{ maxWidth: "58ch" }}>
                En Rash Pont la estética regenerativa estimula la reparación natural de tu piel para resultados armoniosos y
                duraderos, sin quirófano ni rellenos artificiales. Al lado, una barbería de caballero clásica y moderna, con
                rituales de barba a toalla caliente.
              </p>
              <p className="rp-texto" style={{ maxWidth: "58ch" }}>
                La primera consulta de estética es gratis y sin compromiso: te conocemos, valoramos tu caso y te proponemos un
                plan a tu medida.
              </p>
            </div>
            <dl style={{ display: "grid", gap: 1, background: "rgba(201,169,110,.18)", border: "1px solid rgba(201,169,110,.18)" }}>
              {[
                ["5,0", "en Booksy, con 14 reseñas de cinco estrellas"],
                ["Gratis", "primera valoración de estética, sin compromiso"],
                ["Phoenix · Bellaction", "aparatología de última generación"],
                ["Germaine de Capuccini", "cosmética profesional de alta gama"],
              ].map(([d, t]) => (
                <div key={d} style={{ background: "#0e0d0b", padding: "22px 24px", display: "grid", gap: 4 }}>
                  <dt className="rp-oro" style={{ fontFamily: "var(--rp-display)", fontSize: 30, lineHeight: 1.1 }}>{d}</dt>
                  <dd className="rp-nude" style={{ fontSize: 13 }}>{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Reseñas */}
        <section className="rp-sec" style={{ background: "#0e0d0b" }}>
          <div className="rp-in" style={{ display: "grid", gap: 36 }}>
            <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
              <p className="rp-eyebrow">Lo que dicen</p>
              <h2 className="rp-titulo" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>No es solo una cita</h2>
            </div>
            <div className="rp-resenas">
              {resenas.map((r) => (
                <figure key={r.nombre} className="rp-resena">
                  <span className="rp-estrellas" aria-label="5 estrellas">★★★★★</span>
                  <blockquote>«{r.texto}»</blockquote>
                  <figcaption className="rp-nude" style={{ fontSize: 12 }}>
                    {r.nombre} · {r.servicio}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <Visitanos />
      </main>

      <Pie />
    </>
  );
}
