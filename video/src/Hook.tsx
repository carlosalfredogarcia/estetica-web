import { useCurrentFrame } from "remotion";
import { e, EIO, S } from "./anim";
import { C, FONT } from "./theme";
import { EDIT, FPS } from "./timeline";

// Gancho: cada línea sube desde detrás de una máscara y se va hacia arriba al acabar.
export const Hook = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const out = e(t, EDIT.hookDur - 0.6, EDIT.hookDur - 0.15, EIO);
  if (out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 300, fontFamily: FONT, fontWeight: 800 }}>
      {EDIT.hook.map((line, i) => {
        const inn = S(frame, 0.08 + i * 0.22, { damping: 18, stiffness: 140 });
        const y = (1 - inn) * 110 - out * 130;
        return (
          <div key={i} style={{ overflow: "hidden", height: 92, marginBottom: 4 }}>
            <div
              style={{
                transform: `translateY(${y}px)`,
                fontSize: 74,
                lineHeight: "92px",
                letterSpacing: -1.5,
                textAlign: "center",
                color: i === EDIT.hookAccent ? C.green : C.white,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
