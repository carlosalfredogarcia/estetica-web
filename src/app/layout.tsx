import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIMUX Estética Avanzada",
  description:
    "Centro de estética avanzada en Málaga. Tratamientos faciales, corporales y depilación láser. Reserva tu cita online.",
  keywords: [
    "estética",
    "tratamientos faciales",
    "depilación láser",
    "Málaga",
    "dermapen",
    "hidrafacial",
    "maderoterapia",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
