# Pendientes

## Del negocio (para todas las estéticas)

- [ ] **Pasar Supabase al plan Pro (unos 25 $/mes)** antes de que el primer cliente use la agenda de verdad.
      Con el plan gratis la base de datos se pausa si nadie entra en una semana y no hay copias diarias.
      Mantener **un solo proyecto** (todas las estéticas dentro): cada proyecto extra suma unos 10 $/mes.
      Dejar activado el **límite de gasto** (Spend Cap) para que nunca cobre de más sin avisar.
- [ ] **Plantilla única (después de enseñar Rash Pont)**: convertir la web de Rash Pont en una plantilla.
      Todas las webs comparten el mismo código (catálogo, ficha, agenda, opiniones…) y cada cliente es solo una
      carpeta con su ficha: nombre, colores, intro elegida, logo, fotos, textos y tratamientos.
      Un arreglo o una mejora se hace una vez y llega a todas. Intros disponibles: sello, puertas y oro líquido.
- [ ] **Extra «Bonos y fidelización»** (150 € de alta + 15 €/mes; ver `docs/clientes/rashpont-propuesta-extras.md`): vender bonos desde el panel, contar
      sesiones y caducidad, y aviso de cumpleaños. Hace falta pedir el cumpleaños (día y mes, opcional y con
      permiso de la clienta) en la reserva o apuntarlo en su ficha.
- [ ] **Campañas e informes**: para más adelante. Campaña sencilla = el panel saca una lista de clientas
      (por ejemplo, las que no vienen desde hace 2 meses) con un mensaje ya escrito y se envía uno a uno por WhatsApp.
- [ ] **Tienda de productos** como extra (ver `docs/clientes/rashpont-tienda.md`).

## Rash Pont (Fuengirola)

- [x] Rash Pont en Supabase (30 oct): `006_rashpont.sql` ejecutado (79 opciones de estética y 19 de barbería)
      y cuentas creadas. Estética: `kalisto1818+raquel@gmail.com` (provisional). Barbería: `reyserramirez8@gmail.com`.
- [ ] Cambiar el correo de Raquel por el suyo (Supabase → Authentication → Users → su usuario → cambiar email;
      no hay que tocar nada más).
- [ ] Llevar a la reunión: `docs/clientes/rashpont-preguntas.md`. Todos los enlaces en `docs/ENLACES.md`.
- [x] Descripciones de Booksy completas (partes 1, 2 y 3). Opcional: repasar la parte 1 leyendo el código de la página.
- [ ] Fotos: las de Gemini (`docs/clientes/rashpont-imagenes.md`) o fotos reales del local, de Raquel y de Andrés.
- [ ] Logo en buena calidad (PNG o SVG).
- [ ] Dominio a nombre de la tienda (datos en `docs/clientes/rashpont.md`) y hacer que abra directamente la portada.

- [ ] Detalle menor de la base de datos: si alguien forzara una reserva en domingo (cerrado), el error sale en inglés
      («cannot extract elements from a scalar») en vez de «Ese día u hora está cerrado». La web nunca ofrece domingos.
      Arreglarlo en una migración 007 cuando haya otro cambio de base de datos.
- [x] Pruebas de solapes (30 oct): 469 comprobaciones con citas de 30, 45, 60, 90, 120 y 135 min, horas bloqueadas,
      cierre, domingo, dos reservas a la vez, cancelar y mover citas desde el panel. Ningún solape.
      Se repiten con `node scripts/pruebas-solapes.cjs` sobre una base de datos local (instrucciones en el archivo).

## De la web de muestra

- **Diagnóstico «¿Qué necesita tu piel?»**: quitado de la web por ahora. El código sigue en
  `src/components/diagnostico.tsx`; para volver a ponerlo, añadir `<Diagnostico />` en `src/app/page.tsx`
  (y el enlace «Diagnóstico» en `site-header.tsx`). Revisar las preguntas cuando se conozca mejor a las clientas.
- **Datos del negocio**: nombre, ciudad, WhatsApp e Instagram se cambian en `NEGOCIO` (`src/lib/data.ts`).
  Ahora es «Tu Estética» con un número de ejemplo y sin Instagram.
- **Panel**: guarda los datos solo en el dispositivo donde se usa. Para varias personas o varios móviles hace falta
  una base de datos (p. ej. Supabase) y que las reservas de la web entren solas.
- **Regalo (cepillo con dispensador)**: pendiente de decidir cómo usarlo en la web.
