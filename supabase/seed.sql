-- =============================================================================
-- Seed Data for GREENLABS.Studio (Development)
-- Note: Does NOT seed profiles or auth — those come from signups
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Echeveria', 'echeveria',
   'Rosetas compactas y coloridas, ideales para arreglos decorativos.', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Kalanchoe', 'kalanchoe',
   'Suculentas resistentes con texturas y formas unicas.', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Crassula', 'crassula',
   'Plantas estructurales con hojas gruesas y geometricas.', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Sedum', 'sedum',
   'Suculentas rastreras perfectas para jardines y techos verdes.', 4);

-- -----------------------------------------------------------------------------
-- Products (prices in Dominican Pesos RD$)
-- -----------------------------------------------------------------------------
INSERT INTO products (id, name, slug, description, price, category_id, light_needs, water_needs, is_featured, stock, care_guide) VALUES
  -- Echeveria
  ('b1000000-0000-0000-0000-000000000001',
   'Echeveria ''Hercules''', 'echeveria-hercules',
   'Hibrido robusto con rosetas grandes de hojas gruesas color verde azulado con bordes rosados.',
   550.00, 'a1000000-0000-0000-0000-000000000001', 'high', 'low', true, 12,
   'Luz directa brillante. Regar solo cuando el sustrato este completamente seco. Proteger de heladas.'),

  ('b1000000-0000-0000-0000-000000000002',
   'Echeveria ''Perle von Nurnberg''', 'echeveria-perle-von-nurnberg',
   'Roseta elegante con hojas en tonos purpura y rosa pastel, cubierta de pruina plateada.',
   650.00, 'a1000000-0000-0000-0000-000000000001', 'high', 'low', true, 8,
   'Sol directo para mantener colores vibrantes. Riego escaso, cada 10-14 dias.'),

  -- Kalanchoe
  ('b1000000-0000-0000-0000-000000000003',
   'Kalanchoe orgyalis', 'kalanchoe-orgyalis',
   'Conocida como "Oreja de cobre" por sus hojas ovaladas con textura aterciopelada color bronce.',
   450.00, 'a1000000-0000-0000-0000-000000000002', 'high', 'low', false, 15,
   'Luz brillante directa. Riego moderado, dejar secar entre riegos. Suelo bien drenado.'),

  ('b1000000-0000-0000-0000-000000000004',
   'Kalanchoe tomentosa', 'kalanchoe-tomentosa',
   'La "Planta panda" con hojas cubiertas de pelusa blanca y puntas marron chocolate.',
   400.00, 'a1000000-0000-0000-0000-000000000002', 'medium', 'low', false, 20,
   'Luz indirecta brillante. Regar cuando la tierra este seca al tacto. No mojar las hojas.'),

  -- Crassula
  ('b1000000-0000-0000-0000-000000000005',
   'Crassula ovata', 'crassula-ovata',
   'El clasico "Arbol de jade". Hojas ovaladas y brillantes, tronco lenoso con los anos.',
   500.00, 'a1000000-0000-0000-0000-000000000003', 'medium', 'low', true, 10,
   'Luz brillante con algo de sol directo. Riego moderado, reducir en invierno.'),

  ('b1000000-0000-0000-0000-000000000006',
   'Crassula perforata', 'crassula-perforata',
   'Cadena de hojas triangulares apiladas. Crece en forma de torre con bordes rojizos al sol.',
   350.00, 'a1000000-0000-0000-0000-000000000003', 'high', 'low', false, 18,
   'Sol directo para mejores colores. Riego escaso, sustrato de cactus bien drenado.'),

  -- Sedum
  ('b1000000-0000-0000-0000-000000000007',
   'Sedum morganianum', 'sedum-morganianum',
   'La "Cola de burro" con tallos colgantes cubiertos de hojas azul-verdosas. Perfecta para macetas colgantes.',
   300.00, 'a1000000-0000-0000-0000-000000000004', 'medium', 'low', false, 25,
   'Luz brillante indirecta. Regar con moderacion. Manipular con cuidado, las hojas se desprenden facilmente.'),

  ('b1000000-0000-0000-0000-000000000008',
   'Sedum rubrotinctum', 'sedum-rubrotinctum',
   'Conocida como "Dedos de gelatina". Hojas redondeadas que se tornan rojas con el sol intenso.',
   380.00, 'a1000000-0000-0000-0000-000000000004', 'high', 'low', true, 14,
   'Sol directo para lograr coloracion roja. Riego minimo, muy resistente a la sequia.');

