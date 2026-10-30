// Rash Pont · catálogo de Estética (Raquel) y Barbería (Andrés).
// Precios y duraciones de Booksy (30 oct 2026). «booksy» enlaza con la descripción completa
// copiada en docs/clientes/rashpont-descripciones/; si no hay, se usa «texto».

export type Parte = "estetica" | "barberia";

export interface Variante {
  nombre: string; // vacío cuando el tratamiento tiene una sola opción
  precio: string; // «129,95 €» o «desde 69,95 €»
  min: number;
}

export interface Tratamiento {
  id: string;
  grupo: string;
  nombre: string;
  resumen: string;
  texto?: string; // descripción nuestra cuando Booksy no trae una completa
  booksy?: string; // principio del título en Booksy, para encontrar su descripción
  variantes: Variante[];
  bonos?: string[];
  img: string;
  destacado?: boolean;
  etiquetas?: string[]; // palabras que busca la clienta
}

export interface Grupo {
  id: string;
  nombre: string;
  frase: string;
}

const F = "/images/rashpont/";

export const NEGOCIOS = {
  estetica: {
    slug: "rashpont-estetica",
    nombre: "Rash Pont · Estética",
    titulo: "Estética regenerativa",
    para: "Para ellas",
    persona: "Raquel",
    whatsapp: "34643044577",
    lema: "Tratamientos faciales y corporales con aparatología de última generación y cosmética Germaine de Capuccini. Resultados naturales, sin quirófano.",
  },
  barberia: {
    slug: "rashpont-barberia",
    nombre: "Rash Pont · Barbería",
    titulo: "Barbería",
    para: "Para ellos",
    persona: "Andrés",
    whatsapp: "34600220380",
    lema: "Cortes de caballero clásicos y modernos, rituales de barba con toalla caliente y cuidado facial masculino.",
  },
} as const;

export const DIRECCION = "C. José Moreno Carbonero, 2 · 29640 Fuengirola";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Calle+Jos%C3%A9+Moreno+Carbonero+2+Fuengirola";
export const INSTAGRAM = "rashpont";
// Lunes a sábado de 10:00 a 21:00 (pendiente de confirmar con Booksy)
export const HORARIO: Record<number, { s: number; e: number }[] | null> = {
  0: null, 1: [{ s: 10, e: 21 }], 2: [{ s: 10, e: 21 }], 3: [{ s: 10, e: 21 }],
  4: [{ s: 10, e: 21 }], 5: [{ s: 10, e: 21 }], 6: [{ s: 10, e: 21 }],
};

export const GRUPOS: Record<Parte, Grupo[]> = {
  estetica: [
    { id: "rostro", nombre: "Rostro y antiedad", frase: "Limpiezas, lifting, exosomas y microneedling" },
    { id: "piel", nombre: "Manchas, acné y espalda", frase: "Para unificar el tono y sanear la piel" },
    { id: "cuerpo", nombre: "Cuerpo y figura", frase: "Remodelar, reafirmar y drenar" },
    { id: "masajes", nombre: "Masajes", frase: "Relajantes, terapéuticos y deportivos" },
    { id: "spa", nombre: "Spa y bienestar", frase: "Rituales para desconectar" },
    { id: "depilacion", nombre: "Depilación", frase: "Con cera, para ellas y ellos" },
  ],
  barberia: [
    { id: "cortes", nombre: "Cortes", frase: "Caballero, niños y mayores" },
    { id: "rituales", nombre: "Rituales", frase: "Corte, barba y cuidado en una cita" },
    { id: "barba", nombre: "Barba", frase: "Diseño, toalla caliente y color" },
    { id: "facial", nombre: "Facial", frase: "Limpieza y mascarillas" },
    { id: "color", nombre: "Color", frase: "Canas, mechas y permanente" },
    { id: "detalles", nombre: "Detalles", frase: "Cejas, nariz y oídos" },
  ],
};

const v = (precio: string, min: number, nombre = ""): Variante => ({ nombre, precio, min });

