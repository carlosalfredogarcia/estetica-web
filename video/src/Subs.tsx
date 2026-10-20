import { fitText } from "@remotion/layout-utils";
import { useCurrentFrame } from "remotion";
import { S } from "./anim";
import { C, FONT } from "./theme";
import { EDIT, FPS, srcToOut, type Word } from "./timeline";

type Chunk = { words: (Word & { o: number })[]; start: number; end: number };

// Palabras en tiempo del vídeo montado, agrupadas en bloques cortos que cortan en las pausas.
const chunks: Chunk[] = (() => {
  const ws = EDIT.words
    .map((w) => ({ ...w, o: srcToOut(w.start) }))
    .filter((w): w is Word & { o: number } => w.o !== null);
  const out: Chunk[] = [];
  let cur: (Word & { o: number })[] = [];
  ws.forEach((w, i) => {
    const prev = ws[i - 1];
    const gap = prev ? w.start - prev.end : 0;
    const len = cur.map((x) => x.text).join(" ").length;
    if (cur.length && (gap > 0.35 || cur.length >= 4 || len + w.text.length > 22)) {
      out.push({ words: cur, start: cur[0].o, end: 0 });
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) out.push({ words: cur, start: cur[0].o, end: 0 });
  out.forEach((c, i) => {
    const last = c.words[c.words.length - 1];
    const natural = last.o + (last.end - last.start) + 0.3;
    c.end = out[i + 1] ? Math.min(out[i + 1].start, natural + 0.6) : natural;
  });
  return out;
})();

export const Subs = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < EDIT.hookDur) return null;
  const c = chunks.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const text = c.words.map((w) => w.text).join(" ");
  const { fontSize } = fitText({ text, withinWidth: 860, fontFamily: FONT, fontWeight: 800 });
  const pop = S(frame, c.start, { damping: 13, stiffness: 220 });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1390,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: Math.min(78, fontSize),
        letterSpacing: -1,
        color: C.white,
        textShadow: "0 4px 18px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)",
        transform: `translateY(${(1 - pop) * 24}px) scale(${0.92 + pop * 0.08})`,
      }}
    >
      {c.words.map((w, i) => (
        <span key={i} style={{ color: t >= w.o ? (i === c.words.length - 1 || t < c.words[i + 1].o ? C.green : C.white) : C.white }}>
          {w.text}
          {i < c.words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};
