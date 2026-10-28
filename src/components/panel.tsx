"use client";

import { useState, useEffect, useCallback } from "react";
import { SERVICES, type Service } from "@/lib/data";
import { useNegocio, categorias, huecosLibres, duracion, type Horario } from "@/components/negocio";
import { db } from "@/lib/supabase";
import { CalendarDays, Bell, Users, Menu, Plus, Ban, ChevronLeft, ChevronRight, ChartColumn, List, ExternalLink, LogOut } from "lucide-react";

// Estética real (desde /panel, con la dueña ya dentro). Sin esto, el panel es la demo con datos inventados.
export interface PanelReal {
  salonId: string;
  slug: string;
  nombre: string;
  horario: Horario;
  servicios: Service[];
  onSalir: () => void;
}

// Fila de la base de datos → la forma que usa el panel
// time = hora de inicio en horas (10.5 = 10:30); dur = minutos que dura
const deCita=(c:any)=>({id:c.id,date:c.fecha,time:c.hora+(c.minuto||0)/60,dur:c.duracion_min||60,client:c.nombre,phone:c.telefono||"",
  service:c.tratamiento,price:`${Number(c.precio||0)}€`,status:c.estado,notes:c.notas||"",origen:c.origen,
  aviso:!!c.aviso_enviado,rec:!!c.recordatorio_enviado,res:!!c.resena_pedida});
const deBloqueo=(b:any)=>({id:b.id,date:b.fecha,time:b.hora+(b.minuto||0)/60,dur:b.duracion_min||60,reason:b.motivo||"No disponible"});

const G="#B8922A", DR="#8B2252", ROSE="#D4929A";
const BG="#F0E8E0", BG2="#E8DDD4", DARK="#1A1A1A", DARK2="#2C2C2C";
const CH="#1A1A1A", MT="#8A7A70";
const GREEN="#4A7A64", RED="#B54A4A", AMBER="#C98A3E";

const SCHED={
  1:[{s:10,e:14},{s:16,e:20}], 2:[{s:9,e:15}],
  3:[{s:10,e:14},{s:16,e:20}], 4:[{s:9,e:15}],
  5:[{s:10,e:14},{s:16,e:20}], 6:[{s:10,e:14}], 0:null,
};
const DAYS=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const DAYS_FULL=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MONTHS=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

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

const toDS=(dt:Date)=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;

// Citas de ejemplo alrededor de hoy (desde el mes pasado hasta dentro de 3 semanas),
// respetando el horario. Sirven para enseñar el panel; se pueden borrar en «Resumen».
function generarDemo(hoy:Date){
  let seed=987654321;
  const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  const out:any[]=[];
  let id=1;
  const start=new Date(hoy.getFullYear(),hoy.getMonth()-1,1);
  const end=new Date(hoy);end.setDate(end.getDate()+21);
  for(const dt=new Date(start);dt<=end;dt.setDate(dt.getDate()+1)){
    const sc=(SCHED as any)[dt.getDay()];
    if(!sc)continue;
    const ds=toDS(dt);
    const ahead=Math.round((dt.getTime()-hoy.getTime())/86400000);
    // Ocupación: alta en el pasado y los próximos días, más baja cuanto más lejos
    const fill=ahead<0?0.78:ahead<=3?0.8:ahead<=10?0.55:0.3;
    for(const{s,e}of sc){
      for(let h=s;h<e;h++){
        if(rnd()>fill)continue;
        const n=NAMES[Math.floor(rnd()*NAMES.length)];
        const sv=POOL[Math.floor(rnd()*POOL.length)];
        const status=(ahead>=0&&rnd()>0.75)?"pendiente":"confirmada";
        const notes=rnd()>0.86?NOTE_POOL[Math.floor(rnd()*NOTE_POOL.length)]:"";
        out.push({id:id++,date:ds,time:h,dur:60,client:n[0],phone:n[1],
          service:sv.s,price:sv.p+"€",status,notes});
      }
    }
  }
  return out;
}

function demoBlocked(hoy:Date){
  const at=(d:number)=>{const x=new Date(hoy);x.setDate(x.getDate()+d);return toDS(x);};
  return [
    {date:at(-12),time:13,dur:60,reason:"Entrega de material"},
    {date:at(-5),time:19,dur:60,reason:"Cita con proveedor"},
    {date:at(2),time:13,dur:60,reason:"Comida familiar"},
    {date:at(6),time:9,dur:60,reason:"Formación láser"},
    {date:at(6),time:10,dur:60,reason:"Formación láser"},
  ];
}

const STORE="estetica-panel-v1";

// Teléfono de la clienta → enlace de WhatsApp (añade el 34 si es un móvil español)
const waTo=(phone:string,msg:string)=>{
  let n=(phone||"").replace(/\D/g,"");
  if(n.length===9)n="34"+n;
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
};
const firstName=(c:string)=>(c||"").split(" ")[0];
const hhmm=(h:number)=>{const m=Math.round(h*60);return `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;};

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fu{animation:fadeUp .5s ease both}
  .pulse{animation:pulse 2s ease-in-out infinite}
  .float{animation:floatY 5s ease-in-out infinite}
  .row:hover{background:${BG2}!important}
  .card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.09)}
  .navbtn:hover{color:${G}!important}
  .slot:hover{filter:brightness(.96)}
  input:focus,select:focus,textarea:focus{border-color:${G}!important;box-shadow:0 0 0 3px rgba(201,169,110,.14);outline:none}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-thumb{background:${G}55;border-radius:3px}
  a{text-decoration:none}
  html,body{-webkit-tap-highlight-color:transparent}
  @media(max-width:640px){.semana-grid{grid-template-columns:1fr!important;min-width:0!important}.semana-dia{min-height:0!important}}
  @media(max-width:640px){.hide-sm{display:none!important}}
`;

function Lotus({size=32,color=G}:{size?:number,color?:string}){
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 52C32 52 12 40 12 24C12 16 20 10 28 14C28 14 24 20 24 28C24 28 28 22 32 20C36 22 40 28 40 28C40 20 36 14 36 14C44 10 52 16 52 24C52 40 32 52 32 52Z" fill={color} opacity=".9"/>
      <path d="M32 52C32 52 20 44 18 34C22 36 26 40 32 44C38 40 42 36 46 34C44 44 32 52 32 52Z" fill={color} opacity=".4"/>
    </svg>
  );
}

