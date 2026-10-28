-- Si a la clienta ya se le mandó el WhatsApp con los detalles de su cita (se ve igual en todos los móviles).
-- Se ejecuta una vez en el SQL Editor de Supabase.
alter table public.citas add column if not exists aviso_enviado boolean not null default false;
