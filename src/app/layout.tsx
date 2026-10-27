import type { Metadata } from "next";
import { NEGOCIO } from "@/lib/data";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${NEGOCIO.nombre} · Estética avanzada en ${NEGOCIO.ciudad}`,
  description:
    `Centro de estética avanzada en ${NEGOCIO.ciudad}. Tratamientos faciales, corporales y depilación láser de alta gama.`,
  openGraph: {
    title: NEGOCIO.nombre,
    description: `Centro de estética avanzada en ${NEGOCIO.ciudad}.`,
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
