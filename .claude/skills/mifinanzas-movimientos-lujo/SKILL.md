---
name: mifinanzas-movimientos-lujo
description: Rediseña la pantalla de Movimientos de MiFinanzas (mifinanza-movimientos.html) con el mismo sistema visual del dashboard nuevo — azul marino, esmeralda, índigo, glassmorphism — y le añade funciones premium (búsqueda, filtros, pulso del mes, deslizar para editar o borrar, detalle con contexto, agrupación de comercios). Úsala cuando el usuario pida mejorar, modernizar o añadir funciones a Movimientos.
---

# MiFinanzas — Movimientos de lujo

Movimientos es donde el usuario pasa más tiempo después del dashboard. Tiene que
sentirse como una app de banca privada: rápida, precisa y agradable de tocar.
Toda la información nueva sale de los datos que la pantalla ya carga; no hace
falta tocar Supabase.

## El stack real (no es React)

- Un solo archivo: `mifinanza-movimientos.html`, HTML + CSS + JavaScript sin framework.
- Supabase JS v2 por CDN (`dbClient`), sesión en `auth.js`, selector de fecha en `datepicker.js`.
- Tablas que lee y escribe (NO cambiar su estructura):
  - `gastos`: `fecha, descripcion, categoria, monto, origen, usuario_id`
  - `ingresos`: `fecha, concepto, tipo, monto, origen, usuario_id`
  - `gastos_fijos`: `nombre, categoria, monto, dia_del_mes, activo, fecha_inicio, fecha_fin, usuario_id`
  - `perfil`: `categorias, premium, codigos_usados, limite_importacion`
- La moneda viene de `window.moneda` (localStorage `moneda`, por defecto `$`). Nunca escribir `€` o `$` fijo.
- El usuario puede cambiar el color de acento (localStorage `color` → `--accent`). Respetarlo.
- No hay hora en los movimientos (solo `fecha`): el tiempo relativo es "Hoy", "Ayer" o la fecha. Si las filas traen `created_at`, se puede usar para "hace 2 h"; comprobarlo antes.

## Contrato que no se puede romper

Antes de tocar nada, leer el archivo entero. Estos nombres los usa la lógica y deben seguir existiendo:

- IDs: `lista`, `mes-label`, `mes-subtitle`, `mes-count`, `total-ingresos`, `total-gastos`, `toast`,
  y todos los modales (`menu-fab`, `panel-mas`, `modal-gasto`, `modal-ingreso`, `modal-fijo`,
  `modal-editar`, `modal-csv`, `modal-csv-rango`, `modal-revision-voz`, `modal-limite-premium`,
  `modal-borrar-1`, `modal-borrar-2`) con sus campos (`g-*`, `i-*`, `f-*`, `e-*`, `csv-*`).
- Funciones: `cargarMovimientos`, `renderLista`, `filtrar`, `cambiarMes`, `abrirEditarIdx`,
  `abrirEditar`, `guardarEdicion`, `eliminarMovimiento`, `abrirMenu`, `abrirGasto`, `abrirIngreso`,
  `abrirGastoFijo`, `abrirModalCSV`, `abrirPanelMas`, `toast` y el flujo de importación y revisión por voz.
- Estado: `todosMovimientos`, `filtradosActuales`, `categoriaActiva`, `mesActual`, `anioActual`.
- El patrón `html { visibility: hidden }` que `auth.js` levanta al validar la sesión.

Se cambia la presentación (CSS, marcado, el HTML que genera `renderLista`) y se AÑADE
lógica de interfaz. Las llamadas a Supabase se quedan como están.

## Sistema visual (el del dashboard nuevo, `inicio.html`)

```css
:root {
  --bg: #0a0e1a;  --surface: #111827;  --surface2: #1a2234;
  --border: #1f2d45;
  --green: #10b981;  --green-glow: rgba(16,185,129,.15);
  --red: #ef4444;    --gold: #f59e0b;
  --accent: #6366f1; --accent-glow: rgba(99,102,241,.18);
  --text: #f1f5f9;
  --sub: #94a3b8;  /* el #64748b de inicio.html no llega a 4.5:1 sobre --surface: usar este */
}
```

