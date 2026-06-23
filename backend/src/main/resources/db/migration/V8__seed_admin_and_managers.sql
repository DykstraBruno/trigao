-- V8__seed_admin_and_managers.sql
-- Seed de usuários para smoke test / onboarding
-- Senhas geradas via pgcrypto bcrypt (compatível com Spring BCryptPasswordEncoder)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin: admin@trigao.com.br / admin123
INSERT INTO users (name, email, password, role)
SELECT 'Admin Trigão', 'admin@trigao.com.br', crypt('admin123', gen_salt('bf', 10)), 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@trigao.com.br');

-- Gerente Barão: barao@trigao.com.br / trigao123
INSERT INTO users (name, email, password, role, store_id)
SELECT 'Gerente Barão', 'barao@trigao.com.br', crypt('trigao123', gen_salt('bf', 10)), 'MANAGER', s.id
FROM stores s
WHERE s.slug = 'barao'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'barao@trigao.com.br');

-- Gerente Centro: centro@trigao.com.br / trigao123
INSERT INTO users (name, email, password, role, store_id)
SELECT 'Gerente Centro', 'centro@trigao.com.br', crypt('trigao123', gen_salt('bf', 10)), 'MANAGER', s.id
FROM stores s
WHERE s.slug = 'centro'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'centro@trigao.com.br');

-- Gerente Parque Piauí: parque@trigao.com.br / trigao123
INSERT INTO users (name, email, password, role, store_id)
SELECT 'Gerente Parque Piauí', 'parque@trigao.com.br', crypt('trigao123', gen_salt('bf', 10)), 'MANAGER', s.id
FROM stores s
WHERE s.slug = 'parque-piaui'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'parque@trigao.com.br');
