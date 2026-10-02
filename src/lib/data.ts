export const COLORS = {
  gold: "#C9A96E",
  goldLight: "#E8D5A3",
  rose: "#D4929A",
  darkRed: "#8B2252",
  bg: "#FDF6F0",
  bg2: "#F0E4DC",
  dark: "#0F0D0C",
  dark2: "#1A1614",
  charcoal: "#2C2C2C",
  muted: "#8A7070",
} as const;

export interface Service {
  cat: "Facial" | "Corporal" | "Láser";
  name: string;
  price: string;
  promo?: string;
  icon: string;
  dur: string;
  desc: string;
  img?: string; // ruta a imagen en /public/img/
}

export const SERVICES: Service[] = [
  {
    cat: "Facial", name: "Dermapen", price: "80€", promo: "1ª sesión 49€",
    icon: "🪡", dur: "60 min", img: "img/dermapen.jpg",
    desc: "Microagujas que estimulan la producción natural de colágeno. Reduce arrugas, cicatrices de acné, poros abiertos y manchas, logrando una piel más firme y luminosa desde la primera sesión.",
  },
  {
    cat: "Facial", name: "Exsomas", price: "80€",
    icon: "✧", dur: "50 min", img: "img/exsomas.jpg",
    desc: "Tratamiento de última generación con exosomas que regeneran y rejuvenecen la piel a nivel celular. Ideal para pieles maduras, apagadas o con signos visibles de envejecimiento.",
  },
  {
    cat: "Facial", name: "Glow Up Super Luminosidad", price: "80€",
    icon: "✦", dur: "55 min", img: "img/glow-up.jpg",
    desc: "Protocolo intensivo de luminosidad que combina activos despigmentantes y vitaminas. Tu piel recupera el brillo natural y un tono uniforme, como recién iluminada desde dentro.",
  },
  {
    cat: "Facial", name: "Cóctel de Vitaminas", price: "65€",
    icon: "💧", dur: "45 min", img: "img/coctel-vitaminas.jpg",
    desc: "Infusión de vitaminas A, C y E directamente en la piel. Nutre en profundidad, combate los radicales libres y devuelve elasticidad y vitalidad al rostro.",
  },
  {
    cat: "Facial", name: "Retinal", price: "70€",
    icon: "◇", dur: "45 min", img: "img/retinal.jpg",
    desc: "Tratamiento con retinal de alta potencia que acelera la renovación celular. Reduce líneas finas, unifica el tono y mejora la textura para una piel visiblemente más joven.",
  },
  {
    cat: "Facial", name: "Radiofrecuencia Facial", price: "25€",
    icon: "〰", dur: "30 min", img: "img/radiofrecuencia-facial.jpg",
    desc: "Ondas de radiofrecuencia que calientan las capas profundas de la piel, estimulando el colágeno. Efecto tensor inmediato y progresivo, sin dolor ni tiempo de recuperación.",
  },
  {
    cat: "Facial", name: "Higiene Facial + IPL", price: "40€", promo: "Bono 5 ses. · 150€",
    icon: "❋", dur: "50 min", img: "img/higiene-ipl.jpg",
    desc: "Limpieza profunda profesional combinada con luz pulsada intensa (IPL). Elimina impurezas, cierra poros, reduce manchas y unifica el tono. La base perfecta para cualquier tratamiento.",
  },
  {
    cat: "Facial", name: "Hidrafacial", price: "35€",
    icon: "🌊", dur: "40 min", img: "img/hidrafacial.jpg",
    desc: "Hidratación profunda en tres pasos: limpieza, exfoliación y nutrición con sérum personalizado. Tu piel queda suave, hidratada y con un glow natural que se nota al instante.",
  },
  {
    cat: "Corporal", name: "Cavitación + Maderoterapia", price: "38€", promo: "Bono 10 ses. · 230€",
    icon: "◈", dur: "60 min", img: "img/cavitacion-madero.jpg",
    desc: "Combinación estrella para moldear tu silueta. La cavitación rompe las células de grasa localizada con ultrasonidos, mientras la maderoterapia redefine contornos y activa la circulación.",
  },
  {
    cat: "Corporal", name: "Radiofrecuencia + Maderoterapia", price: "38€", promo: "Bono 10 ses. · 230€",
    icon: "♢", dur: "60 min", img: "img/rf-madero.jpg",
    desc: "Dúo reafirmante que combate la flacidez y la celulitis. La radiofrecuencia tensa la piel desde dentro, y la maderoterapia esculpe y drena para unos resultados visibles y duraderos.",
  },
  {
    cat: "Corporal", name: "Radiofrecuencia Corporal", price: "25€", promo: "Bono 5 ses. · 70€",
    icon: "〰", dur: "35 min", img: "img/rf-corporal.jpg",
    desc: "Radiofrecuencia aplicada en zonas corporales como abdomen, muslos o brazos. Reafirma la piel, reduce celulitis y mejora la textura de forma progresiva y sin molestias.",
  },
  {
    cat: "Corporal", name: "Presoterapia", price: "15€", promo: "Bono 5 ses. · 70€",
    icon: "↻", dur: "30 min", img: "img/presoterapia.jpg",
    desc: "Drenaje linfático mecánico mediante presión controlada. Reduce retención de líquidos, alivia piernas cansadas, mejora la circulación y ayuda a eliminar toxinas. Ideal post-entrenamiento.",
  },
  {
    cat: "Corporal", name: "Body Sculp Vibratorio", price: "45€", promo: "Bono 10 ses. · 300€",
    icon: "⚡", dur: "50 min", img: "img/body-sculp.jpg",
    desc: "Tecnología vibratoria de alta frecuencia que actúa sobre la grasa localizada y la celulitis. Tonifica, redefine la figura y potencia los resultados de otros tratamientos corporales.",
  },
  {
    cat: "Láser", name: "Cuerpo Completo (Ellas)", price: "69€", promo: "1ª sesión · 39€",
    icon: "✧", dur: "90 min", img: "img/laser-cuerpo-ellas.jpg",
    desc: "Depilación láser de diodo en todo el cuerpo: piernas, axilas, ingles, brazos y más. Tecnología segura y eficaz para todo tipo de piel, con resultados permanentes desde las primeras sesiones.",
  },
  {
    cat: "Láser", name: "Cuerpo Completo (Ellos)", price: "89€", promo: "1ª sesión · 59€",
    icon: "✧", dur: "120 min", img: "img/laser-cuerpo-ellos.jpg",
    desc: "Depilación láser integral adaptada a la piel y el vello masculino. Incluye pecho, espalda, hombros, abdomen y más. Sesiones diseñadas para un resultado limpio y definitivo.",
  },
  {
    cat: "Láser", name: "Axilas + Ingles", price: "25€",
    icon: "◇", dur: "20 min", img: "img/laser-axilas-ingles.jpg",
    desc: "Las dos zonas más demandadas en un solo pack. Sesión rápida y cómoda para mantener estas zonas libres de vello de forma permanente. Ideal para empezar con el láser.",
  },
  {
    cat: "Láser", name: "Facial Láser", price: "9€ / 14€",
    icon: "◇", dur: "10 min", img: "img/laser-facial.jpg",
    desc: "Depilación láser de precisión en zonas faciales: labio, patillas, mentón o entrecejo. Rápida, prácticamente indolora y con resultados que se notan desde la primera sesión.",
  },
  {
    cat: "Láser", name: "Labio", price: "6€",
    icon: "◇", dur: "5 min", img: "img/laser-labio.jpg",
    desc: "Sesión express de depilación láser en el labio superior. El tratamiento más rápido y económico para olvidarte del vello facial. Sin cera, sin irritaciones.",
  },
  {
    cat: "Láser", name: "Piernas Completas", price: "29€",
    icon: "◇", dur: "45 min", img: "img/laser-piernas.jpg",
    desc: "Depilación láser de piernas completas, desde el tobillo hasta la ingle. Piel suave y libre de vello todo el año, sin las molestias de la cera o la cuchilla.",
  },
  {
    cat: "Láser", name: "Piernas + Axilas", price: "39€",
    icon: "◇", dur: "55 min", img: "img/laser-piernas-axilas.jpg",
    desc: "Combo muy popular que cubre piernas completas y axilas en una sola cita. Ahorra tiempo y dinero con este pack pensado para un resultado integral.",
  },
  {
    cat: "Láser", name: "Pubis", price: "19€",
    icon: "◇", dur: "15 min", img: "img/laser-pubis.jpg",
    desc: "Depilación láser de la zona púbica con tecnología de última generación. Sesión discreta, rápida y cómoda, realizada con total profesionalidad y privacidad.",
  },
  {
    cat: "Láser", name: "Pecho / Espalda (Ellos)", price: "29€",
    icon: "◇", dur: "40 min", img: "img/laser-pecho-espalda.jpg",
    desc: "Depilación láser masculina para pecho o espalda. Elimina el vello grueso de forma definitiva con sesiones adaptadas a la densidad y el grosor del vello masculino.",
  },
];

