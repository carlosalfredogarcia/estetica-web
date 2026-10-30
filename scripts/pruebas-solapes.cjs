// Pruebas de solapes: la web (huecosLibres) y la base de datos (reservar + trigger) tienen que coincidir.
// Se ejecutan contra una base de datos local de prueba, nunca contra Supabase:
//   initdb -D /tmp/pg -A trust -U postgres && pg_ctl -D /tmp/pg -o "-p 5499 -k /tmp" start
//   psql -h /tmp -p 5499 -U postgres -c "create database t"
//   (en t: crear roles anon y authenticated, el esquema auth con auth.users y auth.uid(), y aplicar supabase/migrations/*.sql)
//   node scripts/pruebas-solapes.cjs
const { execFileSync } = require("child_process");
const fs = require("fs");
const ts = require(require("path").join(__dirname, "../node_modules/typescript"));

const sql = (q) => execFileSync("psql", ["-h", "/tmp", "-p", "5499", "-U", "postgres", "-d", "t", "-At", "-v", "ON_ERROR_STOP=1", "-c", q], { encoding: "utf8" }).trim();

// La función de la web, tal cual está en el código
const src = fs.readFileSync(require("path").join(__dirname, "../src/components/negocio.tsx"), "utf8");
const ini = src.indexOf("export function huecosLibres(");
let prof = 0, fin = src.indexOf("{", src.indexOf(")", src.indexOf("): number[]", ini)));
for (let i = fin; i < src.length; i++) { if (src[i] === "{") prof++; if (src[i] === "}" && --prof === 0) { fin = i + 1; break; } }
const js = ts.transpileModule(src.slice(ini, fin).replace("export ", ""), { compilerOptions: { target: 99 } }).outputText;
const huecosLibres = new Function(js + "; return huecosLibres;")();

const DIA = "2026-11-09"; // lunes
const HORARIO = { 0: null, 1: [{ s: 10, e: 21 }], 2: [{ s: 10, e: 21 }], 3: [{ s: 10, e: 21 }], 4: [{ s: 10, e: 21 }], 5: [{ s: 10, e: 21 }], 6: [{ s: 10, e: 21 }] };
let tel = 600000000;
let fallos = 0, pruebas = 0;
const ok = (cond, msg) => { pruebas++; if (!cond) { fallos++; console.log("  ✗ " + msg); } };
const hh = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function reservar(slug, fecha, min, trat, guardar = false) {
  const q = `select public.reservar('${slug}', '${fecha}', ${Math.floor(min / 60)}::smallint, ${min % 60}::smallint, '${trat.replace(/'/g, "''")}', 'Prueba', '${tel++}')`;
  if (guardar) { try { sql(q); return true; } catch { return false; } }
  // Se prueba y se deshace: no queda nada guardado
  try { execFileSync("psql", ["-h", "/tmp", "-p", "5499", "-U", "postgres", "-d", "t", "-At", "-c", `do $$ begin perform ${q.slice(7)}; raise exception 'SE_PUEDE'; exception when others then raise exception '%', sqlerrm; end $$;`], { encoding: "utf8", stdio: "pipe" }); } catch (e) { return /SE_PUEDE/.test(String(e.stderr)); }
  return false;
}
function ocupado(slug, fecha) {
  const filas = sql(`select hora*60+minuto, duracion_min from public.horas_ocupadas('${slug}', '${fecha}', '${fecha}')`);
  return filas ? filas.split("\n").map((l) => { const [a, d] = l.split("|").map(Number); return { ini: a, fin: a + d }; }) : [];
}
const trat = (slug, min) => sql(`select t.nombre from tratamientos t join salones s on s.id=t.salon_id where s.slug='${slug}' and t.duracion_min=${min} order by t.orden limit 1`);

// ── Día con citas de distintas duraciones (Estética) ──
sql(`delete from citas; delete from bloqueos;`);
const E = "rashpont-estetica", B = "rashpont-barberia";
console.log("Citas puestas el lunes " + DIA + " en Estética:");
for (const [m, d] of [[600, 90], [720, 30], [810, 60], [960, 45], [1170, 30]]) {
  const t = trat(E, d); const g = reservar(E, DIA, m, t, true);
  console.log(`  ${hh(m)}–${hh(m + d)}  ${t} ${g ? "" : "(NO SE GUARDÓ)"}`); ok(g, `no se pudo poner la cita base de ${hh(m)}`);
}
// Bloqueo de la dueña: 17:30 a 18:30
sql(`insert into bloqueos (salon_id, fecha, hora, minuto, duracion_min, motivo) select id, '${DIA}', 17, 30, 60, 'prueba' from salones where slug='${E}'`);
console.log("  17:30–18:30  hora bloqueada por la dueña");

