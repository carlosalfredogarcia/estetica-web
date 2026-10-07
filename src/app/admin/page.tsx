"use client";

import { useState } from "react";

const G="#C9A96E", DR="#8B2252", ROSE="#D4929A";
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
  ["Carla Méndez","688 991 003"],["Lucía Ferrer","677 001 553"],["Susana Torres","611 220 887"],
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

// Genera todas las citas de julio 2026 respetando el horario real de DIMUX.
// La ocupación crece a lo largo del mes: el centro abrió el 18 de julio.
function generarJulio(){
  let seed=987654321;
  const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  const out=[];
  let id=1;
  for(let d=1;d<=31;d++){
    const dt=new Date(2026,6,d);
    const sc=SCHED[dt.getDay()];
    if(!sc)continue;
    const ds=`2026-07-${String(d).padStart(2,"0")}`;
    // Probabilidad de que la hora esté reservada
    const fill = d<=10 ? 0.55 : d<=17 ? 0.72 : d<=24 ? 0.90 : 0.82;
    for(const{s,e}of sc){
      for(let h=s;h<e;h++){
        if(rnd()>fill)continue;
        const n=NAMES[Math.floor(rnd()*NAMES.length)];
        const sv=POOL[Math.floor(rnd()*POOL.length)];
        const r=rnd();
        const status=(d>=24&&r>0.80)?"pendiente":"confirmada";
        const notes=rnd()>0.86?NOTE_POOL[Math.floor(rnd()*NOTE_POOL.length)]:"";
        out.push({id:id++,date:ds,time:h,client:n[0],phone:n[1],
          service:sv.s,price:sv.p+"€",status,notes});
      }
    }
  }
  return out;
}

const INIT_BOOKINGS=generarJulio();

