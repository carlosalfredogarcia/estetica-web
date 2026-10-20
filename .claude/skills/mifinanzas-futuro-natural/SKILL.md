---
name: mifinanzas-futuro-natural
description: Transforma cualquier pantalla de MiFinanzas (empezando por el dashboard) en una interfaz de tecnología de futuro que transmite confianza, serenidad y naturaleza — biotecnología serena, luz de aurora, formas orgánicas y movimiento que respira. Úsala cuando el usuario pida que la app se vea "del futuro", "más natural", "más tranquila", "que dé confianza" o quiera rediseñar una pantalla con ese espíritu.
---

# MiFinanzas — Futuro natural

La idea: el dinero como un ecosistema vivo que entiendes de un vistazo. Tecnología
que no grita: luz suave, materiales que parecen cristal y musgo, números claros y
movimiento lento, como la respiración. Quien abre la app tiene que sentir calma
antes de leer una sola cifra.

Tres sensaciones, cada una con su traducción concreta:

| Sensación  | Cómo se consigue |
|------------|------------------|
| Confianza  | Cifras grandes y exactas, siempre en el mismo sitio. Estados explicados con palabras ("Bajo control"), nunca solo con color. Nada parpadea, nada sorprende. |
| Serenidad  | Mucho aire entre bloques. Animaciones lentas (≥ 600 ms) con curvas suaves, sin rebotes. Los avisos se dicen con tono tranquilo, no con alarmas rojas. |
| Naturaleza | Formas orgánicas (radios generosos, curvas de colina), metáforas de crecimiento (anillos de árbol, raíces, horizonte) y una paleta de bosque al anochecer con luz de aurora. |

## Stack y restricciones

- React + Tailwind, el mismo stack de MiFinanzas. Supabase sin cambios en tablas.
- Mobile-first (390 px de referencia). Objetivos táctiles ≥ 44 px.
- Solo UI: no tocar lógica, cálculos ni llamadas a Supabase.
- Un componente por pantalla, para revisarlo fácil.
- SVG y CSS puros para gráficos y efectos. Sin librerías de gráficos ni de animación.

## Paleta — "bosque al anochecer"

```css
:root {
  --night:   #06110e;  /* fondo: verde casi negro, nunca negro puro */
  --moss:    #0d1c17;  /* superficies */
  --moss-2:  #132820;  /* superficies elevadas */
  --line:    rgba(158, 214, 186, .14); /* bordes finos */
  --mist:    #e6f0ea;  /* texto principal */
  --sage:    #9db8aa;  /* texto secundario (≥ 4.5:1 sobre --moss) */
  --aurora:  #5eead4;  /* acento vivo: luz, foco, datos positivos */
  --leaf:    #34d399;  /* ingresos, "bajo control" */
  --sun:     #f4cf8a;  /* atención, ahorro, momentos cálidos */
  --coral:   #f2907f;  /* gastos y "al límite" — rojo suavizado, nunca #ff0000 */
  --sky:     #8fb8ff;  /* información neutra, enlaces */
}
```

Reglas de color:
- Gastos en `--coral`, no en rojo puro: informa sin asustar.
- La luz (glows, halos) siempre en `--aurora` o `--sun`, con opacidad ≤ 0.35.
- Un solo acento vivo por pantalla; el resto, tonos de musgo y niebla.
- Ningún color comunica solo: acompáñalo de texto o icono.

En Tailwind, añade estos tokens en `theme.extend.colors` con los mismos nombres
(`night`, `moss`, `moss-2`, `mist`, `sage`, `aurora`, `leaf`, `sun`, `coral`, `sky`).

## Tipografía

- **Sora** (Google Fonts) para cifras y títulos: geométrica, de futuro, legible.
- **Figtree** para texto: humana y cálida.
- Cifras siempre con `font-variant-numeric: tabular-nums`.
- Formato español: `1.529,29 €` (punto de miles también en 4 cifras, coma decimal, € detrás).
- Títulos de sección en minúsculas con mayúscula inicial, nada de MAYÚSCULAS espaciadas.

## Materiales y formas