const occ = ocupado(E, DIA);
const dia = new Date(DIA + "T00:00:00");
for (const d of [30, 45, 60, 90, 120, 135]) {
  const t = trat(E, d);
  if (!t) { console.log(`(no hay tratamiento de ${d} min)`); continue; }
  const libres = huecosLibres(HORARIO, dia, d, occ, 30);
  // 1) Ninguna hora ofrecida pisa otra cita, el bloqueo ni el cierre
  for (const s of libres) ok(!occ.some((o) => o.ini < s + d && o.fin > s) && s + d <= 21 * 60 && s >= 600, `la web ofrece ${hh(s)} para ${d} min y se solapa`);
  // 2) Cada hora del día (cada 15 min): la base de datos acepta justo las que la web ofrece
  let distintas = [];
  for (let s = 9 * 60 + 30; s <= 21 * 60; s += 15) {
    const web = libres.includes(s);
    const db = reservar(E, DIA, s, t);
    const libreDeVerdad = s >= 600 && s + d <= 1260 && !occ.some((o) => o.ini < s + d && o.fin > s);
    ok(db === libreDeVerdad, `${d} min a las ${hh(s)}: la base de datos ${db ? "acepta" : "rechaza"} y debería ${libreDeVerdad ? "aceptar" : "rechazar"}`);
    if (web && !db) distintas.push(hh(s));
    if (s % 30 === 0) ok(web === libreDeVerdad, `${d} min a las ${hh(s)}: la web ${web ? "ofrece" : "no ofrece"} y debería ${libreDeVerdad ? "ofrecer" : "no ofrecer"}`);
  }
  console.log(`${String(d).padStart(3)} min · ${t.slice(0, 50)}\n        horas que ve la clienta: ${libres.map(hh).join(" ")}`);
  ok(distintas.length === 0, `la web ofrece horas que la base de datos rechaza: ${distintas}`);
}

// ── Casos sueltos ──
console.log("Casos sueltos:");
const t60 = trat(E, 60), t30 = trat(E, 30), b45 = trat(B, 45);
ok(!reservar(E, "2026-11-08", 660, t60), "domingo (cerrado) debería rechazarse");
ok(!reservar(E, DIA, 20 * 60 + 30, t60), "60 min a las 20:30 se pasa del cierre y debería rechazarse");
ok(reservar(B, DIA, 600, b45), "la barbería es otra agenda: a las 10:00 tiene que estar libre aunque estética esté ocupada");
// Dos clientas a la vez en el mismo hueco: solo entra una
ok(reservar(E, "2026-11-10", 660, t60, true), "primera reserva del martes 11:00");
ok(!reservar(E, "2026-11-10", 660, t60, true), "segunda reserva en el mismo hueco debería rechazarse");
ok(!reservar(E, "2026-11-10", 690, t30, true), "30 min a las 11:30 pisa la cita de 11:00–12:00 y debería rechazarse");
ok(reservar(E, "2026-11-10", 720, t30, true), "30 min a las 12:00 empieza justo cuando acaba la otra: debería aceptarse");
// Cancelar libera el hueco
sql(`update citas set estado='cancelada' where fecha='2026-11-10' and hora=11`);
ok(reservar(E, "2026-11-10", 660, t60, true), "tras cancelar, el hueco de las 11:00 debería volver a estar libre");
// La dueña mueve una cita encima de otra desde el panel: también se impide
let pisa = false; try { sql(`update citas set hora=12, minuto=0 where fecha='2026-11-10' and hora=11 and estado<>'cancelada'`); pisa = true; } catch {}
ok(!pisa, "mover desde el panel una cita encima de otra debería impedirse");
// Bonos no tocan nada aquí. Fecha pasada:
ok(!reservar(E, "2026-10-01", 660, t60), "una fecha pasada debería rechazarse");

console.log(`\n${pruebas} comprobaciones · ${fallos ? fallos + " FALLOS" : "todo bien, ningún solape"}`);
sql(`delete from citas; delete from bloqueos;`);
process.exit(fallos ? 1 : 0);
