-- V11__loyalty_program.sql
-- Programa de fidelidade Trigão Club.
-- 1 ponto a cada R$ 5,00 gastos. 20 pontos = R$ 1,00 de desconto.

ALTER TABLE users ADD COLUMN loyalty_points INTEGER NOT NULL DEFAULT 0;

CREATE TABLE loyalty_transactions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id        BIGINT          REFERENCES orders(id) ON DELETE SET NULL,
    type            VARCHAR(20)     NOT NULL,
    points          INTEGER         NOT NULL,
    balance_after   INTEGER         NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_loyalty_type CHECK (type IN ('EARN', 'REDEEM', 'ADJUST', 'EXPIRE'))
);

CREATE INDEX idx_loyalty_user_created ON loyalty_transactions(user_id, created_at DESC);
CREATE INDEX idx_loyalty_order        ON loyalty_transactions(order_id);

-- Coluna para registrar pontos usados no pedido (auditoria + recálculo)
ALTER TABLE orders ADD COLUMN loyalty_points_used   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN loyalty_points_earned INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN discount_amount       NUMERIC(10, 2) NOT NULL DEFAULT 0;
