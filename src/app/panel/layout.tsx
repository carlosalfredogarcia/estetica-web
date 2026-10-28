import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Mi panel",
  robots: { index: false, follow: false },
  // Se puede instalar en el móvil como una app (icono en la pantalla de inicio, sin barra del navegador)
  manifest: "/panel.webmanifest",
  appleWebApp: { capable: true, title: "Mi panel", statusBarStyle: "default" },
  icons: { apple: "/icons/panel-192.png" },
};

// Como una app: sin zoom al tocar ni al pellizcar
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFFFFF",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
