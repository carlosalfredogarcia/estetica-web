# Qué más se puede automatizar (y con qué IA)

Plan por orden de impacto para un centro de estética. Lo marcado ✅ ya está en la web.

## Ya hecho en la web (sin coste)

- ✅ **Reserva directa por WhatsApp**: la reserva abre WhatsApp con el mensaje listo (tratamiento, día, hora, nombre, teléfono). Antes la web decía «¡Reserva recibida!» pero no enviaba nada.
- ✅ **Cita en el calendario de la clienta** (.ics con aviso el día antes): menos olvidos y menos plantones.
- ⏸ **Diagnóstico en 30 segundos**: hecho pero quitado de la web por ahora (ver PENDIENTES.md).
- ✅ **Ahorro de cada bono** calculado solo a partir de los precios de `src/lib/data.ts`.
- ✅ **Guía antes/después** de cada tipo de tratamiento y **preguntas frecuentes**: responde antes de que pregunten.
- ✅ **«Abierto ahora · cerramos a las…»** con la hora de Málaga.
- ✅ **Ficha para Google** (datos estructurados `BeautySalon`): horario, servicios y precios legibles por Google.

## Siguiente paso recomendado: asistente con IA en la web y en WhatsApp

| Qué | Para qué | Modelo |
|---|---|---|
| Chat de la web | Responde dudas 24 h (precios, contraindicaciones, qué tratamiento elegir) y acaba en una reserva | **Claude Sonnet 5.5**: el que mejor relación calidad/precio tiene ahora mismo |
| WhatsApp Business API | Confirma citas, recuerda la cita 24 h antes y pide reseña en Google tras la sesión | Sonnet 5.5 (o Haiku 5.5 para mensajes simples y baratos) |
| Análisis de foto de piel | La clienta sube un selfie y recibe una orientación (manchas, poros, textura) | **Claude Opus 5.5**: el más inteligente del mercado (octubre 2026), lee imágenes |
| Contenido de Instagram | Textos de posts, reels y promociones de cada mes a partir de los tratamientos | Sonnet 5.5 |

**Qué hace falta para activarlo** (avísame y lo monto):
1. Una clave de la API de Anthropic (console.anthropic.com). Cada conversación cuesta céntimos; se pone un límite mensual.
2. La web ahora es estática (`output: "export"`). El asistente necesita una pequeña función en Vercel que guarde la clave en secreto. Es un cambio pequeño.
3. Para WhatsApp automático: cuenta de **WhatsApp Business API** (Meta o un proveedor como 360dialog/Twilio).

## Gestión del centro (panel `/admin`)

Ahora el panel enseña **citas de ejemplo**: no guarda nada. Para que sea real:
- **Base de datos** (Supabase, gratis para empezar): las reservas de la web entran solas en el panel, sin copiar de WhatsApp.
- **Huecos reales**: el calendario de la web deja de ofrecer las horas ya ocupadas.
- **Recordatorios automáticos** 24 h antes, y si no confirma, se avisa a la dueña para llenar el hueco.
- **Ficha de clienta**: historial, alergias, sesiones que le quedan del bono, fotos antes/después (con consentimiento).
- **Reactivar clientas**: aviso automático a quien no viene desde hace 2 meses, o cuando toca la siguiente sesión de láser (cada 6–8 semanas).
- **Reseñas**: mensaje automático tras la cita con el enlace a Google.

## Software ya hecho (si se prefiere no programarlo)

- **Pabau**: software de clínicas estéticas con análisis de piel con IA («AI Studio»).
- **Vagaro**: reservas con asistente IA («Vera») que promociona huecos libres.
- **ScanSkinAI / Haut.AI / Perfect Corp / Revieve**: análisis de piel desde el móvil o la tablet.
- **Crisalix / Makeover.so**: simulación del resultado; ayuda mucho a cerrar la venta en la consulta.

> Aviso: el análisis de piel con IA es **orientativo**, nunca un diagnóstico médico. En la web se dice así.
