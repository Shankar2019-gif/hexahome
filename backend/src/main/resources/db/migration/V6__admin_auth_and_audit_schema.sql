-- ============================================================================
-- HexaHome Flyway Migration V6: Admin Authentication, RBAC & Audit Schema
-- Target: PostgreSQL 16+
-- ============================================================================

-- 1. Dedicated Admin Users Table (Isolated from public users)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL, -- SUPER_ADMIN, MODERATOR, SUPPORT, SALES, CONTENT
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Admin Refresh Token Session Store (Stores SHA-256 token hashes, not raw tokens)
CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Admin Audit Log Table (Immutable audit trail for all admin actions)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    previous_value JSONB,
    new_value JSONB,
    reason TEXT,
    ip_address VARCHAR(45),
    outcome VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. High-Performance Query & Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users (username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users (role);

CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_admin_id ON admin_refresh_tokens (admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_refresh_tokens_token_hash ON admin_refresh_tokens (token_hash);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity ON admin_audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs (created_at DESC);
