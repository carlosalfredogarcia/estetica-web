"use client";

import { useEffect, useRef, useState } from "react";

// Intro de cine «Oro líquido»: una gota de sérum (ellas), un corte de tijera (ellos)
// y el polvo dorado que se une en el sello. Sale la primera vez de cada visita
// (o siempre con ?intro=oro) y se puede saltar.
export function IntroOro() {
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
      <div className="rpi-vineta" />
      <div className="rpi-grano" />
      <div className="rpi-barra arriba" />
      <div className="rpi-barra abajo" />
      <div className="rpi-destello" data-r="destello" />

      <div className="rpi-rotulo" data-r="rotulo">
        <small>Rash Pont presenta</small>
        <span>una historia de belleza y bienestar</span>
      </div>

      <svg className="rpi-gotero" data-r="gotero" viewBox="0 0 60 200">
        <defs>
          <linearGradient id="rpiSerum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0DDB2" />
            <stop offset="1" stopColor="#A8874F" />
          </linearGradient>
        </defs>
        <path className="vidrio pera" d="M18 50 V16 a12 12 0 0 1 24 0 V50 Z" />
        <rect className="vidrio" x="13" y="50" width="34" height="11" rx="2" />
        <path className="serum" d="M26.5 118 H33.5 V172 L30 186 L26.5 172 Z" />
        <path className="vidrio" d="M24 61 V172 L30 192 L36 172 V61" />
        <line className="vidrio" x1="27.5" y1="72" x2="27.5" y2="108" style={{ opacity: 0.45 }} />
      </svg>
      <p className="rpi-cap" data-r="capA">Para ellas.<small>Estética regenerativa</small></p>
      <p className="rpi-cap" data-r="capB">Para ellos.<small>Barbería</small></p>

      <div className="rpi-escena" data-r="escena">
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
          <p className="rpi-frase" data-r="frase">No es solo una cita.</p>
        </div>
      </div>

      <canvas data-r="lienzo" />
      <button className="rpi-saltar" type="button" data-r="saltar">Saltar</button>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// La película, en el lienzo y con clases. Devuelve una función para pararla.
function guion(root: HTMLElement, fin: () => void) {
  const $ = <T extends Element = HTMLElement>(r: string) => root.querySelector(`[data-r="${r}"]`) as unknown as T;
  const cv = $<HTMLCanvasElement>("lienzo");
  const ctx = cv.getContext("2d")!;
  const gotero = $("gotero"), sello = $("sello");
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, CX = 0, CY = 0, SY = 0;
  const ORO = (a: number) => `rgba(201,169,110,${a})`, LUZ = (a: number) => `rgba(246,231,196,${a})`;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  type Mota = { x: number; y: number; r: number; vy: number; vx: number; a: number; t: number };
  type Polvo = { sx: number; sy: number; tx: number; ty: number; x: number; y: number; t0: number; dur: number; r: number; a: number };
  const S = {
    motas: [] as Mota[],
    gota: null as null | { x: number; y: number; vy: number; crece: number },
    ondas: [] as { cx: number; cy: number; r: number; max: number; vida: number; espera: number }[],
    salpica: [] as { x: number; y: number; suelo: number; vx: number; vy: number; r: number; vida: number }[],
    hojas: null as null | { abre: number; alfa: number },
    destellos: [] as { x: number; y: number; r: number; vida: number }[],
    corte: null as null | { largo: number; alfa: number },
    polvo: [] as Polvo[],
  };
  type Tween = { o: Record<string, number>; k: string; de: number; a: number; dur: number; t0: number; f: (t: number) => number };
  const tweens: Tween[] = [];
  const tween = (o: Record<string, number>, k: string, a: number, dur: number, f = ease) =>
    tweens.push({ o, k, de: o[k], a, dur, t0: performance.now(), f });

  const mota = (cualquiera: boolean): Mota => ({
    x: Math.random() * W, y: cualquiera ? Math.random() * H : H + 8, r: Math.random() * 1.2 + 0.3,
    vy: -(Math.random() * 0.2 + 0.05), vx: (Math.random() - 0.5) * 0.1, a: Math.random() * 0.4 + 0.1, t: Math.random() * 6,
  });
  function medir() {
    W = cv.clientWidth; H = cv.clientHeight; CX = W / 2; CY = H * 0.46; SY = H * 0.6;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    S.motas = Array.from({ length: Math.round(Math.min(90, (W * H) / 12000)) }, () => mota(true));
  }

  function impacto(x: number, y: number) {
    const R = Math.min(W, H * 1.6) * 0.42;
    for (let i = 0; i < 4; i++) S.ondas.push({ cx: x, cy: y, r: 4, max: R * (1 - i * 0.18), vida: 1, espera: i * 9 });
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6, vel = Math.random() * 5 + 2;
      S.salpica.push({ x, y, suelo: y, vx: Math.cos(a) * vel * 0.7, vy: Math.sin(a) * vel, r: Math.random() * 2 + 0.6, vida: 1 });
    }
    S.destellos.push({ x, y, r: 90, vida: 1 });
  }
  function entranHojas() { S.hojas = { abre: 0, alfa: 0 }; tween(S.hojas, "alfa", 1, 400); tween(S.hojas, "abre", 0.75, 500); }
  function corta(ultimo: boolean) {
    const h = S.hojas!;
    tween(h, "abre", 0.02, 200, (t) => t * t);
    setTimeout(() => {
      S.destellos.push({ x: CX, y: CY, r: 120, vida: 1 });
      if (ultimo) { S.corte = { largo: 0, alfa: 1 }; tween(S.corte, "largo", Math.hypot(W, H), 400, (t) => 1 - Math.pow(1 - t, 3)); tween(h, "alfa", 0, 800); }
      else tween(h, "abre", 0.75, 240);
    }, 210);
  }
  function destinos() {
    const r = sello.getBoundingClientRect(), k = r.width / 260;
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    const o = off.getContext("2d")!;
    o.fillStyle = "#fff"; o.textAlign = "center";
    o.font = `italic 300 ${92 * k}px "Cormorant Garamond", Garamond, serif`;
    if ("letterSpacing" in o) (o as unknown as { letterSpacing: string }).letterSpacing = `${-4 * k}px`;
    o.fillText("rp", r.left + 130 * k, r.top + 160 * k);
    const pts: [number, number][] = [], d = o.getImageData(0, 0, W, H).data, paso = Math.max(2, Math.round(2 * k));
    for (let y = 0; y < H; y += paso) for (let x = 0; x < W; x += paso) if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
    const cx = r.left + 130 * k, cy = r.top + 130 * k, rr = 120 * k;
    for (let i = 0; i < 220; i++) { const a = (i / 220) * Math.PI * 2; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    return pts;
  }
  function junta() {
    const pts = destinos(), R = Math.min(W, H * 1.6) * 0.42, ahora = performance.now();
    S.polvo = pts.map(([tx, ty], i) => {
      let sx: number, sy: number;
      if (i % 2) { const a = Math.random() * Math.PI * 2; sx = CX + Math.cos(a) * R * (0.6 + Math.random() * 0.5); sy = SY + Math.sin(a) * R * 0.3 * (0.6 + Math.random() * 0.5); }
      else { const t = (Math.random() - 0.5) * Math.hypot(W, H) * 0.8, ang = (-8 * Math.PI) / 180; sx = CX + Math.cos(ang) * t; sy = CY + Math.sin(ang) * t + (Math.random() - 0.5) * 20; }
      return { sx, sy, tx, ty, x: sx, y: sy, t0: ahora + Math.random() * 300, dur: 1000 + Math.random() * 300, r: Math.random() * 0.9 + 0.7, a: 1 };
    });
  }

  let raf = 0;
  function cuadro(ahora: number) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const w = tweens[i], p = Math.min(1, (ahora - w.t0) / w.dur);
      w.o[w.k] = w.de + (w.a - w.de) * w.f(p);
      if (p >= 1) tweens.splice(i, 1);
    }
    ctx.clearRect(0, 0, W, H);
    for (const m of S.motas) {
      m.x += m.vx; m.y += m.vy; m.t += 0.02;
      if (m.y < -8) Object.assign(m, mota(false));
      ctx.fillStyle = `rgba(232,208,160,${m.a * (0.6 + 0.4 * Math.sin(m.t))})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "lighter";
    const g0 = S.gota;
    if (g0) {
      if (g0.crece < 1) {
        g0.crece = Math.min(1, g0.crece + 0.04);
        const rr = 5.5 * g0.crece, g = ctx.createRadialGradient(g0.x - 1, g0.y + rr - 1, 0, g0.x, g0.y + rr, rr * 2);
        g.addColorStop(0, LUZ(1)); g.addColorStop(0.5, ORO(0.9)); g.addColorStop(1, ORO(0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(g0.x, g0.y + rr, rr * 2, 0, 7); ctx.fill();
        if (g0.crece >= 1) g0.y += 5.5;
      } else {
        g0.vy += 0.55; g0.y += g0.vy;
        const estira = Math.min(26, 6 + g0.vy * 1.1);
        const g = ctx.createRadialGradient(g0.x - 2, g0.y - 2, 0, g0.x, g0.y, estira);
        g.addColorStop(0, LUZ(1)); g.addColorStop(0.5, ORO(0.95)); g.addColorStop(1, ORO(0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(g0.x, g0.y - estira * 0.4, 6, estira, 0, 0, 7); ctx.fill();
        if (g0.y >= SY) { S.gota = null; impacto(g0.x, SY); }
      }
    }
    S.ondas = S.ondas.filter((o) => o.vida > 0);
    for (const o of S.ondas) {
      if (o.espera > 0) { o.espera--; continue; }
      o.r += (o.max - o.r) * 0.028; o.vida -= 0.0065;
      ctx.strokeStyle = ORO(Math.max(0, o.vida) * 0.9); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(o.cx, o.cy, o.r, o.r * 0.3, 0, 0, 7); ctx.stroke();
    }
    S.salpica = S.salpica.filter((s) => s.vida > 0);
    for (const s of S.salpica) {
      s.vy += 0.22; s.x += s.vx; s.y += s.vy; s.vida -= 0.018;
      if (s.y > s.suelo && s.vy > 0) s.vida = 0;
      ctx.fillStyle = LUZ(Math.max(0, s.vida)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    const h = S.hojas;
    if (h && h.alfa > 0.01) {
      const L = Math.min(W, H) * 0.62;
      for (const sg of [1, -1]) {
        ctx.save(); ctx.translate(CX, CY); ctx.rotate(-Math.PI / 2 + (sg * h.abre) / 2);
        const g = ctx.createLinearGradient(-L * 0.2, 0, L * 0.6, 0);
        g.addColorStop(0, ORO(0)); g.addColorStop(0.25, ORO(0.9 * h.alfa)); g.addColorStop(0.8, LUZ(h.alfa)); g.addColorStop(1, LUZ(0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(-L * 0.16, -1.5); ctx.lineTo(0, -3.5); ctx.lineTo(L * 0.6, 0); ctx.lineTo(0, 3.5); ctx.lineTo(-L * 0.16, 1.5); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = ORO(0.85 * h.alfa); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(-L * 0.16 - 16, 0, 15, 0, 7); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = LUZ(h.alfa); ctx.beginPath(); ctx.arc(CX, CY, 2.6, 0, 7); ctx.fill();
    }
    const c = S.corte;
    if (c) {
      c.alfa -= 0.012;
      if (c.alfa <= 0) S.corte = null;
      else {
        const ang = (-8 * Math.PI) / 180, dx = (Math.cos(ang) * c.largo) / 2, dy = (Math.sin(ang) * c.largo) / 2;
        ctx.save(); ctx.shadowColor = LUZ(1); ctx.shadowBlur = 24; ctx.strokeStyle = LUZ(c.alfa); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(CX - dx, CY - dy); ctx.lineTo(CX + dx, CY + dy); ctx.stroke(); ctx.restore();
      }
    }
    S.destellos = S.destellos.filter((f) => f.vida > 0);
    for (const f of S.destellos) {
      f.vida -= 0.03;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1.4 - f.vida * 0.4));
      g.addColorStop(0, LUZ(f.vida * 0.9)); g.addColorStop(1, LUZ(0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 1.4, 0, 7); ctx.fill();
    }
    for (const p of S.polvo) {
      const k = Math.max(0, Math.min(1, (ahora - p.t0) / p.dur)), e = ease(k), giro = Math.sin(k * Math.PI) * 40;
      p.x = p.sx + (p.tx - p.sx) * e + Math.cos(p.t0) * giro;
      p.y = p.sy + (p.ty - p.sy) * e + Math.sin(p.t0) * giro;
      ctx.fillStyle = k >= 1 ? ORO(p.a * 0.9) : LUZ(p.a * 0.8);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(cuadro);
  }

  // ── El guion ──
  let vivo = true;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const espera = (ms: number) => new Promise<void>((ok, ko) => timers.push(setTimeout(() => (vivo ? ok() : ko()), ms)));
  const on = (r: string, c = "on") => $(r).classList.add(c);
  const off = (r: string, c = "on") => $(r).classList.remove(c);

  async function rodar() {
    try { await document.fonts.load('italic 300 92px "Cormorant Garamond"'); } catch {}
    try {
      await espera(300); on("rotulo");
      await espera(1200); off("rotulo");
      await espera(300); on("gotero");
      await espera(1100); on("gotero", "aprieta");
      const r = gotero.getBoundingClientRect();
      S.gota = { x: r.left + r.width / 2, y: r.top + (r.height * 192) / 200, vy: 0, crece: 0 };
      await espera(900); on("capA"); on("gotero", "sube");
      await espera(1000); off("capA");
      await espera(200); entranHojas();
      await espera(550); corta(false);
      await espera(450); corta(true);
      await espera(300); on("capB");
      await espera(1000); off("capB");
      await espera(200); on("escena"); junta(); on("sello", "dibuja");
      await espera(1500); on("sello", "mono-on"); S.polvo.forEach((p) => tween(p as unknown as Record<string, number>, "a", 0, 900)); on("destello", "go");
      await espera(200); on("nombre");
      await espera(600); on("nombre", "brilla");
      await espera(200); on("raya");
      await espera(300); on("lema");
      await espera(500); on("frase");
      await espera(1500); fin();
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
