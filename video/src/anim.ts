import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timeline";

export const EO = Easing.bezier(0.16, 1, 0.3, 1); // sale rápido, llega suave
export const EIO = Easing.bezier(0.65, 0, 0.35, 1); // arranca y frena suave

export const e = (t: number, a: number, b: number, ez = EIO) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ez,
  });

export const S = (frame: number, at: number, cfg = { damping: 14, stiffness: 160 }) =>
  spring({ frame: frame - Math.round(at * FPS), fps: FPS, config: cfg });
