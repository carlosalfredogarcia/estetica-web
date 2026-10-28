"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { cargarSalonReal } from "@/components/negocio";
import { Panel, type PanelReal } from "@/components/panel";

// Panel de verdad de cada estética: la dueña entra con su correo y contraseña
// y solo ve lo suyo (las reglas RLS de la base de datos lo garantizan).
type Estado = { paso: "cargando" } | { paso: "entrar"; error?: string } | { paso: "sin-salon"; correo: string } | { paso: "dentro"; salon: PanelReal };

export default function PanelPage() {
  const [estado, setEstado] = useState<Estado>({ paso: "cargando" });
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);

  const salir = useCallback(async () => {
    await db().auth.signOut();
    setEstado({ paso: "entrar" });
  }, []);

  const abrir = useCallback(async () => {
    const { data } = await db().auth.getUser();
    const user = data.user;
    if (!user) return setEstado({ paso: "entrar" });
    const { data: s } = await db().from("salones").select("id, slug").eq("owner_id", user.id).limit(1).maybeSingle();
    if (!s) return setEstado({ paso: "sin-salon", correo: user.email ?? "" });
    const r = await cargarSalonReal(s.slug);
    setEstado({
      paso: "dentro",
      salon: { salonId: s.id, slug: s.slug, nombre: r.negocio.nombre, horario: r.horario, servicios: r.servicios, onSalir: salir },
    });
  }, [salir]);

  useEffect(() => {
    const t = setTimeout(abrir, 0);
    return () => clearTimeout(t);
  }, [abrir]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    const { error } = await db().auth.signInWithPassword({ email: correo.trim(), password: clave });
    setEnviando(false);
    if (error) return setEstado({ paso: "entrar", error: "Correo o contraseña incorrectos" });
    setEstado({ paso: "cargando" });
    abrir();
  }

  if (estado.paso === "dentro") return <Panel real={estado.salon} />;

  return (
    <div className="cine min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-3xl tracking-[0.2em] uppercase text-center mb-1">Tu panel</p>
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--gold)] text-center mb-10">Panel de gestión</p>

        {estado.paso === "cargando" && (
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
        )}

        {estado.paso === "sin-salon" && (
          <div className="text-center space-y-4">
            <p className="text-sm font-sans">
              Has entrado como <b>{estado.correo}</b>, pero esta cuenta aún no tiene una estética asignada.
            </p>
            <p className="text-sm font-sans text-muted-foreground">Escribe a Carlos para que te la active.</p>
            <button onClick={salir} className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">
              Entrar con otra cuenta
            </button>
          </div>
        )}

        {estado.paso === "entrar" && (
          <form onSubmit={entrar} className="space-y-4">
            <input
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Tu correo"
              className="w-full px-4 py-3 bg-white border border-border text-sm font-sans outline-none focus:border-[var(--gold)]"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-white border border-border text-sm font-sans outline-none focus:border-[var(--gold)]"
            />
            {estado.error && <p className="text-sm font-sans text-[#b42318]">{estado.error}</p>}
            <button disabled={enviando} className="w-full btn-gold py-3.5 text-xs font-sans tracking-[0.2em] uppercase rounded-full disabled:opacity-50">
              {enviando ? "Entrando…" : "Entrar"}
            </button>
            <p className="text-xs font-sans text-muted-foreground text-center">¿No recuerdas la contraseña? Escribe a Carlos.</p>
          </form>
        )}
      </div>
    </div>
  );
}
