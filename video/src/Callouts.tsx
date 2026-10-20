import { useCurrentFrame } from "remotion";
import { e, EIO, EO, S } from "./anim";
import { C, FONT, SCREEN_H, SCREEN_W } from "./theme";
import { EDIT, FPS, srcToOut } from "./timeline";

// Rótulos de datos (porcentajes, importes) que la voz no dice con cifras.
// Llegan con muelle y una onda; se van encogiendo con curva.
export const Callouts = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <>
      {EDIT.callouts.map((c, i) => {
        const at = srcToOut(c.at);
        const until = srcToOut(c.until);
        if (at === null || until === null || t < at - 0.1 || t > until + 0.1) return null;
        const inn = S(frame, at, { damping: 11, stiffness: 170 });
        const out = e(t, until - 0.35, until, EIO);
        const ring = e(t, at, at + 0.6, EO);
        const color = c.tone === "good" ? C.green : C.red;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x * SCREEN_W,
              top: c.y * SCREEN_H,
              transform: `translate(-50%, -50%) scale(${inn * (1 - out)}) rotate(${(1 - inn) * -8}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 260,
                height: 260,
                marginLeft: -130,
                marginTop: -130,
                borderRadius: 130,
                border: `6px solid ${color}`,
                transform: `scale(${0.4 + ring * 1.1})`,
                opacity: 1 - ring,
              }}
            />
            <div
              style={{
                position: "relative",
                background: color,
                color: C.bg,
                borderRadius: 34,
                padding: "16px 30px 18px",
                fontFamily: FONT,
                textAlign: "center",
                boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2, whiteSpace: "nowrap" }}>{c.text}</div>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{c.label}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
