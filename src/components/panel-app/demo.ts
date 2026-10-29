// Datos inventados para el panel de muestra (/admin): clientas, tratamientos y citas
// alrededor de hoy, respetando el horario. No se usan en las estéticas de verdad.
import { toDS } from "./tema";

export const SCHED: Record<number, { s: number; e: number }[] | null> = {
  1: [{ s: 10, e: 14 }, { s: 16, e: 20 }], 2: [{ s: 9, e: 15 }],
  3: [{ s: 10, e: 14 }, { s: 16, e: 20 }], 4: [{ s: 9, e: 15 }],
  5: [{ s: 10, e: 14 }, { s: 16, e: 20 }], 6: [{ s: 10, e: 14 }], 0: null,
};

const NAMES=[
  ["Ana Martínez","612 445 789"],["Laura Gómez","655 231 908"],["Carmen Ruiz","699 112 334"],
  ["Pilar Sanz","634 220 118"],["Sofía Delgado","634 887 221"],["Marta Vidal","677 543 112"],
  ["Eva Núñez","611 887 442"],["Raquel Mora","688 220 991"],["Elena Torres","622 908 776"],
  ["Julia Navarro","688 334 129"],["Rosa Iglesias","611 220 448"],["Patricia León","645 771 003"],
  ["Nuria Campos","699 445 228"],["Cristina Ramos","654 118 776"],["Beatriz Solís","633 992 114"],
  ["Silvia Ortiz","622 334 887"],["Andrea Blanco","688 776 221"],["Isabel Prado","611 445 990"],
  ["Alicia Ferrán","644 112 887"],["Mónica Sáez","677 990 331"],["Lorena Ruiz","622 445 118"],
  ["Teresa Vega","655 003 221"],["Sara Molina","688 112 443"],["Daniel Ortega","611 778 220"],
  ["Nerea Puig","644 220 995"],["Clara Benítez","699 331 007"],["Inés Carvajal","633 445 882"],
  ["Verónica Salas","622 118 003"],["Marina Lozano","677 220 449"],["Alba Reyes","611 993 228"],
  ["Yolanda Gil","644 887 110"],["Paula Herrero","688 445 003"],["Lidia Cano","622 770 118"],
  ["Rocío Amaya","655 112 990"],["Miriam Duarte","633 220 447"],["Sandra Peña","611 445 228"],
  ["Natalia Ibáñez","677 003 991"],["Gema Escudero","622 887 445"],["Ángela Ríos","644 220 118"],
  ["Carla Méndez","688 991 003"],["Laura Ferrer","677 001 553"],["Susana Torres","611 220 887"],
  ["Amaia Etxebarria","644 445 003"],["Olga Barrios","699 118 220"],["Emma Rivas","677 445 991"],
  ["Diana Solé","611 887 003"],["Tania Villar","644 991 228"],["Sonia Aguilar","688 220 447"],
  ["Javier Nieto","622 003 118"],["Marta Coll","677 118 990"],["Irene Bravo","633 771 004"],
  ["Noelia Prats","655 448 002"],["Celia Marín","611 336 998"],["Vanesa Roldán","688 004 771"],
  ["Sergio Alcántara","622 990 336"],["Lidia Bermejo","644 118 557"],["Aitana Cortés","677 552 883"],
  ["Berta Lorenzo","699 007 445"],["Sonia Peral","633 889 112"],["Miguel Ángel Ruiz","611 774 220"],
  ["Alejandra Cid","655 220 889"],["Fátima Ojeda","688 557 003"],["Sonia Vargas","622 881 447"],
  ["Marta Reina","644 003 992"],["Elisa Quintero","677 336 118"],["Paula Cabrera","699 992 004"],
];

const POOL=[
  {s:"Dermapen",p:80},{s:"Exsomas",p:80},{s:"Glow Up Super Luminosidad",p:80},
  {s:"Cóctel de Vitaminas",p:65},{s:"Retinal",p:70},{s:"Radiofrecuencia Facial",p:25},
  {s:"Higiene Facial + IPL",p:40},{s:"Hidrafacial",p:35},{s:"Hidrafacial",p:35},
  {s:"Cavitación + Maderoterapia",p:38},{s:"Radiofrecuencia + Maderoterapia",p:38},
  {s:"Radiofrecuencia Corporal",p:25},{s:"Presoterapia",p:15},{s:"Presoterapia",p:15},
  {s:"Body Sculp Vibratorio",p:45},{s:"Cuerpo Completo (Ellas)",p:69},
  {s:"Cuerpo Completo (Ellos)",p:89},{s:"Axilas + Ingles",p:25},{s:"Facial Láser",p:9},
  {s:"Labio",p:6},{s:"Piernas Completas",p:29},{s:"Piernas + Axilas",p:39},
  {s:"Pubis",p:19},{s:"Pecho / Espalda (Ellos)",p:29},
];

