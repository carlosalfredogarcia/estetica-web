import { OffthreadVideo, staticFile } from "remotion";
import { EDIT, FPS } from "./timeline";
import { SCREEN_H, SCREEN_W } from "./theme";

export const Screen = ({ from }: { from: number }) => (
  <OffthreadVideo
    src={staticFile(EDIT.source)}
    trimBefore={Math.round(from * FPS)}
    style={{ width: SCREEN_W, height: SCREEN_H }}
  />
);
