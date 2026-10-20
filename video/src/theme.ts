import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Plus Jakarta Sans";

loadFont({ family: FONT, url: staticFile("fonts/plus-jakarta-sans-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: FONT, url: staticFile("fonts/plus-jakarta-sans-latin-800-normal.woff2"), weight: "800" });

// Colores sacados de la propia app.
export const C = {
  bg: "#0A0D0C",
  green: "#B8F36B",
  teal: "#3FD3B6",
  red: "#F2647A",
  white: "#FFFFFF",
};

// Teléfono: pantalla con la proporción exacta de la grabación (392x850).
export const SCREEN_W = 719;
export const SCREEN_H = Math.round((SCREEN_W * 850) / 392);
export const BEZEL = 14;
export const PHONE_W = SCREEN_W + BEZEL * 2;
export const PHONE_H = SCREEN_H + BEZEL * 2;
export const PHONE_X = Math.round((1080 - PHONE_W) / 2);
export const PHONE_Y = Math.round((1920 - PHONE_H) / 2);
