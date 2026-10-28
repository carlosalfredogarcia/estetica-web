import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Proyecto «alfrega-esteticas». La clave anon es pública (va en la web):
// la seguridad la ponen las reglas RLS de supabase/migrations/001_esteticas.sql.
const URL = "https://btizpwpinqyhneipczry.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXpwd3BpbnF5aG5laXBjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzYxODQsImV4cCI6MjEwODcxMjE4NH0.WtKdl_s-KSJbwVIXccRYGiCkUpRtcEy2kXUqxNtbjis";

let client: SupabaseClient | null = null;

// Solo en el navegador (la web se publica como páginas estáticas)
export function db(): SupabaseClient {
  if (!client) client = createClient(URL, ANON, { auth: { persistSession: true, storageKey: "alfrega-sesion" } });
  return client;
}
