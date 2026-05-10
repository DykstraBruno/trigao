-- V7__update_paes_image_urls.sql
-- Atualiza image_url dos paes adicionados no catalogo

UPDATE products SET image_url = 'assets/products/pao-frances.svg' WHERE name = 'Pão Francês';
UPDATE products SET image_url = 'assets/products/pao-frances-amanteigado.svg' WHERE name = 'Pão Francês Amanteigado';
UPDATE products SET image_url = 'assets/products/pacote-pao-zero-lactose.svg' WHERE name = 'Pacote Pão Zero Lactose';
UPDATE products SET image_url = 'assets/products/pao-hot-dog.svg' WHERE name = 'Pão Hot-Dog';
UPDATE products SET image_url = 'assets/products/pao-de-arroz-40g.svg' WHERE name = 'Pão de Arroz P (40 gramas)';
UPDATE products SET image_url = 'assets/products/pao-carteiro.svg' WHERE name = 'Pão Carteiro';
UPDATE products SET image_url = 'assets/products/pao-de-queijo-massa-fina.svg' WHERE name = 'Pão de Queijo (Massa Fina)';
UPDATE products SET image_url = 'assets/products/pao-romeu-e-julieta.svg' WHERE name = 'Pão Romeu e Julieta';
UPDATE products SET image_url = 'assets/products/lingua-de-sogra.svg' WHERE name = 'Língua de Sogra';
