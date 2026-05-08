INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Pão Caseiro', 'Pão caseiro macio, ideal para o café da manhã', 12.00,
       (SELECT id FROM categories WHERE name = 'Pães'), 40
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão Caseiro');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Pão de Coco', 'Pão levemente adocicado com cobertura de coco', 4.50,
       (SELECT id FROM categories WHERE name = 'Pães'), 35
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Pães')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pão de Coco');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Bolo Salgado de Frango', 'Bolo salgado recheado com frango temperado e legumes', 28.00,
       (SELECT id FROM categories WHERE name = 'Bolos Salgados'), 18
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bolos Salgados')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bolo Salgado de Frango');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Torta Salgada de Atum', 'Torta salgada cremosa com recheio de atum', 30.00,
       (SELECT id FROM categories WHERE name = 'Bolos Salgados'), 16
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bolos Salgados')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Torta Salgada de Atum');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Bolo de Milho', 'Bolo doce fofinho com sabor caseiro de milho', 22.00,
       (SELECT id FROM categories WHERE name = 'Bolos Doces'), 20
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bolos Doces')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bolo de Milho');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Bolo Formigueiro', 'Bolo doce tradicional com granulado de chocolate', 24.00,
       (SELECT id FROM categories WHERE name = 'Bolos Doces'), 20
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bolos Doces')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bolo Formigueiro');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Empada de Frango', 'Empada amanteigada recheada com frango desfiado', 6.50,
       (SELECT id FROM categories WHERE name = 'Salgados'), 60
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Salgados')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Empada de Frango');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Enroladinho de Salsicha', 'Salgado assado clássico para qualquer hora do dia', 5.50,
       (SELECT id FROM categories WHERE name = 'Salgados'), 70
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Salgados')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Enroladinho de Salsicha');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Combo Café da Manhã', 'Pão na chapa, café com leite e fatia de bolo', 18.00,
       (SELECT id FROM categories WHERE name = 'Café da Manhã'), 30
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Café da Manhã')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Combo Café da Manhã');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Misto Quente com Café', 'Sanduíche misto quente acompanhado de café passado na hora', 14.00,
       (SELECT id FROM categories WHERE name = 'Café da Manhã'), 30
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Café da Manhã')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Misto Quente com Café');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Cappuccino', 'Cappuccino cremoso com canela', 7.50,
       (SELECT id FROM categories WHERE name = 'Bebidas'), 80
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bebidas')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cappuccino');

INSERT INTO products (name, description, price, category_id, stock)
SELECT 'Chocolate Quente', 'Bebida cremosa de chocolate servida quente', 9.00,
       (SELECT id FROM categories WHERE name = 'Bebidas'), 50
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Bebidas')
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Quente');