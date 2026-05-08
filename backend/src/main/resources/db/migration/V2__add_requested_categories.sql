INSERT INTO categories (name, description)
SELECT 'Bolos Salgados', 'Bolos salgados artesanais para lanches e encomendas'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Bolos Salgados'
);

INSERT INTO categories (name, description)
SELECT 'Bolos Doces', 'Bolos doces para sobremesas, festas e ocasiões especiais'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Bolos Doces'
);

INSERT INTO categories (name, description)
SELECT 'Café da Manhã', 'Itens para um café da manhã completo e fresco todos os dias'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Café da Manhã'
);

UPDATE categories
SET active = TRUE
WHERE name IN ('Pães', 'Salgados', 'Bebidas', 'Bolos Salgados', 'Bolos Doces', 'Café da Manhã');