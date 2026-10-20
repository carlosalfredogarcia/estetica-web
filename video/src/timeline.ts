import edit from "../data/edit.json";

export const FPS = 30;

export type Word = { text: string; start: number; end: number };
export type Tramo = { id: string; from: number; to: number; mode: string };
export type Spot = { at: number; until: number; x: number; y: number; w: number; h: number };
export type Callout = {
  at: number;
  until: number;
  text: string;
  label: string;
  x: number;
  y: number;
  tone: "good" | "bad";
};

export const EDIT = edit as {
  source: string;
  sourceDur: number;
  hook: string[];
  hookAccent: number;
  hookDur: number;
  tramos: Tramo[];
  words: Word[];
  spots: Spot[];
  callouts: Callout[];
};

// Los focos, rótulos y palabras van en segundos de la grabación original.
// Los tramos dicen qué trozos de la grabación entran y en qué orden.
export const TRAMOS = EDIT.tramos;
export const DURS = TRAMOS.map((t) => t.to - t.from);
export const STARTS = DURS.map((_, i) => DURS.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL = DURS.reduce((a, b) => a + b, 0);

// Segundo de la grabación → segundo del vídeo montado (null si se ha cortado).
export const srcToOut = (t: number): number | null => {
  for (let i = 0; i < TRAMOS.length; i++) {
    if (t >= TRAMOS[i].from && t <= TRAMOS[i].to) return STARTS[i] + t - TRAMOS[i].from;
  }
  return null;
};

// Segundo del vídeo montado → segundo de la grabación.
export const outToSrc = (t: number): number => {
  for (let i = TRAMOS.length - 1; i >= 0; i--) {
    if (t >= STARTS[i]) return TRAMOS[i].from + Math.min(t - STARTS[i], DURS[i]);
  }
  return TRAMOS[0].from;
};
