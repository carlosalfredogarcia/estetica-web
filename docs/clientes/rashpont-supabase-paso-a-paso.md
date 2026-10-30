# Rash Pont · Poner la agenda de verdad (paso a paso con la extensión de Chrome)

Qué vamos a hacer: meter en la base de datos los dos negocios de Rash Pont (Estética y Barbería) con
todos sus tratamientos, y crear la cuenta del panel de Raquel y la de Andrés.
Mientras no se haga, la web funciona en «modo muestra» (las reservas no llegan a nadie).

Haz un paso, comprueba que ha salido bien y pasa al siguiente.

## Paso 1 · Crear los dos negocios

Abre Supabase en Chrome (con tu sesión iniciada) y pega esto en la extensión:

```
Abre Supabase (supabase.com/dashboard) y entra en el proyecto "alfrega-esteticas" (su dirección empieza por btizpwpinqyhneipczry).
Ve a "SQL Editor" en el menú de la izquierda y crea una consulta nueva ("New query").
En otra pestaña abre https://github.com/carlosalfredogarcia/estetica-web/blob/main/supabase/migrations/006_rashpont.sql y pulsa el botón "Raw" para ver el texto. Copia TODO el texto.
Vuelve a Supabase, pega el texto en la consulta nueva y pulsa "Run".
Dime qué mensaje sale abajo (debe decir "Success" o similar). Si sale un error, cópiamelo entero y NO ejecutes nada más.
```

Comprobar: abre https://estetica-web-six.vercel.app/rashpont/estetica, elige un tratamiento y un día.
Si todo fue bien, la web ya usa la agenda de verdad (la reserva aparecerá en el panel de Raquel en el paso 3).

## Paso 2 · Crear las cuentas de Raquel y Andrés

Necesitas el correo de cada uno y una contraseña (luego la pueden cambiar). Pega esto en la extensión,
cambiando los datos en MAYÚSCULAS:

```
En Supabase, en el proyecto "alfrega-esteticas", ve a "Authentication" y luego a "Users".
Pulsa "Add user" y elige "Create new user".
Crea este usuario: correo CORREO_DE_RAQUEL, contraseña CONTRASEÑA_DE_RAQUEL, y marca la casilla "Auto Confirm User". Pulsa crear.
Repite con: correo CORREO_DE_ANDRES, contraseña CONTRASEÑA_DE_ANDRES, también con "Auto Confirm User".
Dime si los dos aparecen en la lista de usuarios.
```

## Paso 3 · Darle a cada uno su negocio

```
En Supabase, en el proyecto "alfrega-esteticas", ve a "SQL Editor" y crea una consulta nueva.
Pega exactamente esto y pulsa "Run":

update public.salones set owner_id = (select id from auth.users where email = 'CORREO_DE_RAQUEL') where slug = 'rashpont-estetica';
update public.salones set owner_id = (select id from auth.users where email = 'CORREO_DE_ANDRES') where slug = 'rashpont-barberia';

Dime el mensaje que sale abajo.
```

## Paso 4 · Probarlo

1. Haz una reserva de prueba en https://estetica-web-six.vercel.app/rashpont/estetica con tu nombre y tu móvil.
2. Entra en https://estetica-web-six.vercel.app/panel con el correo y la contraseña de Raquel: tiene que salir tu cita.
3. Haz lo mismo con Barbería y la cuenta de Andrés.
4. Borra o cancela las citas de prueba desde el panel.

## Si algo sale mal

- Error en el paso 1: cópialo y pásamelo. No pasa nada por ejecutar el archivo dos veces: actualiza los datos
  y no borra citas.
- En el panel sale «no tienes estética asignada»: el correo del paso 3 no coincide con el del paso 2.
