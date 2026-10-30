import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./rashpont.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

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
