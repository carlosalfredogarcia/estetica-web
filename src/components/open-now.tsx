"use client";

import { useEffect, useState } from "react";
import { DAYS } from "@/lib/data";
import { useSalon, type Horario } from "@/components/negocio";

// Hora actual en Málaga, sea cual sea el país desde el que se mira la web
function madridNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dow, h: Number(get("hour")) + Number(get("minute")) / 60 };
}

const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

function status(SCHEDULE_MAP: Horario) {
  const { dow, h } = madridNow();
  const today = SCHEDULE_MAP[dow];
  const current = today?.find((s) => h >= s.s && h < s.e);
  if (current) return { open: true, text: `Abierto ahora · cerramos a las ${hh(current.e)}` };
  const later = today?.find((s) => h < s.s);
  if (later) return { open: false, text: `Cerrado ahora · abrimos hoy a las ${hh(later.s)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (dow + i) % 7;
    const sc = SCHEDULE_MAP[d];
    if (sc) return { open: false, text: `Cerrado ahora · abrimos ${i === 1 ? "mañana" : `el ${DAYS[d].toLowerCase()}`} a las ${hh(sc[0].s)}` };
  }
  return { open: false, text: "Cerrado" };
}

export function OpenNow({ className }: { className?: string }) {
  const { horario, modo } = useSalon();
  const [st, setSt] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setSt(status(horario)), 0);
    const id = setInterval(() => setSt(status(horario)), 60000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [horario]);
  if (modo === "cargando") return null;
  if (!st) return null;
  return (
    <p className={className}>
      <span className="relative inline-flex w-2 h-2 mr-2 align-middle">
        {st.open && <span className="absolute inset-0 rounded-full bg-[#4A7A64] animate-ping opacity-70" />}
        <span className={`relative w-2 h-2 rounded-full ${st.open ? "bg-[#4A7A64]" : "bg-[#8A7A70]"}`} />
      </span>
      {st.text}
    </p>
  );
}
