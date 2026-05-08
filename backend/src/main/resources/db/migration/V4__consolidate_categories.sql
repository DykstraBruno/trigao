UPDATE categories
SET description = 'Pães frescos assados diariamente', active = TRUE
WHERE name = 'Pães';

UPDATE categories
SET description = 'Salgados assados e fritos para qualquer hora do dia', active = TRUE
WHERE name = 'Salgados';

UPDATE categories
SET description = 'Bebidas quentes e frias para acompanhar seus pedidos', active = TRUE
WHERE name = 'Bebidas';

UPDATE categories
SET description = 'Bolos salgados artesanais para lanches e encomendas', active = TRUE
WHERE name = 'Bolos Salgados';

UPDATE categories
SET description = 'Bolos doces para sobremesas, festas e ocasiões especiais', active = TRUE
WHERE name = 'Bolos Doces';

UPDATE categories
SET description = 'Itens para um café da manhã completo e fresco todos os dias', active = TRUE
WHERE name = 'Café da Manhã';

UPDATE products p
SET category_id = target.id
FROM categories source, categories target
WHERE p.category_id = source.id
  AND source.name = 'Bolos'
  AND target.name = 'Bolos Doces';

UPDATE products p
SET category_id = target.id
FROM categories source, categories target
WHERE p.category_id = source.id
  AND source.name = 'Doces'
  AND target.name = 'Bolos Doces';

UPDATE products p
SET category_id = target.id
FROM categories source, categories target
WHERE p.category_id = source.id
  AND source.name = 'Combos'
  AND target.name = 'Café da Manhã';

UPDATE categories
SET active = FALSE
WHERE name IN ('Bolos', 'Doces', 'Combos');