- Tipografía: Manrope (400–800). Cifras con `font-variant-numeric: tabular-nums`, peso 800.
- Gastos en `--red` (#f87171 en texto pequeño), ingresos en `--green` (#34d399), fijos en `--accent`.
- Tarjeta resumen con glassmorphism: degradado esmeralda→índigo translúcido, `backdrop-filter: blur(12px)`, borde verde sutil.
- Resto de tarjetas: `--surface`, borde `--border`, radio 16–24 px.
- Iconos de interfaz en SVG de trazo; el emoji solo para la categoría (como ya hace `getIcon`).
- Navbar y FAB iguales que en `inicio.html` para que las pantallas se sientan una sola app.

## Funciones de lujo

Todas son solo de interfaz y se calculan con `todosMovimientos`. Ordenadas por impacto.

1. **Resumen del mes con cristal.** Balance neto (ingresos − gastos) grande, ingresos y gastos
   debajo y una barra fina que compara los dos. Los totales cuentan hacia su valor al cargar (600 ms).
2. **Pulso del mes.** Mini gráfico SVG de barras: una por día con el gasto de ese día; hoy resaltado.
   Tocar una barra hace scroll suave a ese día de la lista.
3. **Búsqueda instantánea.** Campo con lupa que filtra mientras escribes por descripción,
   categoría o importe ("120" encuentra 120,00). Sin llamadas nuevas: filtra `todosMovimientos`.
4. **Chips de filtro.** Todos · Gastos · Ingresos · Fijos · y las 4 categorías con más gasto del mes.
   Usan `filtrar()` y `categoriaActiva`, que ya existen en el código aunque hoy no tienen chips en pantalla.
5. **Cabeceras de día con total.** "Hoy · −42,30" fijas arriba al hacer scroll (`position: sticky`).
6. **Deslizar para actuar.** Deslizar a la izquierda muestra "Eliminar"; a la derecha, "Editar".
   Eliminar no borra al momento: toast "Movimiento eliminado · Deshacer" durante 5 s y solo
   entonces se llama a la lógica de borrado existente. Vibración corta (`navigator.vibrate(10)`) en Android.
7. **Detalle con contexto.** Tocar un movimiento abre primero una hoja de detalle: importe grande,
   categoría, fecha, origen (manual o importado) y una línea útil: "Este mes llevas 186,40 en
   Supermercado (7 movimientos)". Botones: Editar (abre el modal actual), Repetir (abre "Nuevo gasto"
   con los mismos datos y fecha de hoy) y Eliminar.
8. **Comercios agrupados.** Si una descripción se repite 3+ veces en el mes, una tarjeta discreta
   lo resume: "Mercadona · 4 veces · 80,21". Tocarla filtra la lista por ese comercio.
9. **Insignias.** Pastilla "Fijo" (índigo), "Importado" (gris) si `origen === 'importado'` y
   "Inusual" (dorado) si el importe supera 2× la media de su categoría ese mes.
10. **Carga y vacío cuidados.** Esqueletos con brillo mientras carga, y un estado vacío con
    ilustración SVG y botón "Añadir el primero" que abre el menú del FAB.

Funciones que SÍ necesitan cambios en la base de datos (proponer, nunca hacer sin permiso):
notas en un movimiento, foto del ticket, etiquetas personalizadas, hora exacta.

## Movimiento y tacto

- Entradas en cascada (40 ms entre filas, máx. 12 filas animadas), 400–600 ms, `cubic-bezier(.16,1,.3,1)`.
- Al deslizar, la fila sigue el dedo; al soltar vuelve con curva suave.
- Nada parpadea ni rebota. `prefers-reduced-motion: reduce` lo apaga todo.

## Accesibilidad y calidad

- Filas y chips como `<button>` (hoy son `div` con `onclick`), objetivos ≥ 44 px.
- Texto secundario `--sub` (#94a3b8), contraste ≥ 4.5:1.
- Deslizar siempre tiene alternativa: los mismos botones en la hoja de detalle.
- Importes formateados con una función propia: separador de miles y 2 decimales, más `window.moneda`.
- Probar con meses vacíos, con 200+ movimientos y con descripciones largas.

## Proceso

1. Leer `mifinanza-movimientos.html` completo e `inicio.html` (referencia visual).
2. Mockup en el lienzo de diseño, junto al dashboard aprobado, con datos reales o marcados como ejemplo.
3. El usuario aprueba o pide cambios.
4. Implementar en `mifinanza-movimientos.html` en una rama propia, sin tocar las llamadas a Supabase.
5. Probar en el navegador a 390 px: cargar mes, cambiar mes, buscar, filtrar, deslizar, deshacer,
   editar, repetir, importar CSV y el flujo de voz.
6. NUNCA hacer push a GitHub sin confirmación explícita del usuario.

## Checklist antes de enseñar

- [ ] Todos los IDs y funciones del contrato siguen existiendo y funcionando.
- [ ] Ninguna llamada a Supabase cambiada.
- [ ] La moneda sale de `window.moneda` y el acento respeta el color del usuario.
- [ ] Contraste ≥ 4.5:1 y objetivos ≥ 44 px.
- [ ] Funciona a 390 px sin scroll horizontal.
- [ ] Borrar se puede deshacer.
- [ ] `prefers-reduced-motion` respetado.
