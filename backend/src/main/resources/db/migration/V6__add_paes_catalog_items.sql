-- V6__add_paes_catalog_items.sql
-- Adiciona pães solicitados ao catalogo na categoria "Pães"

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão Francês',
       'Delicie-se com a perfeicao crocante do nosso pao frances, onde a tradicao encontra a qualidade em cada mordida. Aproximadamente 50 gramas. Serve 1 pessoa.',
       1.70,
  'assets/products/pao-frances.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       220
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Francês');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão Francês Amanteigado',
       'Irresistivel pao amanteigado! Combinando a maciez do pao fresco com a riqueza do sabor da manteiga. Aproximadamente 50 gramas. Serve 1 pessoa.',
       1.95,
  'assets/products/pao-frances-amanteigado.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       180
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Francês Amanteigado');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pacote Pão Zero Lactose',
       'Pao zero lactose, qualidade e sabor que vai encantar seu paladar. Aproximadamente 33 gramas cada unidade. Pacote com 6 unidades. Sem lactose.',
       9.99,
  'assets/products/pacote-pao-zero-lactose.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       80
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pacote Pão Zero Lactose');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão Hot-Dog',
       'Delicioso e irresistivel, nosso pao hot dog e a combinacao perfeita de maciez e sabor, garantindo uma experiencia de qualidade. Aproximadamente 45 gramas. Serve 1 pessoa.',
       1.80,
  'assets/products/pao-hot-dog.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       150
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Hot-Dog');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão de Arroz P (40 gramas)',
       'Peca e experimente nosso delicioso pao de arroz. Serve 1 pessoa.',
       2.10,
  'assets/products/pao-de-arroz-40g.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       120
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão de Arroz P (40 gramas)');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão Carteiro',
       'Delicioso e irresistivel pao carteiro. Serve 1 pessoa.',
       1.90,
  'assets/products/pao-carteiro.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       140
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Carteiro');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão de Queijo (Massa Fina)',
       'Peca e experimente nosso delicioso pao de queijo, massa leve e suculenta. Serve 1 pessoa.',
       3.00,
  'assets/products/pao-de-queijo-massa-fina.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       110
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão de Queijo (Massa Fina)');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Pão Romeu e Julieta',
       'Delicioso pao com cobertura de coco, fatias de queijo e doce de goiaba.',
       3.70,
  'assets/products/pao-romeu-e-julieta.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       90
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Romeu e Julieta');

INSERT INTO products (name, description, price, image_url, category_id, active, stock)
SELECT 'Língua de Sogra',
       'Delicioso pao massa fina, com 25cm de comprimento, cobertura com tracos de creme de baunilha e coco flocado.',
       4.50,
  'assets/products/lingua-de-sogra.svg',
       (SELECT id FROM categories WHERE name = 'Pães'),
       TRUE,
       70
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Língua de Sogra');
