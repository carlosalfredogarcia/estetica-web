import { useCurrentFrame } from "remotion";
import { e, EIO, S } from "./anim";
import { C, SCREEN_H, SCREEN_W } from "./theme";
import { EDIT, FPS, srcToOut } from "./timeline";

// Foco: oscurece la pantalla salvo la zona de la que se habla y la enmarca.
// La UI ocupa todo el ancho, así que un zoom recortaría los lados.
export const Spotlight = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <>
      {EDIT.spots.map((s, i) => {
        const at = srcToOut(s.at);
        const until = srcToOut(s.until);
        if (at === null || until === null) return null;
        const k = e(t, at, at + 0.5, EIO) * (1 - e(t, until - 0.5, until, EIO));
        if (k <= 0) return null;
        const pop = S(frame, at + 0.15, { damping: 12, stiffness: 180 });
        const grow = (1 - pop) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x * SCREEN_W - grow,
              top: s.y * SCREEN_H - grow,
              width: s.w * SCREEN_W + grow * 2,
              height: s.h * SCREEN_H + grow * 2,
              borderRadius: 30,
              border: `4px solid rgba(184,243,107,${0.9 * k})`,
              boxShadow: `0 0 0 3000px rgba(0,0,0,${0.62 * k}), 0 0 40px rgba(184,243,107,${0.35 * k})`,
              color: C.green,
            }}
          />
        );
      })}
    </>
  );
};
