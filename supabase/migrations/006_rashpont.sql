-- Rash Pont (Fuengirola): dos negocios en el mismo local, cada uno con su agenda, su WhatsApp y su panel.
-- Generado desde src/app/rashpont/_datos/catalogo.ts. Se puede volver a ejecutar: actualiza los datos y
-- vuelve a crear la lista de tratamientos (las citas no se tocan).
-- Se ejecuta en el SQL Editor de Supabase después de 001…005.

-- ── Rash Pont · Estética (Raquel) ──
insert into public.salones (slug, nombre, ciudad, whatsapp, instagram, horario, confirmar_auto, intervalo_min)
values ('rashpont-estetica', 'Rash Pont · Estética', 'Fuengirola', '34643044577', 'rashpont', '{"0":null,"1":[{"s":10,"e":21}],"2":[{"s":10,"e":21}],"3":[{"s":10,"e":21}],"4":[{"s":10,"e":21}],"5":[{"s":10,"e":21}],"6":[{"s":10,"e":21}]}', true, 30)
on conflict (slug) do update set nombre = excluded.nombre, whatsapp = excluded.whatsapp, instagram = excluded.instagram, horario = excluded.horario;

delete from public.tratamientos where salon_id = (select id from public.salones where slug = 'rashpont-estetica');
insert into public.tratamientos (salon_id, categoria, nombre, precio, precio_texto, duracion_min, descripcion, imagen, orden)
select s.id, t.categoria, t.nombre, t.precio, t.precio_texto, t.duracion_min, t.descripcion, t.imagen, t.orden
from public.salones s, (values
  ('Rostro y antiedad', 'Ritual de higiene antiedad y firmeza premium · Esencial · punta de diamante y electroporación', 129.95, null, 60, 'Su facial estrella: limpieza profunda, peeling, ácido hialurónico, mascarilla de alta gama y luz LED. Cada protocolo se adapta a tu piel.', '/images/rashpont/facial.webp', 0),
  ('Rostro y antiedad', 'Ritual de higiene antiedad y firmeza premium · Premium · Expert Jet, vitaminas y exosomas', 169.95, null, 90, 'Su facial estrella: limpieza profunda, peeling, ácido hialurónico, mascarilla de alta gama y luz LED. Cada protocolo se adapta a tu piel.', '/images/rashpont/facial.webp', 1),
  ('Rostro y antiedad', 'Ritual regenerativo Detox & Glow · Cura renovadora flash', 89.95, 'desde 89,95 €', 60, 'Limpieza facial con efecto «buena cara» inmediato. Ideal si tienes poco tiempo o un evento: poros limpios y piel luminosa.', '/images/rashpont/facial.webp', 2),
  ('Rostro y antiedad', 'Ritual regenerativo Detox & Glow · Higiene tecnológica regenerativa', 149.95, 'desde 149,95 €', 90, 'Limpieza facial con efecto «buena cara» inmediato. Ideal si tienes poco tiempo o un evento: poros limpios y piel luminosa.', '/images/rashpont/facial.webp', 3),
  ('Rostro y antiedad', 'Ritual bioregeneración celular · Intensiva · sin agujas', 149.95, 'desde 149,95 €', 60, 'Exosomas y PDRN para calmar, reparar y dar luz a pieles sensibles, con rosácea o con los primeros signos de la edad.', '/images/rashpont/serum.webp', 4),
  ('Rostro y antiedad', 'Ritual bioregeneración celular · Supreme · con microneedling', 199.95, null, 90, 'Exosomas y PDRN para calmar, reparar y dar luz a pieles sensibles, con rosácea o con los primeros signos de la edad.', '/images/rashpont/serum.webp', 5),
  ('Rostro y antiedad', 'Tratamiento regenerativo celular avanzado · Rostro global con exosomas + periocular', 395.95, 'desde 395,95 €', 60, 'Su terapia de alta gama: rostro completo con exosomas y PDRN, más protocolo para bolsas, ojeras y patas de gallo.', '/images/rashpont/serum.webp', 6),
  ('Rostro y antiedad', 'Tratamiento regenerativo celular avanzado · Exosomas + PDRN + periocular despigmentante', 499.95, null, 90, 'Su terapia de alta gama: rostro completo con exosomas y PDRN, más protocolo para bolsas, ojeras y patas de gallo.', '/images/rashpont/serum.webp', 7),
  ('Rostro y antiedad', 'Microneedling renovación celular + labios · Glow & Hidra', 149.95, 'desde 149,95 €', 60, 'Dermapen con ácido hialurónico y vitaminas para estimular colágeno. Mejora arrugas finas, marcas de acné, poros y manchas.', '/images/rashpont/dermapen.webp', 8),
  ('Rostro y antiedad', 'Microneedling renovación celular + labios · Exosomas Supreme + labios', 299.95, null, 90, 'Dermapen con ácido hialurónico y vitaminas para estimular colágeno. Mejora arrugas finas, marcas de acné, poros y manchas.', '/images/rashpont/dermapen.webp', 9),
  ('Rostro y antiedad', 'Pack Regenera-Lift antiedad premium Phoenix · Mesoterapia virtual con cóctel de vitaminas', 119.95, 'desde 119,95 €', 60, 'Radiofrecuencia Phoenix con cóctel de vitaminas o con exosomas y dermapen. Reafirma, ilumina y redefine el óvalo.', '/images/rashpont/radiofrecuencia.webp', 10),
  ('Rostro y antiedad', 'Pack Regenera-Lift antiedad premium Phoenix · Diatermia + dermapen con exosomas y PDRN', 349.95, null, 90, 'Radiofrecuencia Phoenix con cóctel de vitaminas o con exosomas y dermapen. Reafirma, ilumina y redefine el óvalo.', '/images/rashpont/radiofrecuencia.webp', 11),
  ('Rostro y antiedad', 'Ritual lifting premium antiedad con Bellaction', 149.95, null, 60, 'Efecto «push up» facial: microdermoabrasión, masaje fisioactivo, crioterapia y LED para tensar y suavizar arrugas.', '/images/rashpont/radiofrecuencia.webp', 12),
  ('Rostro y antiedad', 'Pack remodela óvalo facial y papada', 119.95, 'desde 119,95 €', 60, 'Bellaction y radiofrecuencia Phoenix para reducir el doble mentón y redefinir la mandíbula, sin cirugía.', '/images/rashpont/radiofrecuencia.webp', 13),
  ('Rostro y antiedad', 'Pack Flash «Lift Glow» · Zona localizada', 69.95, 'desde 69,95 €', 45, '¿Tienes un evento? Efecto tensor inmediato y luminosidad extrema en una sesión, con radiofrecuencia y su cóctel de activos.', '/images/rashpont/serum.webp', 14),
  ('Rostro y antiedad', 'Pack Flash «Lift Glow» · Facial completo', 119.95, 'desde 119,95 €', 75, '¿Tienes un evento? Efecto tensor inmediato y luminosidad extrema en una sesión, con radiofrecuencia y su cóctel de activos.', '/images/rashpont/serum.webp', 15),
  ('Rostro y antiedad', 'Redensificación de labios Lip & Gloss', 79.95, null, 45, 'Micro-infusión de ácido hialurónico y péptidos con dermapen: labios hidratados, más jugosos y con color natural, sin rellenos.', '/images/rashpont/dermapen.webp', 16),
  ('Rostro y antiedad', 'Drenaje linfático facial · Express', 69.95, 'desde 69,95 €', 30, 'Masaje manual suave que deshincha la cara, elimina toxinas y da frescura al momento. Perfecto como mantenimiento.', '/images/rashpont/facial.webp', 17),
  ('Rostro y antiedad', 'Drenaje linfático facial · Detox & Esculpe', 99.95, null, 60, 'Masaje manual suave que deshincha la cara, elimina toxinas y da frescura al momento. Perfecto como mantenimiento.', '/images/rashpont/facial.webp', 18),
  ('Rostro y antiedad', 'Express Glow Dúo · piel y mirada', 59.95, 'desde 59,95 €', 60, 'Limpieza hidratante con efecto luminoso y diseño y color de cejas en la misma cita.', '/images/rashpont/facial.webp', 19),
  ('Rostro y antiedad', 'Ritual regenerativo 360º · Exprés de alto impacto', 79.95, 'desde 79,95 €', 65, 'Facial y corporal en una cita: limpieza ultrasónica, drenaje, presoterapia, activos, LED y crioterapia.', '/images/rashpont/presoterapia.webp', 20),
  ('Rostro y antiedad', 'Ritual regenerativo 360º · Ritual 360º completo', 149.95, 'desde 149,95 €', 90, 'Facial y corporal en una cita: limpieza ultrasónica, drenaje, presoterapia, activos, LED y crioterapia.', '/images/rashpont/presoterapia.webp', 21),
  ('Manchas, acné y espalda', 'Aclaramiento corporal premium · Axilas, codos o rodillas', 89.95, null, 60, 'Unifica el tono de axilas, ingles, codos, rodillas y zona íntima con peeling químico y activos de Germaine de Capuccini.', '/images/rashpont/serum.webp', 22),
  ('Manchas, acné y espalda', 'Aclaramiento corporal premium · Ingles y entrepierna', 129.95, null, 60, 'Unifica el tono de axilas, ingles, codos, rodillas y zona íntima con peeling químico y activos de Germaine de Capuccini.', '/images/rashpont/serum.webp', 23),
  ('Manchas, acné y espalda', 'Aclaramiento corporal premium · Íntimo premium', 149.95, null, 60, 'Unifica el tono de axilas, ingles, codos, rodillas y zona íntima con peeling químico y activos de Germaine de Capuccini.', '/images/rashpont/serum.webp', 24),
  ('Manchas, acné y espalda', 'Piel grasa y acné premium', 179.95, null, 90, 'Protocolo avanzado y regenerativo para acné activo, brillos y marcas. Desinfecta, regula el sebo y calma la piel.', '/images/rashpont/facial.webp', 25),
  ('Manchas, acné y espalda', 'Pack Stop «Sebo & Glow»', 119.95, null, 60, 'Mantenimiento para pieles muy grasas: limpieza, peeling, extracción, alta frecuencia y LED azul.', '/images/rashpont/facial.webp', 26),
  ('Manchas, acné y espalda', 'Tratamiento regenerativo de espalda · Higiene express', 59.95, null, 30, 'Para ellas y ellos: elimina puntos negros, granos y marcas de la espalda con exfoliación, extracción y alta frecuencia.', '/images/rashpont/corporal.webp', 27),
  ('Manchas, acné y espalda', 'Tratamiento regenerativo de espalda · Salud dermatológica y regenerativa', 119.95, null, 60, 'Para ellas y ellos: elimina puntos negros, granos y marcas de la espalda con exfoliación, extracción y alta frecuencia.', '/images/rashpont/corporal.webp', 28),
  ('Cuerpo y figura', 'Vientre plano «modo turbo» · Express · maderoterapia y esculpido', 119.95, 'desde 119,95 €', 60, 'Maderoterapia, cavitación, Bellaction y presoterapia para reducir abdomen y grasa localizada.', '/images/rashpont/maderoterapia.webp', 29),
  ('Cuerpo y figura', 'Vientre plano «modo turbo» · Full Turbo · cavitación + Bellaction + presoterapia', 149.95, null, 120, 'Maderoterapia, cavitación, Bellaction y presoterapia para reducir abdomen y grasa localizada.', '/images/rashpont/maderoterapia.webp', 30),
  ('Cuerpo y figura', 'Bye Bye michelines rebeldes · Diagnóstico + sesión express', 59.95, null, 45, 'Remodelación abdominal premium, una lipo-reducción sin cirugía. Puedes empezar con un diagnóstico y sesión express.', '/images/rashpont/maderoterapia.webp', 31),
  ('Cuerpo y figura', 'Bye Bye michelines rebeldes · Remodelación abdominal premium', 119.95, null, 60, 'Remodelación abdominal premium, una lipo-reducción sin cirugía. Puedes empezar con un diagnóstico y sesión express.', '/images/rashpont/maderoterapia.webp', 32),
  ('Cuerpo y figura', 'Experiencia Diosa Cleopatra · Una zona', 119.95, 'desde 119,95 €', 60, 'Envoltura hipotérmica y drenante para piernas, glúteos, abdomen o brazos. Deshincha y reafirma.', '/images/rashpont/corporal.webp', 33),
  ('Cuerpo y figura', 'Experiencia Diosa Cleopatra · Integral de pies a cabeza', 149.95, null, 90, 'Envoltura hipotérmica y drenante para piernas, glúteos, abdomen o brazos. Deshincha y reafirma.', '/images/rashpont/corporal.webp', 34),
  ('Cuerpo y figura', 'Mamá Fit · reafirma y tonifica · 1 zona', 99.95, 'desde 99,95 €', 30, 'Tratamiento tensor para recuperar tu mejor versión después del embarazo, sin cirugía ni pausas.', '/images/rashpont/corporal.webp', 35),
  ('Cuerpo y figura', 'Mamá Fit · reafirma y tonifica · 2 zonas', 199.95, null, 65, 'Tratamiento tensor para recuperar tu mejor versión después del embarazo, sin cirugía ni pausas.', '/images/rashpont/corporal.webp', 36),
  ('Cuerpo y figura', 'Mamá Fit · reafirma y tonifica · Cuerpo completo', 249.95, null, 100, 'Tratamiento tensor para recuperar tu mejor versión después del embarazo, sin cirugía ni pausas.', '/images/rashpont/corporal.webp', 37),
  ('Cuerpo y figura', 'Bio-reafirmante de senos premium', 119.95, null, 80, 'Radiofrecuencia Phoenix y activos de alta gama para un pecho más firme desde la primera sesión. Incluye cuello y escote.', '/images/rashpont/radiofrecuencia.webp', 38),
  ('Cuerpo y figura', 'Escote efecto juventud 360º · Radiofrecuencia + mesoterapia virtual', 199.95, 'desde 199,95 €', 90, 'Protocolo intensivo para las arrugas y la flacidez del escote, con radiofrecuencia, mesoterapia virtual y LED.', '/images/rashpont/radiofrecuencia.webp', 39),
  ('Cuerpo y figura', 'Escote efecto juventud 360º · Efecto Flash · RF + dermapen + mesoterapia + LED', 299.95, null, 120, 'Protocolo intensivo para las arrugas y la flacidez del escote, con radiofrecuencia, mesoterapia virtual y LED.', '/images/rashpont/radiofrecuencia.webp', 40),
  ('Cuerpo y figura', 'Remodelación y tonificación Bellaction', 79.95, null, 55, 'Masaje fisioactivo profundo no invasivo que remodela, tonifica y mejora la celulitis.', '/images/rashpont/corporal.webp', 41),
  ('Cuerpo y figura', 'Piernas de verano los 365 días · Masaje + cavitación + mesoterapia virtual', 89.95, 'desde 89,95 €', 60, 'Masaje, cavitación y mesoterapia virtual para unas piernas más ligeras, firmes y sin piel de naranja.', '/images/rashpont/piernas.webp', 42),
  ('Cuerpo y figura', 'Piernas de verano los 365 días · Cavitación + Bellaction + radiofrecuencia', 119.95, 'desde 119,95 €', 100, 'Masaje, cavitación y mesoterapia virtual para unas piernas más ligeras, firmes y sin piel de naranja.', '/images/rashpont/piernas.webp', 43),
  ('Cuerpo y figura', 'Piernas de Top Model · Sesión de 30 minutos', 89.95, 'desde 89,95 €', 30, '40.000 contracciones musculares en 60 minutos: tonifica, moldea y combate la celulitis.', '/images/rashpont/piernas.webp', 44),
  ('Cuerpo y figura', 'Piernas de Top Model · Programa completo de 60 minutos', 119.50, null, 60, '40.000 contracciones musculares en 60 minutos: tonifica, moldea y combate la celulitis.', '/images/rashpont/piernas.webp', 45),
  ('Cuerpo y figura', 'Masaje reductor Germaine de Capuccini', 69.95, 'desde 69,95 €', 45, 'Tratamiento Perfect Forms reductor y anticelulítico con cosmética de alta gama.', '/images/rashpont/maderoterapia.webp', 46),
  ('Cuerpo y figura', 'Drenaje linfático corporal · Zona específica', 49.95, 'desde 49,95 €', 30, 'Masaje suave y lento que elimina líquidos y toxinas. Se puede combinar con presoterapia.', '/images/rashpont/presoterapia.webp', 47),
  ('Cuerpo y figura', 'Drenaje linfático corporal · Zona + presoterapia', 79.95, null, 70, 'Masaje suave y lento que elimina líquidos y toxinas. Se puede combinar con presoterapia.', '/images/rashpont/presoterapia.webp', 48),
  ('Cuerpo y figura', 'Drenaje linfático corporal · Cuerpo completo + presoterapia', 89.95, null, 75, 'Masaje suave y lento que elimina líquidos y toxinas. Se puede combinar con presoterapia.', '/images/rashpont/presoterapia.webp', 49),
  ('Cuerpo y figura', 'Presoterapia 3 en 1', 79.95, 'desde 79,95 €', 30, 'Drenaje, luz LED y masaje fisioactivo a la vez, para piernas ligeras y desinflamadas.', '/images/rashpont/presoterapia.webp', 50),
  ('Masajes', 'Masaje terapéutico relajante de cuerpo entero · Con maderoterapia o piedras volcánicas', 89.95, null, 60, 'Descontractura, serena el sistema nervioso y devuelve ligereza al cuerpo. Con maderoterapia o piedras volcánicas.', '/images/rashpont/corporal.webp', 51),
  ('Masajes', 'Masaje terapéutico relajante de cuerpo entero · Relajante de cuerpo entero', 99.95, null, 70, 'Descontractura, serena el sistema nervioso y devuelve ligereza al cuerpo. Con maderoterapia o piedras volcánicas.', '/images/rashpont/corporal.webp', 52),
  ('Masajes', 'Masaje terapéutico relajante de cuerpo entero · Ritual facial y corporal «Total Reset»', 149.95, null, 100, 'Descontractura, serena el sistema nervioso y devuelve ligereza al cuerpo. Con maderoterapia o piedras volcánicas.', '/images/rashpont/corporal.webp', 53),
  ('Masajes', 'Masaje descontracturante S.O.S espalda', 85.95, null, 60, 'Para ellas y ellos: libera la tensión de espalda, cuello y hombros.', '/images/rashpont/corporal.webp', 54),
  ('Masajes', 'Masaje premium cervical y de cráneo', 69.95, null, 55, 'Alivia la tensión del cuello y la cabeza, ideal si pasas muchas horas sentada o con dolor de cabeza.', '/images/rashpont/corporal.webp', 55),
  ('Masajes', 'Masaje deportivo · Opción 1', 69.95, 'desde 69,95 €', 50, 'Recuperación muscular antes o después del entreno, en tres duraciones.', '/images/rashpont/maderoterapia.webp', 56),
  ('Masajes', 'Masaje deportivo · Opción 2', 89.95, 'desde 89,95 €', 65, 'Recuperación muscular antes o después del entreno, en tres duraciones.', '/images/rashpont/maderoterapia.webp', 57),
  ('Masajes', 'Masaje deportivo · Opción 3', 119.95, null, 95, 'Recuperación muscular antes o después del entreno, en tres duraciones.', '/images/rashpont/maderoterapia.webp', 58),
  ('Masajes', 'Masaje sueco profundo', 79.95, null, 60, 'El clásico masaje de amasamiento y fricción para soltar el cuerpo entero.', '/images/rashpont/corporal.webp', 59),
  ('Masajes', 'Masaje Lomi Lomi', 79.95, null, 60, 'Masaje hawaiano con movimientos largos y envolventes, como olas.', '/images/rashpont/corporal.webp', 60),
  ('Masajes', 'Masaje con piedras calientes · Envoltura bio-activa + maderoterapia + piedras', 79.95, 'desde 79,95 €', 60, 'Calor, envoltura bio-activa y maderoterapia. Packs recomendados según lo que necesites.', '/images/rashpont/maderoterapia.webp', 61),
  ('Masajes', 'Masaje con piedras calientes · Pack regenerador celular y térmico', 119.95, null, 90, 'Calor, envoltura bio-activa y maderoterapia. Packs recomendados según lo que necesites.', '/images/rashpont/maderoterapia.webp', 62),
  ('Masajes', 'Masaje con pistola de percusión «Fascia Gun»', 69.95, null, 45, 'Terapia percusiva profunda para soltar fascias y contracturas rebeldes.', '/images/rashpont/maderoterapia.webp', 63),
  ('Masajes', 'Reflexología', 49.95, null, 45, 'Masaje terapéutico en las zonas reflejas de pies, manos, cara y orejas.', '/images/rashpont/corporal.webp', 64),
  ('Spa y bienestar', 'Circuito spa y masaje relax con cava y bombones', 159.95, null, 90, 'Una experiencia para desconectar del todo: circuito spa, masaje relajante, cava y bombones.', '/images/rashpont/corporal.webp', 65),
  ('Spa y bienestar', 'Programa S.O.S antiestrés', 159.95, 'desde 159,95 €', 120, 'Reset físico y emocional: una intervención pensada para aliviar el estrés agudo.', '/images/rashpont/corporal.webp', 66),
  ('Spa y bienestar', 'Circuito reset hormonal y mitocondrial', 149.95, 'desde 149,95 €', 90, 'Programa de biohacking para la menopausia y la longevidad.', '/images/rashpont/serum.webp', 67),
  ('Spa y bienestar', 'Spa capilar y salud del cuero cabelludo · Spa capilar Detox & Balance', 149.95, null, 90, 'Salud del cuero cabelludo y tratamiento de la caída: diagnóstico capilar, detox, masaje craneal y, en la versión avanzada, microneedling con factores de crecimiento.', '/images/rashpont/serum.webp', 68),
  ('Spa y bienestar', 'Spa capilar y salud del cuero cabelludo · Ritual regenerativo IR Médical con microneedling capilar', 349.95, null, 135, 'Salud del cuero cabelludo y tratamiento de la caída: diagnóstico capilar, detox, masaje craneal y, en la versión avanzada, microneedling con factores de crecimiento.', '/images/rashpont/serum.webp', 69),
  ('Spa y bienestar', 'Programa regenerativo mio-estético', 119.95, null, 60, 'Protocolo que trabaja músculo y piel a la vez para tonificar y regenerar.', '/images/rashpont/corporal.webp', 70),
  ('Spa y bienestar', 'Terapias relajantes con elementos naturales', 79.95, null, 70, 'Aromaterapia con aceites esenciales puros para relajar cuerpo y mente.', '/images/rashpont/serum.webp', 71),
  ('Spa y bienestar', 'Terapia de luz infrarroja', 35.00, 'desde 35,00 €', 30, 'Calor profundo que relaja, mejora la circulación y ayuda a la recuperación.', '/images/rashpont/serum.webp', 72),
  ('Depilación', 'Piernas enteras', 34.95, null, 35, 'Depilación con cera de las piernas completas, para ellas y ellos.', '/images/rashpont/piernas.webp', 73),
  ('Depilación', 'Íntima: ingles, genitales y glúteos', 49.95, null, 60, 'Depilación con cera de la zona íntima completa.', '/images/rashpont/piernas.webp', 74),
  ('Depilación', 'Axilas y brazos', 39.95, null, 30, 'Depilación con cera de axilas y brazos.', '/images/rashpont/piernas.webp', 75),
  ('Depilación', 'Rostro', 29.95, null, 30, 'Cejas, entrecejo, labio y mejillas con cera.', '/images/rashpont/facial.webp', 76),
  ('Depilación', 'Pecho y espalda (caballero)', 39.95, null, 40, 'Depilación con cera de pecho y espalda para hombre.', '/images/rashpont/corporal.webp', 77),
  ('Depilación', 'Abdomen y línea alba', 29.95, null, 30, 'Para controlar el vello central del abdomen.', '/images/rashpont/corporal.webp', 78)
) as t(categoria, nombre, precio, precio_texto, duracion_min, descripcion, imagen, orden)
where s.slug = 'rashpont-estetica';

