-- ============================================================================
-- HexaHome Flyway Migration V5: Performance Indexes & Auth Schema Expansion
-- ============================================================================

-- 1. Expand User Schema for Direct Password-Based Authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);

-- 2. Foreign Key & Query Performance Optimization Indexes
-- Indexes for Property Images
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images (property_id);

-- Indexes for Leads & Seeker Queries
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads (property_id);
CREATE INDEX IF NOT EXISTS idx_leads_seeker_id ON leads (seeker_id);

-- Indexes for Billing & Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments (user_id);

-- Index for Hot Deal Queries
CREATE INDEX IF NOT EXISTS idx_properties_status_hotdeal ON properties (status, is_hot_deal);

-- Index for User Lookups (email)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