export function Panel({real}:{real?:PanelReal}){
  const [view,setView]=useState("agenda");
  const [mas,setMas]=useState(false); // menú «Más» de la barra de abajo
  const [calModo,setCalModo]=useState<"dia"|"semana"|"mes">("dia"); // pestaña Agenda
  const demoNegocio=useNegocio();
  const NEGOCIO=real?{...demoNegocio,nombre:real.nombre}:demoNegocio;
  const HOR:any=real?real.horario:SCHED;
  const SV:Service[]=real?real.servicios:SERVICES;
  const [ready,setReady]=useState(false);
  const [today,setToday]=useState("");
  const [bookings,setBookings]=useState<any[]>([]);
  const [blocked,setBlocked]=useState<any[]>([]);
  const [selDate,setSelDate]=useState("");
  const [newBk,setNewBk]=useState<any>(null);
  const [noteDraft,setNoteDraft]=useState("");
  const [search,setSearch]=useState("");
  const [sent,setSent]=useState<Record<string,boolean>>({});
  const [detail,setDetail]=useState<any>(null);
  const [blockModal,setBlockModal]=useState<any>(null);
  const [hueco,setHueco]=useState<{date:string,min:number}|null>(null); // media hora libre tocada en la rejilla
  const [blockReason,setBlockReason]=useState("");
  const [calM,setCalM]=useState(new Date());
  const [toast,setToast]=useState("");
  const [toastAccion,setToastAccion]=useState<{label:string,fn:()=>void}|null>(null);

  const salonId=real?.salonId;
  const storeKey=real?`${STORE}-${real.slug}`:STORE;

  // Estética real: citas y bloqueos de la base de datos
  const cargarDB=useCallback(async(avisar=false)=>{
    if(!salonId)return;
    const [c,b]=await Promise.all([
      db().from("citas").select("*").eq("salon_id",salonId).neq("estado","cancelada"),
      db().from("bloqueos").select("*").eq("salon_id",salonId),
    ]);
    if(c.error||b.error){setToast("No se pudo cargar. Revisa la conexión.");return;}
    const nuevas=(c.data??[]).map(deCita);
    setBookings((antes:any[])=>{
      if(avisar){
        const ya=new Set(antes.map((x:any)=>x.id));
        const n=nuevas.filter((x:any)=>!ya.has(x.id)&&x.origen==="web").length;
        if(n){setToast(`🔔 ${n} reserva${n>1?"s":""} nueva${n>1?"s":""} desde la web`);setTimeout(()=>setToast(""),4000);}
      }
      return nuevas;
    });
    setBlocked((b.data??[]).map(deBloqueo));
  },[salonId]);

  // Al abrir: fecha real de hoy y los datos (de la base de datos, o de este dispositivo en la demo)
  useEffect(()=>{
    const hoy=new Date();hoy.setHours(0,0,0,0);
    let saved:any=null;
    try{saved=JSON.parse(localStorage.getItem(storeKey)||"null");}catch{}
    const t=setTimeout(async()=>{
      setToday(toDS(hoy));setSelDate(toDS(hoy));
      setCalM(new Date(hoy.getFullYear(),hoy.getMonth(),1));
      if(salonId){await cargarDB();}
      else{
        setBookings(saved?.bookings??generarDemo(hoy));
        setBlocked(saved?.blocked??demoBlocked(hoy));
      }
      setSent(saved?.sent??{});
      setReady(true);
    },0);
    return()=>clearTimeout(t);
  },[salonId,storeKey,cargarDB]);
  // Cada minuto y al volver a la pestaña, mira si han entrado reservas nuevas
  useEffect(()=>{
    if(!salonId)return;
    const id=setInterval(()=>cargarDB(true),60000);
    const foco=()=>{if(document.visibilityState==="visible")cargarDB(true);};
    document.addEventListener("visibilitychange",foco);
    return()=>{clearInterval(id);document.removeEventListener("visibilitychange",foco);};
  },[salonId,cargarDB]);
  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem(storeKey,JSON.stringify(salonId?{sent}:{bookings,blocked,sent}));}catch{}
  },[ready,bookings,blocked,sent,salonId,storeKey]);
  const detailId=detail?.id;
  useEffect(()=>{
    const t=setTimeout(()=>setNoteDraft(detail?.notes||""),0);
    return()=>clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[detailId]);

  const serif={fontFamily:"'Roboto',Helvetica,sans-serif"};
  const sans={fontFamily:"'Roboto',Helvetica,sans-serif"};

  // Aviso abajo; con «accion» sale un botón (p. ej. «Deshacer») y dura más
  const showToast=(m:string,accion?:{label:string,fn:()=>void})=>{
    setToast(m);setToastAccion(accion??null);
    const id=Date.now();(showToast as any).ultimo=id;
    setTimeout(()=>{if((showToast as any).ultimo===id){setToast("");setToastAccion(null);}},accion?7000:2600);
  };

  const parseD=(ds:string)=>{const[y,m,d]=ds.split("-").map(Number);return new Date(y,m-1,d);};
  const fmtD=(ds:string)=>{const dt=parseD(ds);return `${DAYS_FULL[dt.getDay()]}, ${dt.getDate()} de ${MONTHS[dt.getMonth()]}`;};
  const getSlots=(ds:string)=>{
    const sc=HOR[parseD(ds).getDay()];
    if(!sc)return[];
    const out:any[]=[];
    for(const{s,e}of sc)for(let h=s;h<e;h++){
      const bk=bookings.find((b:any)=>b.date===ds&&b.time<h+1&&b.time+(b.dur||60)/60>h);
      const bl=blocked.find((b:any)=>b.date===ds&&b.time<h+1&&b.time+(b.dur||60)/60>h);
      out.push({h,booking:bk,block:bl});
    }
    return out;
  };

  const dayBookings=bookings.filter((b:any)=>b.date===selDate).sort((a:any,b:any)=>a.time-b.time);
  const slots=getSlots(selDate);
  // Minutos ocupados de un día (citas y bloqueos), para buscar huecos
  const ocupadoDia=(ds:string)=>[
    ...bookings.filter((b:any)=>b.date===ds).map((b:any)=>({ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60)})),
    ...blocked.filter((b:any)=>b.date===ds).map((b:any)=>({ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60)})),
  ];
  // Agenda del día: citas, bloqueos y los ratos libres entre medias
  const agenda=(ds:string)=>{
    const tramos=HOR[parseD(ds).getDay()]||[];
    const items:any[]=[
      ...bookings.filter((b:any)=>b.date===ds).map((b:any)=>({tipo:"cita",ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60),b})),
      ...blocked.filter((b:any)=>b.date===ds).map((b:any)=>({tipo:"bloqueo",ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60),b})),
    ];
    for(const{s:ts,e:te}of tramos){
      let t=ts*60;
      const dentro=items.filter(x=>x.tipo!=="libre"&&x.fin>ts*60&&x.ini<te*60).sort((a,b)=>a.ini-b.ini);
      for(const x of dentro){if(x.ini>t)items.push({tipo:"libre",ini:t,fin:x.ini});t=Math.max(t,x.fin);}
      if(t<te*60)items.push({tipo:"libre",ini:t,fin:te*60});
    }
    return items.sort((a,b)=>a.ini-b.ini||(a.tipo==="libre"?1:-1));
  };
  const libresMin=agenda(selDate).filter(x=>x.tipo==="libre").reduce((n,x)=>n+x.fin-x.ini,0);
  const freeCount=libresMin%60?`${(libresMin/60).toFixed(1).replace(".",",")} h`:`${libresMin/60} h`;
  const revenue=dayBookings.reduce((sum:number,b:any)=>sum+parseInt(b.price)||0,0);
  // ¿Ya se le mandó ese WhatsApp? conf = detalles de la cita, rec = recordatorio, res = reseña
  const COL:Record<string,string>={conf:"aviso_enviado",rec:"recordatorio_enviado",res:"resena_pedida"};
  const CAMPO:Record<string,string>={conf:"aviso",rec:"rec",res:"res"};
  const enviado=(k:string,b?:any)=>!!sent[k]||!!(b&&b[CAMPO[k.split("-")[0]]]);
  // Reservas a las que aún no se les ha mandado el WhatsApp con los detalles
  const pending=bookings.filter((b:any)=>b.date>=today&&(b.origen==="web"||b.status==="pendiente")&&!enviado(`conf-${b.id}`,b))
    .sort((a:any,b:any)=>a.date===b.date?a.time-b.time:a.date.localeCompare(b.date));

  // Week days
  const selDt=parseD(selDate);
  const weekStart=new Date(selDt);
  weekStart.setDate(selDt.getDate()-((selDt.getDay()+6)%7));
  const weekDays=Array.from({length:7},(_,i)=>{
    const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d;
  });

  // En la estética real cada cambio se guarda en la base de datos; si falla, se recarga lo que hay
  const guardar=async(q:PromiseLike<{error:any}>)=>{
    const {error}=await q;
    if(error){
      showToast(/duplicate|unique|disponible/i.test(error.message)?"Esa hora ya está ocupada":"No se pudo guardar. Inténtalo de nuevo.");
      cargarDB();
      return false;
    }
    return true;
  };
  const cambiarEstado=(id:any,status:string)=>{
    setBookings((p:any[])=>p.map(b=>b.id===id?{...b,status}:b));
    if(salonId)guardar(db().from("citas").update({estado:status}).eq("id",id));
  };
  const confirmBk=(id:any)=>{
    cambiarEstado(id,"confirmada");
    showToast("Cita confirmada ✓");
    setDetail(null);
  };
  const cancelBk=(id:any)=>{
    const antes=bookings.find((b:any)=>b.id===id);
    setBookings((p:any[])=>p.filter(b=>b.id!==id));
    if(salonId)guardar(db().from("citas").update({estado:"cancelada"}).eq("id",id));
    setDetail(null);
    if(!antes)return;
    showToast(`Cita de ${firstName(antes.client)} cancelada`,{label:"Deshacer",fn:async()=>{
      if(salonId&&!await guardar(db().from("citas").update({estado:antes.status}).eq("id",id)))return;
      setBookings((p:any[])=>[...p,antes]);
      showToast("Cita recuperada ✓");
    }});
  };
  // blockModal = {date, min (inicio en minutos o null), dur (minutos)}
  const doBlock=async()=>{
    const {date,min,dur}=blockModal;
    const nuevo:any={date,time:min/60,dur,reason:blockReason||"No disponible"};
    setBlockModal(null);setBlockReason("");
    if(salonId){
      const {data,error}=await db().from("bloqueos").insert({salon_id:salonId,fecha:date,hora:Math.floor(min/60),minuto:min%60,
        duracion_min:dur,motivo:nuevo.reason}).select("id").single();
      if(error){showToast("No se pudo bloquear. Inténtalo de nuevo.");return;}
      nuevo.id=data.id;
    }
    setBlocked((p:any[])=>[...p,nuevo]);
    showToast(`Bloqueado de ${hhmm(min/60)} a ${hhmm((min+dur)/60)}`);
  };
  const unblock=(b:any)=>{
    setBlocked((p:any[])=>p.filter(x=>x!==b));
    if(salonId&&b.id)guardar(db().from("bloqueos").delete().eq("id",b.id));
    showToast(`Liberado de ${hhmm(b.time)} a ${hhmm(b.time+(b.dur||60)/60)}`,{label:"Deshacer",fn:async()=>{
      if(salonId){
        const {data,error}=await db().from("bloqueos").insert({salon_id:salonId,fecha:b.date,hora:Math.floor(b.time),
          minuto:Math.round((b.time%1)*60),duracion_min:b.dur||60,motivo:b.reason}).select("id").single();
        if(error){showToast("No se pudo deshacer");return;}
        b={...b,id:data.id};
      }
      setBlocked((p:any[])=>[...p,b]);
    }});
  };

  const saveNote=(id:any)=>{
    setBookings((p:any[])=>p.map(b=>b.id===id?{...b,notes:noteDraft}:b));
    setDetail((d:any)=>d&&{...d,notes:noteDraft});
    if(salonId)guardar(db().from("citas").update({notas:noteDraft}).eq("id",id));
    showToast("Nota guardada ✓");
  };
  // min = minutos del día en que empieza (opcional)
  const openNew=(date?:string,min?:number)=>{
    setBlockModal(null);setBlockReason("");
    setNewBk({client:"",phone:"",service:SV[0]?.name??"",date:date||selDate,time:min??"",notes:""});
  };
  const saveNew=async()=>{
    if(!newBk.client.trim()||newBk.time===""){showToast("Falta el nombre o la hora");return;}
    const sv=SV.find(x=>x.name===newBk.service);
    const ini=Number(newBk.time);
    const cita={date:newBk.date,time:ini/60,dur:duracion(sv?.dur),client:newBk.client.trim(),
      phone:newBk.phone.trim(),service:newBk.service,price:`${parseInt(sv?.price||"0")||0}€`,
      status:"confirmada",notes:newBk.notes.trim()};
    let id:any=Math.max(0,...bookings.map((b:any)=>typeof b.id==="number"?b.id:0))+1;
    if(salonId){
      const {data,error}=await db().from("citas").insert({salon_id:salonId,fecha:cita.date,hora:Math.floor(ini/60),minuto:ini%60,duracion_min:cita.dur,
        nombre:cita.client,telefono:cita.phone||null,tratamiento:cita.service,precio:parseInt(sv?.price||"0")||null,
        estado:"confirmada",origen:"panel",notas:cita.notes||null}).select("id").single();
      if(error){showToast(/duplicate|unique|disponible/i.test(error.message)?"Esa hora ya está ocupada":"No se pudo guardar la cita");return;}
      id=data.id;
    }
    setBookings((p:any[])=>[...p,{id,...cita}]);
    setSelDate(newBk.date);setNewBk(null);
    showToast("Cita apuntada ✓");
  };
  const markSent=(key:string,b?:any)=>{
    setSent(p=>({...p,[key]:true}));
    const tipo=key.split("-")[0];
    if(b&&COL[tipo]){
      setBookings((p:any[])=>p.map(x=>x.id===b.id?{...x,[CAMPO[tipo]]:true}:x));
      if(salonId)db().from("citas").update({[COL[tipo]]:true}).eq("id",b.id).then(()=>{});
    }
  };

  // Mensajes de WhatsApp listos para enviar
  const msgConfirm=(b:any)=>`Hola ${firstName(b.client)}! Te confirmo tu cita en ${NEGOCIO.nombre}: ${b.service}, el ${fmtD(b.date).toLowerCase()} a las ${hhmm(b.time)}. ¡Te esperamos!`;
  const msgReminder=(b:any)=>`Hola ${firstName(b.client)}! Te recuerdo que mañana tienes cita a las ${hhmm(b.time)} para ${b.service}. Si no puedes venir, avísame por aquí. ¡Gracias!`;
  const msgReview=(b:any)=>`Hola ${firstName(b.client)}! Gracias por venir a ${NEGOCIO.nombre}. Si te gustó, me ayudaría mucho que dejaras una reseña en Google. ¡Un abrazo!`;
  const msgMiss=(c:any)=>`Hola ${firstName(c.client)}! Hace tiempo que no te vemos por ${NEGOCIO.nombre}. ¿Te reservo un hueco esta semana?`;

  // Clientas: se calculan solas a partir de las citas
  const clients=(()=>{
    const m:Record<string,any>={};
    for(const b of bookings){
      const k=b.client.toLowerCase();
      const c=m[k]||(m[k]={client:b.client,phone:b.phone,visits:0,spent:0,last:"",next:"",first:"",services:{} as Record<string,number>});
      if(b.phone)c.phone=b.phone;
      if(b.date<today){
        c.visits++;c.spent+=parseInt(b.price)||0;
        if(b.date>c.last)c.last=b.date;
        if(!c.first||b.date<c.first)c.first=b.date;
        c.services[b.service]=(c.services[b.service]||0)+1;
      }else if(!c.next||b.date<c.next)c.next=b.date;
    }
    return Object.values(m).map((c:any)=>({...c,
      fav:Object.entries(c.services).sort((a:any,b:any)=>b[1]-a[1])[0]?.[0]||"",
      daysAway:c.last?Math.round((parseD(today).getTime()-parseD(c.last).getTime())/86400000):null,
    }));
  })();

  const exportCSV=(rows:any[],name:string)=>{
    const head="Fecha;Hora;Clienta;Teléfono;Tratamiento;Precio;Estado;Notas";
    const esc=(v:any)=>`"${String(v??"").replace(/"/g,'""')}"`;
    const body=rows.map(b=>[b.date,hhmm(b.time),b.client,b.phone,b.service,parseInt(b.price)||0,b.status,b.notes].map(esc).join(";"));
    const url=URL.createObjectURL(new Blob(["\ufeff"+[head,...body].join("\n")],{type:"text/csv"}));
    const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
  };

  const bP={...sans,background:G,color:DARK,border:"none",padding:"11px 22px",
    borderRadius:24,fontSize:11.5,letterSpacing:"2px",cursor:"pointer",
    textTransform:"uppercase" as const,fontWeight:500};
  const bO={...bP,background:"transparent",color:G,border:`1px solid ${G}`};
  const bDanger={...bP,background:"transparent",color:RED,border:`1px solid ${RED}55`};
  // 16px: con menos, el móvil hace zoom al tocar el campo
  const inp={...sans,width:"100%",padding:"11px 14px",border:`1px solid ${G}44`,
    borderRadius:10,background:"white",color:CH,fontSize:16,outline:"none"};

  const yr=calM.getFullYear(),mo=calM.getMonth();
  const firstDay=new Date(yr,mo,1).getDay();
  const dIM=new Date(yr,mo+1,0).getDate();
  const cells:any[]=[];
  for(let i=0;i<((firstDay+6)%7);i++)cells.push(null);
  for(let d=1;d<=dIM;d++)cells.push(d);

  const statusStyle=(s:string)=>s==="confirmada"
    ?{bg:`${GREEN}18`,color:GREEN,label:"CONFIRMADA"}
    :{bg:`${AMBER}20`,color:AMBER,label:"PENDIENTE"};

  // Rejilla de horas: una fila por media hora, de la apertura al cierre; las citas y bloqueos
  // ocupan su duración. Con varios días (semana) se ven en columnas, de lunes a domingo.
  const rejilla=(dias:string[])=>{
    const semana=dias.length>1;
    const ROW=semana?24:34;
    let ini=24*60,fin=0;
    for(const ds of dias){
      for(const{s:a,e:z}of(HOR[parseD(ds).getDay()]||[])){ini=Math.min(ini,a*60);fin=Math.max(fin,z*60);}
      for(const o of ocupadoDia(ds)){ini=Math.min(ini,Math.floor(o.ini/30)*30);fin=Math.max(fin,Math.ceil(o.fin/30)*30);}
    }
    if(fin<=ini){ini=10*60;fin=20*60;}
    const filas=Array.from({length:(fin-ini)/30},(_,i)=>ini+i*30);
    const abierto=(ds:string,m:number)=>(HOR[parseD(ds).getDay()]||[]).some(({s:a,e:z}:any)=>m>=a*60&&m<z*60);
    const LBL=semana?38:50;
    const cols=`${LBL}px repeat(${dias.length},minmax(0,1fr))`;
    const ahora=new Date();const minAhora=ahora.getHours()*60+ahora.getMinutes();
    return(
      <div style={{background:"white",borderRadius:16,border:`1px solid ${G}22`,overflow:"hidden"}}>
        {semana&&(
          <div style={{display:"grid",gridTemplateColumns:cols,borderBottom:`1px solid ${G}22`,background:"white"}}>
            <div/>
            {dias.map(ds=>{const d=parseD(ds);const hoy=ds===today;return(
              <button key={ds} onClick={()=>{setSelDate(ds);setCalModo("dia");}}
                style={{...sans,background:"none",border:"none",padding:"8px 0 6px",cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:600,color:hoy?G:MT,textTransform:"uppercase"}}>{DAYS[d.getDay()].slice(0,2)}</div>
                <div style={{fontSize:17,fontWeight:700,margin:"2px auto 0",width:30,height:30,lineHeight:"30px",borderRadius:15,
                  background:hoy?G:"transparent",color:hoy?"#fff":CH}}>{d.getDate()}</div>
              </button>
            );})}
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:cols}}>
          <div>
            {filas.map(m=>(
              <div key={m} style={{height:ROW,...sans,fontSize:semana?10.5:12,color:MT,textAlign:"right",paddingRight:6,
                fontWeight:m%60===0?600:400,lineHeight:"14px",paddingTop:2}}>
                {m%60===0||!semana?hhmm(m/60):""}
              </div>
            ))}
          </div>
          {dias.map(ds=>{
            const items=[
              ...bookings.filter((b:any)=>b.date===ds).map((b:any)=>({tipo:"cita",ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60),b})),
              ...blocked.filter((b:any)=>b.date===ds).map((b:any)=>({tipo:"bloqueo",ini:Math.round(b.time*60),fin:Math.round(b.time*60)+(b.dur||60),b})),
            ];
            const lleno=(m:number)=>items.some(x=>x.ini<m+30&&x.fin>m);
            return(
              <div key={ds} style={{position:"relative",borderLeft:`1px solid ${G}22`}}>
                {filas.map(m=>{const ab=abierto(ds,m);return(
                  <div key={m} onClick={()=>{if(ab&&!lleno(m))setHueco({date:ds,min:m});}}
                    style={{height:ROW,borderTop:`1px solid ${m%60===0?"#E8DDD4":"#F4EEE8"}`,cursor:ab?"pointer":"default",
                      background:ab?"white":"repeating-linear-gradient(45deg,#F5EFE9,#F5EFE9 4px,#EFE7DF 4px,#EFE7DF 8px)"}}/>
                );})}
                {ds===today&&minAhora>=ini&&minAhora<=fin&&(
                  <div style={{position:"absolute",left:0,right:0,top:(minAhora-ini)/30*ROW,height:2,background:RED,zIndex:3,pointerEvents:"none"}}/>
                )}
                {items.map((x:any,i:number)=>{
                  const top=(x.ini-ini)/30*ROW+1,h=Math.max(ROW-2,(x.fin-x.ini)/30*ROW-2);
                  if(x.tipo==="bloqueo")return(
                    <div key={"b"+i} onClick={()=>unblock(x.b)}
                      style={{position:"absolute",top,height:h,left:2,right:2,borderRadius:6,cursor:"pointer",overflow:"hidden",zIndex:2,
                        background:`repeating-linear-gradient(45deg,${RED}14,${RED}14 5px,${RED}22 5px,${RED}22 10px)`,borderLeft:`3px solid ${RED}`,
                        ...sans,fontSize:semana?10:12.5,color:RED,padding:semana?"2px 3px":"4px 8px",lineHeight:1.25}}>
                      {semana?"Bloq.":<><b>Bloqueado</b> · {hhmm(x.ini/60)}–{hhmm(x.fin/60)} · {x.b.reason} <span style={{opacity:.7}}>(toca para liberar)</span></>}
                    </div>
                  );
                  const b=x.b;const st=statusStyle(b.status);const avisar=pending.some((y:any)=>y.id===b.id);
                  return(
                    <div key={"c"+b.id} onClick={()=>setDetail(b)}
                      style={{position:"absolute",top,height:h,left:2,right:2,borderRadius:6,cursor:"pointer",overflow:"hidden",zIndex:2,
                        background:st.bg.replace(/18$|20$/,"2A"),borderLeft:`3px solid ${st.color}`,...sans,
                        padding:semana?"2px 3px":"4px 8px",lineHeight:1.25,boxShadow:"0 1px 2px rgba(0,0,0,.06)"}}>
                      {semana?(
                        <div style={{fontSize:10,color:CH,fontWeight:700,wordBreak:"break-word"}}>{hhmm(b.time)}<br/>{firstName(b.client)}</div>
                      ):(
                        <>
                          <div style={{fontSize:13.5,fontWeight:700,color:CH,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                            {avisar&&"📩 "}{b.client} <span style={{fontWeight:500,color:MT}}>· {b.service}</span>
                          </div>
                          {h>40&&<div style={{fontSize:12.5,color:MT}}>{hhmm(x.ini/60)} – {hhmm(x.fin/60)} · {b.price}</div>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if(!ready)return <div style={{background:BG,minHeight:"100vh"}}/>;

  return(
    <div style={{...sans,background:BG,minHeight:"100vh",color:CH,overflowX:"clip"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>

      {/* TOAST */}
      {toast&&(
        <div className="fu" style={{position:"fixed",bottom:"calc(150px + env(safe-area-inset-bottom))",left:16,right:16,margin:"0 auto",maxWidth:460,
          zIndex:900,justifyContent:"space-between",
          background:DARK,color:"#fff",padding:"14px 26px",
          borderLeft:`3px solid ${G}`,
          ...sans,fontSize:14,boxShadow:"0 8px 28px rgba(0,0,0,.3)",display:"flex",alignItems:"center",gap:16,
          borderRadius:12}}>
          <span>{toast}</span>
          {toastAccion&&(
            <button onClick={()=>{toastAccion.fn();setToast("");setToastAccion(null);}}
              style={{...sans,background:"none",border:"none",color:G,fontWeight:700,fontSize:14,cursor:"pointer",padding:0,whiteSpace:"nowrap"}}>
              {toastAccion.label}
            </button>
          )}
        </div>
      )}

      {/* CABECERA */}
      <header style={{background:"#FFFFFF",borderBottom:`1px solid ${G}44`,
        padding:"0 16px",height:58,display:"flex",alignItems:"center",gap:12,
        justifyContent:"space-between",position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
          <Lotus size={22}/>
          <div style={{minWidth:0}}>
            <div style={{...sans,fontSize:16,fontWeight:700,color:"#1A1A1A",lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{NEGOCIO.nombre}</div>
            <div style={{...sans,fontSize:11,letterSpacing:"2px",color:G,marginTop:2}}>PANEL DE GESTIÓN</div>
          </div>
        </div>
        {pending.length>0&&(
          <button onClick={()=>setView("avisos")} style={{...sans,display:"flex",alignItems:"center",gap:7,cursor:"pointer",border:"none",
            background:`${AMBER}20`,padding:"7px 12px",borderRadius:20,flexShrink:0}}>
            <div className="pulse" style={{width:7,height:7,borderRadius:"50%",background:AMBER}}/>
            <span style={{fontSize:13,fontWeight:600,color:AMBER,whiteSpace:"nowrap"}}>{pending.length} por avisar</span>
          </button>
        )}
      </header>

      <div style={{maxWidth:1080,margin:"0 auto",padding:"20px 16px 150px"}}>

        {/* ═════ AGENDA: selector día / semana / mes ═════ */}
        {view==="agenda"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",background:"#E8DDD4",borderRadius:14,padding:4,marginBottom:14}}>
            {(["dia","semana","mes"] as const).map(m=>(
              <button key={m} onClick={()=>setCalModo(m)}
                style={{...sans,border:"none",borderRadius:11,padding:"10px 0",fontSize:15,fontWeight:700,cursor:"pointer",
                  background:calModo===m?"white":"transparent",color:calModo===m?CH:MT,boxShadow:calModo===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
                {m==="dia"?"Día":m==="semana"?"Semana":"Mes"}
              </button>
            ))}
          </div>
        )}

        {/* ═════ DÍA ═════ */}
        {view==="agenda"&&calModo==="dia"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:12}}>
            <button aria-label="Día anterior" onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()-1);setSelDate(toDS(d));}} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronLeft size={22} color={G}/></button>
            <div style={{textAlign:"center",minWidth:0}}>
              <div style={{...sans,fontSize:19,fontWeight:700,lineHeight:1.2}}>{fmtD(selDate)}</div>
              {selDate!==today
                ?<button onClick={()=>setSelDate(today)} style={{...sans,fontSize:13,color:G,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>Volver a hoy</button>
                :<div style={{...sans,fontSize:13,color:MT}}>Hoy</div>}
            </div>
            <button aria-label="Día siguiente" onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()+1);setSelDate(toDS(d));}} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronRight size={22} color={G}/></button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <div style={{...sans,fontSize:14,color:MT}}>
              <b style={{color:CH}}>{dayBookings.length} cita{dayBookings.length===1?"":"s"}</b> · {freeCount} libre · <b style={{color:DR}}>{revenue}€</b>
            </div>
            <button onClick={()=>setBlockModal({date:selDate,min:null,dur:60})}
              style={{...sans,display:"flex",alignItems:"center",gap:6,fontSize:13,color:MT,background:"white",
                border:`1px solid ${MT}44`,borderRadius:20,padding:"7px 12px",cursor:"pointer"}}>
              <Ban size={15}/> Bloquear horas
            </button>
          </div>
          {(HOR[parseD(selDate).getDay()]||[]).length===0&&!dayBookings.length?(
            <div style={{textAlign:"center",padding:"48px 24px",background:BG2,border:`1px dashed ${G}44`,borderRadius:16}}>
              <div style={{...sans,fontSize:18,fontWeight:700,marginBottom:6}}>Cerrado</div>
              <div style={{...sans,fontSize:14,color:MT}}>Este día no se abre.</div>
            </div>
          ):rejilla([selDate])}
          <div style={{...sans,fontSize:12.5,color:MT,marginTop:10}}>Toca una media hora libre para apuntar una cita o bloquearla.</div>
        </div>
        )}

        {/* ═════ SEMANA (de lunes a domingo, en horizontal) ═════ */}
        {view==="agenda"&&calModo==="semana"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:12}}>
            <button aria-label="Semana anterior" onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()-7);setSelDate(toDS(d));}} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronLeft size={22} color={G}/></button>
            <div style={{textAlign:"center"}}>
              <div style={{...sans,fontSize:17,fontWeight:700}}>
                {weekDays[0].getDate()} {MONTHS[weekDays[0].getMonth()].slice(0,3).toLowerCase()} – {weekDays[6].getDate()} {MONTHS[weekDays[6].getMonth()].slice(0,3).toLowerCase()}
              </div>
              {(()=>{const w=weekDays.map(toDS);const n=bookings.filter((b:any)=>w.includes(b.date));
                return <div style={{...sans,fontSize:13,color:MT}}>{n.length} citas · {n.reduce((s:number,b:any)=>s+(parseInt(b.price)||0),0)}€
                  {!w.includes(today)&&<button onClick={()=>setSelDate(today)} style={{...sans,fontSize:13,color:G,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}> · Esta semana</button>}</div>;})()}
            </div>
            <button aria-label="Semana siguiente" onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()+7);setSelDate(toDS(d));}} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronRight size={22} color={G}/></button>
          </div>
          {rejilla(weekDays.map(toDS))}
          <div style={{...sans,fontSize:12.5,color:MT,marginTop:10}}>Toca un día para verlo entero, o una media hora libre para apuntar una cita.</div>
        </div>
        )}

        {/* ═════ VISTA MES ═════ */}
        {view==="agenda"&&calModo==="mes"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:16}}>
            <button aria-label="Mes anterior" onClick={()=>setCalM(new Date(yr,mo-1,1))} style={{width:44,height:44,borderRadius:22,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronLeft size={22} color={G}/></button>
            <div style={{...sans,fontSize:20,fontWeight:700}}>{MONTHS[mo]} {yr}</div>
            <button aria-label="Mes siguiente" onClick={()=>setCalM(new Date(yr,mo+1,1))} style={{width:44,height:44,borderRadius:22,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronRight size={22} color={G}/></button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
            gap:2,background:`${G}22`,marginBottom:26}}>
            {(()=>{
              const pre=`${yr}-${String(mo+1).padStart(2,"0")}-`;
              const mBks=bookings.filter((b:any)=>b.date.startsWith(pre));
              let mSlots=0;
              for(let d=1;d<=dIM;d++)mSlots+=getSlots(`${pre}${String(d).padStart(2,"0")}`).length;
              const mRev=mBks.reduce((s:number,b:any)=>s+(parseInt(b.price)||0),0);
              const mOcc=mSlots?Math.round((mBks.length/mSlots)*100):0;
              const ya=mBks.filter((b:any)=>b.date<today).reduce((s:number,b:any)=>s+(parseInt(b.price)||0),0);
              const nuevas=clients.filter((c:any)=>c.first&&c.first.startsWith(pre)).length;
              return[
                {n:mBks.length,l:"Citas del mes",c:CH},
                {n:`${mOcc}%`,l:"Ocupación",c:mOcc>70?RED:mOcc>35?AMBER:GREEN},
                {n:Math.max(0,mSlots-mBks.length),l:"Huecos libres",c:GREEN},
                {n:`${mRev}€`,l:"Facturación prevista",c:DR},
                {n:`${ya}€`,l:"Ya facturado",c:DR},
                {n:nuevas,l:"Clientas nuevas",c:GREEN},
              ];
            })().map((s:any)=>(
              <div key={s.l} className="card" style={{background:"white",padding:"20px 18px",
                textAlign:"center",transition:"all .25s"}}>
                <div style={{...serif,fontSize:31,fontWeight:400,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{...sans,fontSize:12.5,letterSpacing:"1.5px",color:MT,marginTop:7}}>
                  {s.l.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d=>(
              <div key={d} style={{...sans,textAlign:"center",fontSize:12.5,
                letterSpacing:"1.5px",color:MT,padding:"8px 0"}}>{d.toUpperCase()}</div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
            gap:2,background:`${G}18`}}>
            {cells.map((d:any,i:number)=>{
              if(!d) return <div key={`e${i}`} style={{background:BG,minHeight:88}}/>;
              const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
              const sl=getSlots(ds);
              const bks=bookings.filter((b:any)=>b.date===ds);
              const bls=blocked.filter((b:any)=>b.date===ds);
              const closed=sl.length===0;
              const isToday=ds===today;
              const occ=sl.length?((sl.length-sl.filter((s:any)=>!s.booking&&!s.block).length)/sl.length):0;
              return(
                <div key={d} onClick={()=>{setSelDate(ds);setCalModo("dia");}}
                  className="row"
                  style={{background:closed?`${MT}0A`:isToday?`${G}1E`:"white",
                    minHeight:88,padding:"8px 9px",cursor:"pointer",
                    transition:"all .18s",position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <span style={{...serif,fontSize:17,
                      color:closed?`${MT}66`:isToday?DR:CH,
                      fontWeight:isToday?600:400}}>{d}</span>
                    {isToday&&(
                      <span style={{...sans,fontSize:9,letterSpacing:"1px",
                        background:G,color:DARK,padding:"2px 5px",borderRadius:8}}>HOY</span>
                    )}
                  </div>
                  {closed?(
                    <div style={{...sans,fontSize:12.5,color:`${MT}55`,marginTop:6}}>Cerrado</div>
                  ):(
                    <div style={{marginTop:6}}>
                      {bks.length>0&&(
                        <div style={{...sans,fontSize:11.5,color:CH,marginBottom:3}}>
                          {bks.length} cita{bks.length>1?"s":""}
                        </div>
                      )}
                      {bls.length>0&&(
                        <div style={{...sans,fontSize:12.5,color:RED,marginBottom:3}}>
                          {bls.length} bloqueo{bls.length>1?"s":""}
                        </div>
                      )}
                      {/* Occupancy bar */}
                      <div style={{position:"absolute",bottom:7,left:9,right:9,
                        height:3,background:`${MT}18`,borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${occ*100}%`,height:"100%",
                          background:occ>.7?RED:occ>.35?AMBER:GREEN,
                          transition:"width .3s"}}/>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap",...sans,fontSize:12.5,color:MT}}>
            <span style={{color:GREEN}}>▬ Poca ocupación</span>
            <span style={{color:AMBER}}>▬ Media</span>
            <span style={{color:RED}}>▬ Casi completo</span>
          </div>
        </div>
        )}

        {/* ═════ TODAS LAS CITAS ═════ */}
        {view==="todas"&&(
        <div className="fu">
          <div style={{marginBottom:24}}>
            <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:6}}>LISTADO COMPLETO</div>
            <div style={{...serif,fontSize:30,fontWeight:300}}>Todas las citas</div>
            <div style={{...sans,fontSize:13,color:MT,marginTop:6}}>
              {bookings.length} citas registradas · {pending.length} pendientes de confirmar
            </div>
          </div>

          {pending.length>0&&(
            <div style={{background:`${AMBER}12`,border:`1px solid ${AMBER}44`,
              padding:"16px 20px",marginBottom:24,borderLeft:`3px solid ${AMBER}`}}>
              <div style={{...sans,fontSize:12.5,letterSpacing:"2px",color:AMBER,
                marginBottom:6,fontWeight:500}}>⚠ REQUIEREN TU ATENCIÓN</div>
              <div style={{...sans,fontSize:13,color:CH,lineHeight:1.7}}>
                Hay {pending.length} reserva{pending.length>1?"s":""} nueva{pending.length>1?"s":""} desde la web.
                Toca cada una para confirmarla o contactar a la clienta.
              </div>
            </div>
          )}

          <div style={{display:"grid",gap:1,background:`${G}18`}}>
            {[...bookings].sort((a:any,b:any)=>a.date===b.date?a.time-b.time:a.date.localeCompare(b.date)).map((b:any)=>{
              const st=statusStyle(b.status);
              const dt=parseD(b.date);
              return(
                <div key={b.id} className="row" onClick={()=>setDetail(b)}
                  style={{background:"white",padding:"15px 20px",
                    display:"flex",alignItems:"center",gap:16,cursor:"pointer",
                    transition:"background .18s",
                    borderLeft:`3px solid ${st.color}`}}>
                  <div style={{textAlign:"center",minWidth:46,flexShrink:0}}>
                    <div style={{...sans,fontSize:11.5,letterSpacing:"1px",color:MT}}>
                      {DAYS[dt.getDay()].toUpperCase()}
                    </div>
                    <div style={{...serif,fontSize:21,lineHeight:1.1}}>{dt.getDate()}</div>
                    <div style={{...sans,fontSize:11.5,color:MT}}>
                      {MONTHS[dt.getMonth()].slice(0,3).toUpperCase()}
                    </div>
                  </div>
                  <div style={{...serif,fontSize:16,color:MT,minWidth:52,flexShrink:0}}>
                    {hhmm(b.time)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{...sans,fontSize:14,fontWeight:500,marginBottom:2}}>{b.client}</div>
                    <div style={{...sans,fontSize:13.5,color:MT,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {b.service}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{...serif,fontSize:17,color:DR,marginBottom:4}}>{b.price}</div>
                    <div style={{...sans,fontSize:11.5,letterSpacing:"1px",
                      background:st.bg,color:st.color,padding:"3px 8px",
                      borderRadius:10,display:"inline-block"}}>{st.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* ═════ AVISOS ═════ */}
        {view==="avisos"&&(()=>{
          const t=parseD(today);t.setDate(t.getDate()+1);const tomorrow=toDS(t);
          const tmr=bookings.filter((b:any)=>b.date===tomorrow).sort((a:any,b:any)=>a.time-b.time);
          const pend=pending;
          const yest=new Date(parseD(today));yest.setDate(yest.getDate()-1);const ystr=toDS(yest);
          const done=bookings.filter((b:any)=>b.date===ystr||(b.date===today&&b.time<new Date().getHours()));
          const away=clients.filter((c:any)=>!c.next&&c.daysAway!==null&&c.daysAway>=30)
            .sort((a:any,b:any)=>b.spent-a.spent).slice(0,8);
          const Section=({title,hint,items,render}:any)=>(
            <div style={{marginBottom:30}}>
              <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:4}}>{title}</div>
              <div style={{...sans,fontSize:13.5,color:MT,marginBottom:12}}>{hint}</div>
              {items.length===0
                ?<div style={{...sans,fontSize:13,color:MT,padding:"18px 20px",background:"white"}}>Nada pendiente aquí ✓</div>
                :<div style={{display:"grid",gap:1,background:`${G}18`}}>{items.map(render)}</div>}
            </div>
          );
          const Row=({b,label,msg,k,sub,onDone}:any)=>(
            <div style={{background:"white",padding:"14px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:180}}>
                <div style={{...sans,fontSize:14,fontWeight:500}}>{b.client}</div>
                <div style={{...sans,fontSize:13.5,color:MT}}>{sub}</div>
              </div>
              {enviado(k,b)&&<span style={{...sans,fontSize:12.5,color:GREEN,fontWeight:600}}>✓ Enviado</span>}
              {b.phone?(
                <a href={waTo(b.phone,msg)} target="_blank" rel="noreferrer"
                  onClick={()=>{markSent(k,b.id?b:undefined);onDone?.();}}>
                  <button style={{...bP,padding:"9px 16px",background:enviado(k,b)?"transparent":GREEN,
                    color:enviado(k,b)?GREEN:"#fff",border:`1px solid ${GREEN}`}}>{label}</button>
                </a>
              ):<span style={{...sans,fontSize:12.5,color:MT}}>Sin teléfono</span>}
            </div>
          );
          return(
          <div className="fu">
            <div style={{marginBottom:24}}>
              <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:6}}>TU LISTA DE HOY</div>
              <div style={{...serif,fontSize:30,fontWeight:300}}>Avisos por WhatsApp</div>
              <div style={{...sans,fontSize:13,color:MT,marginTop:6}}>
                Cada botón abre WhatsApp con el mensaje ya escrito. Solo tienes que pulsar enviar.
              </div>
            </div>
            <Section title="RECORDATORIOS PARA MAÑANA" hint="Un recordatorio el día antes reduce mucho las citas a las que no vienen."
              items={tmr} render={(b:any)=>(
                <Row key={b.id} b={b} k={`rec-${b.id}`} label="Recordar" msg={msgReminder(b)}
                  sub={`${hhmm(b.time)} · ${b.service}`}/>
              )}/>
            <Section title="RESERVAS NUEVAS: MÁNDALES LOS DETALLES" hint="La web les dice que les llegará un WhatsApp con los detalles de su cita. Envíaselo desde aquí."
              items={pend} render={(b:any)=>(
                <Row key={b.id} b={b} k={`conf-${b.id}`} label="Enviar detalles" msg={msgConfirm(b)}
                  sub={`${fmtD(b.date)} · ${hhmm(b.time)} · ${b.service}`}
                  onDone={()=>cambiarEstado(b.id,"confirmada")}/>
              )}/>
            <Section title="PEDIR RESEÑA" hint="Clientas que vinieron ayer u hoy. Las reseñas en Google traen clientas nuevas."
              items={done} render={(b:any)=>(
                <Row key={b.id} b={b} k={`res-${b.id}`} label="Pedir reseña" msg={msgReview(b)}
                  sub={`${fmtD(b.date)} · ${b.service}`}/>
              )}/>
            <Section title="HACE TIEMPO QUE NO VIENEN" hint="Más de 30 días sin venir y sin cita pendiente. Primero las que más gastan."
              items={away} render={(c:any)=>(
                <Row key={c.client} b={c} k={`miss-${c.client}-${c.last}`} label="Escribir" msg={msgMiss(c)}
                  sub={`${c.daysAway} días sin venir · ${c.visits} visitas · ${c.spent}€`}/>
              )}/>
          </div>);
        })()}

        {/* ═════ CLIENTAS ═════ */}
        {view==="clientas"&&(()=>{
          const q=search.trim().toLowerCase();
          const list=clients.filter((c:any)=>!q||c.client.toLowerCase().includes(q)||(c.phone||"").includes(q))
            .sort((a:any,b:any)=>b.spent-a.spent);
          return(
          <div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:20}}>
              <div>
                <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:6}}>FICHAS</div>
                <div style={{...serif,fontSize:30,fontWeight:300}}>Clientas</div>
                <div style={{...sans,fontSize:13,color:MT,marginTop:6}}>
                  {clients.length} clientas · se crean solas al apuntar citas
                </div>
              </div>
              <input style={{...inp,maxWidth:280}} placeholder="Buscar por nombre o teléfono"
                value={search} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}/>
            </div>
            <div style={{display:"grid",gap:1,background:`${G}18`}}>
              {list.map((c:any)=>(
                <div key={c.client} style={{background:"white",padding:"14px 20px",display:"flex",
                  alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:`${G}22`,color:G,
                    display:"flex",alignItems:"center",justifyContent:"center",...serif,fontSize:15,flexShrink:0}}>
                    {c.client.split(" ").map((w:string)=>w[0]).slice(0,2).join("")}
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{...sans,fontSize:14,fontWeight:500}}>{c.client}</div>
                    <div style={{...sans,fontSize:13.5,color:MT}}>{c.phone}{c.fav?` · suele hacerse ${c.fav}`:""}</div>
                  </div>
                  <div style={{...sans,fontSize:13.5,color:MT,minWidth:150}}>
                    {c.visits} visita{c.visits===1?"":"s"} · <span style={{color:DR}}>{c.spent}€</span>
                    <div style={{fontSize:12.5}}>
                      {c.next?<span style={{color:GREEN}}>Próxima: {fmtD(c.next)}</span>
                        :c.last?`Última: hace ${c.daysAway} días`:"Aún no ha venido"}
                    </div>
                  </div>
                  <a href={waTo(c.phone,"")} target="_blank" rel="noreferrer">
                    <button style={{...bO,padding:"8px 14px"}}>WhatsApp</button>
                  </a>
                  <button style={{...bP,padding:"8px 14px"}}
                    onClick={()=>{openNew(today);setNewBk((n:any)=>({...n,client:c.client,phone:c.phone,service:c.fav||n.service}));}}>
                    + Cita
                  </button>
                </div>
              ))}
            </div>
          </div>);
        })()}

        {/* ═════ RESUMEN ═════ */}
        {view==="resumen"&&(()=>{
          const pre=`${yr}-${String(mo+1).padStart(2,"0")}-`;
          const mBks=bookings.filter((b:any)=>b.date.startsWith(pre));
          const past=mBks.filter((b:any)=>b.date<today);
          const fut=mBks.filter((b:any)=>b.date>=today);
          const sum=(a:any[])=>a.reduce((s:number,b:any)=>s+(parseInt(b.price)||0),0);
          const names=new Set(mBks.map((b:any)=>b.client.toLowerCase()));
          const nuevas=clients.filter((c:any)=>c.first&&c.first.startsWith(pre)).length;
          const bySv:Record<string,{n:number,e:number}>={};
          for(const b of mBks){const x=bySv[b.service]||(bySv[b.service]={n:0,e:0});x.n++;x.e+=parseInt(b.price)||0;}
          const top=Object.entries(bySv).sort((a,b)=>b[1].e-a[1].e).slice(0,6);
          const maxE=top[0]?.[1].e||1;
          const byCat:Record<string,number>={};
          for(const b of mBks){const c=SV.find(x=>x.name===b.service)?.cat||"Otros";byCat[c]=(byCat[c]||0)+(parseInt(b.price)||0);}
          const tot=sum(mBks)||1;
          return(
          <div className="fu">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:14}}>
              <button aria-label="Mes anterior" onClick={()=>setCalM(new Date(yr,mo-1,1))} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronLeft size={22} color={G}/></button>
              <div style={{...sans,fontSize:19,fontWeight:700}}>Resumen de {MONTHS[mo].toLowerCase()}</div>
              <button aria-label="Mes siguiente" onClick={()=>setCalM(new Date(yr,mo+1,1))} style={{width:42,height:42,borderRadius:21,border:`1px solid ${G}55`,background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronRight size={22} color={G}/></button>
            </div>
            {(()=>{const past=mBks.filter((b:any)=>b.date<today);const tk=past.length?Math.round(sum(past)/past.length):0;return(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {[["Ya facturado",`${sum(past)}€`,DR],["Por cobrar",`${sum(mBks)-sum(past)}€`,AMBER],["Ticket medio",`${tk}€`,CH],["Clientas nuevas",nuevas,GREEN]].map(([l,n,c]:any)=>(
                  <div key={l} style={{background:"white",borderRadius:14,padding:"14px 12px",textAlign:"center"}}>
                    <div style={{...sans,fontSize:24,fontWeight:700,color:c}}>{n}</div>
                    <div style={{...sans,fontSize:12.5,color:MT,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>);})()}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"8px 0 12px",gap:12}}>
              <div style={{...sans,fontSize:17,fontWeight:700}}>Lo que más se hace</div>
              <button style={{...bO,padding:"9px 14px"}} onClick={()=>exportCSV(mBks,`citas-${yr}-${String(mo+1).padStart(2,"0")}.csv`)}>
                Descargar Excel
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(300px,100%),1fr))",gap:16}}>
              <div style={{background:"white",padding:22}}>
                <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:16}}>TRATAMIENTOS QUE MÁS FACTURAN</div>
                {top.length===0&&<div style={{...sans,fontSize:13,color:MT}}>Sin citas este mes</div>}
                {top.map(([n,v])=>(
                  <div key={n} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",...sans,fontSize:13,marginBottom:4}}>
                      <span>{n} <span style={{color:MT,fontSize:12.5}}>· {v.n}</span></span><span style={{color:DR}}>{v.e}€</span>
                    </div>
                    <div style={{height:4,background:`${G}18`}}><div style={{height:4,width:`${(v.e/maxE)*100}%`,background:G}}/></div>
                  </div>
                ))}
              </div>
              <div style={{background:"white",padding:22}}>
                <div style={{...sans,fontSize:12.5,letterSpacing:"3px",color:G,marginBottom:16}}>POR TIPO DE TRATAMIENTO</div>
                {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,e])=>(
                  <div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",
                    padding:"10px 0",borderBottom:`1px solid ${G}18`,...sans,fontSize:14}}>
                    <span>{c==="Láser"?"Depilación láser":c==="Facial"?"Faciales":c==="Corporal"?"Corporales":c}</span>
                    <span><span style={{color:MT,fontSize:13.5,marginRight:10}}>{Math.round((e/tot)*100)}%</span><span style={{color:DR}}>{e}€</span></span>
                  </div>
                ))}
              </div>
            </div>
            {!salonId&&(            <div style={{marginTop:36,padding:"18px 20px",border:`1px dashed ${G}55`,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{...sans,fontSize:13.5,color:MT,flex:1,minWidth:220,lineHeight:1.6}}>
                Los datos se guardan en este dispositivo. Ahora hay citas de ejemplo: cuando empieces de verdad, bórralas.
              </div>
              <button style={{...bO,padding:"9px 14px"}} onClick={()=>{
                const h=parseD(today);setBookings(generarDemo(h));setBlocked(demoBlocked(h));setSent({});showToast("Datos de ejemplo cargados");}}>
                Cargar ejemplo
              </button>
              <button style={{...bDanger,padding:"9px 14px"}} onClick={()=>{
                if(!confirm("¿Borrar todas las citas y empezar de cero?"))return;
                setBookings([]);setBlocked([]);setSent({});showToast("Panel vacío. ¡A por las primeras citas!");}}>
                Empezar de cero
              </button>
            </div>)}
          </div>);
        })()}

      </div>

      {/* ═════ HOJA NUEVA CITA ═════ */}
      {newBk&&(()=>{
        const sv=SV.find(x=>x.name===newBk.service);
        const dur=duracion(sv?.dur);
        const dia=parseD(newBk.date);
        const libres=huecosLibres(HOR,dia,dur,ocupadoDia(newBk.date),30);
        // Si la hora elegida ya no cabe con este tratamiento, se avisa
        const horaOk=newBk.time===""||libres.includes(Number(newBk.time));
        const dias=Array.from({length:21},(_,i)=>{const d=parseD(today);d.setDate(d.getDate()+i);return d;});
        const lbl={...sans,display:"block",fontSize:13,fontWeight:600,color:CH,marginBottom:8,marginTop:18} as const;
        const chip=(on:boolean)=>({...sans,border:`1.5px solid ${on?DARK:"#E2D6CB"}`,background:on?DARK:"white",color:on?"#fff":CH,
          borderRadius:12,cursor:"pointer",flexShrink:0} as const);
        const listo=newBk.client.trim().length>=2&&newBk.time!==""&&horaOk;
        return(
        <div onClick={()=>setNewBk(null)}
          style={{position:"fixed",inset:0,background:"rgba(15,13,12,.55)",zIndex:500,display:"flex",
            alignItems:"flex-end",justifyContent:"center"}}>
          <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
            style={{background:BG,width:"100%",maxWidth:520,maxHeight:"94vh",overflowY:"auto",
              borderRadius:"22px 22px 0 0",boxShadow:"0 -10px 40px rgba(0,0,0,.25)"}}>
            <div style={{position:"sticky",top:0,background:BG,padding:"14px 20px 10px",borderBottom:`1px solid ${G}22`,zIndex:2}}>
              <div style={{width:40,height:4,borderRadius:2,background:"#D4C9BE",margin:"0 auto 12px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{...sans,fontSize:20,fontWeight:700}}>Nueva cita</div>
                <button onClick={()=>setNewBk(null)} style={{...sans,background:"none",border:"none",fontSize:15,color:MT,cursor:"pointer"}}>Cerrar</button>
              </div>
            </div>
            <div style={{padding:"4px 20px 20px"}}>
              <label style={lbl}>Clienta</label>
              <input style={{...inp,fontSize:16,padding:"13px 14px",borderRadius:12}} list="clientas" value={newBk.client} placeholder="Nombre y apellido"
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                  const v=e.target.value;const c=clients.find((x:any)=>x.client.toLowerCase()===v.toLowerCase());
                  setNewBk((n:any)=>({...n,client:v,phone:c?c.phone:n.phone,service:c?.fav||n.service}));}}/>
              <datalist id="clientas">{clients.map((c:any)=><option key={c.client} value={c.client}/>)}</datalist>
              <input style={{...inp,fontSize:16,padding:"13px 14px",borderRadius:12,marginTop:8}} value={newBk.phone}
                placeholder="Teléfono (opcional)" inputMode="tel"
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setNewBk((n:any)=>({...n,phone:e.target.value}))}/>

              <label style={lbl}>Tratamiento</label>
              <select style={{...inp,fontSize:16,padding:"13px 14px",borderRadius:12}} value={newBk.service}
                onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setNewBk((n:any)=>({...n,service:e.target.value}))}>
                {categorias(SV).map(({id:cat,label})=>(
                  <optgroup key={cat} label={label}>
                    {SV.filter(x=>x.cat===cat).map(x=><option key={x.name} value={x.name}>{x.name} · {x.dur} · {x.price}</option>)}
                  </optgroup>
                ))}
              </select>

              <label style={lbl}>Día</label>
              <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,margin:"0 -20px",padding:"0 20px 4px"}}>
                {dias.map((d,i)=>{
                  const ds=toDS(d);const on=ds===newBk.date;const cerrado=!HOR[d.getDay()];
                  return(
                    <button key={ds} onClick={()=>setNewBk((n:any)=>({...n,date:ds,time:""}))}
                      style={{...chip(on),width:62,padding:"8px 0",textAlign:"center",opacity:cerrado&&!on?.4:1}}>
                      <div style={{fontSize:12.5,fontWeight:600,textTransform:"uppercase"}}>{i===0?"Hoy":i===1?"Mañ.":DAYS[d.getDay()]}</div>
                      <div style={{fontSize:20,fontWeight:700,lineHeight:1.2}}>{d.getDate()}</div>
                      <div style={{fontSize:11.5}}>{MONTHS[d.getMonth()].slice(0,3)}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{...sans,fontSize:13.5,color:MT,marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                ¿Otro día?
                <input type="date" value={newBk.date} style={{...inp,width:"auto",padding:"6px 10px",fontSize:14,borderRadius:10}}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>e.target.value&&setNewBk((n:any)=>({...n,date:e.target.value,time:""}))}/>
              </div>

              <label style={lbl}>Hora <span style={{fontWeight:400,color:MT}}>· {fmtD(newBk.date)} · dura {dur} min</span></label>
              {libres.length===0?(
                <div style={{...sans,fontSize:14,color:MT,padding:"12px 0"}}>No hay huecos libres ese día para este tratamiento.</div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {libres.map(m=>{const on=Number(newBk.time)===m&&newBk.time!=="";return(
                    <button key={m} onClick={()=>setNewBk((n:any)=>({...n,time:m}))}
                      style={{...chip(on),padding:"11px 0",fontSize:15,fontWeight:600}}>{hhmm(m/60)}</button>
                  );})}
                </div>
              )}
              {!horaOk&&<div style={{...sans,fontSize:13,color:RED,marginTop:8}}>Esa hora no cabe con este tratamiento: elige otra.</div>}

              <label style={lbl}>Notas <span style={{fontWeight:400,color:MT}}>(opcional)</span></label>
              <input style={{...inp,fontSize:16,padding:"13px 14px",borderRadius:12}} value={newBk.notes} placeholder="Alergias, bono, preferencias…"
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setNewBk((n:any)=>({...n,notes:e.target.value}))}/>
            </div>
            <div style={{position:"sticky",bottom:0,background:BG,padding:"12px 20px 18px",borderTop:`1px solid ${G}22`}}>
              <button disabled={!listo} onClick={saveNew}
                style={{...sans,width:"100%",padding:"15px",borderRadius:30,border:"none",fontSize:16,fontWeight:700,
                  background:G,color:"#fff",cursor:listo?"pointer":"default",opacity:listo?1:.4}}>
                {newBk.time!==""&&horaOk?`Guardar cita · ${hhmm(Number(newBk.time)/60)}`:"Elige nombre y hora"}
              </button>
            </div>
          </div>
        </div>);
      })()}

      {/* ═════ HOJA DETALLE ═════ */}
      {detail&&(()=>{
        const st=statusStyle(detail.status);
        const ini=detail.time,fin=detail.time+(detail.dur||60)/60;
        const tel=detail.phone;
        const fila=(k:string,v:any)=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${G}22`,gap:16}}>
            <span style={{...sans,fontSize:14,color:MT}}>{k}</span>
            <span style={{...sans,fontSize:15,fontWeight:600,textAlign:"right"}}>{v}</span>
          </div>
        );
        return(
      <div onClick={()=>setDetail(null)}
        style={{position:"fixed",inset:0,background:"rgba(15,13,12,.55)",zIndex:500,display:"flex",
          alignItems:"flex-end",justifyContent:"center"}}>
        <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
          style={{background:BG,width:"100%",maxWidth:520,maxHeight:"94vh",overflowY:"auto",
            borderRadius:"22px 22px 0 0",boxShadow:"0 -10px 40px rgba(0,0,0,.25)"}}>
          <div style={{padding:"14px 20px 0"}}>
            <div style={{width:40,height:4,borderRadius:2,background:"#D4C9BE",margin:"0 auto 14px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div>
                <div style={{...sans,fontSize:22,fontWeight:700,lineHeight:1.2}}>{detail.client}</div>
                <div style={{...sans,fontSize:15,color:MT,marginTop:4}}>{detail.service}</div>
              </div>
              <span style={{...sans,fontSize:13.5,fontWeight:600,background:st.bg,color:st.color,padding:"5px 12px",borderRadius:20,whiteSpace:"nowrap"}}>{st.label}</span>
            </div>
          </div>

          <div style={{padding:"8px 20px 22px"}}>
            {fila("Día",fmtD(detail.date))}
            {fila("Hora",`${hhmm(ini)} – ${hhmm(fin)}`)}
            {fila("Precio",detail.price)}
            {fila("Teléfono",tel||<span style={{color:MT,fontWeight:400}}>Sin teléfono</span>)}

            <div style={{marginTop:18}}>
              <div style={{...sans,fontSize:14,fontWeight:600,marginBottom:8}}>Notas <span style={{fontWeight:400,color:MT}}>(alergias, bono, preferencias)</span></div>
              <textarea style={{...inp,minHeight:70,resize:"vertical",fontSize:16,borderRadius:12}} value={noteDraft}
                onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>setNoteDraft(e.target.value)}
                placeholder="Solo lo ves tú"/>
              {noteDraft!==(detail.notes||"")&&(
                <button style={{...bO,marginTop:8,padding:"10px 16px",fontSize:13.5}} onClick={()=>saveNote(detail.id)}>Guardar nota</button>
              )}
            </div>

            {tel?(
              <>
                <div style={{...sans,fontSize:14,fontWeight:600,marginTop:22,marginBottom:8}}>Mandarle un WhatsApp</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["✓ Enviar detalles",msgConfirm(detail),"conf"],["⏰ Recordar cita",msgReminder(detail),"rec"],["⭐ Pedir reseña",msgReview(detail),"res"],["💬 Escribir","",""]].map(([l,m,k])=>(
                    <a key={l} href={waTo(tel,m)} target="_blank" rel="noreferrer"
                      onClick={()=>{if(k){markSent(`${k}-${detail.id}`,detail);if(k==="conf"&&detail.status==="pendiente")cambiarEstado(detail.id,"confirmada");setDetail(null);}}}
                      style={{...sans,fontSize:14,fontWeight:600,textAlign:"center",padding:"12px 8px",
                        border:`1.5px solid ${GREEN}55`,color:GREEN,borderRadius:14,background:"white"}}>
                      {l}
                    </a>
                  ))}
                </div>
                <a href={`tel:${tel.replace(/\s/g,"")}`} style={{display:"block",marginTop:8}}>
                  <button style={{...bO,width:"100%",fontSize:13.5,padding:"12px"}}>📞 Llamar</button>
                </a>
              </>
            ):(
              <div style={{...sans,fontSize:13,color:MT,marginTop:18}}>Sin teléfono no se le pueden mandar mensajes.</div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:22}}>
              {detail.status==="pendiente"&&(
                <button style={{...bP,width:"100%",background:GREEN,color:"#fff",fontSize:13,padding:"14px"}}
                  onClick={()=>confirmBk(detail.id)}>
                  ✓ Marcar como confirmada
                </button>
              )}
              <button style={{...bDanger,width:"100%",fontSize:13.5,padding:"13px"}} onClick={()=>cancelBk(detail.id)}>
                Cancelar cita y liberar hueco
              </button>
            </div>
          </div>
        </div>
      </div>);
      })()}

      {/* ═════ HOJA BLOQUEAR (inicio y duración) ═════ */}
      {blockModal&&(()=>{
        const {date,min,dur}=blockModal;
        const DUR=[30,60,90,120,180,240];
        // Inicios posibles cada media hora: que quepa entero en el horario y no pise otra cosa
        const inicios=huecosLibres(HOR,parseD(date),dur,ocupadoDia(date),30);
        const valido=min!=null&&inicios.includes(min);
        const cerrar=()=>{setBlockModal(null);setBlockReason("");};
        const chip=(on:boolean)=>({...sans,padding:"10px 0",fontSize:15,fontWeight:600,borderRadius:12,cursor:"pointer",
          border:`1.5px solid ${on?RED:"#E2D6CB"}`,background:on?RED:"white",color:on?"#fff":CH} as const);
        const durTxt=(d:number)=>d<60?`${d} min`:d%60?`${Math.floor(d/60)} h ${d%60}`:`${d/60} h`;
        return(
      <div onClick={cerrar} style={{position:"fixed",inset:0,background:"rgba(15,13,12,.55)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
          style={{background:BG,width:"100%",maxWidth:520,maxHeight:"92vh",overflowY:"auto",borderRadius:"22px 22px 0 0",boxShadow:"0 -10px 40px rgba(0,0,0,.25)",padding:"14px 20px 22px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#D4C9BE",margin:"0 auto 14px"}}/>
          <div style={{...sans,fontSize:20,fontWeight:700}}>Bloquear horas</div>
          <div style={{...sans,fontSize:14,color:MT,marginTop:4,marginBottom:16}}>
            {fmtD(date)} · Ese rato deja de salir en la web y nadie podrá reservarlo.
          </div>
          <div style={{...sans,fontSize:14,fontWeight:600,marginBottom:8}}>¿Cuánto tiempo?</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
            {DUR.map(d=>(
              <button key={d} onClick={()=>setBlockModal((m:any)=>({...m,dur:d}))} style={chip(dur===d)}>{durTxt(d)}</button>
            ))}
          </div>
          <div style={{...sans,fontSize:14,fontWeight:600,marginBottom:8}}>¿Desde qué hora?</div>
          {inicios.length===0?(
            <div style={{...sans,fontSize:14,color:MT,marginBottom:16}}>No hay {durTxt(dur)} seguidos libres ese día.</div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
              {inicios.map(m=>(
                <button key={m} onClick={()=>setBlockModal((x:any)=>({...x,min:m}))} style={chip(min===m)}>{hhmm(m/60)}</button>
              ))}
            </div>
          )}
          <div style={{...sans,fontSize:14,fontWeight:600,marginBottom:8}}>Motivo <span style={{fontWeight:400,color:MT}}>(solo lo ves tú)</span></div>
          <input style={{...inp,marginBottom:18,borderRadius:12,padding:"13px 14px"}} value={blockReason}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setBlockReason(e.target.value)}
            placeholder="Comida, formación, descanso…"/>
          <button disabled={!valido} onClick={doBlock}
            style={{...sans,width:"100%",padding:"15px",borderRadius:30,border:"none",fontSize:16,fontWeight:700,
              background:RED,color:"#fff",cursor:"pointer",opacity:valido?1:.4}}>
            {valido?`Bloquear de ${hhmm(min/60)} a ${hhmm((min+dur)/60)}`:"Elige desde qué hora"}
          </button>
        </div>
      </div>);
      })()}

      {/* ═════ HOJA DE UNA MEDIA HORA LIBRE ═════ */}
      {hueco&&(
        <div onClick={()=>setHueco(null)} style={{position:"fixed",inset:0,background:"rgba(15,13,12,.45)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
            style={{background:BG,width:"100%",maxWidth:520,borderRadius:"22px 22px 0 0",padding:"14px 20px 26px"}}>
            <div style={{width:40,height:4,borderRadius:2,background:"#D4C9BE",margin:"0 auto 14px"}}/>
            <div style={{...sans,fontSize:20,fontWeight:700,marginBottom:2}}>{hhmm(hueco.min/60)} · libre</div>
            <div style={{...sans,fontSize:14,color:MT,marginBottom:16}}>{fmtD(hueco.date)}</div>
            <button onClick={()=>{openNew(hueco.date,hueco.min);setHueco(null);}}
              style={{...sans,width:"100%",padding:"15px",borderRadius:30,border:"none",fontSize:16,fontWeight:700,background:G,color:"#fff",cursor:"pointer",marginBottom:10,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Plus size={20}/> Nueva cita a las {hhmm(hueco.min/60)}
            </button>
            <button onClick={()=>{setBlockModal({date:hueco.date,min:hueco.min,dur:60});setHueco(null);}}
              style={{...sans,width:"100%",padding:"14px",borderRadius:30,border:`1.5px solid ${RED}66`,fontSize:15,fontWeight:700,background:"white",color:RED,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ban size={18}/> Bloquear desde las {hhmm(hueco.min/60)}
            </button>
          </div>
        </div>
      )}

      {/* ═════ BOTÓN NUEVA CITA (siempre a la vista) ═════ */}
      {!newBk&&!detail&&!blockModal&&!mas&&!hueco&&(
        <button onClick={()=>openNew(view==="agenda"&&calModo==="dia"?selDate:undefined)} aria-label="Nueva cita"
          style={{...sans,position:"fixed",right:16,bottom:"calc(80px + env(safe-area-inset-bottom))",zIndex:300,display:"flex",alignItems:"center",gap:8,
            background:G,color:"#fff",border:"none",borderRadius:30,padding:"15px 22px",fontSize:16,fontWeight:700,
            boxShadow:"0 10px 28px rgba(184,146,42,.45)",cursor:"pointer"}}>
          <Plus size={22}/> Nueva cita
        </button>
      )}

      {/* ═════ BARRA DE ABAJO ═════ */}
      <nav style={{position:"fixed",left:0,right:0,bottom:0,zIndex:400,background:"white",borderTop:`1px solid ${G}33`,
        paddingBottom:"env(safe-area-inset-bottom)",boxShadow:"0 -4px 20px rgba(0,0,0,.05)"}}>
        <div style={{maxWidth:560,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(5,1fr)"}}>
          {([["agenda","Agenda",CalendarDays],["avisos","Avisos",Bell],["clientas","Clientas",Users],["resumen","Resumen",ChartColumn],["mas","Más",Menu]] as const).map(([id,l,Icon])=>{
            const on=id==="mas"?mas||view==="todas":view===id&&!mas;
            return(
              <button key={id} onClick={()=>{if(id==="mas"){setMas(true);return;}setMas(false);setView(id);if(id==="agenda"&&view==="agenda"){setCalModo("dia");setSelDate(today);}window.scrollTo(0,0);}}
                style={{...sans,background:"none",border:"none",cursor:"pointer",padding:"9px 0 8px",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:3,color:on?G:"#8A7A70",position:"relative"}}>
                <Icon size={23} strokeWidth={on?2.4:1.8}/>
                <span style={{fontSize:11.5,fontWeight:on?700:500}}>{l}</span>
                {id==="avisos"&&pending.length>0&&(
                  <span style={{position:"absolute",top:5,left:"calc(50% + 6px)",minWidth:18,height:18,borderRadius:9,background:RED,color:"#fff",
                    fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px"}}>{pending.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═════ MENÚ «MÁS» ═════ */}
      {mas&&(
        <div onClick={()=>setMas(false)} style={{position:"fixed",inset:0,background:"rgba(15,13,12,.45)",zIndex:450,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
            style={{background:BG,width:"100%",maxWidth:520,borderRadius:"22px 22px 0 0",padding:"14px 16px calc(84px + env(safe-area-inset-bottom))"}}>
            <div style={{width:40,height:4,borderRadius:2,background:"#D4C9BE",margin:"0 auto 14px"}}/>
            {([
              ["todas","Todas las citas","La lista completa, de la más próxima a la más lejana",List],
            ] as const).map(([id,t,d,Icon])=>(
              <button key={id} onClick={()=>{setView(id);setMas(false);window.scrollTo(0,0);}}
                style={{...sans,width:"100%",display:"flex",alignItems:"center",gap:14,padding:"14px 12px",background:"white",
                  border:"none",borderRadius:14,marginBottom:8,cursor:"pointer",textAlign:"left"}}>
                <Icon size={24} color={G}/>
                <div><div style={{fontSize:16,fontWeight:700,color:CH}}>{t}</div><div style={{fontSize:13,color:MT}}>{d}</div></div>
              </button>
            ))}
            {real&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:6}}>
                <a href={`/?s=${real.slug}`} target="_blank" rel="noreferrer"
                  style={{...sans,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",borderRadius:14,
                    border:`1px solid ${G}66`,color:G,fontSize:15,fontWeight:600}}><ExternalLink size={17}/> Ver mi web</a>
                <button onClick={real.onSalir}
                  style={{...sans,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",borderRadius:14,
                    border:`1px solid ${MT}55`,background:"none",color:MT,fontSize:15,fontWeight:600,cursor:"pointer"}}><LogOut size={17}/> Salir</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
