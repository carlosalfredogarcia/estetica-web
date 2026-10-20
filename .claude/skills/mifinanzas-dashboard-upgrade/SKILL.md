---
name: mifinanzas-dashboard-upgrade
description: Rediseña el dashboard de MiFinanzas para que sea más moderno, único y transmita seguridad — con nuevas funciones visuales: anillo de presupuesto, barra de salud financiera, tarjetas con glassmorphism, y paleta refinada. Úsala cuando el usuario pida mejorar, modernizar o rediseñar el dashboard o cualquier pantalla de MiFinanzas.
---

# MiFinanzas — Dashboard Upgrade

Rediseña el dashboard actual de MiFinanzas para que transmita seguridad, control y modernidad.

## Stack y restricciones
- React + Tailwind (mismo stack que MiFinanzas)
- Supabase como backend (no cambiar estructura de tablas)
- Mobile-first — la app se usa en móvil
- No romper funcionalidad existente — solo mejorar UI
- Un componente por pantalla para revisar fácilmente

## Identidad visual nueva
--bg: #0a0e1a (azul marino oscuro)
--surface: #111827
--green: #10b981 (esmeralda)
--red: #ef4444
--gold: #f59e0b
--accent: #6366f1 (índigo)

## Nuevas funciones de diseño

1. ANILLO DE SALUD FINANCIERA — SVG circular animado que muestra % de ingresos gastado. Verde < 80%, ámbar 80-95%, rojo > 95%.

2. SALDO CON GLASSMORPHISM — fondo degradado semitransparente con backdrop-filter: blur(12px) y borde verde sutil.

3. SPARKLINE — línea SVG con los últimos 6 meses de saldo. SVG puro, sin librerías.

4. GASTOS FIJOS CON BARRAS — cada gasto fijo muestra su % del total como barra horizontal.

5. RITMO DE GASTO — frase: "Llevas €X gastados. A este ritmo terminarás el mes en €Y."

6. ÚLTIMO MOVIMIENTO CON CONTEXTO — emoji de categoría, tiempo relativo ("hace 2h", "ayer"), botón ver todos.

## Estado actual del dashboard (referencia)
- Saldo: €393,36
- Ingresos: €1.380 / Gastos: €986,64
- Gastos fijos: Santander €47, Basic fit €25, Amazon prime €5, claude €22, Orange €15
- Último movimiento: Vzla −€120

## Proceso
1. Crear mockup HTML primero — usuario aprueba
2. Luego código React real
3. NUNCA push a GitHub sin confirmación explícita
