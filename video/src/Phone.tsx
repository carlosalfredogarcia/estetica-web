import type { ReactNode } from "react";
import { BEZEL, PHONE_H, PHONE_W, SCREEN_H, SCREEN_W } from "./theme";

// Android genérico: bordes finos, cámara perforada centrada y botones a la derecha.
export const Phone = ({ children }: { children: ReactNode }) => (
  <div style={{ position: "relative", width: PHONE_W, height: PHONE_H }}>
    <div style={{ position: "absolute", right: -6, top: 300, width: 6, height: 120, borderRadius: 3, background: "#2A2F2D" }} />
    <div style={{ position: "absolute", right: -6, top: 470, width: 6, height: 70, borderRadius: 3, background: "#2A2F2D" }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 64,
        background: "linear-gradient(145deg, #3A403E 0%, #161A19 45%, #2C3230 100%)",
        boxShadow: "0 50px 120px rgba(0,0,0,0.65), 0 0 0 2px #050606 inset",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: BEZEL,
        top: BEZEL,
        width: SCREEN_W,
        height: SCREEN_H,
        borderRadius: 52,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: SCREEN_W / 2 - 13,
          top: 22,
          width: 26,
          height: 26,
          borderRadius: 13,
          background: "#050505",
          boxShadow: "0 0 0 3px #111",
        }}
      />
    </div>
  </div>
);