- **Cristal de niebla** para la tarjeta principal: `background: linear-gradient(160deg, rgba(94,234,212,.12), rgba(13,28,23,.6))`, `backdrop-filter: blur(16px)`, borde `--line`, y una luz interior arriba (`inset 0 1px 0 rgba(255,255,255,.06)`).
- **Musgo** para el resto de tarjetas: `--moss`, borde `--line`, sin sombras duras.
- Radios orgánicos: 28 px en tarjetas, 999 px en píldoras. Una tarjeta destacada puede usar radios asimétricos (`32px 32px 32px 12px`) como una hoja.
- Fondo con 2 halos de luz desenfocados (`--aurora` y `--sun`, blur ≥ 80 px, opacidad ≤ 0.2), quietos o con deriva muy lenta (≥ 20 s).
- Separadores como líneas de horizonte curvas (SVG), no reglas rectas.

## Metáforas — cada dato, un elemento de la naturaleza

1. **Anillos de árbol (salud financiera).** El anillo de % gastado se dibuja como anillos concéntricos finos: el exterior es el mes actual; los interiores, más tenues, los meses anteriores. Leaf < 80 %, sun 80–95 %, coral > 95 %. Etiqueta siempre en palabras: "Bajo control", "Atención", "Al límite".
2. **Horizonte (evolución del saldo).** La sparkline de 6 meses es una línea de colinas: trazo suave (curva Catmull-Rom o cúbica), relleno degradado hacia abajo como neblina y un punto de luz en el mes actual.
3. **Raíces (gastos fijos).** Cada gasto fijo es una barra fina que nace de una misma línea vertical, como raíces de un tronco; el grosor o la longitud es su % del total.
4. **Brote (metas y ahorro).** El progreso hacia una meta se muestra como un brote que crece en etapas (semilla → brote → planta → árbol) según el %; la cifra exacta siempre al lado.
5. **Clima (ritmo de gasto).** La frase del ritmo va con un icono de clima: despejado si la proyección queda por debajo de los ingresos, nublado si se acerca, lluvia suave si los supera. Texto: "Llevas X €. A este ritmo terminarás el mes en Y €." y, si se pasa, "Son Z € más de lo que ingresas: aún estás a tiempo."
6. **Huella (último movimiento).** Categoría con su emoji, tiempo relativo ("hace 2 h", "ayer") y botón "Ver todos".

Las metáforas apoyan, nunca sustituyen: la cifra exacta está siempre visible.

## Movimiento — la app respira

- Curvas: `cubic-bezier(.4, 0, .2, 1)` para movimientos, `cubic-bezier(.16, 1, .3, 1)` para entradas. Nada de muelles con rebote.
- Entradas al cargar: las tarjetas suben 12 px y aparecen en cascada (80 ms entre una y otra), 700 ms cada una.
- Anillos, barras y horizonte se dibujan una vez al cargar (1,2–1,6 s) y luego quedan quietos.
- Respiración: el halo del acento principal late entre 0.25 y 0.35 de opacidad en un ciclo de 6 s. Solo un elemento respira por pantalla.
- `prefers-reduced-motion: reduce` desactiva todo lo anterior.

## Tono de los textos

- Frases cortas, en segunda persona, tranquilas: "Vas bien este mes", "Te quedan 393,36 € hasta fin de mes".
- Los avisos proponen, no regañan: "Aún estás a tiempo de ajustar" en vez de "¡Te has pasado!".
- Nada de afirmaciones de seguridad o privacidad que la app no cumpla de verdad.

## Lo que hay que evitar

- Neón saturado, negro puro, rojo puro, degradados morado-azul de "IA".
- Hojas o plantas decorativas sin significado: cada elemento natural representa un dato.
- Emoji fuera de las categorías.
- Animaciones en bucle que distraigan (salvo la única respiración).
- Inventar datos: si falta un histórico, se marca como "datos de ejemplo" en el mockup.

## Proceso

1. Leer la pantalla actual (captura o código) y listar sus datos reales.
2. Hacer un mockup HTML (lienzo de diseño) con esos datos, junto a la pantalla actual para comparar. Marcar como ejemplo todo dato que no exista.
3. El usuario aprueba o pide cambios. No pasar a código con dudas abiertas.
4. Escribir el componente React + Tailwind con los tokens de esta skill, sin tocar la lógica.
5. NUNCA hacer push a GitHub del código de la app sin confirmación explícita.

## Checklist antes de enseñar nada

- [ ] Contraste de texto ≥ 4.5:1 (también los grises pequeños).
- [ ] Cada estado se entiende sin color (texto o icono).
- [ ] Cifras en formato español y con `tabular-nums`.
- [ ] Un solo acento vivo y un solo elemento que respira.
- [ ] Funciona a 390 px sin scroll horizontal.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Ningún dato inventado sin marcar.
