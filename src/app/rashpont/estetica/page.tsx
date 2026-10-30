import type { Metadata } from "next";
import { ParteWeb } from "../_componentes/parte-web";
import { tratamientosConTexto } from "../_datos/descripciones";

export const metadata: Metadata = {
  title: "Estética regenerativa · Rash Pont Fuengirola",
  description: "Tratamientos faciales y corporales, exosomas, microneedling, masajes y spa en Fuengirola. Reserva tu cita con Raquel.",
};

export default function Estetica() {
  return <ParteWeb parte="estetica" tratamientos={tratamientosConTexto("estetica")} />;
}
