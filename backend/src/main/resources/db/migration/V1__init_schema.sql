-- ============================================================================
-- HexaHome Flyway Migration V1: Complete Database Schema
-- Target: PostgreSQL 16+ with resilient PostGIS & Full-Text Search
-- ============================================================================

-- 1. Enable Core PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_trgm') THEN
        CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'postgis') THEN
        CREATE EXTENSION IF NOT EXISTS "postgis";
    END IF;
END $$;

-- 2. Master Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(120),
    name VARCHAR(100),
    profile_pic_url VARCHAR(500),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User Roles Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    latitude NUMERIC(10, 7) NOT NULL DEFAULT 0,
    longitude NUMERIC(10, 7) NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Localities Table
CREATE TABLE IF NOT EXISTS localities (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL DEFAULT 0,
    longitude NUMERIC(10, 7) NOT NULL DEFAULT 0,
    pin_code INT,
    display_order INT NOT NULL DEFAULT 0,
    CONSTRAINT uq_city_locality_slug UNIQUE (city_id, slug)
);

-- 6. Amenities Master Table
CREATE TABLE IF NOT EXISTS amenities (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(500),
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL'
);

-- 7. Shared Base Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_id VARCHAR(10) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    locality_id INT NOT NULL REFERENCES localities(id) ON DELETE RESTRICT,
    
    ad_type VARCHAR(20) NOT NULL, -- RENT, SALE, PLOT, PG
    property_type VARCHAR(30) NOT NULL, -- FLAT, HOUSE, VILLA, COMMERCIAL, PLOT, PG
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    price NUMERIC(14, 2) NOT NULL,
    deposit NUMERIC(14, 2) DEFAULT 0,
    maintenance_charges NUMERIC(10, 2) DEFAULT 0,
    is_maintenance_included BOOLEAN NOT NULL DEFAULT TRUE,
    
    bhk VARCHAR(20), -- 1 RK, 1 BHK, 2 BHK, 3 BHK, 4 BHK, 5+ BHK
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    balconies INT DEFAULT 0,
    
    built_up_area NUMERIC(10, 2) NOT NULL,
    carpet_area NUMERIC(10, 2),
    
    furnishing VARCHAR(30) DEFAULT 'UNFURNISHED',
    preferred_tenant VARCHAR(30) DEFAULT 'ANY',
    facing VARCHAR(30),
    floor_number INT,
    total_floors INT,
    
    available_from DATE DEFAULT CURRENT_DATE,
    
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address TEXT NOT NULL,
    
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_zero_brokerage BOOLEAN NOT NULL DEFAULT TRUE,
    is_hot_deal BOOLEAN NOT NULL DEFAULT FALSE,
    
    metadata JSONB DEFAULT '{}',
    search_vector TSVECTOR,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. PG / Co-Living Specific Detail Table
CREATE TABLE IF NOT EXISTS pg_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    gender_allowed VARCHAR(20) NOT NULL,
    sharing_types VARCHAR(50) NOT NULL,
    food_included BOOLEAN NOT NULL DEFAULT TRUE,
    meals_provided VARCHAR(50) DEFAULT 'BREAKFAST_DINNER',
    notice_period VARCHAR(30) DEFAULT '30_DAYS',
    deposit_months NUMERIC(4, 1) DEFAULT 2,
    gate_closing_time VARCHAR(20) DEFAULT '22:30'
);

-- 9. Commercial Specific Detail Table
CREATE TABLE IF NOT EXISTS commercial_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    commercial_type VARCHAR(40) NOT NULL,
    power_load_kva NUMERIC(10, 2),
    ceiling_height_ft NUMERIC(6, 2),
    goods_lift_available BOOLEAN NOT NULL DEFAULT FALSE,
    parking_slots INT DEFAULT 0
);

-- 10. Plots Specific Detail Table
CREATE TABLE IF NOT EXISTS plot_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    plot_length NUMERIC(10, 2),
    plot_breadth NUMERIC(10, 2),
    boundary_wall BOOLEAN NOT NULL DEFAULT FALSE,
    corner_plot BOOLEAN NOT NULL DEFAULT FALSE,
    gated_community BOOLEAN NOT NULL DEFAULT FALSE,
    road_width_ft NUMERIC(6, 2)
);

-- 11. Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    caption VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. Property Amenities Junction Table
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id INT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 13. Leads & Inquiries Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    seeker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    seeker_name VARCHAR(100) NOT NULL,
    seeker_phone VARCHAR(15) NOT NULL,
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 14. Contact Phone Reveals & Quota Deductions Table
CREATE TABLE IF NOT EXISTS contact_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    credit_deducted INT NOT NULL DEFAULT 1,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_property_view UNIQUE (user_id, property_id)
);

-- 15. Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target_role VARCHAR(50) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    validity_days INT NOT NULL,
    contact_credits INT NOT NULL,
    has_assisted_manager BOOLEAN NOT NULL DEFAULT FALSE,
    instant_whatsapp_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 16. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    total_credits INT NOT NULL,
    remaining_credits INT NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
);

-- 17. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    payment_id VARCHAR(100) UNIQUE,
    gateway VARCHAR(30) NOT NULL,
    amount_inr NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 18. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_wishlist UNIQUE (user_id, property_id)
);

-- 19. Saved Searches Table
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    filter_criteria JSONB NOT NULL,
    whatsapp_alert BOOLEAN NOT NULL DEFAULT TRUE,
    email_alert BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 20. Reports & Listing Abuse Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reported_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL,
    comments TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 21. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    display_order INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ============================================================================

-- Full-Text Search Vector Index
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON properties USING GIN (search_vector);

-- High-Frequency Composite Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_properties_city_ad_price ON properties (city_id, ad_type, status, price);
CREATE INDEX IF NOT EXISTS idx_properties_locality_bhk ON properties (locality_id, bhk, price) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON properties (owner_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_coords ON properties (latitude, longitude);

-- Conditionally add PostGIS columns and GiST index if PostGIS is enabled
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        BEGIN
            ALTER TABLE cities ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);
            ALTER TABLE localities ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);
            ALTER TABLE properties ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);
            CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIST (location);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_cities_name_trgm ON cities USING GIN (name gin_trgm_ops);
            CREATE INDEX IF NOT EXISTS idx_localities_name_trgm ON localities USING GIN (name gin_trgm_ops);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;

-- Trigger Function for Search Vector Generation
CREATE OR REPLACE FUNCTION properties_search_vector_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.bhk, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.address, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_search_vector ON properties;
CREATE TRIGGER trg_properties_search_vector
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION properties_search_vector_trigger();