const NOTE_POOL=[
  "Primera sesión. Revisar historial.","Bono 10 sesiones · sesión 3",
  "Bono 5 sesiones · sesión 2","Alergia a lidocaína. Usar alternativa.",
  "Nueva clienta desde Instagram","Pidió cambiar de hora si hay hueco",
  "Piel sensible. Bajar intensidad.","Sesión de seguimiento",
  "Viene con su hermana, preguntar por hueco doble","Pagó por adelantado",
  "Repite tratamiento del mes pasado","Prefiere aviso por WhatsApp el día antes",
];


// Citas de ejemplo alrededor de hoy (desde el mes pasado hasta dentro de dos meses),
// respetando el horario. Sirven para enseñar el panel; se pueden borrar en «Resumen».
export function generarDemo(hoy:Date){
  let seed=987654321;
  const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  const out:any[]=[];
  let id=1;
  const start=new Date(hoy.getFullYear(),hoy.getMonth()-1,1);
  // Hasta el final del mes que viene a dos meses vista (en octubre, todo diciembre)
  const end=new Date(hoy.getFullYear(),hoy.getMonth()+3,0);
  for(const dt=new Date(start);dt<=end;dt.setDate(dt.getDate()+1)){
    const sc=(SCHED as any)[dt.getDay()];
    if(!sc)continue;
    const ds=toDS(dt);
    const ahead=Math.round((dt.getTime()-hoy.getTime())/86400000);
    // Ocupación: alta en el pasado y los próximos días, más baja cuanto más lejos
    const fill=ahead<0?0.78:ahead<=3?0.8:ahead<=10?0.65:0.6;
    for(const{s,e}of sc){
      for(let h=s;h<e;h++){
        if(rnd()>fill)continue;
        const n=NAMES[Math.floor(rnd()*NAMES.length)];
        const sv=POOL[Math.floor(rnd()*POOL.length)];
        // Sin confirmar, solo algunas de la próxima semana (las que salen en «Avisos»)
        const status=(rnd()>0.75&&ahead>=0&&ahead<=7)?"pendiente":"confirmada";
        const notes=rnd()>0.86?NOTE_POOL[Math.floor(rnd()*NOTE_POOL.length)]:"";
        out.push({id:id++,date:ds,time:h,dur:60,client:n[0],phone:n[1],
          service:sv.s,price:sv.p+"€",status,notes});
      }
    }
  }
  return out;
}

export function demoBlocked(hoy:Date){
  const at=(d:number)=>{const x=new Date(hoy);x.setDate(x.getDate()+d);return toDS(x);};
  return [
    {date:at(-12),time:13,dur:60,reason:"Entrega de material"},
    {date:at(-5),time:19,dur:60,reason:"Cita con proveedor"},
    {date:at(2),time:13,dur:60,reason:"Comida familiar"},
    {date:at(6),time:9,dur:60,reason:"Formación láser"},
    {date:at(6),time:10,dur:60,reason:"Formación láser"},
  ];
}


// Donde el panel de muestra guarda sus datos en este móvil
export const DEMO_STORE="estetica-panel-v2";
// Reservas hechas en la web de muestra que el panel de muestra aún no ha recogido
const NUEVAS="alfrega-demo-nuevas";

export type ReservaDemo={date:string;time:number;dur:number;client:string;phone:string;service:string;price:string};

// La web de muestra deja aquí la reserva para que aparezca en el panel de muestra del mismo móvil
export function guardarReservaDemo(r:ReservaDemo){
  try{
    const l=JSON.parse(localStorage.getItem(NUEVAS)||"[]");
    l.push(r);
    localStorage.setItem(NUEVAS,JSON.stringify(l));
  }catch{}
}

// El panel de muestra las recoge (y las borra de la cola)
export function recogerReservasDemo():ReservaDemo[]{
  try{
    const l=JSON.parse(localStorage.getItem(NUEVAS)||"[]");
    localStorage.removeItem(NUEVAS);
    return Array.isArray(l)?l:[];
  }catch{return [];}
}

// Horas ya ocupadas en el panel de muestra, para que la web de muestra no las ofrezca: { "2026-11-02": [{ini, fin}] }
export function ocupadoDemo(hoy:Date){
  let citas:any[]=[],bloq:any[]=[];
  try{
    const g=JSON.parse(localStorage.getItem(DEMO_STORE)||"null");
    citas=g?.bookings??generarDemo(hoy);
    bloq=g?.blocked??demoBlocked(hoy);
  }catch{citas=generarDemo(hoy);bloq=demoBlocked(hoy);}
  try{
    citas=citas.concat(JSON.parse(localStorage.getItem(NUEVAS)||"[]"));
  }catch{}
  const m:Record<string,{ini:number;fin:number}[]>={};
  for(const c of [...citas.filter((c)=>c.status!=="cancelada"),...bloq]){
    const ini=Math.round(c.time*60);
    (m[c.date]??=[]).push({ini,fin:ini+(c.dur||60)});
  }
  return m;
}