export const TRATAMIENTOS: Record<Parte, Tratamiento[]> = {
  estetica: [
    // ── Rostro y antiedad ─────────────────────────────────────────────
    {
      id: "higiene-premium", grupo: "rostro", destacado: true, img: F + "facial.webp",
      nombre: "Ritual de higiene antiedad y firmeza premium",
      resumen: "Su facial estrella: limpieza profunda, peeling, ácido hialurónico, mascarilla de alta gama y luz LED. Cada protocolo se adapta a tu piel.",
      booksy: "RITUAL DE HIGIENE ANTIEDAD",
      variantes: [v("129,95 €", 60, "Esencial · punta de diamante y electroporación"), v("169,95 €", 90, "Premium · Expert Jet, vitaminas y exosomas")],
      bonos: ["Ahorras 39,90 € · 60 min · 3 sesiones 349,95 € (con masaje de espalda de regalo)", "Ahorras 99,80 € · 60 min · 5 sesiones 549,95 € (con kit de mantenimiento)", "Ahorras 49,90 € · 90 min · 3 sesiones 459,95 € (con masaje relajante)", "Ahorras 149,80 € · 90 min · 5 sesiones 699,95 €"],
      etiquetas: ["limpieza", "facial", "arrugas", "firmeza", "hidratación", "luminosidad", "antiedad"],
    },
    {
      id: "detox-glow", grupo: "rostro", img: F + "facial.webp",
      nombre: "Ritual regenerativo Detox & Glow",
      resumen: "Limpieza facial con efecto «buena cara» inmediato. Ideal si tienes poco tiempo o un evento: poros limpios y piel luminosa.",
      booksy: "RITUAL REGENERATIVO DETOX",
      variantes: [v("desde 89,95 €", 60, "Cura renovadora flash"), v("desde 149,95 €", 90, "Higiene tecnológica regenerativa")],
      etiquetas: ["limpieza", "facial", "poros", "puntos negros", "glow", "evento", "dermaplaning"],
    },
    {
      id: "bioregeneracion", grupo: "rostro", img: F + "serum.webp",
      nombre: "Ritual bioregeneración celular",
      resumen: "Exosomas y PDRN para calmar, reparar y dar luz a pieles sensibles, con rosácea o con los primeros signos de la edad.",
      booksy: "RITUAL BIOREGENERACION",
      variantes: [v("desde 149,95 €", 60, "Intensiva · sin agujas"), v("199,95 €", 90, "Supreme · con microneedling")],
      bonos: ["Ahorras 49,90 € · 60 min · 3 sesiones 399,95 €", "Ahorras 149,80 € · 60 min · 5 sesiones 599,95 €", "Ahorras 69,90 € · 90 min · 3 sesiones 529,95 €", "Ahorras 199,80 € · 90 min · 5 sesiones 799,95 €"],
      etiquetas: ["exosomas", "pdrn", "rosácea", "sensible", "regenerativa", "arrugas"],
    },
    {
      id: "exosomas-global", grupo: "rostro", destacado: true, img: F + "serum.webp",
      nombre: "Tratamiento regenerativo celular avanzado",
      resumen: "Su terapia de alta gama: rostro completo con exosomas y PDRN, más protocolo para bolsas, ojeras y patas de gallo.",
      booksy: "TRATAMIENTO REGENERATIVO CELULAR",
      variantes: [v("desde 395,95 €", 60, "Rostro global con exosomas + periocular"), v("499,95 €", 90, "Exosomas + PDRN + periocular despigmentante")],
      bonos: ["Ahorras 200 € · 3 sesiones 987,85 € (la tercera a mitad de precio)", "Ahorras 395,95 € · 5 sesiones 1.583,80 € (4 + 1 gratis)", "Ahorras 791,90 € · 8 sesiones 2.375,70 € (6 + 2 gratis)", "Ahorras 200 € · 90 min · bono choque 3 sesiones con kit en casa 1.299,85 €"],
      etiquetas: ["exosomas", "pdrn", "ojeras", "bolsas", "manchas", "arrugas", "cicatrices", "acné"],
    },
    {
      id: "microneedling", grupo: "rostro", destacado: true, img: F + "dermapen.webp",
      nombre: "Microneedling renovación celular + labios",
      resumen: "Dermapen con ácido hialurónico y vitaminas para estimular colágeno. Mejora arrugas finas, marcas de acné, poros y manchas.",
      booksy: "MICRONEEDLING",
      variantes: [v("desde 149,95 €", 60, "Glow & Hidra"), v("299,95 €", 90, "Exosomas Supreme + labios")],
      bonos: ["Ahorras 50 € · Glow & Hidra · 3 sesiones 399 €", "Ahorras 100 € · Exosomas Supreme · 3 sesiones 649 €"],
      etiquetas: ["dermapen", "colágeno", "cicatrices", "acné", "poros", "manchas", "labios"],
    },
    {
      id: "regenera-lift", grupo: "rostro", img: F + "radiofrecuencia.webp",
      nombre: "Pack Regenera-Lift antiedad premium Phoenix",
      resumen: "Radiofrecuencia Phoenix con cóctel de vitaminas o con exosomas y dermapen. Reafirma, ilumina y redefine el óvalo.",
      booksy: "PACK “REGENERA",
      variantes: [v("desde 119,95 €", 60, "Mesoterapia virtual con cóctel de vitaminas"), v("349,95 €", 90, "Diatermia + dermapen con exosomas y PDRN")],
      etiquetas: ["radiofrecuencia", "phoenix", "flacidez", "lifting", "óvalo", "vitaminas", "exosomas"],
    },
    {
      id: "lifting-bellaction", grupo: "rostro", img: F + "radiofrecuencia.webp",
      nombre: "Ritual lifting premium antiedad con Bellaction",
      resumen: "Efecto «push up» facial: microdermoabrasión, masaje fisioactivo, crioterapia y LED para tensar y suavizar arrugas.",
      booksy: "RITUAL LIFTING PREMIUM",
      variantes: [v("149,95 €", 60)],
      etiquetas: ["lifting", "bellaction", "arrugas", "flacidez", "óvalo"],
    },
    {
      id: "papada", grupo: "rostro", img: F + "radiofrecuencia.webp",
      nombre: "Pack remodela óvalo facial y papada",
      resumen: "Bellaction y radiofrecuencia Phoenix para reducir el doble mentón y redefinir la mandíbula, sin cirugía.",
      booksy: "PACK REMODELA OVALO",
      variantes: [v("desde 119,95 €", 60)],
      etiquetas: ["papada", "doble mentón", "mandíbula", "óvalo", "flacidez"],
    },
    {
      id: "flash-lift", grupo: "rostro", img: F + "serum.webp",
      nombre: "Pack Flash «Lift Glow»",
      resumen: "¿Tienes un evento? Efecto tensor inmediato y luminosidad extrema en una sesión, con radiofrecuencia y su cóctel de activos.",
      booksy: "PACK FLASH",
      variantes: [v("desde 69,95 €", 45, "Zona localizada"), v("desde 119,95 €", 75, "Facial completo")],
      etiquetas: ["evento", "boda", "tensor", "glow", "cansancio", "flash"],
    },
    {
      id: "labios", grupo: "rostro", img: F + "dermapen.webp",
      nombre: "Redensificación de labios Lip & Gloss",
      resumen: "Micro-infusión de ácido hialurónico y péptidos con dermapen: labios hidratados, más jugosos y con color natural, sin rellenos.",
      booksy: "LIP REDENSIFICATION",
      variantes: [v("79,95 €", 45)],
      etiquetas: ["labios", "hialurónico", "hidratación", "volumen", "código de barras"],
    },
    {
      id: "drenaje-facial", grupo: "rostro", img: F + "facial.webp",
      nombre: "Drenaje linfático facial",
      resumen: "Masaje manual suave que deshincha la cara, elimina toxinas y da frescura al momento. Perfecto como mantenimiento.",
      booksy: "DRENAJE LINFÁTICO FACIAL",
      variantes: [v("desde 69,95 €", 30, "Express"), v("99,95 €", 60, "Detox & Esculpe")],
      bonos: ["Ahorras 20,85 € · 30 min · 3 sesiones 189 €", "Ahorras 54,75 € · 30 min · 5 sesiones 295 €", "Ahorras 149,50 € · 30 min · 10 sesiones 550 €", "Ahorras 30,85 € · 60 min · 3 sesiones 269 €", "Ahorras 74,75 € · 60 min · 5 sesiones 425 €", "Ahorras 209,50 € · 60 min · 10 sesiones 790 €"],
      etiquetas: ["hinchazón", "retención", "bolsas", "drenaje", "detox"],
    },
    {
      id: "glow-cejas", grupo: "rostro", img: F + "facial.webp",
      nombre: "Express Glow Dúo · piel y mirada",
      resumen: "Limpieza hidratante con efecto luminoso y diseño y color de cejas en la misma cita.",
      booksy: "Express Glow Duo",
      variantes: [v("desde 59,95 €", 60)],
      etiquetas: ["cejas", "limpieza", "mirada", "hidratación"],
    },
    {
      id: "ritual-360", grupo: "rostro", img: F + "presoterapia.webp",
      nombre: "Ritual regenerativo 360º",
      resumen: "Facial y corporal en una cita: limpieza ultrasónica, drenaje, presoterapia, activos, LED y crioterapia.",
      texto: "Un ritual completo de cara y cuerpo para salir renovada.\n\nLa opción exprés combina limpieza facial ultrasónica, alta frecuencia y 30 minutos de presoterapia detox.\n\nEl ritual 360º completo suma doble limpieza profunda, drenaje linfático manual, presoterapia médica de 40 minutos, infusión de activos, luz LED y crioterapia.",
      booksy: "RITUAL REGENERATIVO 360",
      variantes: [v("desde 79,95 €", 65, "Exprés de alto impacto"), v("desde 149,95 €", 90, "Ritual 360º completo")],
      etiquetas: ["presoterapia", "drenaje", "detox", "limpieza", "piernas cansadas"],
    },

    // ── Manchas, acné y espalda ───────────────────────────────────────
    {
      id: "aclaramiento", grupo: "piel", destacado: true, img: F + "serum.webp",
      nombre: "Aclaramiento corporal premium",
      resumen: "Unifica el tono de axilas, ingles, codos, rodillas y zona íntima con peeling químico y activos de Germaine de Capuccini.",
      booksy: "ACLARAMIENTO CORPORAL",
      variantes: [v("89,95 €", 60, "Axilas, codos o rodillas"), v("129,95 €", 60, "Ingles y entrepierna"), v("149,95 €", 60, "Íntimo premium")],
      bonos: ["Ahorras 109,80 € · Íntimo · 4 sesiones 490 €", "Ahorras 209,70 € · Íntimo · 6 sesiones 690 €", "Dúo · 2 zonas en la misma cita 219,95 €"],
      etiquetas: ["manchas", "axilas", "ingles", "íntimo", "codos", "rodillas", "despigmentante", "oscurecimiento"],
    },
    {
      id: "acne-premium", grupo: "piel", destacado: true, img: F + "facial.webp",
      nombre: "Piel grasa y acné premium",
      resumen: "Protocolo avanzado y regenerativo para acné activo, brillos y marcas. Desinfecta, regula el sebo y calma la piel.",
      texto: "Un tratamiento completo para pieles grasas con acné activo, poros obstruidos y marcas.\n\nEmpieza con un diagnóstico de tu piel. Después, hidrodermoabrasión para limpiar y desinfectar, peeling químico suave para renovar, extracción higiénica de comedones y alta frecuencia en las zonas inflamadas.\n\nTermina con fototerapia LED azul, una mascarilla seborreguladora y calmante, y protección solar para evitar marcas.\n\nEl objetivo es bajar la inflamación, controlar los brotes y conseguir una piel uniforme y matificada.",
      variantes: [v("179,95 €", 90)],
      etiquetas: ["acné", "granos", "grasa", "sebo", "poros", "marcas", "cicatrices"],
    },
    {
      id: "sebo-glow", grupo: "piel", img: F + "facial.webp",
      nombre: "Pack Stop «Sebo & Glow»",
      resumen: "Mantenimiento para pieles muy grasas: limpieza, peeling, extracción, alta frecuencia y LED azul.",
      booksy: "PACK STOP",
      variantes: [v("119,95 €", 60)],
      etiquetas: ["acné", "grasa", "sebo", "poros", "puntos negros"],
    },
    {
      id: "espalda", grupo: "piel", img: F + "corporal.webp",
      nombre: "Tratamiento regenerativo de espalda",
      resumen: "Para ellas y ellos: elimina puntos negros, granos y marcas de la espalda con exfoliación, extracción y alta frecuencia.",
      booksy: "TRATAMIENTO REGENERATIVO Y AVANZADO DE ESPALDA",
      variantes: [v("59,95 €", 30, "Higiene express"), v("119,95 €", 60, "Salud dermatológica y regenerativa")],
      bonos: ["Ahorras 29,85 € · Express · 3 sesiones 150 €", "Ahorras 80,80 € · Intensivo · 4 sesiones 399 €", "Ahorras 120,70 € · Plan anual · 6 sesiones 599 €"],
      etiquetas: ["espalda", "acné", "puntos negros", "hombre", "granos"],
    },

    // ── Cuerpo y figura ───────────────────────────────────────────────
    {
      id: "vientre-plano", grupo: "cuerpo", destacado: true, img: F + "maderoterapia.webp",
      nombre: "Vientre plano «modo turbo»",
      resumen: "Maderoterapia, cavitación, Bellaction y presoterapia para reducir abdomen y grasa localizada.",
      texto: "Remodela y reduce el abdomen con un protocolo intensivo.\n\nLa sesión express combina maderoterapia, esculpido corporal y principios activos reductores.\n\nLa sesión Full Turbo de 2 horas une cavitación, masaje fisioactivo Bellaction y presoterapia 3 en 1 para atacar la grasa localizada, la retención y la flacidez a la vez.",
      booksy: "REMODELA Y REDUCE",
      bonos: ["Ahorras 104,75 € · 1 h · 5 sesiones 495 €", "Ahorras 309,50 € · 1 h · 10 sesiones 890 €", "Ahorras 50,75 € · Full Turbo · 5 sesiones 699 €", "Ahorras 149,60 € · Full Turbo · 8 sesiones 1.050 €", "Ahorras 299,45 € · Full Turbo · 10 + 1 gratis 1.350 €"],
      variantes: [v("desde 119,95 €", 60, "Express · maderoterapia y esculpido"), v("149,95 €", 120, "Full Turbo · cavitación + Bellaction + presoterapia")],
      etiquetas: ["abdomen", "barriga", "grasa", "cavitación", "maderoterapia", "reductor"],
    },
    {
      id: "michelines", grupo: "cuerpo", img: F + "maderoterapia.webp",
      nombre: "Bye Bye michelines rebeldes",
      resumen: "Remodelación abdominal premium, una lipo-reducción sin cirugía. Puedes empezar con un diagnóstico y sesión express.",
      texto: "Sesión de remodelación premium para los michelines que no se van con dieta ni deporte.\n\nEmpieza con un diagnóstico corporal y una sesión express para conocer tu caso, o reserva directamente la remodelación abdominal premium: una lipo-reducción sin cirugía con aparatología y técnicas manuales.",
      booksy: "EXPERIENCIA “BYE BYE",
      bonos: ["Ahorras 89,80 € · «Efecto Reductor Express» · 4 sesiones 390 €", "Ahorras 239,60 € · «Silueta Fit» · 8 sesiones 720 € (el más vendido)", "Ahorras 449,40 € · «Escultor Abdominal 360°» · 12 sesiones 990 €"],
      variantes: [v("59,95 €", 45, "Diagnóstico + sesión express"), v("119,95 €", 60, "Remodelación abdominal premium")],
      etiquetas: ["michelines", "abdomen", "flancos", "grasa", "lipo sin cirugía"],
    },
    {
      id: "cleopatra", grupo: "cuerpo", img: F + "corporal.webp",
      nombre: "Experiencia Diosa Cleopatra",
      resumen: "Envoltura hipotérmica y drenante para piernas, glúteos, abdomen o brazos. Deshincha y reafirma.",
      texto: "Una experiencia hipotérmica y drenante inspirada en los rituales de belleza de Cleopatra.\n\nPuedes elegir un trabajo intensivo en una zona (piernas y glúteos, abdomen y flancos, o brazos) o el tratamiento integral de pies a cabeza.\n\nEl frío activa la circulación, ayuda a eliminar líquidos y deja la piel más firme.",
      booksy: "EXPERIENCIA DIOSA CLEOPATRA",
      bonos: ["Ahorras 100,75 € · Una zona · 5 sesiones 499 € (con presoterapia de regalo)", "Ahorras 300,50 € · Una zona · 10 sesiones 899 €", "Ahorras 60,85 € · Full Body · 3 sesiones 389 €", "Ahorras 200,70 € · Full Body · 6 sesiones 699 €", "Ahorras 100,75 € · Método Cleopatra masculino · 5 sesiones 499 €", "Ahorras 50,90 € · Parejas o regalo «Diosa & Apolo» · 2 sesiones de 90 min 249 €"],
      variantes: [v("desde 119,95 €", 60, "Una zona"), v("149,95 €", 90, "Integral de pies a cabeza")],
      etiquetas: ["retención", "piernas", "glúteos", "drenante", "frío", "celulitis"],
    },
    {
      id: "mama-fit", grupo: "cuerpo", img: F + "corporal.webp",
      nombre: "Mamá Fit · reafirma y tonifica",
      resumen: "Tratamiento tensor para recuperar tu mejor versión después del embarazo, sin cirugía ni pausas.",
      texto: "¿Lista para recuperar tu mejor versión sin cirugías ni pausas en tu rutina?\n\nUn tratamiento tensor que reafirma y tonifica las zonas que más cambian después del embarazo: abdomen, brazos, piernas y glúteos.\n\nPuedes tratar una zona, dos zonas o el cuerpo completo.",
      booksy: "TRATAMIENTO TENSOR",
      bonos: ["Ahorras 149,75 € · 1 zona · 6 sesiones 449,95 € (pagas 5)", "Ahorras 299,75 € · 2 zonas · 6 sesiones 899,95 €", "Ahorras 599,55 € · Full Body · 10 sesiones 1.899,95 €"],
      variantes: [v("desde 99,95 €", 30, "1 zona"), v("199,95 €", 65, "2 zonas"), v("249,95 €", 100, "Cuerpo completo")],
      etiquetas: ["posparto", "embarazo", "flacidez", "abdomen", "tonificar"],
    },
    {
      id: "senos", grupo: "cuerpo", img: F + "radiofrecuencia.webp",
      nombre: "Bio-reafirmante de senos premium",
      resumen: "Radiofrecuencia Phoenix y activos de alta gama para un pecho más firme desde la primera sesión. Incluye cuello y escote.",
      booksy: "TRATAMIENTO PREMIUM “BIO",
      variantes: [v("119,95 €", 80)],
      etiquetas: ["pecho", "senos", "busto", "flacidez", "escote", "reafirmante"],
    },
    {
      id: "escote", grupo: "cuerpo", img: F + "radiofrecuencia.webp",
      nombre: "Escote efecto juventud 360º",
      resumen: "Protocolo intensivo para las arrugas y la flacidez del escote, con radiofrecuencia, mesoterapia virtual y LED.",
      texto: "Un protocolo intensivo para devolver firmeza y luz al escote, una de las zonas que antes muestra la edad.\n\nLa primera opción combina radiofrecuencia y mesoterapia virtual. La opción «Efecto Flash» suma dermapen y luz LED para una luminosidad y textura inmediatas.",
      booksy: "EXPERIENCIA “ESCOTE",
      variantes: [v("desde 199,95 €", 90, "Radiofrecuencia + mesoterapia virtual"), v("299,95 €", 120, "Efecto Flash · RF + dermapen + mesoterapia + LED")],
      etiquetas: ["escote", "cuello", "arrugas", "flacidez", "manchas"],
    },
    {
      id: "bellaction", grupo: "cuerpo", img: F + "corporal.webp",
      nombre: "Remodelación y tonificación Bellaction",
      resumen: "Masaje fisioactivo profundo no invasivo que remodela, tonifica y mejora la celulitis.",
      texto: "Bellaction Duo es un tratamiento corporal no invasivo basado en un masaje fisioactivo profundo.\n\nCombina succión, vibración e infrarrojos para movilizar la grasa, activar la circulación y mejorar la celulitis y la flacidez, con resultados que se notan desde las primeras sesiones.",
      booksy: "REMODELACIÓN Y TONIFICACION CORPORAL BELLACTION",
      variantes: [v("79,95 €", 55)],
      etiquetas: ["celulitis", "piel de naranja", "tonificar", "grasa", "bellaction"],
    },
    {
      id: "piernas-verano", grupo: "cuerpo", img: F + "piernas.webp",
      nombre: "Piernas de verano los 365 días",
      resumen: "Masaje, cavitación y mesoterapia virtual para unas piernas más ligeras, firmes y sin piel de naranja.",
      texto: "Unas piernas de verano todo el año.\n\nLa primera opción combina masaje manual, cavitación y mesoterapia virtual. La segunda suma cavitación, masaje fisioactivo Bellaction Duo y radiofrecuencia Phoenix para reafirmar a fondo.",
      booksy: "EXPERIENCIA PIERNAS DE VERANO",
      variantes: [v("desde 89,95 €", 60, "Masaje + cavitación + mesoterapia virtual"), v("desde 119,95 €", 100, "Cavitación + Bellaction + radiofrecuencia")],
      etiquetas: ["piernas", "celulitis", "piel de naranja", "cavitación", "flacidez"],
    },
    {
      id: "top-model", grupo: "cuerpo", img: F + "piernas.webp",
      nombre: "Piernas de Top Model",
      resumen: "40.000 contracciones musculares en 60 minutos: tonifica, moldea y combate la celulitis.",
      texto: "Un programa diseñado para resultados naturales y visibles en las piernas.\n\nEn 60 minutos se trabajan 40.000 contracciones musculares que tonifican, moldean y ayudan a eliminar la celulitis, para unas piernas firmes y estilizadas.",
      booksy: "EXPERIENCIA “ PIERNAS DE TOP",
      variantes: [v("desde 89,95 €", 30, "Sesión de 30 minutos"), v("119,50 €", 60, "Programa completo de 60 minutos")],
      etiquetas: ["piernas", "glúteos", "tonificar", "celulitis", "electroestimulación"],
    },
    {
      id: "masaje-reductor", grupo: "cuerpo", img: F + "maderoterapia.webp",
      nombre: "Masaje reductor Germaine de Capuccini",
      resumen: "Tratamiento Perfect Forms reductor y anticelulítico con cosmética de alta gama.",
      texto: "El tratamiento Perfect Forms Reductor de Germaine de Capuccini es un ritual corporal reductor y anticelulítico.\n\nCombina un masaje específico con activos que ayudan a reducir volumen, mejorar la piel de naranja y dejar la piel suave y firme.",
      booksy: "MASAJE REDUCTOR",
      variantes: [v("desde 69,95 €", 45)],
      etiquetas: ["reductor", "celulitis", "grasa", "germaine"],
    },
    {
      id: "drenaje-corporal", grupo: "cuerpo", img: F + "presoterapia.webp",
      nombre: "Drenaje linfático corporal",
      resumen: "Masaje suave y lento que elimina líquidos y toxinas. Se puede combinar con presoterapia.",
      texto: "El drenaje linfático es un masaje suave y lento que estimula el sistema linfático para eliminar líquidos retenidos y toxinas.\n\nAlivia la pesadez de piernas, deshincha y mejora la circulación. Puedes tratar una zona, añadir presoterapia o hacer el cuerpo completo con presoterapia de drenaje secuencial.",
      booksy: "DRENAJE LINFÁTICO CORPORAL",
      bonos: ["Ahorras 25 € · Zona · 5 sesiones 224,75 €", "Ahorras 74,95 € · Zona · 10 sesiones 424,55 €", "Ahorras 40 € · Zona + presoterapia · 5 sesiones 359,75 €", "Ahorras 120,50 € · Zona + presoterapia · 10 sesiones 679 €", "Ahorras 45 € · Cuerpo completo + presoterapia · 5 sesiones 404,75 €", "Ahorras 134,95 € · Cuerpo completo + presoterapia · 10 sesiones 764,55 €"],
      variantes: [v("desde 49,95 €", 30, "Zona específica"), v("79,95 €", 70, "Zona + presoterapia"), v("89,95 €", 75, "Cuerpo completo + presoterapia")],
      etiquetas: ["retención", "piernas cansadas", "hinchazón", "drenaje", "presoterapia"],
    },
    {
      id: "presoterapia", grupo: "cuerpo", img: F + "presoterapia.webp",
      nombre: "Presoterapia 3 en 1",
      resumen: "Drenaje, luz LED y masaje fisioactivo a la vez, para piernas ligeras y desinflamadas.",
      texto: "Tres tecnologías en una sesión de 30 minutos: drenaje por presión, luz LED y electroestimulación (EMS).\n\nIdeal para piernas cansadas, retención de líquidos y como complemento de los tratamientos reductores.",
      booksy: "PRESOTERAPIA 3",
      variantes: [v("desde 79,95 €", 30)],
      etiquetas: ["presoterapia", "piernas cansadas", "retención", "circulación"],
    },

    // ── Masajes ───────────────────────────────────────────────────────
    {
      id: "masaje-relajante", grupo: "masajes", destacado: true, img: F + "corporal.webp",
      nombre: "Masaje terapéutico relajante de cuerpo entero",
      resumen: "Descontractura, serena el sistema nervioso y devuelve ligereza al cuerpo. Con maderoterapia o piedras volcánicas.",
      texto: "Descubre el alivio profundo y la renovación total con un masaje terapéutico de cuerpo entero.\n\nNo solo descontractura la musculatura: serena el sistema nervioso y devuelve al cuerpo ligereza y vitalidad.\n\nPuedes elegirlo con maderoterapia regenerativa o piedras volcánicas, o convertirlo en el ritual «Total Reset» de cara y cuerpo.",
      booksy: "MASAJE TERAPÉUTICO RELAJANTE",
      bonos: ["Ahorras 29,90 € · 3 sesiones 269,95 €", "Ahorras 74,75 € · 5 sesiones 425 €"],
      variantes: [v("89,95 €", 60, "Con maderoterapia o piedras volcánicas"), v("99,95 €", 70, "Relajante de cuerpo entero"), v("149,95 €", 100, "Ritual facial y corporal «Total Reset»")],
      etiquetas: ["relax", "estrés", "contracturas", "piedras", "maderoterapia"],
    },
    {
      id: "descontracturante", grupo: "masajes", destacado: true, img: F + "corporal.webp",
      nombre: "Masaje descontracturante S.O.S espalda",
      resumen: "Para ellas y ellos: libera la tensión de espalda, cuello y hombros.",
      texto: "Una experiencia unisex para liberarte de la tensión y el estrés acumulados en la espalda.\n\nUn masaje terapéutico profundo que trabaja las contracturas de espalda, cuello y hombros.",
      booksy: "MASAJE TERAPÉUTICO DESCONTRACTURANTE",
      variantes: [v("85,95 €", 60)],
      etiquetas: ["espalda", "contracturas", "cuello", "dolor", "tensión", "hombre"],
    },
    {
      id: "cervical", grupo: "masajes", img: F + "corporal.webp",
      nombre: "Masaje premium cervical y de cráneo",
      resumen: "Alivia la tensión del cuello y la cabeza, ideal si pasas muchas horas sentada o con dolor de cabeza.",
      texto: "Un masaje terapéutico centrado en cervicales, nuca y cuero cabelludo.\n\nAlivia la tensión del cuello, la cargazón de hombros y los dolores de cabeza por estrés.",
      variantes: [v("69,95 €", 55)],
      etiquetas: ["cuello", "cervicales", "cabeza", "migraña", "tensión"],
    },
    {
      id: "deportivo", grupo: "masajes", img: F + "maderoterapia.webp",
      nombre: "Masaje deportivo",
      resumen: "Recuperación muscular antes o después del entreno, en tres duraciones.",
      texto: "Un masaje profundo para deportistas: prepara el músculo, alivia la sobrecarga y acelera la recuperación.\n\nElige la duración según las zonas que quieras trabajar.",
      variantes: [v("desde 69,95 €", 50, "Opción 1"), v("desde 89,95 €", 65, "Opción 2"), v("119,95 €", 95, "Opción 3")],
      etiquetas: ["deporte", "gimnasio", "sobrecarga", "piernas", "hombre"],
    },
    {
      id: "sueco", grupo: "masajes", img: F + "corporal.webp",
      nombre: "Masaje sueco profundo",
      resumen: "El clásico masaje de amasamiento y fricción para soltar el cuerpo entero.",
      texto: "El masaje sueco combina amasamiento, fricción y estiramientos para relajar la musculatura profunda y activar la circulación.",
      variantes: [v("79,95 €", 60)],
      etiquetas: ["relax", "sueco", "contracturas"],
    },
    {
      id: "lomi", grupo: "masajes", img: F + "corporal.webp",
      nombre: "Masaje Lomi Lomi",
      resumen: "Masaje hawaiano con movimientos largos y envolventes, como olas.",
      texto: "El Lomi Lomi es un masaje tradicional hawaiano de movimientos largos, fluidos y envolventes que recorren todo el cuerpo como las olas.\n\nRelaja en profundidad y equilibra cuerpo y mente.",
      variantes: [v("79,95 €", 60)],
      etiquetas: ["relax", "hawaiano"],
    },
    {
      id: "piedras", grupo: "masajes", img: F + "maderoterapia.webp",
      nombre: "Masaje con piedras calientes",
      resumen: "Calor, envoltura bio-activa y maderoterapia. Packs recomendados según lo que necesites.",
      texto: "El calor de las piedras volcánicas relaja la musculatura en profundidad.\n\nPuedes combinarlo con una envoltura bio-activa y maderoterapia, o elegir el pack regenerador celular y térmico de 90 minutos. Te recomendamos el pack según tu valoración.",
      booksy: "MASAJE CON PIEDRAS CALIENTES",
      variantes: [v("desde 79,95 €", 60, "Envoltura bio-activa + maderoterapia + piedras"), v("119,95 €", 90, "Pack regenerador celular y térmico")],
      etiquetas: ["piedras", "calor", "relax", "envoltura"],
    },
    {
      id: "fascia", grupo: "masajes", img: F + "maderoterapia.webp",
      nombre: "Masaje con pistola de percusión «Fascia Gun»",
      resumen: "Terapia percusiva profunda para soltar fascias y contracturas rebeldes.",
      texto: "Un masaje profundo con pistola de percusión que llega a la fascia y suelta las contracturas más rebeldes. Muy útil para deportistas y para la sobrecarga del día a día.",
      booksy: "MASAJE CON PISTOLA",
      variantes: [v("69,95 €", 45)],
      etiquetas: ["contracturas", "deporte", "percusión", "fascia"],
    },
    {
      id: "reflexologia", grupo: "masajes", img: F + "corporal.webp",
      nombre: "Reflexología",
      resumen: "Masaje terapéutico en las zonas reflejas de pies, manos, cara y orejas.",
      texto: "Un masaje terapéutico sobre las zonas reflejas de pies, manos, rostro y orejas, que equilibra y relaja todo el cuerpo.",
      booksy: "REFLEXOLOGÍA",
      variantes: [v("49,95 €", 45)],
      etiquetas: ["pies", "reflexología", "relax"],
    },

    // ── Spa y bienestar ───────────────────────────────────────────────
    {
      id: "spa-cava", grupo: "spa", destacado: true, img: F + "corporal.webp",
      nombre: "Circuito spa y masaje relax con cava y bombones",
      resumen: "Una experiencia para desconectar del todo: circuito spa, masaje relajante, cava y bombones.",
      texto: "Te invitamos a sumergirte en una experiencia de bienestar única para desconectar del estrés diario.\n\nUn circuito spa con masaje relajante, acompañado de una copa de cava y bombones.\n\nPorque no existe belleza duradera sin bienestar profundo.",
      variantes: [v("159,95 €", 90)],
      etiquetas: ["spa", "regalo", "pareja", "relax", "cava"],
    },
    {
      id: "antiestres", grupo: "spa", img: F + "corporal.webp",
      nombre: "Programa S.O.S antiestrés",
      resumen: "Reset físico y emocional: una intervención pensada para aliviar el estrés agudo.",
      texto: "Una intervención rápida y diseñada para aliviar el estrés agudo, la tensión acumulada y el cansancio mental.\n\nCombina masaje, técnicas de relajación y rituales sensoriales para un reset físico y emocional completo.",
      booksy: "PROGRAMA S.O.S",
      variantes: [v("desde 159,95 €", 120)],
      etiquetas: ["estrés", "ansiedad", "relax", "cansancio"],
    },
    {
      id: "hormonal", grupo: "spa", img: F + "serum.webp",
      nombre: "Circuito reset hormonal y mitocondrial",
      resumen: "Programa de biohacking para la menopausia y la longevidad.",
      texto: "Un programa de biohacking pensado para la menopausia y la longevidad.\n\nCombina terapias que ayudan a recuperar energía, mejorar el descanso y cuidar la piel y el cuerpo en esta etapa.",
      booksy: "CIRCUITO “RESET HORMONAL",
      variantes: [v("desde 149,95 €", 90)],
      etiquetas: ["menopausia", "hormonas", "longevidad", "energía"],
    },
    {
      id: "spa-capilar", grupo: "spa", img: F + "serum.webp",
      nombre: "Spa capilar y salud del cuero cabelludo",
      resumen: "Salud del cuero cabelludo y tratamiento de la caída: diagnóstico capilar, detox, masaje craneal y, en la versión avanzada, microneedling con factores de crecimiento.",
      texto: "Spa capilar Detox & Balance de hora y media.\n\nLimpia en profundidad el cuero cabelludo, equilibra la grasa, calma la irritación y nutre el folículo, con un masaje craneal muy relajante.",
      booksy: "SPA CAPILAR",
      variantes: [v("149,95 €", 90, "Spa capilar Detox & Balance"), v("349,95 €", 135, "Ritual regenerativo IR Médical con microneedling capilar")],
      bonos: ["Ahorras 69,85 € · Detox & Balance · 3 sesiones 380 €", "Ahorras 150,75 € · Detox & Balance · 5 sesiones 599 € (4 + 1 gratis)"],
      etiquetas: ["pelo", "caída", "alopecia", "caspa", "cuero cabelludo", "capilar", "microneedling"],
    },
    {
      id: "mio-estetico", grupo: "spa", img: F + "corporal.webp",
      nombre: "Programa regenerativo mio-estético",
      resumen: "Protocolo que trabaja músculo y piel a la vez para tonificar y regenerar.",
      texto: "Un protocolo regenerativo que trabaja a la vez la musculatura y la piel, para tonificar, mejorar la postura y regenerar los tejidos.",
      booksy: "PROGRAMA REGENERATIVO MIO",
      variantes: [v("119,95 €", 60)],
      etiquetas: ["músculo", "tonificar", "regenerativa"],
    },
    {
      id: "aromaterapia", grupo: "spa", img: F + "serum.webp",
      nombre: "Terapias relajantes con elementos naturales",
      resumen: "Aromaterapia con aceites esenciales puros para relajar cuerpo y mente.",
      texto: "Uso terapéutico de aceites esenciales puros, flores y elementos naturales en un masaje relajante que calma cuerpo y mente.",
      booksy: "TERAPIAS RELAJANTES",
      variantes: [v("79,95 €", 70)],
      etiquetas: ["aromaterapia", "aceites", "relax"],
    },
    {
      id: "infrarroja", grupo: "spa", img: F + "serum.webp",
      nombre: "Terapia de luz infrarroja",
      resumen: "Calor profundo que relaja, mejora la circulación y ayuda a la recuperación.",
      texto: "La luz infrarroja calienta los tejidos en profundidad: relaja la musculatura, activa la circulación y ayuda a la recuperación de la piel y el músculo.",
      booksy: "TERAPIA DE LUZ INFRARROJA",
      variantes: [v("desde 35,00 €", 30)],
      etiquetas: ["infrarrojo", "calor", "circulación"],
    },

    // ── Depilación ────────────────────────────────────────────────────
    {
      id: "depi-piernas", grupo: "depilacion", destacado: true, img: F + "piernas.webp",
      nombre: "Piernas enteras",
      resumen: "Depilación con cera de las piernas completas, para ellas y ellos.",
      texto: "Depilación con cera de las piernas completas. Para mujeres y hombres.",
      variantes: [v("34,95 €", 35)],
      etiquetas: ["cera", "piernas", "depilar"],
    },
    {
      id: "depi-intima", grupo: "depilacion", img: F + "piernas.webp",
      nombre: "Íntima: ingles, genitales y glúteos",
      resumen: "Depilación con cera de la zona íntima completa.",
      texto: "Depilación con cera de ingles, genitales y glúteos, con cuidado especial para la piel sensible de la zona.",
      variantes: [v("49,95 €", 60)],
      etiquetas: ["cera", "ingles", "brasileña", "íntima"],
    },
    {
      id: "depi-axilas", grupo: "depilacion", img: F + "piernas.webp",
      nombre: "Axilas y brazos",
      resumen: "Depilación con cera de axilas y brazos.",
      texto: "Depilación con cera de axilas y brazos completos.",
      variantes: [v("39,95 €", 30)],
      etiquetas: ["cera", "axilas", "brazos"],
    },
    {
      id: "depi-rostro", grupo: "depilacion", img: F + "facial.webp",
      nombre: "Rostro",
      resumen: "Cejas, entrecejo, labio y mejillas con cera.",
      texto: "Depilación con cera del rostro: cejas y entrecejo para definir la forma, labio superior, mentón y mejillas.",
      booksy: "DEPILACIÓN CON CERA ZONA ROSTRO",
      variantes: [v("29,95 €", 30)],
      etiquetas: ["cera", "cejas", "bigote", "labio", "cara"],
    },
    {
      id: "depi-pecho", grupo: "depilacion", img: F + "corporal.webp",
      nombre: "Pecho y espalda (caballero)",
      resumen: "Depilación con cera de pecho y espalda para hombre.",
      texto: "Depilación con cera de pecho y espalda para caballero.",
      variantes: [v("39,95 €", 40)],
      etiquetas: ["cera", "pecho", "espalda", "hombre"],
    },
    {
      id: "depi-abdomen", grupo: "depilacion", img: F + "corporal.webp",
      nombre: "Abdomen y línea alba",
      resumen: "Para controlar el vello central del abdomen.",
      texto: "Depilación con cera del abdomen y la línea alba, para controlar el vello central.",
      booksy: "DEPILACIÓN DE ABDOMEN",
      variantes: [v("29,95 €", 30)],
      etiquetas: ["cera", "abdomen", "barriga"],
    },
  ],

  barberia: [
    {
      id: "corte-caballero", grupo: "cortes", destacado: true, img: "corte",
      nombre: "Corte caballero",
      resumen: "Barbería clásica y moderna, adaptada a la forma de tu cara para un acabado preciso.",
      texto: "Barbería clásica y moderna, enfocada en la fisionomía de cada cliente para lograr acabados precisos y estilos que te representen.\n\nAndrés te asesora y adapta el corte a tu tipo de pelo y a tu día a día.",
      booksy: "CORTE CABALLERO",
      variantes: [v("14,95 €", 45)],
      etiquetas: ["corte", "pelo", "degradado", "fade", "hombre"],
    },
    {
      id: "corte-infantil", grupo: "cortes", img: "corte",
      nombre: "Corte infantil",
      resumen: "Paciencia y estilo para los más pequeños, con cortes que respetan cómo crece su pelo.",
      texto: "Psicología y paciencia aplicadas al estilo: cortes adaptables que respetan la dinámica del cabello en crecimiento, para que los peques salgan contentos.",
      booksy: "CORTE INFANTIL",
      variantes: [v("9,95 €", 45)],
      etiquetas: ["niño", "infantil", "corte"],
    },
    {
      id: "corte-senior", grupo: "cortes", img: "corte",
      nombre: "Corte jubilado",
      resumen: "Tijera y peine con suavidad y elegancia para cabellos maduros.",
      texto: "Maestría en tijera y peine para tratar los cabellos maduros con suavidad, priorizando la elegancia atemporal y la comodidad.",
      booksy: "CORTE JUBILADO",
      variantes: [v("9,95 €", 30)],
      etiquetas: ["mayores", "jubilado", "corte", "señor"],
    },
    {
      id: "puntas-mujer", grupo: "cortes", img: "corte",
      nombre: "Corte de puntas mujer + lavado + aceite",
      resumen: "Sanea tu melena: corte de puntas, lavado y aceite nutritivo.",
      texto: "Renueva tu melena con un servicio que incluye corte de puntas, lavado y aceite nutritivo para un acabado suave y brillante.",
      booksy: "CORTE DE PUNTAS MUJER",
      variantes: [v("29,95 €", 45)],
      etiquetas: ["mujer", "puntas", "melena", "lavado"],
    },
    {
      id: "ritual-rashpont", grupo: "rituales", destacado: true, img: "ritual",
      nombre: "Ritual Rash Pont",
      resumen: "Corte, diseño de barba y alta frecuencia en una sola cita. El completo de la casa.",
      texto: "Corte de pelo y diseño de barba con asesoramiento personalizado y un acabado impecable.\n\nTermina con alta frecuencia, que oxigena y sanea la piel después del afeitado.",
      booksy: "Ritual RashPont",
      variantes: [v("39,95 €", 60)],
      etiquetas: ["corte", "barba", "completo", "ritual"],
    },
    {
      id: "ritual-germaine", grupo: "rituales", destacado: true, img: "ritual",
      nombre: "Ritual Germaine de Capuccini",
      resumen: "Corte, barba y mascarilla facial de alta gama. Sales nuevo.",
      texto: "Corte de pelo personalizado, diseño de barba y una mascarilla facial de Germaine de Capuccini para cuidar la piel. La experiencia más completa de la barbería.",
      booksy: "Ritual Germaine",
      variantes: [v("45,95 €", 90)],
      etiquetas: ["corte", "barba", "mascarilla", "ritual", "regalo"],
    },
    {
      id: "barba-spa", grupo: "barba", destacado: true, img: "barba",
      nombre: "Ritual de barba spa + masaje facial",
      resumen: "Toalla caliente, masaje facial, exfoliación y diseño de barba. El favorito de sus clientes.",
      texto: "Diseño de barba y ritual de afeitado que combina técnicas tradicionales con cuidado facial.\n\nToalla caliente, masaje facial suave, limpieza exfoliante de la barba y retoque de cejas.\n\n«Se toman el tiempo para ponerte la toalla caliente, un leve masaje facial, limpieza exfoliante en la barba y retoque de cejas.» Patricio, en Booksy.",
      booksy: "RITUAL DE BARBA",
      variantes: [v("17,95 €", 35)],
      etiquetas: ["barba", "toalla caliente", "afeitado", "masaje"],
    },
    {
      id: "barba-express", grupo: "barba", img: "barba",
      nombre: "Recorte de barba express",
      resumen: "Delineado rápido con navaja para mantener tu estilo entre visitas.",
      texto: "Higiene impecable y delineado rápido con navaja para mantener la estructura de tu barba entre servicios.",
      booksy: "RECORTE DEBARBA",
      variantes: [v("8,95 €", 15)],
      etiquetas: ["barba", "navaja", "perfilar"],
    },
    {
      id: "barba-canas", grupo: "barba", img: "color",
      nombre: "Tinte de canas de barba",
      resumen: "Cubre canas y rellena huecos con un acabado natural.",
      texto: "Un acabado natural y definido: cubre las canas de la barba y rellena las zonas con menos densidad.",
      booksy: "Tinturacion de Canas",
      variantes: [v("7,95 €", 15)],
      etiquetas: ["canas", "barba", "tinte"],
    },
    {
      id: "limpieza-pink", grupo: "facial", img: "facial",
      nombre: "Limpieza facial + Pink Mask",
      resumen: "Limpieza que elimina puntos negros y mascarilla Elevel3 Pink.",
      texto: "Limpieza facial masculina con mascarilla Elevel3 Pink Mask: elimina puntos negros, limpia los poros y deja la piel fresca.",
      booksy: "Limpieza Facial + ELEVEL3 Pink",
      variantes: [v("20,95 €", 30)],
      etiquetas: ["limpieza", "facial", "puntos negros", "mascarilla"],
    },
    {
      id: "limpieza-black", grupo: "facial", img: "facial",
      nombre: "Limpieza facial + Black Mask",
      resumen: "Renovación total con la mascarilla negra peel-off Elevel3.",
      texto: "Renovación total: limpieza facial y mascarilla Elevel3 Black Mask peel-off para una piel impecable.",
      booksy: "Limpieza Facial + ELEVEL3 Black",
      variantes: [v("20,95 €", 30)],
      etiquetas: ["limpieza", "facial", "black mask", "poros"],
    },
    {
      id: "canas-pelo", grupo: "color", img: "color",
      nombre: "Cubrir canas del cabello",
      resumen: "Aspecto más joven con un cubrimiento de canas natural.",
      texto: "Recupera un aspecto juvenil con un cubrimiento de canas profesional y de acabado natural.",
      booksy: "Cubrimiento de Canas",
      variantes: [v("29,95 €", 45)],
      etiquetas: ["canas", "tinte", "color"],
    },
    {
      id: "color-global", grupo: "color", img: "color",
      nombre: "Color global",
      resumen: "Un color completo e impecable, desde tonos naturales hasta los más atrevidos.",
      texto: "Lleva tu look al siguiente nivel con un color global impecable, desde tonos naturales hasta acabados más atrevidos.",
      booksy: "Color Global",
      variantes: [v("59,95 €", 150)],
      etiquetas: ["color", "tinte", "rubio", "platino"],
    },
    {
      id: "mechas", grupo: "color", img: "color",
      nombre: "Mechas hombre",
      resumen: "Rayitos y mechas para dar luz y movimiento a tu pelo.",
      texto: "Rayitos y mechas para hombre: una técnica de iluminación que da luz y movimiento a tu estilo.",
      booksy: "Mechas Hombre",
      variantes: [v("49,95 €", 120)],
      etiquetas: ["mechas", "rayitos", "color"],
    },
    {
      id: "permanente", grupo: "color", img: "color",
      nombre: "Ondulación permanente",
      resumen: "Ondas duraderas para cabello medio y largo, natural o tratado.",
      texto: "Ondulación permanente para cabello medio y largo, natural o tratado.",
      booksy: "ONDULACION PERMANENTE",
      variantes: [v("70,00 €", 60)],
      etiquetas: ["permanente", "rizos", "ondas"],
    },
    {
      id: "cejas-color", grupo: "detalles", img: "detalle",
      nombre: "Coloración y diseño de cejas",
      resumen: "Define y da intensidad a la mirada con color semipermanente.",
      texto: "Define, rellena y da intensidad a tu mirada con una coloración semipermanente adaptada a tu tono.",
      booksy: "Coloración Y Diseño De Cejas",
      variantes: [v("15,95 €", 15)],
      etiquetas: ["cejas", "color", "mirada"],
    },
    {
      id: "cejas-cuchilla", grupo: "detalles", img: "detalle",
      nombre: "Perfilado de cejas con cuchilla",
      resumen: "Un acabado limpio y profesional para definir la mirada.",
      texto: "Perfilado de cejas con navaja para definir la mirada con un acabado limpio y profesional.",
      booksy: "Depilación de Ceja",
      variantes: [v("4,95 €", 10)],
      etiquetas: ["cejas", "navaja"],
    },
    {
      id: "nariz", grupo: "detalles", img: "detalle",
      nombre: "Depilación nasal con cera",
      resumen: "Adiós al vello visible de la nariz, de forma rápida e higiénica.",
      texto: "Elimina de forma rápida e higiénica el vello visible de la nariz con cera.",
      booksy: "Depilación de Nasal",
      variantes: [v("4,95 €", 10)],
      etiquetas: ["nariz", "cera", "vello"],
    },
    {
      id: "oidos", grupo: "detalles", img: "detalle",
      nombre: "Depilación de oídos",
      resumen: "Eliminación suave del vello del oído con cera de baja fusión.",
      texto: "Eliminación suave y eficaz del vello no deseado del pabellón auricular con cera de baja fusión.",
      booksy: "Depilación del conducto",
      variantes: [v("4,95 €", 10)],
      etiquetas: ["oídos", "orejas", "cera", "vello"],
    },
  ],
};

