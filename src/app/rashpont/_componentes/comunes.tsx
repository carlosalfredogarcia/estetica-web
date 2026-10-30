import { Sello, IconoWhatsApp } from "./marca";
import { DIRECCION, MAPA, INSTAGRAM, NEGOCIOS } from "../_datos/catalogo";

export function Cabecera({ enlaces, accion }: { enlaces: { href: string; texto: string }[]; accion?: React.ReactNode }) {
  return (
    <header className="rp-cab">
      <div className="rp-cab-in">
        <a href="/rashpont" style={{ display: "flex", alignItems: "center", gap: 12 }} aria-label="Rash Pont, portada">
          <Sello className="rp-sello-mini" />
          <span className="rp-caps rp-oro" style={{ fontSize: 17, letterSpacing: ".3em" }}>Rash Pont</span>
        </a>
        <nav aria-label="Secciones">
          {enlaces.map((e) => (
            <a key={e.href} href={e.href}>{e.texto}</a>
          ))}
        </nav>
        {accion}
      </div>
    </header>
  );
}

export function Visitanos() {
  const fmt = (n: string) => n.replace(/^34(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
  return (
    <section id="visitanos" className="rp-sec" style={{ borderTop: "1px solid rgba(201,169,110,.12)" }}>
      <div className="rp-in" style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <p className="rp-eyebrow">Visítanos</p>
          <h2 className="rp-titulo" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>En el centro de Fuengirola</h2>
          <p className="rp-texto">{DIRECCION}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="rp-btn rp-btn-sm" href={MAPA} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            <a className="rp-btn rp-btn-sm" href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a>
          </div>
        </div>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <p className="rp-eyebrow">Horario</p>
          <dl style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid rgba(201,169,110,.14)", paddingBottom: 8 }}>
              <dt>Lunes a sábado</dt>
              <dd className="rp-oro" style={{ fontVariantNumeric: "tabular-nums" }}>10:00 – 21:00</dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <dt>Domingo</dt>
              <dd className="rp-nude">Cerrado</dd>
            </div>
          </dl>
        </div>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <p className="rp-eyebrow">WhatsApp</p>
          {(["estetica", "barberia"] as const).map((p) => (
            <a
              key={p}
              href={`https://wa.me/${NEGOCIOS[p].whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(201,169,110,.14)" }}
            >
              <IconoWhatsApp className="w-5 h-5 text-[var(--rp-gold)]" />
              <span style={{ display: "grid" }}>
                <span>{NEGOCIOS[p].titulo} · {NEGOCIOS[p].persona}</span>
                <span className="rp-nude" style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmt(NEGOCIOS[p].whatsapp)}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="rp-sec" style={{ paddingBlock: 40, borderTop: "1px solid rgba(201,169,110,.12)" }}>
      <div className="rp-in" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
        <span className="rp-nude">© Rash Pont S.L. · Fuengirola</span>
        <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <a className="rp-nude" href="/rashpont/estetica">Estética</a>
          <a className="rp-nude" href="/rashpont/barberia">Barbería</a>
          <a className="rp-nude" href="/rashpont?intro=sello">Intro sello</a>
          <a className="rp-nude" href="/rashpont?intro=oro">Intro oro</a>
          <a className="rp-nude" href="/panel">Acceso profesionales</a>
        </span>
      </div>
    </footer>
  );
}
