# Rash Pont · Tienda de productos (notas para la reunión)

Raquel quiere vender sus productos (tiene muchos). Antes de dar precio, preguntarle esto.

## Preguntas

1. **¿Cuántos productos son?** ¿Más o menos 20, 50, 100…?
2. **¿Quién pasa los datos?** Para cada producto: foto, nombre, precio y una frase. ¿Me pasa una lista
   (hoja de cálculo o fotos de la estantería con precios) o las fotos las saco yo en el centro?
3. **¿Envíos o recogida en el centro?** ¿Quiere mandar paquetes o que la clienta lo recoja en Rash Pont?
4. **¿Cobrar online o en el centro?** ¿Le basta con que la clienta lo pague al recogerlo (efectivo, tarjeta, Bizum)
   o quiere que paguen con tarjeta en la web?
5. **¿Puede vender esas marcas por internet?** Algunas marcas profesionales (por ejemplo Germaine de Capuccini)
   solo dejan vender sus productos a los centros autorizados y **en persona**, no en tiendas online, para cuidar
   su imagen y su precio. Que se lo pregunte a su distribuidor o a su comercial. Si no le dejan vender online,
   el escaparate con recogida en el centro sí suele estar permitido.
6. **¿Cuánto stock tiene?** ¿Quiere que la web diga «agotado» o lo controla ella?

## Las dos opciones

| | Escaparate (recomendado para empezar) | Tienda con pago online |
|---|---|---|
| Qué ve la clienta | Productos con foto, precio y descripción | Lo mismo, con carrito |
| Cómo compra | Pulsa «Lo quiero» y le llega a Raquel por WhatsApp; se lo aparta y lo cobra en el centro | Paga con tarjeta en la web; recogida o envío |
| Pasarela de pago | No hace falta | Sí (Stripe) |
| Precio de alta | 150–250 € | 400–700 € |
| Al mes | +10 € | +20–25 € |
| Subir los productos | Hasta 50 incluidos; luego 1–2 € por producto (o que pase una hoja con todo) | Igual |

## Qué es la pasarela de pago

Es el servicio que cobra la tarjeta de la clienta en la web y le ingresa el dinero a Raquel en su cuenta
(por ejemplo **Stripe**). No se paga cuota: se queda una pequeña comisión de cada venta, más o menos
**1,5 % + 0,25 €** con tarjetas europeas.

Ejemplo: una crema de 40 € → Stripe se queda unos 0,85 € → a Raquel le llegan unos 39,15 €.

La comisión la paga Raquel (sale de cada venta); tú cobras el alta y la cuota de la tienda.
Para darse de alta en Stripe hacen falta los datos de la empresa (Rash Pont S.L., CIF) y su cuenta bancaria.

Con tienda online también hacen falta: condiciones de venta, política de devoluciones y envíos (si hay envíos).

## Recomendación

Empezar por el **escaparate**: se monta rápido, no necesita pasarela ni papeles nuevos, y sirve para ver
si de verdad vende. Si vende mucho, se pasa a la tienda con pago online.
