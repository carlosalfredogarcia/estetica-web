import type { Metadata } from "next";
import { ParteWeb } from "../_componentes/parte-web";
import { tratamientosConTexto } from "../_datos/descripciones";

export const metadata: Metadata = {
  title: "Barbería · Rash Pont Fuengirola",
  description: "Corte de caballero, rituales de barba con toalla caliente, color y cuidado facial masculino en Fuengirola. Reserva con Andrés.",
};

export default function Barberia() {
  return <ParteWeb parte="barberia" tratamientos={tratamientosConTexto("barberia")} />;
}
