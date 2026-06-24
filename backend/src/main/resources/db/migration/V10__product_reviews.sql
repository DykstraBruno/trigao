-- V10__product_reviews.sql
-- Avaliações de produtos pós-entrega.
-- 1 review por (cliente, produto, pedido) — cliente pode avaliar mesmo produto em pedidos distintos.

CREATE TABLE product_reviews (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id    BIGINT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rating      INTEGER         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    approved    BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT uq_review_user_product_order UNIQUE (user_id, product_id, order_id)
);

CREATE INDEX idx_reviews_product       ON product_reviews(product_id, approved, created_at DESC);
CREATE INDEX idx_reviews_user          ON product_reviews(user_id);
CREATE INDEX idx_reviews_order         ON product_reviews(order_id);
