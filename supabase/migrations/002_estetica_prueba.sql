-- Estética de PRUEBA para comprobar que todo funciona: web en …/?s=prueba y panel en …/panel
-- Antes: Authentication → Users → Add user → tu correo y una contraseña (marca «Auto Confirm User»).
-- Después cambia CAMBIA_ESTO@correo.com por ese correo y ejecuta esto en el SQL Editor.

do $$
declare s uuid;
begin
  insert into public.salones (slug, nombre, ciudad, whatsapp, owner_id)
  values ('prueba', 'Estética Prueba', 'Málaga', '34640309239',
          (select id from auth.users where email = 'CAMBIA_ESTO@correo.com'))
  returning id into s;

  insert into public.tratamientos (salon_id, categoria, nombre, precio, precio_texto, promo, duracion_min, descripcion, imagen, orden) values
  (s, 'Facial', 'Dermapen', 80, null, '1ª sesión 49€', 60, 'Microagujas que estimulan la producción natural de colágeno. Reduce arrugas, cicatrices de acné, poros abiertos y manchas, logrando una piel más firme y luminosa desde la primera sesión.', 'img/dermapen.jpg', 0),
  (s, 'Facial', 'Exsomas', 80, null, null, 50, 'Tratamiento de última generación con exosomas que regeneran y rejuvenecen la piel a nivel celular. Ideal para pieles maduras, apagadas o con signos visibles de envejecimiento.', 'img/exsomas.jpg', 1),
  (s, 'Facial', 'Glow Up Super Luminosidad', 80, null, null, 55, 'Protocolo intensivo de luminosidad que combina activos despigmentantes y vitaminas. Tu piel recupera el brillo natural y un tono uniforme, como recién iluminada desde dentro.', 'img/glow-up.jpg', 2),
  (s, 'Facial', 'Cóctel de Vitaminas', 65, null, null, 45, 'Infusión de vitaminas A, C y E directamente en la piel. Nutre en profundidad, combate los radicales libres y devuelve elasticidad y vitalidad al rostro.', 'images/tratamientos/serum.webp', 3),
  (s, 'Facial', 'Retinal', 70, null, null, 45, 'Tratamiento con retinal de alta potencia que acelera la renovación celular. Reduce líneas finas, unifica el tono y mejora la textura para una piel visiblemente más joven.', 'img/retinal.jpg', 4),
  (s, 'Facial', 'Radiofrecuencia Facial', 25, null, null, 30, 'Ondas de radiofrecuencia que calientan las capas profundas de la piel, estimulando el colágeno. Efecto tensor inmediato y progresivo, sin dolor ni tiempo de recuperación.', 'img/radiofrecuencia-facial.jpg', 5),
  (s, 'Facial', 'Higiene Facial + IPL', 40, null, 'Bono 5 ses. · 150€', 50, 'Limpieza profunda profesional combinada con luz pulsada intensa (IPL). Elimina impurezas, cierra poros, reduce manchas y unifica el tono. La base perfecta para cualquier tratamiento.', 'img/higiene-ipl.jpg', 6),
  (s, 'Facial', 'Hidrafacial', 35, null, null, 40, 'Hidratación profunda en tres pasos: limpieza, exfoliación y nutrición con sérum personalizado. Tu piel queda suave, hidratada y con un glow natural que se nota al instante.', 'img/hidrafacial.jpg', 7),
  (s, 'Corporal', 'Cavitación + Maderoterapia', 38, null, 'Bono 10 ses. · 230€', 60, 'Combinación estrella para moldear tu silueta. La cavitación rompe las células de grasa localizada con ultrasonidos, mientras la maderoterapia redefine contornos y activa la circulación.', 'images/tratamientos/maderoterapia.webp', 8),
  (s, 'Corporal', 'Radiofrecuencia + Maderoterapia', 38, null, 'Bono 10 ses. · 230€', 60, 'Dúo reafirmante que combate la flacidez y la celulitis. La radiofrecuencia tensa la piel desde dentro, y la maderoterapia esculpe y drena para unos resultados visibles y duraderos.', 'img/rf-madero.jpg', 9),
  (s, 'Corporal', 'Radiofrecuencia Corporal', 25, null, 'Bono 5 ses. · 70€', 35, 'Radiofrecuencia aplicada en zonas corporales como abdomen, muslos o brazos. Reafirma la piel, reduce celulitis y mejora la textura de forma progresiva y sin molestias.', 'img/rf-corporal.jpg', 10),
  (s, 'Corporal', 'Presoterapia', 15, null, 'Bono 5 ses. · 70€', 30, 'Drenaje linfático mecánico mediante presión controlada. Reduce retención de líquidos, alivia piernas cansadas, mejora la circulación y ayuda a eliminar toxinas. Ideal post-entrenamiento.', 'images/tratamientos/presoterapia.webp', 11),
  (s, 'Corporal', 'Body Sculp Vibratorio', 45, null, 'Bono 10 ses. · 300€', 50, 'Tecnología vibratoria de alta frecuencia que actúa sobre la grasa localizada y la celulitis. Tonifica, redefine la figura y potencia los resultados de otros tratamientos corporales.', 'images/tratamientos/corporal.webp', 12),
  (s, 'Láser', 'Cuerpo Completo (Ellas)', 69, null, '1ª sesión · 39€', 90, 'Depilación láser de diodo en todo el cuerpo: piernas, axilas, ingles, brazos y más. Tecnología segura y eficaz para todo tipo de piel, con resultados permanentes desde las primeras sesiones.', 'img/laser-cuerpo-ellas.jpg', 13),
  (s, 'Láser', 'Cuerpo Completo (Ellos)', 89, null, '1ª sesión · 59€', 120, 'Depilación láser integral adaptada a la piel y el vello masculino. Incluye pecho, espalda, hombros, abdomen y más. Sesiones diseñadas para un resultado limpio y definitivo.', 'img/laser-cuerpo-ellos.jpg', 14),
  (s, 'Láser', 'Axilas + Ingles', 25, null, null, 20, 'Las dos zonas más demandadas en un solo pack. Sesión rápida y cómoda para mantener estas zonas libres de vello de forma permanente. Ideal para empezar con el láser.', 'img/laser-axilas-ingles.jpg', 15),
  (s, 'Láser', 'Facial Láser', 9, '9€ / 14€', null, 10, 'Depilación láser de precisión en zonas faciales: labio, patillas, mentón o entrecejo. Rápida, prácticamente indolora y con resultados que se notan desde la primera sesión.', 'images/tratamientos/laser-facial.webp', 16),
  (s, 'Láser', 'Labio', 6, null, null, 5, 'Sesión express de depilación láser en el labio superior. El tratamiento más rápido y económico para olvidarte del vello facial. Sin cera, sin irritaciones.', 'img/laser-labio.jpg', 17),
  (s, 'Láser', 'Piernas Completas', 29, null, null, 45, 'Depilación láser de piernas completas, desde el tobillo hasta la ingle. Piel suave y libre de vello todo el año, sin las molestias de la cera o la cuchilla.', 'img/laser-piernas.jpg', 18),
  (s, 'Láser', 'Piernas + Axilas', 39, null, null, 55, 'Combo muy popular que cubre piernas completas y axilas en una sola cita. Ahorra tiempo y dinero con este pack pensado para un resultado integral.', 'images/tratamientos/laser-piernas.webp', 19),
  (s, 'Láser', 'Pubis', 19, null, null, 15, 'Depilación láser de la zona púbica con tecnología de última generación. Sesión discreta, rápida y cómoda, realizada con total profesionalidad y privacidad.', 'img/laser-pubis.jpg', 20),
  (s, 'Láser', 'Pecho / Espalda (Ellos)', 29, null, null, 40, 'Depilación láser masculina para pecho o espalda. Elimina el vello grueso de forma definitiva con sesiones adaptadas a la densidad y el grosor del vello masculino.', 'img/laser-pecho-espalda.jpg', 21);
end $$;

-- Comprobación: debe salir la estética con su dueña (owner_id no vacío) y 22 tratamientos
select s.slug, s.nombre, s.owner_id is not null as tiene_duena, count(t.*) as tratamientos
from public.salones s left join public.tratamientos t on t.salon_id = s.id
where s.slug = 'prueba' group by s.id;
