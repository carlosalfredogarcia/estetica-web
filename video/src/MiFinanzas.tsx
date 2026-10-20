import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { e, EO, S } from "./anim";
import { Callouts } from "./Callouts";
import { Hook } from "./Hook";
import { Phone } from "./Phone";
import { Screen } from "./Screen";
import { Spotlight } from "./Spotlight";
import { Subs } from "./Subs";
import { YearTotals } from "./YearTotals";
import { C, PHONE_X, PHONE_Y } from "./theme";
import { DURS, EDIT, FPS, STARTS, TRAMOS } from "./timeline";

// Fondo quieto: oscuro como la app, con un halo verde detrás del teléfono.
const Fondo = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 45% at 50% 52%, rgba(184,243,107,0.16) 0%, rgba(63,211,182,0.06) 45%, ${C.bg} 75%)`,
      backgroundColor: C.bg,
    }}
  />
);

export const MiFinanzas = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Durante el gancho el teléfono espera abajo, más pequeño; luego sube a su sitio.
  const rise = S(frame, 0, { damping: 20, stiffness: 120 });
  const settle = e(t, EDIT.hookDur - 0.3, EDIT.hookDur + 0.5, EO);
  const y = (1 - rise) * 900 + (1 - settle) * 470;
  const scale = 0.78 + settle * 0.22;
  return (
    <AbsoluteFill>
      <Fondo />
      <div
        style={{
          position: "absolute",
          left: PHONE_X,
          top: PHONE_Y,
          transformOrigin: "50% 0%",
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        <Phone>
          {TRAMOS.map((tr, i) => (
            <Sequence
              key={tr.id}
              from={Math.round(STARTS[i] * FPS)}
              durationInFrames={Math.round(DURS[i] * FPS)}
              premountFor={FPS}
            >
              <Screen from={tr.from} />
            </Sequence>
          ))}
          <AbsoluteFill>
            <Spotlight />
            <Callouts />
            <YearTotals />
          </AbsoluteFill>
        </Phone>
      </div>
      <Hook />
      <Subs />
    </AbsoluteFill>
  );
};