-- -----------------------------------------------------------------------------
-- Services
-- -----------------------------------------------------------------------------
INSERT INTO services (id, name, slug, description, price_range, is_active, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'Souvenirs para Eventos', 'souvenirs-para-eventos',
   'Suculentas personalizadas para bodas, cumpleanos, baby showers y eventos corporativos. Cada pieza se prepara con amor y atencion al detalle.',
   'RD$150 - RD$500 por unidad',
   true, 1),

  ('c1000000-0000-0000-0000-000000000002',
   'Asesoria de Cuidado', 'asesoria-de-cuidado',
   'Consulta personalizada sobre el cuidado de tus suculentas. Te ayudamos a identificar problemas, elegir el sustrato correcto y crear rutinas de riego.',
   'RD$500 - RD$1,500 por sesion',
   true, 2);

-- -----------------------------------------------------------------------------
-- Souvenir Packages
-- -----------------------------------------------------------------------------
INSERT INTO souvenir_packages (id, name, slug, description, price, items_included, min_quantity, is_active, sort_order) VALUES
  ('d1000000-0000-0000-0000-000000000001',
   'Paquete Boda', 'paquete-boda',
   'Souvenirs elegantes para tu dia especial. Mini suculentas en macetas de ceramica blanca con etiqueta personalizada.',
   250.00,
   ARRAY['Mini suculenta seleccionada', 'Maceta de ceramica blanca', 'Etiqueta personalizada con nombres y fecha', 'Bolsa de regalo'],
   20, true, 1),

  ('d1000000-0000-0000-0000-000000000002',
   'Paquete Cumpleanos', 'paquete-cumpleanos',
   'Regalos divertidos y coloridos para celebrar. Suculentas en macetas pintadas a mano con tarjeta de agradecimiento.',
   200.00,
   ARRAY['Mini suculenta', 'Maceta pintada a mano', 'Tarjeta de agradecimiento', 'Lazo decorativo'],
   10, true, 2),

  ('d1000000-0000-0000-0000-000000000003',
   'Paquete Corporativo', 'paquete-corporativo',
   'Detalles profesionales para eventos de empresa. Suculentas en macetas con logo grabado y empaque ejecutivo.',
   350.00,
   ARRAY['Suculenta premium', 'Maceta con logo grabado', 'Tarjeta corporativa', 'Empaque ejecutivo', 'Guia de cuidado'],
   15, true, 3);

-- -----------------------------------------------------------------------------
-- Testimonials
-- -----------------------------------------------------------------------------
INSERT INTO testimonials (id, name, text, rating, is_featured, sort_order) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'Maria Fernanda R.',
   'Los souvenirs para mi boda quedaron hermosos. Cada invitado se llevo una suculenta y todos estaban encantados. Oscar fue muy atento con cada detalle.',
   5, true, 1),

  ('e1000000-0000-0000-0000-000000000002',
   'Carlos A. Martinez',
   'Compre varias Echeverias y llegaron en perfecto estado. La asesoria de cuidado me ayudo mucho porque soy principiante. Muy recomendado.',
   5, true, 2),

  ('e1000000-0000-0000-0000-000000000003',
   'Laura P. Santos',
   'Pedi el paquete corporativo para un evento de la empresa y quedo espectacular. El equipo de GREENLABS fue super profesional y puntual.',
   4, true, 3);

-- -----------------------------------------------------------------------------
-- CMS Content
-- -----------------------------------------------------------------------------
INSERT INTO cms_content (id, page, section, content) VALUES
  ('f1000000-0000-0000-0000-000000000001',
   'landing', 'hero',
   '{
     "heading": "Naturaleza viva en cada detalle",
     "subheading": "Suculentas cultivadas con amor en Republica Dominicana",
     "cta_text": "Ver Catalogo",
     "cta_link": "/catalogo",
     "background_image": ""
   }'::jsonb),

  ('f1000000-0000-0000-0000-000000000002',
   'landing', 'about',
   '{
     "heading": "Sobre GREENLABS",
     "body": "Somos un estudio dedicado al cultivo y diseno con suculentas. Cada planta es seleccionada y cuidada con atencion para que llegue perfecta a tu hogar o evento. Creemos que un toque de verde transforma cualquier espacio.",
     "image": "",
     "cta_text": "Conoce nuestros servicios",
     "cta_link": "/servicios"
   }'::jsonb);

-- -----------------------------------------------------------------------------
-- Proposals (featured collections)
-- -----------------------------------------------------------------------------
INSERT INTO proposals (id, title, slug, description, product_ids, is_active, sort_order) VALUES
  ('g1000000-0000-0000-0000-000000000001',
   'Coleccion Favoritas', 'coleccion-favoritas',
   'Nuestra seleccion de las suculentas mas populares y queridas por nuestros clientes.',
   ARRAY[
     'b1000000-0000-0000-0000-000000000001',
     'b1000000-0000-0000-0000-000000000002',
     'b1000000-0000-0000-0000-000000000005',
     'b1000000-0000-0000-0000-000000000008'
   ]::uuid[],
   true, 1);
