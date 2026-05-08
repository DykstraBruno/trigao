-- V1__init.sql
-- Schema inicial da Trigão Panificadora

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    email       VARCHAR(255)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    phone       VARCHAR(20),
    role        VARCHAR(20)         NOT NULL DEFAULT 'CUSTOMER',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    active      BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200)        NOT NULL,
    description     TEXT,
    price           NUMERIC(10, 2)      NOT NULL CHECK (price >= 0),
    image_url       VARCHAR(500),
    category_id     BIGINT              REFERENCES categories(id) ON DELETE SET NULL,
    active          BOOLEAN             NOT NULL DEFAULT TRUE,
    stock           INTEGER             NOT NULL DEFAULT 0,
    abacatepay_product_id VARCHAR(100),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT              NOT NULL REFERENCES users(id),
    status          order_status        NOT NULL DEFAULT 'PENDING',
    total_amount    NUMERIC(10, 2)      NOT NULL,
    notes           TEXT,
    billing_id      VARCHAR(100),
    billing_url     VARCHAR(500),
    payment_method  VARCHAR(20),
    address         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  BIGINT          NOT NULL REFERENCES products(id),
    quantity    INTEGER         NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2)  NOT NULL
);

-- Índices
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_billing ON orders(billing_id);

-- Dados iniciais: categorias
INSERT INTO categories (name, description) VALUES
    ('Pães', 'Pães frescos assados diariamente'),
    ('Bolos', 'Bolos artesanais para todas as ocasiões'),
    ('Salgados', 'Salgados fritos e assados'),
    ('Doces', 'Doces e sobremesas'),
    ('Bebidas', 'Bebidas quentes e frias'),
    ('Combos', 'Combos especiais com desconto');

-- Dados iniciais: produtos
INSERT INTO products (name, description, price, category_id, stock) VALUES
    ('Pão Francês', 'Pão francês crocante por fora e macio por dentro', 0.75, 1, 200),
    ('Pão de Queijo', 'Tradicional pão de queijo mineiro', 3.50, 1, 100),
    ('Pão Integral', 'Pão integral com grãos selecionados', 8.90, 1, 50),
    ('Pão de Leite', 'Pão de leite fofinho e adocicado', 1.50, 1, 80),
    ('Bolo de Cenoura', 'Bolo de cenoura com cobertura de chocolate', 25.00, 2, 20),
    ('Bolo de Chocolate', 'Bolo de chocolate recheado com ganache', 35.00, 2, 15),
    ('Coxinha', 'Coxinha de frango cremosa', 5.50, 3, 60),
    ('Esfirra', 'Esfirra assada de carne', 4.50, 3, 60),
    ('Pastel', 'Pastel frito de queijo', 5.00, 3, 50),
    ('Brigadeiro', 'Brigadeiro caseiro', 3.00, 4, 80),
    ('Café', 'Café passado na hora', 5.00, 5, 999),
    ('Suco de Laranja', 'Suco de laranja natural', 8.00, 5, 50);
