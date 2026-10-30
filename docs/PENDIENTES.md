# Pendientes

## Del negocio (para todas las estéticas)

- [ ] **Pasar Supabase al plan Pro (unos 25 $/mes)** antes de que el primer cliente use la agenda de verdad.
      Con el plan gratis la base de datos se pausa si nadie entra en una semana y no hay copias diarias.
      Mantener **un solo proyecto** (todas las estéticas dentro): cada proyecto extra suma unos 10 $/mes.
      Dejar activado el **límite de gasto** (Spend Cap) para que nunca cobre de más sin avisar.
- [ ] **Diseños base**: cuando haya más clientes, tener 2 o 3 diseños base (por ejemplo «Cine oscuro»,
      «Crema elegante», «Moderno claro») y para cada cliente cambiar logo, colores, fotos y textos.
      Hacer cada web desde cero no escala: cada arreglo hay que repetirlo en todas.
      Rash Pont (`src/app/rashpont/`) puede ser el primero de esos diseños base.
- [ ] **Extra «Bonos y cumpleaños»** (+10 €/mes, Fundadora pasa a 40 €): vender bonos desde el panel, contar
      sesiones y caducidad, y aviso de cumpleaños. Hace falta pedir el cumpleaños (día y mes, opcional y con
      permiso de la clienta) en la reserva o apuntarlo en su ficha.
- [ ] **Campañas e informes**: para más adelante. Campaña sencilla = el panel saca una lista de clientas
      (por ejemplo, las que no vienen desde hace 2 meses) con un mensaje ya escrito y se envía uno a uno por WhatsApp.
- [ ] **Tienda de productos** como extra (ver `docs/clientes/rashpont-tienda.md`).

## Rash Pont (Fuengirola)

- [ ] Ejecutar `supabase/migrations/006_rashpont.sql` y crear las cuentas de Raquel y Andrés
      (guía: `docs/clientes/rashpont-supabase-paso-a-paso.md`).
- [ ] Descripciones de Booksy, parte 3: Bienestar holístico (13 servicios) y Barbería.
- [ ] Fotos: las de Gemini (`docs/clientes/rashpont-imagenes.md`) o fotos reales del local, de Raquel y de Andrés.
- [ ] Logo en buena calidad (PNG o SVG).
- [ ] Dominio a nombre de la tienda (datos en `docs/clientes/rashpont.md`) y hacer que abra directamente la portada.
- [ ] Preguntas para el cliente: horario, precios que no cuadran, «reyser», tienda… (en `docs/clientes/rashpont.md`).

## De la web de muestra

- **Diagnóstico «¿Qué necesita tu piel?»**: quitado de la web por ahora. El código sigue en
  `src/components/diagnostico.tsx`; para volver a ponerlo, añadir `<Diagnostico />` en `src/app/page.tsx`
  (y el enlace «Diagnóstico» en `site-header.tsx`). Revisar las preguntas cuando se conozca mejor a las clientas.
- **Datos del negocio**: nombre, ciudad, WhatsApp e Instagram se cambian en `NEGOCIO` (`src/lib/data.ts`).
  Ahora es «Tu Estética» con un número de ejemplo y sin Instagram.
- **Panel**: guarda los datos solo en el dispositivo donde se usa. Para varias personas o varios móviles hace falta
  una base de datos (p. ej. Supabase) y que las reservas de la web entren solas.
- **Regalo (cepillo con dispensador)**: pendiente de decidir cómo usarlo en la web.
