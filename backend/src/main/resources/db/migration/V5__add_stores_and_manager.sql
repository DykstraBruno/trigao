-- V5__add_stores_and_manager.sql
-- Adiciona multi-loja e role MANAGER

CREATE TABLE stores (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL UNIQUE,
    slug        VARCHAR(50)         NOT NULL UNIQUE,
    address     TEXT,
    phone       VARCHAR(20),
    active      BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN store_id BIGINT REFERENCES stores(id);
ALTER TABLE orders ADD COLUMN store_id BIGINT REFERENCES stores(id);

CREATE INDEX idx_users_store ON users(store_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_store_status ON orders(store_id, status);

INSERT INTO stores (name, slug, address) VALUES
    ('Barão',         'barao',         'Av. Barão de Gurguéia, Teresina - PI'),
    ('Centro',        'centro',        'Centro, Teresina - PI'),
    ('Parque Piauí',  'parque-piaui',  'Parque Piauí, Teresina - PI');