const INIT_BLOCKED=[
  {date:"2026-07-07",time:14,reason:"Montaje del local"},
  {date:"2026-07-14",time:13,reason:"Entrega de material"},
  {date:"2026-07-16",time:19,reason:"Preparar inauguración"},
  {date:"2026-07-22",time:19,reason:"Cita con proveedor"},
  {date:"2026-07-25",time:13,reason:"Comida familiar"},
  {date:"2026-07-29",time:9,reason:"Formación láser"},
  {date:"2026-07-29",time:10,reason:"Formación láser"},
  {date:"2026-07-30",time:14,reason:"Descanso"},
];

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
`;

function Lotus({size=32,color=G}:{size?:number,color?:string}){
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 52C32 52 12 40 12 24C12 16 20 10 28 14C28 14 24 20 24 28C24 28 28 22 32 20C36 22 40 28 40 28C40 20 36 14 36 14C44 10 52 16 52 24C52 40 32 52 32 52Z" fill={color} opacity=".9"/>
      <path d="M32 52C32 52 20 44 18 34C22 36 26 40 32 44C38 40 42 36 46 34C44 44 32 52 32 52Z" fill={color} opacity=".4"/>
    </svg>
  );
}

export default function AdminPage(){
  const [view,setView]=useState("dia");
  const [bookings,setBookings]=useState(INIT_BOOKINGS);
  const [blocked,setBlocked]=useState(INIT_BLOCKED);
  const [selDate,setSelDate]=useState("2026-07-24");
  const [detail,setDetail]=useState<any>(null);
  const [blockModal,setBlockModal]=useState<any>(null);
  const [blockReason,setBlockReason]=useState("");
  const [calM,setCalM]=useState(new Date(2026,6,1));
  const [toast,setToast]=useState("");

  const serif={fontFamily:"'Roboto',Helvetica,sans-serif"};
  const sans={fontFamily:"'Roboto',Helvetica,sans-serif"};

  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),2600);};

  const parseD=(ds:string)=>{const[y,m,d]=ds.split("-").map(Number);return new Date(y,m-1,d);};
  const fmtD=(ds:string)=>{const dt=parseD(ds);return `${DAYS_FULL[dt.getDay()]}, ${dt.getDate()} de ${MONTHS[dt.getMonth()]}`;};
  const toDS=(dt:Date)=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;

  const getSlots=(ds:string)=>{
    const sc=(SCHED as any)[parseD(ds).getDay()];
    if(!sc)return[];
    const out:any[]=[];
    for(const{s,e}of sc)for(let h=s;h<e;h++){
      const bk=bookings.find((b:any)=>b.date===ds&&b.time===h);
      const bl=blocked.find((b:any)=>b.date===ds&&b.time===h);
      out.push({h,booking:bk,block:bl});
    }
    return out;
  };

  const dayBookings=bookings.filter((b:any)=>b.date===selDate).sort((a:any,b:any)=>a.time-b.time);
  const slots=getSlots(selDate);
  const freeCount=slots.filter((s:any)=>!s.booking&&!s.block).length;
  const revenue=dayBookings.reduce((sum:number,b:any)=>sum+parseInt(b.price)||0,0);
  const pending=bookings.filter((b:any)=>b.status==="pendiente");

  // Week days
  const selDt=parseD(selDate);
  const weekStart=new Date(selDt);
  weekStart.setDate(selDt.getDate()-((selDt.getDay()+6)%7));
  const weekDays=Array.from({length:7},(_,i)=>{
    const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d;
  });

  const confirmBk=(id:number)=>{
    setBookings((p:any[])=>p.map(b=>b.id===id?{...b,status:"confirmada"}:b));
    showToast("Cita confirmada ✓");
    setDetail(null);
  };
  const cancelBk=(id:number)=>{
    setBookings((p:any[])=>p.filter(b=>b.id!==id));
    showToast("Cita cancelada. Hueco liberado.");
    setDetail(null);
  };
  const doBlock=()=>{
    setBlocked((p:any[])=>[...p,{date:blockModal.date,time:blockModal.h,reason:blockReason||"No disponible"}]);
    showToast(`${String(blockModal.h).padStart(2,"0")}:00 bloqueado`);
    setBlockModal(null);setBlockReason("");
  };
  const unblock=(d:string,h:number)=>{
    setBlocked((p:any[])=>p.filter(b=>!(b.date===d&&b.time===h)));
    showToast("Hora liberada ✓");
  };

  const bP={...sans,background:G,color:DARK,border:"none",padding:"11px 22px",
    borderRadius:24,fontSize:10,letterSpacing:"2px",cursor:"pointer",
    textTransform:"uppercase" as const,fontWeight:500};
  const bO={...bP,background:"transparent",color:G,border:`1px solid ${G}`};
  const bDanger={...bP,background:"transparent",color:RED,border:`1px solid ${RED}55`};
  const inp={...sans,width:"100%",padding:"11px 14px",border:`1px solid ${G}44`,
    borderRadius:2,background:"white",color:CH,fontSize:14,outline:"none"};

  const yr=calM.getFullYear(),mo=calM.getMonth();
  const firstDay=new Date(yr,mo,1).getDay();
  const dIM=new Date(yr,mo+1,0).getDate();
  const cells:any[]=[];
  for(let i=0;i<((firstDay+6)%7);i++)cells.push(null);
  for(let d=1;d<=dIM;d++)cells.push(d);

  const statusStyle=(s:string)=>s==="confirmada"
    ?{bg:`${GREEN}18`,color:GREEN,label:"CONFIRMADA"}
    :{bg:`${AMBER}20`,color:AMBER,label:"PENDIENTE"};

  return(
    <div style={{...sans,background:BG,minHeight:"100vh",color:CH}}>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>

      {/* TOAST */}
      {toast&&(
        <div className="fu" style={{position:"fixed",bottom:24,left:"50%",
          transform:"translateX(-50%)",zIndex:900,
          background:DARK,color:"#fff",padding:"14px 26px",
          borderRadius:2,borderLeft:`3px solid ${G}`,
          ...sans,fontSize:13,boxShadow:"0 8px 28px rgba(0,0,0,.3)"}}>
          {toast}
        </div>
      )}

      {/* HEADER */}
      <header style={{background:"#D4C4B5",borderBottom:`1px solid ${G}22`,
        padding:"0 28px",height:64,display:"flex",alignItems:"center",
        justifyContent:"space-between",position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="float"><Lotus size={24}/></div>
          <div>
            <div style={{...serif,fontSize:15,letterSpacing:"6px",color:"#1A1A1A",lineHeight:1}}>DIMUX</div>
            <div style={{...sans,fontSize:7,letterSpacing:"3px",color:G,marginTop:2}}>PANEL DE GESTIÓN</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          {pending.length>0&&(
            <div style={{display:"flex",alignItems:"center",gap:7,
              background:`${AMBER}20`,padding:"6px 14px",borderRadius:20}}>
              <div className="pulse" style={{width:6,height:6,borderRadius:"50%",background:AMBER}}/>
              <span style={{...sans,fontSize:11,color:AMBER}}>
                {pending.length} nueva{pending.length>1?"s":""} sin confirmar
              </span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:G,
              display:"flex",alignItems:"center",justifyContent:"center",
              ...serif,fontSize:14,color:DARK,fontWeight:600}}>L</div>
            <div style={{...sans,fontSize:12,color:"#ffffffAA"}}>Lucía</div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div style={{background:"#C8B8A8",borderBottom:`1px solid ${G}18`,
        padding:"0 28px",display:"flex",gap:4,position:"sticky",top:64,zIndex:190}}>
        {[["dia","Hoy / Por día"],["semana","Vista semanal"],["mes","Calendario"],["todas","Todas las citas"]].map(([id,l])=>(
          <button key={id} className="navbtn" onClick={()=>setView(id)}
            style={{...sans,padding:"14px 20px",border:"none",background:"none",
              cursor:"pointer",fontSize:11,letterSpacing:"1.5px",
              color:view===id?G:"#1A1A1A66",
              borderBottom:`2px solid ${view===id?G:"transparent"}`,
              marginBottom:-1,fontWeight:view===id?500:400,transition:"color .2s"}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{maxWidth:1080,margin:"0 auto",padding:"32px 24px 64px"}}>

        {/* ═════ VISTA DÍA ═════ */}
        {view==="dia"&&(
        <div className="fu">
          {/* Date nav */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:6}}>AGENDA DEL DÍA</div>
              <div style={{...serif,fontSize:30,fontWeight:300,lineHeight:1.1}}>{fmtD(selDate)}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()-1);setSelDate(toDS(d));}}>‹ Anterior</button>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>setSelDate("2026-07-24")}>Hoy</button>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()+1);setSelDate(toDS(d));}}>Siguiente ›</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
            gap:2,background:`${G}22`,marginBottom:28}}>
            {[
              {n:dayBookings.length,l:"Citas del día",c:CH},
              {n:freeCount,l:"Huecos libres",c:GREEN},
              {n:dayBookings.filter((b:any)=>b.status==="pendiente").length,l:"Sin confirmar",c:AMBER},
              {n:`${revenue}€`,l:"Ingresos previstos",c:DR},
            ].map(s=>(
              <div key={s.l} className="card" style={{background:"white",padding:"22px 20px",
                textAlign:"center",transition:"all .25s"}}>
                <div style={{...serif,fontSize:34,fontWeight:400,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{...sans,fontSize:9,letterSpacing:"1.5px",color:MT,marginTop:7}}>
                  {s.l.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          {slots.length===0?(
            <div style={{textAlign:"center",padding:"64px 24px",background:BG2,border:`1px dashed ${G}44`}}>
              <div style={{...serif,fontSize:44,color:`${MT}44`,marginBottom:12}}>—</div>
              <div style={{...serif,fontSize:22,fontWeight:300,marginBottom:8}}>Centro cerrado</div>
              <div style={{...sans,fontSize:13,color:MT}}>Los domingos DIMUX no abre. Disfruta el descanso.</div>
            </div>
          ):(
          <div>
            <div style={{...sans,fontSize:9,letterSpacing:"3px",color:MT,marginBottom:14}}>
              LÍNEA DE TIEMPO · TOCA UN HUECO LIBRE PARA BLOQUEARLO
            </div>
            <div style={{display:"grid",gap:2,background:`${G}18`}}>
              {slots.map(({h,booking,block}:any)=>{
                const isFree=!booking&&!block;
                const st=booking?statusStyle(booking.status):null;
                return(
                  <div key={h} className={isFree?"slot":"row"}
                    onClick={()=>{
                      if(booking)setDetail(booking);
                      else if(block)unblock(selDate,h);
                      else setBlockModal({date:selDate,h});
                    }}
                    style={{background:booking?"white":block?`${RED}0C`:BG,
                      padding:"16px 20px",display:"flex",alignItems:"center",
                      gap:18,cursor:"pointer",transition:"all .18s",
                      borderLeft:`3px solid ${booking?st!.color:block?RED:GREEN}`}}>
                    <div style={{...serif,fontSize:19,color:booking?CH:MT,
                      minWidth:56,fontWeight:400}}>
                      {String(h).padStart(2,"0")}:00
                    </div>
                    {booking?(
                      <>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{...sans,fontSize:15,marginBottom:3,fontWeight:500}}>
                            {booking.client}
                          </div>
                          <div style={{...sans,fontSize:12,color:MT}}>
                            {booking.service} · {booking.phone}
                          </div>
                          {booking.notes&&(
                            <div style={{...sans,fontSize:11,color:AMBER,marginTop:4}}>
                              ⚠ {booking.notes}
                            </div>
                          )}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{...serif,fontSize:19,color:DR,marginBottom:5}}>{booking.price}</div>
                          <div style={{...sans,fontSize:8,letterSpacing:"1.5px",
                            background:st!.bg,color:st!.color,
                            padding:"3px 9px",borderRadius:10,display:"inline-block"}}>
                            {st!.label}
                          </div>
                        </div>
                      </>
                    ):block?(
                      <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{...sans,fontSize:14,color:RED,marginBottom:2}}>Bloqueado por ti</div>
                          <div style={{...sans,fontSize:12,color:MT}}>{block.reason}</div>
                        </div>
                        <div style={{...sans,fontSize:10,color:`${RED}99`,letterSpacing:"1px"}}>
                          TOCA PARA LIBERAR ✕
                        </div>
                      </div>
                    ):(
                      <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{...sans,fontSize:14,color:GREEN}}>Hueco libre · visible en la web</div>
                        <div style={{...sans,fontSize:10,color:`${MT}88`,letterSpacing:"1px"}}>
                          BLOQUEAR +
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
        )}

        {/* ═════ VISTA SEMANA ═════ */}
        {view==="semana"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:6}}>OCUPACIÓN SEMANAL</div>
              <div style={{...serif,fontSize:30,fontWeight:300}}>
                Semana del {weekDays[0].getDate()} al {weekDays[6].getDate()} de {MONTHS[weekDays[6].getMonth()]}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()-7);setSelDate(toDS(d));}}>‹ Semana</button>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>setSelDate("2026-07-24")}>Actual</button>
              <button style={{...bO,padding:"9px 15px"}}
                onClick={()=>{const d=parseD(selDate);d.setDate(d.getDate()+7);setSelDate(toDS(d));}}>Semana ›</button>
            </div>
          </div>

          {/* Weekly stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
            gap:2,background:`${G}22`,marginBottom:26}}>
            {(()=>{
              const wDS=weekDays.map(toDS);
              const wBks=bookings.filter((b:any)=>wDS.includes(b.date));
              const wSlots=wDS.reduce((n:number,ds:string)=>n+getSlots(ds).length,0);
              const wRev=wBks.reduce((s:number,b:any)=>s+(parseInt(b.price)||0),0);
              const wPend=wBks.filter((b:any)=>b.status==="pendiente").length;
              const wOcc=wSlots?Math.round((wBks.length/wSlots)*100):0;
              return[
                {n:wBks.length,l:"Citas esta semana",c:CH},
                {n:`${wOcc}%`,l:"Ocupación total",c:wOcc>70?RED:wOcc>35?AMBER:GREEN},
                {n:wPend,l:"Sin confirmar",c:AMBER},
                {n:`${wRev}€`,l:"Ingresos previstos",c:DR},
              ];
            })().map((s:any)=>(
              <div key={s.l} className="card" style={{background:"white",padding:"20px 18px",
                textAlign:"center",transition:"all .25s"}}>
                <div style={{...serif,fontSize:31,fontWeight:400,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{...sans,fontSize:9,letterSpacing:"1.5px",color:MT,marginTop:7}}>
                  {s.l.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div style={{overflowX:"auto",paddingBottom:8}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(122px,1fr))",
              gap:2,background:`${G}22`,minWidth:860}}>
              {weekDays.map(d=>{
                const ds=toDS(d);
                const sl=getSlots(ds);
                const bks=bookings.filter((b:any)=>b.date===ds).sort((a:any,b:any)=>a.time-b.time);
                const isToday=ds==="2026-07-24";
                const closed=sl.length===0;
                const occ=sl.length?Math.round(((sl.length-sl.filter((s:any)=>!s.booking&&!s.block).length)/sl.length)*100):0;
                return(
                  <div key={ds} onClick={()=>{setSelDate(ds);setView("dia");}}
                    style={{background:isToday?`${G}14`:"white",cursor:"pointer",
                      minHeight:250,display:"flex",flexDirection:"column"}}>
                    <div style={{padding:"12px 10px",borderBottom:`1px solid ${G}22`,
                      textAlign:"center",background:isToday?`${G}22`:BG}}>
                      <div style={{...sans,fontSize:9,letterSpacing:"1.5px",
                        color:isToday?DARK:MT,fontWeight:isToday?700:400}}>
                        {DAYS[d.getDay()].toUpperCase()}
                      </div>
                      <div style={{...serif,fontSize:22,marginTop:2,
                        color:isToday?DR:CH}}>{d.getDate()}</div>
                      {!closed&&(
                        <div style={{...sans,fontSize:9,color:occ>70?RED:occ>35?AMBER:GREEN,marginTop:3}}>
                          {occ}% ocupado
                        </div>
                      )}
                    </div>
                    <div style={{flex:1,padding:"8px 7px",display:"flex",
                      flexDirection:"column",gap:4}}>
                      {closed?(
                        <div style={{...sans,fontSize:10,color:`${MT}77`,
                          textAlign:"center",padding:"20px 0"}}>Cerrado</div>
                      ):bks.length===0?(
                        <div style={{...sans,fontSize:10,color:GREEN,
                          textAlign:"center",padding:"20px 0"}}>Día libre</div>
                      ):bks.map((b:any)=>{
                        const st=statusStyle(b.status);
                        return(
                          <div key={b.id} style={{background:st.bg,
                            borderLeft:`2px solid ${st.color}`,padding:"6px 8px"}}>
                            <div style={{...sans,fontSize:10,color:st.color,fontWeight:500}}>
                              {String(b.time).padStart(2,"0")}:00
                            </div>
                            <div style={{...sans,fontSize:11,marginTop:1,
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {b.client.split(" ")[0]}
                            </div>
                            <div style={{...sans,fontSize:9,color:MT,
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {b.service}
                            </div>
                          </div>
                        );
                      })}
                      {blocked.filter((b:any)=>b.date===ds).map((b:any)=>(
                        <div key={b.time} style={{background:`${RED}12`,
                          borderLeft:`2px solid ${RED}`,padding:"6px 8px"}}>
                          <div style={{...sans,fontSize:10,color:RED}}>
                            {String(b.time).padStart(2,"0")}:00
                          </div>
                          <div style={{...sans,fontSize:9,color:MT}}>{b.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap",
            ...sans,fontSize:11,color:MT}}>
            <span style={{color:GREEN}}>■ Confirmada</span>
            <span style={{color:AMBER}}>■ Pendiente</span>
            <span style={{color:RED}}>■ Bloqueado por Lucía</span>
            <span>Toca un día para ver el detalle</span>
          </div>
        </div>
        )}

        {/* ═════ VISTA MES ═════ */}
        {view==="mes"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div>
              <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:6}}>VISTA MENSUAL</div>
              <div style={{...serif,fontSize:30,fontWeight:300}}>{MONTHS[mo]} {yr}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...bO,padding:"9px 16px"}} onClick={()=>setCalM(new Date(yr,mo-1,1))}>‹</button>
              <button style={{...bO,padding:"9px 16px"}} onClick={()=>setCalM(new Date(yr,mo+1,1))}>›</button>
            </div>
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
              return[
                {n:mBks.length,l:"Citas del mes",c:CH},
                {n:`${mOcc}%`,l:"Ocupación del mes",c:mOcc>70?RED:mOcc>35?AMBER:GREEN},
                {n:mSlots-mBks.length,l:"Huecos libres",c:GREEN},
                {n:`${mRev}€`,l:"Facturación prevista",c:DR},
              ];
            })().map((s:any)=>(
              <div key={s.l} className="card" style={{background:"white",padding:"20px 18px",
                textAlign:"center",transition:"all .25s"}}>
                <div style={{...serif,fontSize:31,fontWeight:400,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{...sans,fontSize:9,letterSpacing:"1.5px",color:MT,marginTop:7}}>
                  {s.l.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d=>(
              <div key={d} style={{...sans,textAlign:"center",fontSize:9,
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
              const isToday=ds==="2026-07-24";
              const occ=sl.length?((sl.length-sl.filter((s:any)=>!s.booking&&!s.block).length)/sl.length):0;
              return(
                <div key={d} onClick={()=>{setSelDate(ds);setView("dia");}}
                  className="row"
                  style={{background:closed?`${MT}0A`:isToday?`${G}1E`:"white",
                    minHeight:88,padding:"8px 9px",cursor:"pointer",
                    transition:"all .18s",position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <span style={{...serif,fontSize:17,
                      color:closed?`${MT}66`:isToday?DR:CH,
                      fontWeight:isToday?600:400}}>{d}</span>
                    {isToday&&(
                      <span style={{...sans,fontSize:7,letterSpacing:"1px",
                        background:G,color:DARK,padding:"2px 5px",borderRadius:8}}>HOY</span>
                    )}
                  </div>
                  {closed?(
                    <div style={{...sans,fontSize:9,color:`${MT}55`,marginTop:6}}>Cerrado</div>
                  ):(
                    <div style={{marginTop:6}}>
                      {bks.length>0&&(
                        <div style={{...sans,fontSize:10,color:CH,marginBottom:3}}>
                          {bks.length} cita{bks.length>1?"s":""}
                        </div>
                      )}
                      {bls.length>0&&(
                        <div style={{...sans,fontSize:9,color:RED,marginBottom:3}}>
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
          <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap",...sans,fontSize:11,color:MT}}>
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
            <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:6}}>LISTADO COMPLETO</div>
            <div style={{...serif,fontSize:30,fontWeight:300}}>Todas las citas</div>
            <div style={{...sans,fontSize:13,color:MT,marginTop:6}}>
              {bookings.length} citas registradas · {pending.length} pendientes de confirmar
            </div>
          </div>

          {pending.length>0&&(
            <div style={{background:`${AMBER}12`,border:`1px solid ${AMBER}44`,
              padding:"16px 20px",marginBottom:24,borderLeft:`3px solid ${AMBER}`}}>
              <div style={{...sans,fontSize:11,letterSpacing:"2px",color:AMBER,
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
                    <div style={{...sans,fontSize:8,letterSpacing:"1px",color:MT}}>
                      {DAYS[dt.getDay()].toUpperCase()}
                    </div>
                    <div style={{...serif,fontSize:21,lineHeight:1.1}}>{dt.getDate()}</div>
                    <div style={{...sans,fontSize:8,color:MT}}>
                      {MONTHS[dt.getMonth()].slice(0,3).toUpperCase()}
                    </div>
                  </div>
                  <div style={{...serif,fontSize:16,color:MT,minWidth:52,flexShrink:0}}>
                    {String(b.time).padStart(2,"0")}:00
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{...sans,fontSize:14,fontWeight:500,marginBottom:2}}>{b.client}</div>
                    <div style={{...sans,fontSize:12,color:MT,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {b.service}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{...serif,fontSize:17,color:DR,marginBottom:4}}>{b.price}</div>
                    <div style={{...sans,fontSize:8,letterSpacing:"1px",
                      background:st.bg,color:st.color,padding:"3px 8px",
                      borderRadius:10,display:"inline-block"}}>{st.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

      </div>

      {/* ═════ MODAL DETALLE ═════ */}
      {detail&&(
      <div onClick={()=>setDetail(null)}
        style={{position:"fixed",inset:0,background:"rgba(15,13,12,.7)",
          backdropFilter:"blur(4px)",zIndex:500,display:"flex",
          alignItems:"center",justifyContent:"center",padding:20}}>
        <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
          style={{background:BG,maxWidth:440,width:"100%",
            maxHeight:"90vh",overflowY:"auto",
            boxShadow:"0 24px 60px rgba(0,0,0,.4)"}}>
          <div style={{background:DARK,padding:"24px 26px",
            borderBottom:`2px solid ${G}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:8}}>
                  DETALLE DE LA CITA
                </div>
                <div style={{...serif,fontSize:26,color:"#fff",fontWeight:300}}>{detail.client}</div>
              </div>
              <button onClick={()=>setDetail(null)}
                style={{background:"none",border:"none",color:"#ffffff77",
                  fontSize:22,cursor:"pointer",lineHeight:1,padding:0}}>×</button>
            </div>
          </div>

          <div style={{padding:"26px"}}>
            {[
              ["Fecha",fmtD(detail.date)],
              ["Hora",`${String(detail.time).padStart(2,"0")}:00h`],
              ["Tratamiento",detail.service],
              ["Precio",detail.price],
              ["Teléfono",detail.phone],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",
                padding:"12px 0",borderBottom:`1px solid ${G}22`,gap:16}}>
                <span style={{...sans,fontSize:11,letterSpacing:"1.5px",color:MT}}>
                  {k.toUpperCase()}
                </span>
                <span style={{...sans,fontSize:14,textAlign:"right"}}>{v}</span>
              </div>
            ))}

            {detail.notes&&(
              <div style={{marginTop:18,padding:"13px 16px",
                background:`${AMBER}12`,borderLeft:`2px solid ${AMBER}`}}>
                <div style={{...sans,fontSize:9,letterSpacing:"2px",
                  color:AMBER,marginBottom:5}}>NOTAS</div>
                <div style={{...sans,fontSize:13,color:CH,lineHeight:1.7}}>{detail.notes}</div>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:26}}>
              <a href={`https://wa.me/34${detail.phone.replace(/\s/g,"")}`}
                target="_blank" rel="noreferrer">
                <button style={{...bP,width:"100%"}}>📱 Escribir por WhatsApp</button>
              </a>
              <a href={`tel:${detail.phone.replace(/\s/g,"")}`}>
                <button style={{...bO,width:"100%"}}>📞 Llamar</button>
              </a>
              {detail.status==="pendiente"&&(
                <button style={{...bP,width:"100%",background:GREEN,color:"#fff"}}
                  onClick={()=>confirmBk(detail.id)}>
                  ✓ Confirmar esta cita
                </button>
              )}
              <button style={{...bDanger,width:"100%"}} onClick={()=>cancelBk(detail.id)}>
                Cancelar cita y liberar hueco
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ═════ MODAL BLOQUEAR ═════ */}
      {blockModal&&(
      <div onClick={()=>{setBlockModal(null);setBlockReason("");}}
        style={{position:"fixed",inset:0,background:"rgba(15,13,12,.7)",
          backdropFilter:"blur(4px)",zIndex:500,display:"flex",
          alignItems:"center",justifyContent:"center",padding:20}}>
        <div className="fu" onClick={(e:React.MouseEvent)=>e.stopPropagation()}
          style={{background:BG,maxWidth:400,width:"100%",
            boxShadow:"0 24px 60px rgba(0,0,0,.4)"}}>
          <div style={{background:DARK,padding:"22px 26px",borderBottom:`2px solid ${G}`}}>
            <div style={{...sans,fontSize:9,letterSpacing:"3px",color:G,marginBottom:8}}>
              BLOQUEAR HORARIO
            </div>
            <div style={{...serif,fontSize:24,color:"#fff",fontWeight:300}}>
              {String(blockModal.h).padStart(2,"0")}:00h
            </div>
            <div style={{...sans,fontSize:12,color:"#ffffff66",marginTop:4}}>
              {fmtD(blockModal.date)}
            </div>
          </div>
          <div style={{padding:26}}>
            <div style={{...sans,fontSize:13,color:MT,lineHeight:1.8,marginBottom:20}}>
              Al bloquear esta hora dejará de aparecer como disponible en la web.
              Los clientes no podrán reservarla.
            </div>
            <label style={{...sans,display:"block",fontSize:10,letterSpacing:"2px",
              color:MT,marginBottom:8}}>MOTIVO (SOLO LO VES TÚ)</label>
            <input style={{...inp,marginBottom:22}} value={blockReason}
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setBlockReason(e.target.value)}
              placeholder="Ej: comida, formación, descanso..."/>
            <div style={{display:"flex",gap:10}}>
              <button style={{...bO,flex:1}}
                onClick={()=>{setBlockModal(null);setBlockReason("");}}>Cancelar</button>
              <button style={{...bP,flex:1}} onClick={doBlock}>Bloquear hora</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
