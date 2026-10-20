import { useCurrentFrame } from "remotion";
import { e, EIO, EO, S } from "./anim";
import { C, FONT, SCREEN_H, SCREEN_W } from "./theme";
import { EDIT, FPS, srcToOut } from "./timeline";

const TOP = 70;
// Distancia hasta la fila de totales de la app (la misma zona que enmarca el foco).
const FROM_Y = 0.236 * SCREEN_H - TOP;

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// Totales del año: se despegan de la pantalla donde los marca el foco y suben
// a quedarse fijados arriba mientras la lista baja.
export const YearTotals = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const at = srcToOut(EDIT.totals.at);
  const until = srcToOut(EDIT.totals.until);
  if (at === null || until === null || t < at - 0.1 || t > until) return null;
  const out = e(t, until - 0.45, until, EIO);
  const gap = 14;
  const w = (SCREEN_W - 40 - gap * 2) / 3;
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: TOP,
        display: "flex",
        gap,
        transform: `translateY(${-out * 240}px)`,
      }}
    >
      {EDIT.totals.items.map((it, i) => {
        const lift = e(t, at + i * 0.06, at + i * 0.06 + 0.7, EO);
        const pop = S(frame, at + i * 0.06 + 0.45, { damping: 10, stiffness: 200 });
        return (
          <div
            key={it.label}
            style={{
              width: w,
              padding: "18px 0 20px",
              borderRadius: 26,
              background: "rgba(20,24,23,0.94)",
              border: `3px solid ${C[it.tone]}`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
              textAlign: "center",
              fontFamily: FONT,
              transform: `translateY(${(1 - lift) * FROM_Y}px) scale(${1 + Math.sin(pop * Math.PI) * 0.06})`,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#9AA3A0", letterSpacing: 2, textTransform: "uppercase" }}>
              {it.label}
            </div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C[it.tone], letterSpacing: -1, marginTop: 4 }}>
              {it.sign}
              {fmt(it.value)}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#7C8582", marginTop: 2 }}>en el año</div>
          </div>
        );
      })}
    </div>
  );
};
