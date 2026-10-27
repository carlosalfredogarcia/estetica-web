-- ALFREGA · Base de datos para todas las estéticas (un solo proyecto de Supabase).
-- Cada fila lleva salon_id. Cada dueña solo ve lo de su estética (RLS).
-- Las clientas de la web no leen nada privado: reservan con la función reservar().
-- Se ejecuta una vez en el SQL Editor de Supabase.

create extension if not exists pgcrypto;

-- ── Estéticas ────────────────────────────────────────────────────────────
create table public.salones (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),  -- su dirección: …/rosa
  nombre      text not null,
  ciudad      text,
  whatsapp    text,                       -- 34600111222
  instagram   text,
  -- Horario por día de la semana (0 = domingo): {"1":[{"s":10,"e":14},{"s":16,"e":20}], "0":null}
  horario     jsonb not null default '{"1":[{"s":10,"e":14},{"s":16,"e":20}],"2":[{"s":10,"e":14},{"s":16,"e":20}],"3":[{"s":10,"e":14},{"s":16,"e":20}],"4":[{"s":10,"e":14},{"s":16,"e":20}],"5":[{"s":10,"e":14},{"s":16,"e":20}],"6":[{"s":10,"e":14}],"0":null}',
  owner_id    uuid references auth.users(id) on delete set null,   -- la dueña (entra con su correo)
  activo      boolean not null default true,
  creado      timestamptz not null default now()
);

-- ── Tratamientos de cada estética ───────────────────────────────────────
create table public.tratamientos (
  id            uuid primary key default gen_random_uuid(),
  salon_id      uuid not null references public.salones(id) on delete cascade,
  categoria     text not null default 'Facial',      -- Facial · Corporal · Láser · …
  nombre        text not null,
  precio        numeric(8,2),
  precio_texto  text,                                -- «9€ / 14€» cuando no es un solo precio
  promo         text,                                -- «Bono 5 ses. · 150€»
  duracion_min  integer not null default 60,
  descripcion   text,
  imagen        text,
  orden         integer not null default 0,
  activo        boolean not null default true
);
create index on public.tratamientos (salon_id, orden);

-- ── Clientas ────────────────────────────────────────────────────────────
create table public.clientas (
  id        uuid primary key default gen_random_uuid(),
  salon_id  uuid not null references public.salones(id) on delete cascade,
  nombre    text not null,
  telefono  text,
  notas     text,                 -- alergias, bonos, preferencias (dato sensible: solo la dueña)
  creado    timestamptz not null default now()
);
create unique index clientas_tel on public.clientas (salon_id, telefono) where telefono is not null and telefono <> '';

-- ── Citas ───────────────────────────────────────────────────────────────
create table public.citas (
  id           uuid primary key default gen_random_uuid(),
  salon_id     uuid not null references public.salones(id) on delete cascade,
  clienta_id   uuid references public.clientas(id) on delete set null,
  fecha        date not null,
  hora         smallint not null check (hora between 0 and 23),
  nombre       text not null,
  telefono     text,
  tratamiento  text not null,
  precio       numeric(8,2),
  estado       text not null default 'pendiente'
               check (estado in ('pendiente','confirmada','hecha','no_vino','cancelada')),
  origen       text not null default 'panel' check (origen in ('web','panel')),
  notas        text,
  recordatorio_enviado boolean not null default false,
  resena_pedida        boolean not null default false,
  creado       timestamptz not null default now()
);
-- Una sola cita por hueco (las canceladas no cuentan)
create unique index citas_hueco on public.citas (salon_id, fecha, hora) where estado <> 'cancelada';
create index on public.citas (salon_id, fecha);

-- ── Horas bloqueadas por la dueña ───────────────────────────────────────
create table public.bloqueos (
  id        uuid primary key default gen_random_uuid(),
  salon_id  uuid not null references public.salones(id) on delete cascade,
  fecha     date not null,
  hora      smallint not null check (hora between 0 and 23),
  motivo    text,
  unique (salon_id, fecha, hora)
);

-- ── Seguridad (RLS) ─────────────────────────────────────────────────────
alter table public.salones      enable row level security;
alter table public.tratamientos enable row level security;
alter table public.clientas     enable row level security;
alter table public.citas        enable row level security;
alter table public.bloqueos     enable row level security;