-- ── Rash Pont · Barbería (Andrés) ──
insert into public.salones (slug, nombre, ciudad, whatsapp, instagram, horario, confirmar_auto, intervalo_min)
values ('rashpont-barberia', 'Rash Pont · Barbería', 'Fuengirola', '34600220380', 'rashpont', '{"0":null,"1":[{"s":10,"e":21}],"2":[{"s":10,"e":21}],"3":[{"s":10,"e":21}],"4":[{"s":10,"e":21}],"5":[{"s":10,"e":21}],"6":[{"s":10,"e":21}]}', true, 30)
on conflict (slug) do update set nombre = excluded.nombre, whatsapp = excluded.whatsapp, instagram = excluded.instagram, horario = excluded.horario;

delete from public.tratamientos where salon_id = (select id from public.salones where slug = 'rashpont-barberia');
insert into public.tratamientos (salon_id, categoria, nombre, precio, precio_texto, duracion_min, descripcion, imagen, orden)
select s.id, t.categoria, t.nombre, t.precio, t.precio_texto, t.duracion_min, t.descripcion, t.imagen, t.orden
from public.salones s, (values
  ('Cortes', 'Corte caballero', 14.95, null, 45, 'Barbería clásica y moderna, adaptada a la forma de tu cara para un acabado preciso.', null, 0),
  ('Cortes', 'Corte infantil', 9.95, null, 45, 'Paciencia y estilo para los más pequeños, con cortes que respetan cómo crece su pelo.', null, 1),
  ('Cortes', 'Corte jubilado', 9.95, null, 30, 'Tijera y peine con suavidad y elegancia para cabellos maduros.', null, 2),
  ('Cortes', 'Corte de puntas mujer + lavado + aceite', 29.95, null, 45, 'Sanea tu melena: corte de puntas, lavado y aceite nutritivo.', null, 3),
  ('Rituales', 'Ritual Rash Pont', 39.95, null, 60, 'Corte, diseño de barba y alta frecuencia en una sola cita. El completo de la casa.', null, 4),
  ('Rituales', 'Ritual Germaine de Capuccini', 45.95, null, 90, 'Corte, barba y mascarilla facial de alta gama. Sales nuevo.', null, 5),
  ('Barba', 'Ritual de barba spa + masaje facial', 17.95, null, 35, 'Toalla caliente, masaje facial, exfoliación y diseño de barba. El favorito de sus clientes.', null, 6),
  ('Barba', 'Recorte de barba express', 8.95, null, 15, 'Delineado rápido con navaja para mantener tu estilo entre visitas.', null, 7),
  ('Barba', 'Tinte de canas de barba', 7.95, null, 15, 'Cubre canas y rellena huecos con un acabado natural.', null, 8),
  ('Facial', 'Limpieza facial + Pink Mask', 20.95, null, 30, 'Limpieza que elimina puntos negros y mascarilla Elevel3 Pink.', null, 9),
  ('Facial', 'Limpieza facial + Black Mask', 20.95, null, 30, 'Renovación total con la mascarilla negra peel-off Elevel3.', null, 10),
  ('Color', 'Cubrir canas del cabello', 29.95, null, 45, 'Aspecto más joven con un cubrimiento de canas natural.', null, 11),
  ('Color', 'Color global', 59.95, null, 150, 'Un color completo e impecable, desde tonos naturales hasta los más atrevidos.', null, 12),
  ('Color', 'Mechas hombre', 49.95, null, 120, 'Rayitos y mechas para dar luz y movimiento a tu pelo.', null, 13),
  ('Color', 'Ondulación permanente', 70.00, null, 60, 'Ondas duraderas para cabello medio y largo, natural o tratado.', null, 14),
  ('Detalles', 'Coloración y diseño de cejas', 15.95, null, 15, 'Define y da intensidad a la mirada con color semipermanente.', null, 15),
  ('Detalles', 'Perfilado de cejas con cuchilla', 4.95, null, 10, 'Un acabado limpio y profesional para definir la mirada.', null, 16),
  ('Detalles', 'Depilación nasal con cera', 4.95, null, 10, 'Adiós al vello visible de la nariz, de forma rápida e higiénica.', null, 17),
  ('Detalles', 'Depilación de oídos', 4.95, null, 10, 'Eliminación suave del vello del oído con cera de baja fusión.', null, 18)
) as t(categoria, nombre, precio, precio_texto, duracion_min, descripcion, imagen, orden)
where s.slug = 'rashpont-barberia';

-- ── Cuentas del panel ──
-- 1) En Supabase: Authentication → Add user, con el correo y la contraseña de Raquel y de Andrés.
-- 2) Cambia los correos y ejecuta estas dos líneas:
-- update public.salones set owner_id = (select id from auth.users where email = 'CORREO_DE_RAQUEL') where slug = 'rashpont-estetica';
-- update public.salones set owner_id = (select id from auth.users where email = 'CORREO_DE_ANDRES') where slug = 'rashpont-barberia';
