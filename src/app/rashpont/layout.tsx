import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./rashpont.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Como una app: sin zoom en el móvil (igual que el panel) y la barra del navegador en negro
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0B0B",
};

export const metadata: Metadata = {
  title: "Rash Pont · Estética regenerativa y barbería en Fuengirola",
  description:
    "Centro de estética regenerativa, spa y barbería en Fuengirola. Tratamientos faciales y corporales sin quirófano, masajes, cortes y rituales de barba. Reserva online.",
  openGraph: {
    title: "Rash Pont · Fuengirola",
    description: "Estética regenerativa para ellas y barbería para ellos. No es solo una cita.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RashPontLayout({ children }: { children: React.ReactNode }) {
  return <div className={`rp ${montserrat.variable}`}>{children}</div>;
}
