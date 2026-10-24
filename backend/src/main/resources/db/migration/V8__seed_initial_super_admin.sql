-- HexaHome Flyway Migration V8: Seed Initial Super Administrator Account
-- Target: PostgreSQL 16+

INSERT INTO admin_users (
    id,
    username,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    failed_login_attempts,
    locked_until,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000099',
    'admin',
    'admin@hexahome.in',
    '$2a$10$aCM3dMXGYhB3AOg5fiKBxuYoVpydQyzOy4Dpnizp8pGGKq4mozE8.',
    'HexaHome Super Administrator',
    'SUPER_ADMIN',
    TRUE,
    0,
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (username) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = TRUE,
    failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = NOW();
