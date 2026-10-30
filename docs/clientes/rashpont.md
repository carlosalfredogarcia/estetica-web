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
  - Entra en Fundadora: los bonos se **enseñan** en la ficha de cada tratamiento (precio y sesiones, como texto).
  - Es **Pro** (cobrar aparte): vender y controlar bonos en el panel (sesiones gastadas y caducidad),
    felicitación de cumpleaños, recordatorios automáticos por WhatsApp, campañas e informes.
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

## La web (primera versión, 30 oct 2026)

- Portada: `/rashpont` (con la intro «Oro líquido»; se repite con `/rashpont?intro=1`).
- Estética: `/rashpont/estetica` · Barbería: `/rashpont/barberia`.
- Código: `src/app/rashpont/`. Catálogo, precios, bonos y reseñas en `src/app/rashpont/_datos/catalogo.ts`.
  Las descripciones completas se leen al construir desde `docs/clientes/rashpont-descripciones/*.md`.
- Mientras los dos negocios no estén en Supabase, la agenda funciona en modo muestra
  (las reservas van al panel de muestra `/admin`). Al ejecutar `supabase/migrations/006_rashpont.sql`
  pasa sola a la agenda de verdad.
- Fotos: las de siempre pasadas a negro y dorado (`public/images/rashpont/`); barbería lleva iconos dorados
  hasta que lleguen sus fotos o las de Gemini (`rashpont-imagenes.md`).

## Pasos de montaje

1. Ejecutar `supabase/migrations/006_rashpont.sql` (crea `rashpont-estetica` y `rashpont-barberia` con sus tratamientos).
2. Crear las cuentas de Raquel y Andrés (Authentication → Add user) y enlazarlas con las dos líneas del final de ese SQL.
3. Subir sus fotos y ajustar textos y colores.
4. Revisarla juntos (día 6) y entregarla en persona (día 7): instalar el panel en su móvil y enseñarle Agenda, Avisos y Clientas.
5. Firmar el contrato de encargado del tratamiento (RGPD).

## Datos confirmados (30 oct 2026)

- **Estética:** Raquel · WhatsApp **643 044 577** (el de su Instagram, wa.link/plhu8o).
- **Barbería:** Andrés (en Booksy sale como «ANDREE») · WhatsApp **600 220 380**. Por ahora solo él.
- **Dirección:** C. José Moreno Carbonero, 2, 29640 Fuengirola. Razón social: Rash Pont S.L.
- **Descripciones completas de Booksy:** `rashpont-descripciones/` (parte 1 de 3 recibida; son 70 servicios).
  Booksy ha cambiado las categorías: Recuperación dérmica, Redensificación térmica, Corrección de textura…
  Muchas descripciones traen bonos con precio: se enseñarán en la tarjeta como «Bonos».
- **Horario provisional en la web:** lunes a sábado de 10:00 a 21:00, domingo cerrado.
- **Booksy:** nota 5,0 con 14 reseñas. Servicios, precios y duraciones en `rashpont-catalogo.md`.
- **Instagram:** @rashpont. Paleta: negro #0B0B0B, negro cálido #1A1712, dorado #C9A96E,
  dorado oscuro #A8874F, crema #F3EDE3, beige #E6DCCB, nude #B89A7A.
  Tono cercano, de tú. Frases suyas: «Cuidado personalizado para ti», «No es solo una cita».
- **Web:** se enseñan todos los tratamientos, ordenados para que la clienta no se pierda
  (grupos por lo que quiere mejorar, buscador y «ver más»). Cada tarjeta lleva un resumen
  y al pulsarla se abre con la descripción completa.
- **Intro:** tres propuestas en `intro/` (sello dorado, puertas y oro líquido). Por ahora gusta más el sello.

## Preguntas pendientes para el cliente

- [ ] **Horario:** Instagram dice lunes a sábado de 10:00 a 21:00; Booksy dice viernes hasta
      las 20:00 y sábado hasta las 15:30. ¿Cuál es el bueno? (En la web va de 10 a 21 por ahora.)
- [ ] **Equipo de barbería:** en una reseña aparece «reyser» haciendo corte y limpieza. ¿Trabaja allí?
- [ ] **Nombre del barbero:** ¿Andrés o Andree? (en Booksy pone ANDREE)
- [ ] **Servicios sin precio en Booksy** (packs y cabeceras: Pack Flash Lift Glow, Experiencia Escote,
      Diosa Cleopatra, Vientre plano, Bye Bye Michelines, Mamá Fit, Spa capilar, Piedras calientes…):
      ¿precio o «desde»?
- [ ] **Bonos, cupones y tarjetas regalo** de Booksy: importes y sesiones. (Muchos bonos ya vienen en las descripciones; confirmar que siguen vigentes.)
- [ ] **Precios que no cuadran** entre la variante y el texto: Microneedling Exosomas Supreme (299,95 € en la variante, 249,95 € en el texto), Exosomas rostro global (395,95 € frente a 389,95 €), Aclaramiento de axilas (89,95 € frente a 129,95 €), Lip Redensification (45 min frente a 30 min). ¿Cuál vale?
- [ ] **Corte de puntas mujer y ondulación permanente** están en Barbería: ¿los hace Andrés?
- [ ] **Señal o cancelación:** ¿cobran algo por no venir? ¿Las reservas se confirman al momento?
- [ ] **Logo** en buena calidad (PNG o SVG) y **fotos reales** del local, de Raquel y de Andrés.

## Notas de la visita

(Apunta aquí lo que te dijeron.)
