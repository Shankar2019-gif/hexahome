-- ============================================================================
-- HexaHome Flyway Migration V3: Builder Projects and FAQs Seed Data
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    builder_name VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    city_id INT REFERENCES cities(id) ON DELETE SET NULL,
    locality_id INT REFERENCES localities(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UNDER_CONSTRUCTION',
    launch_year INT,
    possession_date VARCHAR(50),
    min_price NUMERIC(15, 2),
    max_price NUMERIC(15, 2),
    price_display VARCHAR(100),
    configurations VARCHAR(100),
    banner_image_url VARCHAR(500),
    brochure_url VARCHAR(500),
    rera_id VARCHAR(100),
    description TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_city_status ON projects (city_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);

-- Seed FAQs matching reference HexaHome accordion
INSERT INTO faqs (id, question, answer, category, display_order) VALUES
(1, 'How is HexaHome different from other real estate portals?', 'HexaHome connects genuine tenants, buyers, and direct property owners with 100% zero brokerage. All listings are verified to eliminate broker spam and hidden commission fees.', 'GENERAL', 1),
(2, 'Is posting a property completely free on HexaHome?', 'Yes! Property owners can post their residential, commercial, or PG listings completely free of cost with zero brokerage.', 'OWNER', 2),
(3, 'How does the owner contact reveal credit system work?', 'To maintain privacy and prevent automated scraping, tenants and buyers receive complimentary contact credits upon registration. You can view direct owner contact details by spending 1 credit per property. Additional credits can be obtained via Assisted or VIP plans.', 'TENANT', 3),
(4, 'How do I schedule a visit to a property?', 'Once you reveal the owner contact number or submit a callback inquiry, you can directly connect with the verified owner via phone or WhatsApp to fix a mutually convenient visit time.', 'TENANT', 4),
(5, 'How does HexaHome ensure zero brokerage?', 'Our moderation algorithms and manual verification team verify property documents and ownership proofs. Any agent or broker misrepresenting themselves as an owner is permanently blocked.', 'GENERAL', 5),
(6, 'Can I cancel or upgrade my subscription plan anytime?', 'Yes, you can upgrade your subscription plan at any time. Any remaining contact credits roll over and accumulate into your upgraded plan validity period.', 'PAYMENT', 6)
ON CONFLICT (id) DO NOTHING;

-- Seed Builder Projects in Coimbatore and Ahmedabad
INSERT INTO projects (
    id, name, builder_name, slug, city_id, locality_id, status, launch_year, possession_date,
    min_price, max_price, price_display, configurations, banner_image_url, rera_id, description, is_featured
) VALUES
(
    'c1d2e3f4-1111-4444-8888-000000000001',
    'Casagrand Nextown',
    'Casagrand Builder Private Limited',
    'casagrand-nextown-vilankurichi-coimbatore',
    1, 2, 'READY_TO_MOVE', 2023, 'Ready to Move',
    4800000.00, 8500000.00, '₹ 48 L - 85 L', '2 & 3 BHK Lifestyle Apartments',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    'TN/11/Building/0192/2021',
    'Premium gated community lifestyle apartments with 50+ world-class amenities including swimming pool, clubhouse, and landscaped gardens located in Vilankurichi, Coimbatore.',
    TRUE
),
(
    'c1d2e3f4-2222-4444-8888-000000000002',
    'Sobha Emerald Heights',
    'Sobha Developers',
    'sobha-emerald-heights-peelamedu-coimbatore',
    1, 1, 'UNDER_CONSTRUCTION', 2024, 'December 2026',
    7500000.00, 16000000.00, '₹ 75 L - 1.6 Cr', '3 & 4 BHK Luxury Condos',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'TN/11/Building/0255/2023',
    'Ultra-luxury high-rise residences by Sobha Developers situated near Peelamedu IT corridor offering panoramic city skyline views and German quality engineering.',
    TRUE
),
(
    'c1d2e3f4-3333-4444-8888-000000000003',
    'Godrej Garden Enclave',
    'Godrej Properties',
    'godrej-garden-enclave-ahmedabad',
    2, NULL, 'NEW_LAUNCH', 2025, 'March 2028',
    6200000.00, 12500000.00, '₹ 62 L - 1.25 Cr', '2, 3 BHK Green Homes',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'PR/GJ/AHMEDABAD/00492/2024',
    'Sustainable luxury living amidst lush green forest groves with solar power integration, rainwater recharge, and smart home automation in prime Ahmedabad.',
    TRUE
)
ON CONFLICT (id) DO NOTHING;
