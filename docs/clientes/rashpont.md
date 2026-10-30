# Rashpont · Fuengirola

Estética y barbería en el mismo local. Primera clienta interesada (visita de finales de octubre de 2026).
Quieren ver una primera versión de la web en la próxima visita.

## Cómo la montamos (decidido)

- **Un solo dominio** para la tienda, con una **portada común** y dos puertas: **Estética** y **Barbería**.
- **Son dos personas, cada una con su rubro:** por dentro se crean como **dos negocios** en Supabase
  (por ejemplo `rashpont-estetica` y `rashpont-barberia`), cada uno con sus servicios, su horario,
  **su propio WhatsApp**, su agenda y su panel. Una reserva de barbería no ocupa la hora de estética.
- **Diseño a medida, muy moderno**, no la plantilla de siempre: sacar la paleta de su Instagram y
  preparar 2 o 3 estilos para que elijan.
- **Precios y duraciones:** de su Booksy.
- **Dominio:** a nombre de la tienda (DonDominio o Cloudflare, solo dominio, sin hosting). La web sigue en Vercel.

- Plan: Fundadora, **30 € al mes** (precio especial de las 10 primeras). Primer mes gratis desde el día de la entrega.
- Identificador de su web (slug): `rashpont` → https://estetica-web-six.vercel.app/?s=rashpont
- Su panel: https://estetica-web-six.vercel.app/panel (entra con su correo y su contraseña)

## Datos que faltan (pedirlos con la imagen `docs/venta/lista-para-la-estetica.png`)

- [ ] Nombre exacto y logo
- [ ] Tratamientos de estética: nombre, precio, duración y descripción breve
- [ ] Servicios de peluquería: nombre, precio y duración
- [ ] ¿Cuántas personas trabajan a la vez? (estética y peluquería, ¿agendas separadas?)
- [ ] Bonos y promociones
- [ ] Horario de cada día y días de cierre
- [ ] Dirección, WhatsApp, Instagram y ficha de Google Maps
- [ ] Correo de la dueña para el panel
- [ ] ¿Reservas confirmadas al momento o las confirma ella?
- [ ] Fotos: local, equipo, máquinas; 3 mejores reseñas
- [ ] Estilo: tres palabras, colores que le gustan y que no, webs que le gustan

## Pasos de montaje

1. Crear su estética en Supabase (como `supabase/migrations/002_estetica_prueba.sql`, con su slug, horario y tratamientos).
2. Crear la cuenta de la dueña con su correo (Authentication → Add user) y enlazarla en `salones`.
3. Subir sus fotos y ajustar textos y colores.
4. Revisarla juntos (día 6) y entregarla en persona (día 7): instalar el panel en su móvil y enseñarle Agenda, Avisos y Clientas.
5. Firmar el contrato de encargado del tratamiento (RGPD).

## Notas de la visita

(Apunta aquí lo que te dijeron.)