// Nombre con el que se reserva (y se guarda en la agenda) cada opción
export const nombreReserva = (t: Tratamiento, va: Variante) => (va.nombre ? `${t.nombre} · ${va.nombre}` : t.nombre);

export const RESENAS: Record<Parte, { nombre: string; texto: string; servicio: string }[]> = {
  estetica: [
    { nombre: "Emilia", servicio: "Tratamiento facial con Raquel", texto: "Estoy muy contenta con mi tratamiento facial. Los productos son de alta gama y mi piel lo reconoce: me siento fantástica." },
    { nombre: "Alessandra", servicio: "Ritual antiedad y firmeza premium", texto: "Me encantó todo. El espacio es acogedor y trabajan con profesionalidad. Raquel es una profesional de confianza." },
    { nombre: "Manuela", servicio: "Con Raquel", texto: "Encantada de los resultados, sin duda repito. La atención es de primera." },
    { nombre: "Paco", servicio: "Corte y limpieza Phoenix", texto: "Me hicieron un corte estupendo y mi esposa se hizo una limpieza Phoenix muy buena. Lo recomiendo." },
  ],
  barberia: [
    { nombre: "Patricio", servicio: "Ritual de barba spa", texto: "Una experiencia increíble. Se toman el tiempo para ponerte la toalla caliente, un masaje facial, limpieza exfoliante en la barba y retoque de cejas." },
    { nombre: "Gabriel", servicio: "Corte caballero", texto: "Very good barber! Listens to what the customer wants, and the whole staff is super friendly. I will go there again." },
    { nombre: "Raúl", servicio: "Corte caballero", texto: "Me corté el pelo y viví una experiencia muy agradable con el barbero." },
    { nombre: "Gustavo", servicio: "Corte caballero", texto: "Muy buena persona y muy buen barbero. Lo recomiendo." },
  ],
};