-- ¿Es la dueña de esta estética?
create or replace function public.es_mi_salon(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from salones where id = s and owner_id = auth.uid());
$$;

-- Lo público (cualquiera, para enseñar la web): datos de la estética y tratamientos activos
create policy "salones públicos" on public.salones for select using (activo);
create policy "tratamientos públicos" on public.tratamientos for select using (activo);

-- La dueña: todo lo de su estética
create policy "dueña edita su salón" on public.salones for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "dueña: tratamientos" on public.tratamientos for all
  using (es_mi_salon(salon_id)) with check (es_mi_salon(salon_id));
create policy "dueña: clientas" on public.clientas for all
  using (es_mi_salon(salon_id)) with check (es_mi_salon(salon_id));
create policy "dueña: citas" on public.citas for all
  using (es_mi_salon(salon_id)) with check (es_mi_salon(salon_id));
create policy "dueña: bloqueos" on public.bloqueos for all
  using (es_mi_salon(salon_id)) with check (es_mi_salon(salon_id));

-- ── Para la web pública ─────────────────────────────────────────────────
-- Horas no disponibles (sin decir de quién son)
create or replace function public.horas_ocupadas(p_slug text, p_desde date, p_hasta date)
returns table (fecha date, hora smallint)
language sql stable security definer set search_path = public as $$
  select c.fecha, c.hora from citas c join salones s on s.id = c.salon_id
   where s.slug = p_slug and c.estado <> 'cancelada' and c.fecha between p_desde and p_hasta
  union
  select b.fecha, b.hora from bloqueos b join salones s on s.id = b.salon_id
   where s.slug = p_slug and b.fecha between p_desde and p_hasta;
$$;

-- Reserva desde la web: comprueba horario, hueco libre y abuso; entra como «pendiente»
create or replace function public.reservar(
  p_slug text, p_fecha date, p_hora smallint, p_tratamiento text, p_nombre text, p_telefono text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s salones%rowtype;
  t tratamientos%rowtype;
  tramos jsonb;
  abierto boolean := false;
  tramo jsonb;
  nueva uuid;
begin
  select * into s from salones where slug = p_slug and activo;
  if not found then raise exception 'Estética no encontrada'; end if;
  if p_fecha < (now() at time zone 'Europe/Madrid')::date or p_fecha > current_date + 120 then
    raise exception 'Fecha no válida';
  end if;
  if length(trim(coalesce(p_nombre,''))) < 2 then raise exception 'Falta el nombre'; end if;

  tramos := s.horario -> extract(dow from p_fecha)::int::text;
  if tramos is not null and jsonb_typeof(tramos) = 'array' then
    for tramo in select * from jsonb_array_elements(tramos) loop
      if p_hora >= (tramo->>'s')::int and p_hora < (tramo->>'e')::int then abierto := true; end if;
    end loop;
  end if;
  if not abierto then raise exception 'Ese día u hora está cerrado'; end if;

  if exists (select 1 from bloqueos where salon_id = s.id and fecha = p_fecha and hora = p_hora) then
    raise exception 'Esa hora ya no está disponible';
  end if;

  -- Máximo 3 reservas pendientes por teléfono, para evitar abusos
  if (select count(*) from citas where salon_id = s.id and telefono = p_telefono
        and estado = 'pendiente' and fecha >= current_date) >= 3 then
    raise exception 'Ya tienes varias reservas pendientes';
  end if;

  select * into t from tratamientos where salon_id = s.id and nombre = p_tratamiento and activo limit 1;

  insert into citas (salon_id, fecha, hora, nombre, telefono, tratamiento, precio, estado, origen)
  values (s.id, p_fecha, p_hora, trim(p_nombre), nullif(trim(coalesce(p_telefono,'')),''),
          p_tratamiento, t.precio, 'pendiente', 'web')
  returning id into nueva;
  return nueva;
exception when unique_violation then
  raise exception 'Esa hora ya no está disponible';
end;
$$;

revoke all on function public.reservar(text, date, smallint, text, text, text) from public;
grant execute on function public.reservar(text, date, smallint, text, text, text) to anon, authenticated;
grant execute on function public.horas_ocupadas(text, date, date) to anon, authenticated;