export const CATEGORIES = [
  {
    id: "Facial" as const, num: "01", label: "Tratamientos Faciales",
    desc: "Dermapen · Hidrafacial · Retinal · Exsomas · Radiofrecuencia · Glow Up",
    gradient: "from-[#5C2D3A] to-[#8B4A60]",
  },
  {
    id: "Corporal" as const, num: "02", label: "Tratamientos Corporales",
    desc: "Cavitación · Maderoterapia · Presoterapia · Body Sculp · Radiofrecuencia",
    gradient: "from-[#2D4A3E] to-[#4A7A64]",
  },
  {
    id: "Láser" as const, num: "03", label: "Depilación Láser",
    desc: "Tecnología avanzada para ellas y ellos · Zonas parciales y cuerpo completo",
    gradient: "from-[#2D3050] to-[#4A5080]",
  },
];

export const SCHEDULE = [
  { d: "Lun · Mié · Vie", h: "10:00–14:00 y 16:00–20:00" },
  { d: "Mar · Jue", h: "09:00–15:00 (ininterrumpido)" },
  { d: "Sábado", h: "10:00–14:00" },
  { d: "Domingo", h: "Cerrado" },
];

export const SCHEDULE_MAP: Record<number, { s: number; e: number }[] | null> = {
  0: null, // Domingo
  1: [{ s: 10, e: 14 }, { s: 16, e: 20 }], // Lunes
  2: [{ s: 9, e: 15 }], // Martes
  3: [{ s: 10, e: 14 }, { s: 16, e: 20 }], // Miércoles
  4: [{ s: 9, e: 15 }], // Jueves
  5: [{ s: 10, e: 14 }, { s: 16, e: 20 }], // Viernes
  6: [{ s: 10, e: 14 }], // Sábado
};

export const TESTIMONIALS = [
  {
    name: "Ana M.",
    text: "Llevaba años buscando un sitio de confianza para el láser. Lucía es increíble, muy profesional, y los resultados son espectaculares desde la primera sesión.",
  },
  {
    name: "Laura G.",
    text: "El Dermapen fue una revelación total. Mi piel nunca había estado tan bien. El trato es exquisito y el ambiente muy cuidado y acogedor.",
  },
  {
    name: "Sofía R.",
    text: "El Hidrafacial dejó mi piel perfecta para mi boda. Cien por cien recomendable. Ya tengo cita para el mes que viene, ¡no cambio de centro!",
  },
];

export const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const WHATSAPP = "34644376744";
export const INSTAGRAM = "lucia_dimux_";
