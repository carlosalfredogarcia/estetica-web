"use client";

import { COLORS } from "@/lib/data";

export default function Particles() {
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + ((i * 5.7) % 90)}%`,
    top: `${8 + ((i * 11.3) % 82)}%`,
    size: 1 + (i % 3),
    delay: `${(i * 0.35) % 4}s`,
    dur: `${2.5 + (i % 3)}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pts.map((p) => (
        <div
          key={p.id}
          className="dot absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: COLORS.gold,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          right: -100, top: -100, width: 420, height: 420,
          border: `1px solid ${COLORS.gold}18`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          right: -50, top: -50, width: 260, height: 260,
          border: `1px solid ${COLORS.gold}12`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: -80, bottom: -80, width: 340, height: 340,
          border: `1px solid ${COLORS.gold}12`,
        }}
      />
    </div>
  );
}
