import { Composition } from "remotion";
import { MiFinanzas } from "./MiFinanzas";
import { FPS, TOTAL } from "./timeline";

export const Root = () => (
  <Composition
    id="MiFinanzas"
    component={MiFinanzas}
    durationInFrames={Math.round(TOTAL * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
