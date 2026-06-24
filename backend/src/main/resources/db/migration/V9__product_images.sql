-- V9__product_images.sql
-- Multi-imagem por produto (galeria). image_url legado continua como capa.

CREATE TABLE product_images (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url         VARCHAR(500)    NOT NULL,
    alt_text    VARCHAR(255),
    sort_order  INTEGER         NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_sort    ON product_images(product_id, sort_order);
