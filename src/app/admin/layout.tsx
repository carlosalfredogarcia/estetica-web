import type { Viewport } from "next";

// El panel de muestra se ve igual que el de verdad: sin zoom en el móvil
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
