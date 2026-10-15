-- ============================================================================
-- HexaHome Flyway Migration V7: Admin Lead Management Schema Enhancements
-- Target: PostgreSQL 16+
-- Safe, additive migration: Protects existing leads data
-- ============================================================================

-- 1. Add assignment and timestamp tracking columns to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- 2. Performance indexes for lead management, filtering, and assignment
CREATE INDEX IF NOT EXISTS idx_leads_assigned_admin_id ON leads(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_seeker_id ON leads(seeker_id);
