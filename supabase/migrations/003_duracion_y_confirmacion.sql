-- Citas según la duración del tratamiento (huecos cada 30 min) y confirmación al momento.
-- Se ejecuta una vez en el SQL Editor de Supabase, después de 001 y 002.

-- Cada cita guarda a qué minuto empieza y cuánto dura
alter table public.citas add column if not exists minuto smallint not null default 0 check (minuto between 0 and 59);
alter table public.citas add column if not exists duracion_min integer not null default 60 check (duracion_min between 5 and 480);

-- Cada estética elige: reservas confirmadas al momento (por defecto) o que las confirme ella
alter table public.salones add column if not exists confirmar_auto boolean not null default true;
-- Cada cuántos minutos se ofrecen huecos (30 por defecto)
alter table public.salones add column if not exists intervalo_min smallint not null default 30 check (intervalo_min in (15, 30, 60));

-- Ya no basta con «una cita por hora»: ahora se comprueba que no se solapen
drop index if exists public.citas_hueco;

create or replace function public.sin_solapes() returns trigger
language plpgsql security definer set search_path = public as $$
declare ini int; fin int;
begin
  if new.estado = 'cancelada' then return new; end if;
  -- Una reserva a la vez por estética y día, para que dos clientas no cojan el mismo hueco
  perform pg_advisory_xact_lock(hashtext(new.salon_id::text || new.fecha::text));
  ini := new.hora * 60 + new.minuto;
  fin := ini + new.duracion_min;
  if exists (
    select 1 from citas c
     where c.salon_id = new.salon_id and c.fecha = new.fecha and c.estado <> 'cancelada' and c.id <> new.id
       and c.hora * 60 + c.minuto < fin and c.hora * 60 + c.minuto + c.duracion_min > ini
  ) or exists (
    select 1 from bloqueos b
     where b.salon_id = new.salon_id and b.fecha = new.fecha and b.hora * 60 < fin and b.hora * 60 + 60 > ini
  ) then
    raise exception 'Esa hora ya no está disponible' using errcode = '23505';
  end if;
  return new;
end;
$$;

drop trigger if exists citas_sin_solapes on public.citas;
create trigger citas_sin_solapes
  before insert or update of fecha, hora, minuto, duracion_min, estado on public.citas
  for each row execute function public.sin_solapes();

-- Horas ocupadas con su duración (sin nombres ni teléfonos)
drop function if exists public.horas_ocupadas(text, date, date);
create function public.horas_ocupadas(p_slug text, p_desde date, p_hasta date)
returns table (fecha date, hora smallint, minuto smallint, duracion_min integer)
language sql stable security definer set search_path = public as $$
  select c.fecha, c.hora, c.minuto, c.duracion_min from citas c join salones s on s.id = c.salon_id
   where s.slug = p_slug and c.estado <> 'cancelada' and c.fecha between p_desde and p_hasta
  union all
  select b.fecha, b.hora, 0::smallint, 60 from bloqueos b join salones s on s.id = b.salon_id
   where s.slug = p_slug and b.fecha between p_desde and p_hasta;
$$;
grant execute on function public.horas_ocupadas(text, date, date) to anon, authenticated;

-- Reserva desde la web, ahora con minuto y la duración del tratamiento
drop function if exists public.reservar(text, date, smallint, text, text, text);
create function public.reservar(
  p_slug text, p_fecha date, p_hora smallint, p_minuto smallint,
  p_tratamiento text, p_nombre text, p_telefono text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s salones%rowtype;
  t tratamientos%rowtype;
  tramo jsonb;
  dentro boolean := false;
  ini int := p_hora * 60 + p_minuto;
  dur int;
  nueva uuid;
begin
  select * into s from salones where slug = p_slug and activo;
  if not found then raise exception 'Estética no encontrada'; end if;
  if p_fecha < (now() at time zone 'Europe/Madrid')::date or p_fecha > current_date + 120 then
    raise exception 'Fecha no válida';
  end if;
  if p_fecha = (now() at time zone 'Europe/Madrid')::date
     and ini <= extract(hour from now() at time zone 'Europe/Madrid') * 60 + extract(minute from now() at time zone 'Europe/Madrid') then
    raise exception 'Esa hora ya ha pasado';
  end if;
  if length(trim(coalesce(p_nombre, ''))) < 2 then raise exception 'Falta el nombre'; end if;
  if length(regexp_replace(coalesce(p_telefono, ''), '\D', '', 'g')) < 9 then raise exception 'Falta el teléfono'; end if;

  select * into t from tratamientos where salon_id = s.id and nombre = p_tratamiento and activo limit 1;
  if not found then raise exception 'Tratamiento no encontrado'; end if;
  dur := coalesce(t.duracion_min, 60);

  -- Tiene que caber entero dentro de un tramo del horario
  for tramo in select * from jsonb_array_elements(coalesce(s.horario -> extract(dow from p_fecha)::int::text, '[]'::jsonb)) loop
    if ini >= (tramo->>'s')::int * 60 and ini + dur <= (tramo->>'e')::int * 60 then dentro := true; end if;
  end loop;
  if not dentro then raise exception 'Ese día u hora está cerrado'; end if;

  if (select count(*) from citas where salon_id = s.id and telefono = p_telefono
        and estado in ('pendiente', 'confirmada') and fecha >= current_date) >= 3 then
    raise exception 'Ya tienes varias reservas pendientes';
  end if;

  insert into citas (salon_id, fecha, hora, minuto, duracion_min, nombre, telefono, tratamiento, precio, estado, origen)
  values (s.id, p_fecha, p_hora, p_minuto, dur, trim(p_nombre), trim(p_telefono), p_tratamiento, t.precio,
          case when s.confirmar_auto then 'confirmada' else 'pendiente' end, 'web')
  returning id into nueva;
  return nueva;
exception when unique_violation then
  raise exception 'Esa hora ya no está disponible';
end;
$$;
revoke all on function public.reservar(text, date, smallint, smallint, text, text, text) from public;
grant execute on function public.reservar(text, date, smallint, smallint, text, text, text) to anon, authenticated;

-- Las citas que ya había toman la duración de su tratamiento
update public.citas c set duracion_min = t.duracion_min
  from public.tratamientos t where t.salon_id = c.salon_id and t.nombre = c.tratamiento;
