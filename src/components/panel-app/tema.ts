// Colores, textos de fechas y utilidades del panel de gestión

export const C = {
  oro: "#B8922A",
  fondo: "#F6F1EC",
  tinta: "#1A1A1A",
  gris: "#8A7A70",
  linea: "#EAE1D8",
  verde: "#3F7A5E",
  ambar: "#C98A3E",
  rojo: "#B54A4A",
  azul: "#2F6FDB",
};

export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export interface Cita {
  id: string | number;
  date: string; // 2026-10-28
  time: number; // hora de inicio en horas: 10.5 = 10:30
  dur: number; // minutos
  client: string;
  phone: string;
  service: string;
  price: string; // «35€»
  status: string; // pendiente · confirmada
  notes: string;
  origen?: string; // web · panel
  aviso?: boolean; // ya se le mandó el WhatsApp con los detalles
  rec?: boolean; // ya se le mandó el recordatorio
  res?: boolean; // ya se le pidió la reseña
}

export interface Bloqueo {
  id?: string | number;
  date: string;
  time: number;
  dur: number;
  reason: string;
}

export const toDS = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseD = (ds: string) => {
  const [y, m, d] = ds.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const sumarDias = (ds: string, n: number) => {
  const d = parseD(ds);
  d.setDate(d.getDate() + n);
  return toDS(d);
};

// 10.5 → «10:30»
export const hhmm = (h: number) => {
  const m = Math.round(h * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
// «Mié 28 oct»
export const fechaCorta = (ds: string) => {
  const d = parseD(ds);
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3).toLowerCase()}`;
};
// «Miércoles, 28 de octubre»
export const fechaLarga = (ds: string) => {
  const d = parseD(ds);
  return `${DIAS_LARGOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;
};
// 90 → «1 h 30»
export const duracionTxt = (min: number) =>
  min < 60 ? `${min} min` : min % 60 ? `${Math.floor(min / 60)} h ${min % 60}` : `${min / 60} h`;
// 270 min → «4,5 h»
export const horasTxt = (min: number) => `${(min / 60).toFixed(min % 60 ? 1 : 0).replace(".", ",")} h`;

export const euros = (n: number) => `${Math.round(n).toLocaleString("es-ES")} €`;
export const precio = (p: string) => parseInt(p) || 0;
export const nombrePila = (c: string) => (c || "").split(" ")[0];
export const iniciales = (c: string) =>
  (c || "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Teléfono de la clienta → enlace de WhatsApp (añade el 34 si es un móvil español)
export const waTo = (phone: string, msg: string) => {
  let n = (phone || "").replace(/\D/g, "");
  if (n.length === 9) n = "34" + n;
  return `https://wa.me/${n}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
};

export const estadoCita = (s: string) =>
  s === "confirmada"
    ? { color: C.verde, fondo: "#E6F0EA", txt: "Confirmada" }
    : { color: C.ambar, fondo: "#F8EBDB", txt: "Pendiente" };
