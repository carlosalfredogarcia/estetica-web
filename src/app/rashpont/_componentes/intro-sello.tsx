"use client";

import { useEffect, useRef, useState } from "react";

// Intro de cine «Sello dorado» (la primera propuesta, en versión rápida): se dibuja el sello,
// aparece RASH PONT letra a letra y las frases de su reel hasta «No es solo una cita».
// Sale la primera vez de cada visita (o siempre con ?intro=…) y se puede saltar.
export function IntroSello() {
  const raiz = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"espera" | "juega" | "fuera" | "nada">("espera");

  useEffect(() => {
    let visto = false;
    try {
      visto = sessionStorage.getItem("rp-intro") === "1";
      sessionStorage.setItem("rp-intro", "1");
    } catch {}
    const forzar = new URLSearchParams(location.search).has("intro");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setEstado((visto && !forzar) || reduce ? "nada" : "juega"), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (estado !== "juega" || !raiz.current) return;
    return guion(raiz.current, () => setEstado("fuera"));
  }, [estado]);

  useEffect(() => {
    if (estado !== "fuera") return;
    const t = setTimeout(() => setEstado("nada"), 1200);
    return () => clearTimeout(t);
  }, [estado]);

  if (estado === "nada") return null;

  return (
    <div ref={raiz} className={`rpi ${estado === "fuera" ? "fuera" : ""}`} aria-hidden="true">
      <canvas data-r="lienzo" />
      <div className="rpi-vineta" />
      <div className="rpi-grano" />
      <div className="rpi-barra arriba" />
      <div className="rpi-barra abajo" />
      <div className="rpi-destello" data-r="destello" />

      <div className="rpi-escena" data-r="logo">
        <div className="rpi-logo">
          <svg className="rpi-sello" data-r="sello" viewBox="0 0 260 260">
            <defs>
              <linearGradient id="rpiOro" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#A8874F" />
                <stop offset=".5" stopColor="#F0DDB2" />
                <stop offset="1" stopColor="#A8874F" />
              </linearGradient>
            </defs>
            <circle className="aro2" cx="130" cy="130" r="128" />
            <circle className="aro" cx="130" cy="130" r="120" />
            <text className="mono" x="130" y="160" textAnchor="middle">rp</text>
          </svg>
          <p className="rpi-nombre" data-r="nombre">
            {"RASH PONT".split("").map((c, i) => (
              <span key={i} className="rp-oro" style={{ "--i": i } as React.CSSProperties}>
                {c === " " ? " " : c}
              </span>
            ))}
          </p>
          <div className="rpi-raya" data-r="raya" />
          <p className="rpi-lema" data-r="lema">Estética regenerativa · Barbería · Spa<br />Fuengirola</p>
        </div>
      </div>

      <div className="rpi-escena" data-r="frases">
        <div className="rpi-versos">
          <p className="rpi-verso">Es amor propio.</p>
          <p className="rpi-verso">Es autocuidado.</p>
          <p className="rpi-verso">Es reconexión.</p>
          <p className="rpi-verso">Es bienestar.</p>
          <div className="rpi-lema-final" data-r="final">
            <span className="caps">No es solo</span>
            <span className="script rp-oro">una cita</span>
          </div>
        </div>
      </div>

      <button className="rpi-saltar" type="button" data-r="saltar">Saltar</button>
    </div>
  );
}

function guion(root: HTMLElement, fin: () => void) {
  const $ = (r: string) => root.querySelector(`[data-r="${r}"]`) as HTMLElement;
  const versos = [...root.querySelectorAll<HTMLElement>(".rpi-verso")];

  // Polvo dorado de fondo
  const cv = $("lienzo") as unknown as HTMLCanvasElement;
  const ctx = cv.getContext("2d")!;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, raf = 0;
  type Mota = { x: number; y: number; r: number; vy: number; vx: number; a: number; t: number };
  let motas: Mota[] = [];
  const mota = (cualquiera: boolean): Mota => ({
    x: Math.random() * W, y: cualquiera ? Math.random() * H : H + 8, r: Math.random() * 1.3 + 0.3,
    vy: -(Math.random() * 0.25 + 0.05), vx: (Math.random() - 0.5) * 0.12, a: Math.random() * 0.5 + 0.15, t: Math.random() * 6,
  });
  function medir() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    motas = Array.from({ length: Math.round(Math.min(110, (W * H) / 9000)) }, () => mota(true));
  }
  let empuje = 0;
  function cuadro() {
    ctx.clearRect(0, 0, W, H);
    for (const m of motas) {
      m.x += m.vx; m.y += m.vy * (1 + empuje * 3); m.t += 0.02;
      if (m.y < -8) Object.assign(m, mota(false));
      ctx.fillStyle = `rgba(232,208,160,${m.a * (0.6 + 0.4 * Math.sin(m.t))})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill();
    }
    empuje *= 0.97;
    raf = requestAnimationFrame(cuadro);
  }

  let vivo = true;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const espera = (ms: number) => new Promise<void>((ok, ko) => timers.push(setTimeout(() => (vivo ? ok() : ko()), ms)));
  const on = (r: string, c = "on") => $(r).classList.add(c);
  const off = (r: string, c = "on") => $(r).classList.remove(c);

  async function rodar() {
    try {
      await espera(200); on("logo");
      await espera(200); on("sello", "dibuja");
      await espera(1100); on("sello", "mono-on");
      await espera(300); on("nombre");
      await espera(600); on("nombre", "brilla"); on("destello", "go"); empuje = 1;
      await espera(300); on("raya");
      await espera(300); on("lema");
      await espera(1200); off("logo"); on("frases");
      await espera(400);
      for (const v of versos) { v.classList.add("on"); await espera(500); }
      versos.forEach((v) => v.classList.add("tenue"));
      on("final"); empuje = 1;
      await espera(1600); fin();
    } catch { /* parada */ }
  }

  medir();
  addEventListener("resize", medir);
  raf = requestAnimationFrame(cuadro);
  const saltar = () => { vivo = false; fin(); };
  $("saltar").addEventListener("click", saltar);
  rodar();

  return () => {
    vivo = false;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    removeEventListener("resize", medir);
    $("saltar")?.removeEventListener("click", saltar);
  };
}
