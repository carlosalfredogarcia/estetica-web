# Pendientes

- **Diagnóstico «¿Qué necesita tu piel?»**: quitado de la web por ahora. El código sigue en
  `src/components/diagnostico.tsx`; para volver a ponerlo, añadir `<Diagnostico />` en `src/app/page.tsx`
  (y el enlace «Diagnóstico» en `site-header.tsx`). Revisar las preguntas cuando se conozca mejor a las clientas.
- **Datos del negocio**: nombre, ciudad, WhatsApp e Instagram se cambian en `NEGOCIO` (`src/lib/data.ts`).
  Ahora es «Tu Estética» con un número de ejemplo y sin Instagram.
- **Panel**: guarda los datos solo en el dispositivo donde se usa. Para varias personas o varios móviles hace falta
  una base de datos (p. ej. Supabase) y que las reservas de la web entren solas.
- **Regalo (cepillo con dispensador)**: pendiente de decidir cómo usarlo en la web.
