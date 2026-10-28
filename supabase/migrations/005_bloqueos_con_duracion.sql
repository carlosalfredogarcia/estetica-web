-- Bloqueos de la duración que quiera la dueña (30 min, 1 h, 1 h 30, 2 h…) y desde cualquier media hora.
-- Se ejecuta una vez en el SQL Editor de Supabase, después de 001 a 004.

alter table public.bloqueos add column if not exists minuto smallint not null default 0 check (minuto between 0 and 59);
alter table public.bloqueos add column if not exists duracion_min integer not null default 60 check (duracion_min between 15 and 720);
-- Antes solo había un bloqueo por hora en punto; ahora pueden empezar en cualquier media hora
alter table public.bloqueos drop constraint if exists bloqueos_salon_id_fecha_hora_key;

-- Las citas no pueden pisar ni otra cita ni un bloqueo (ahora con su duración)
create or replace function public.sin_solapes() returns trigger
language plpgsql security definer set search_path = public as $$
declare ini int; fin int;
begin
  if new.estado = 'cancelada' then return new; end if;
  perform pg_advisory_xact_lock(hashtext(new.salon_id::text || new.fecha::text));
  ini := new.hora * 60 + new.minuto;
  fin := ini + new.duracion_min;
  if exists (
    select 1 from citas c
     where c.salon_id = new.salon_id and c.fecha = new.fecha and c.estado <> 'cancelada' and c.id <> new.id
       and c.hora * 60 + c.minuto < fin and c.hora * 60 + c.minuto + c.duracion_min > ini
  ) or exists (
    select 1 from bloqueos b
     where b.salon_id = new.salon_id and b.fecha = new.fecha
       and b.hora * 60 + b.minuto < fin and b.hora * 60 + b.minuto + b.duracion_min > ini
  ) then
    raise exception 'Esa hora ya no está disponible' using errcode = '23505';
  end if;
  return new;
end;
$$;

-- La web no ofrece las horas bloqueadas, con su duración
create or replace function public.horas_ocupadas(p_slug text, p_desde date, p_hasta date)
returns table (fecha date, hora smallint, minuto smallint, duracion_min integer)
language sql stable security definer set search_path = public as $$
  select c.fecha, c.hora, c.minuto, c.duracion_min from citas c join salones s on s.id = c.salon_id
   where s.slug = p_slug and c.estado <> 'cancelada' and c.fecha between p_desde and p_hasta
  union all
  select b.fecha, b.hora, b.minuto, b.duracion_min from bloqueos b join salones s on s.id = b.salon_id
   where s.slug = p_slug and b.fecha between p_desde and p_hasta;
$$;
