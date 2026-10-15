-- ============================================================================
-- HexaHome Flyway Migration V4: Add Builder Role & Expand Profile Photo Storage
-- ============================================================================

INSERT INTO roles (id, name, description) VALUES
(8, 'ROLE_BUILDER', 'Real estate builder or property developer')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE users ALTER COLUMN profile_pic_url TYPE TEXT;
