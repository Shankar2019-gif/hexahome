-- ============================================================================
-- HexaHome Flyway Migration V2: Baseline Seed Data
-- ============================================================================

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_TENANT', 'Individual searching for rental homes'),
(2, 'ROLE_BUYER', 'Individual searching to buy property'),
(3, 'ROLE_OWNER', 'Property owner listing homes directly'),
(4, 'ROLE_LANDLORD', 'Landlord managing multiple rental properties'),
(5, 'ROLE_AGENT', 'Real estate broker or certified agent'),
(6, 'ROLE_PG_OWNER', 'Owner of PG or Co-living facility'),
(7, 'ROLE_ADMIN', 'Platform operations and moderation admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Cities
INSERT INTO cities (id, name, state, slug, latitude, longitude, display_order, is_active) VALUES
(1, 'Coimbatore', 'Tamil Nadu', 'coimbatore', 11.0168, 76.9558, 1, TRUE),
(2, 'Ahmedabad', 'Gujarat', 'ahmedabad', 23.0225, 72.5714, 2, TRUE),
(3, 'Noida', 'Uttar Pradesh', 'noida', 28.5355, 77.3910, 3, TRUE),
(4, 'Bengaluru', 'Karnataka', 'bengaluru', 12.9716, 77.5946, 4, TRUE),
(5, 'Chennai', 'Tamil Nadu', 'chennai', 13.0827, 80.2707, 5, TRUE),
(6, 'Mumbai', 'Maharashtra', 'mumbai', 19.0760, 72.8777, 6, TRUE),
(7, 'Pune', 'Maharashtra', 'pune', 18.5204, 73.8567, 7, TRUE),
(8, 'Delhi', 'Delhi', 'delhi', 28.7041, 77.1025, 8, TRUE),
(9, 'Hyderabad', 'Telangana', 'hyderabad', 17.3850, 78.4867, 9, TRUE),
(10, 'Kolkata', 'West Bengal', 'kolkata', 22.5726, 88.3639, 10, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Localities for Coimbatore
INSERT INTO localities (id, city_id, name, slug, latitude, longitude, pin_code, display_order) VALUES
(1, 1, 'Peelamedu', 'peelamedu', 11.0267, 77.0028, 641004, 1),
(2, 1, 'Vilankurichi', 'vilankurichi', 11.0601, 77.0189, 641035, 2),
(3, 1, 'Vadakovai', 'vadakovai', 11.0183, 76.9602, 641002, 3),
(4, 1, 'Ram Nagar', 'ram-nagar', 11.0125, 76.9622, 641009, 4),
(5, 1, 'Papanaickenpalayam', 'papanaickenpalayam', 11.0142, 76.9850, 641037, 5),
(6, 1, 'Chinnavedampatti', 'chinnavedampatti', 11.0664, 76.9842, 641049, 6),
(7, 1, 'Sundarapuram', 'sundarapuram', 10.9525, 76.9740, 641024, 7),
(8, 1, 'Saravanampatty', 'saravanampatty', 11.0797, 76.9984, 641035, 8)
ON CONFLICT (id) DO NOTHING;

-- 4. Amenities Master
INSERT INTO amenities (id, code, name, icon_url, category) VALUES
(1, 'LIFT', 'Elevator / Lift', 'https://assets.hexahome.in/static/icons/amenities/lift.svg', 'BUILDING'),
(2, 'COVERED_PARKING', 'Covered Parking', 'https://assets.hexahome.in/static/icons/amenities/parking.svg', 'PARKING'),
(3, 'POWER_BACKUP', '24x7 Power Backup', 'https://assets.hexahome.in/static/icons/amenities/power-backup.svg', 'UTILITIES'),
(4, 'SECURITY', '24x7 Security & CCTV', 'https://assets.hexahome.in/static/icons/amenities/security.svg', 'SAFETY'),
(5, 'GYM', 'Gymnasium & Fitness', 'https://assets.hexahome.in/static/icons/amenities/gym.svg', 'LIFESTYLE'),
(6, 'SWIMMING_POOL', 'Swimming Pool', 'https://assets.hexahome.in/static/icons/amenities/pool.svg', 'LIFESTYLE'),
(7, 'GAS_PIPELINE', 'Piped Gas Connection', 'https://assets.hexahome.in/static/icons/amenities/gas.svg', 'UTILITIES'),
(8, 'CLUBHOUSE', 'Clubhouse & Party Hall', 'https://assets.hexahome.in/static/icons/amenities/clubhouse.svg', 'LIFESTYLE'),
(9, 'CHILDREN_PLAY_AREA', 'Children Play Area', 'https://assets.hexahome.in/static/icons/amenities/play-area.svg', 'COMMUNITY'),
(10, 'RAINWATER_HARVESTING', 'Rainwater Harvesting', 'https://assets.hexahome.in/static/icons/amenities/rainwater.svg', 'ECO')
ON CONFLICT (id) DO NOTHING;

-- 5. Monetization Plans
INSERT INTO plans (id, name, target_role, price_inr, validity_days, contact_credits, has_assisted_manager, instant_whatsapp_alerts, features, is_active) VALUES
('plan_free_tenant', 'Basic Free', 'TENANT', 0.00, 30, 2, FALSE, FALSE, '["View up to 2 verified owner contacts", "Standard search filters"]', TRUE),
('plan_tenant_pro', 'Tenant Assisted Pro', 'TENANT', 999.00, 45, 25, FALSE, TRUE, '["View 25 verified owner contacts", "Instant WhatsApp alerts for new matching listings", "Priority response"]', TRUE),
('plan_tenant_gold', 'Tenant VIP Unlimited', 'TENANT', 1999.00, 90, 50, TRUE, TRUE, '["View 50 verified owner contacts", "Dedicated relationship manager", "Legal rent agreement draft included"]', TRUE),
('plan_owner_free', 'Free Listing', 'OWNER', 0.00, 30, 0, FALSE, FALSE, '["1 Free standard listing", "0% Brokerage connection"]', TRUE),
('plan_owner_boost', 'Owner Fast Connect', 'OWNER', 1499.00, 60, 0, TRUE, TRUE, '["Top search rank badge", "Direct tenant lead alerts via SMS & WhatsApp", "Listing boost on home page"]', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. Demo System User (Property Owner)
INSERT INTO users (id, phone, email, name, is_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '9842109876', 'venkatesh.owner@hexahome.in', 'K. Venkatesh', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES
('00000000-0000-0000-0000-000000000001', 3)
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 7. Baseline Properties (Matching Reference HexaHome Data)
INSERT INTO properties (
    id, short_id, slug, owner_id, city_id, locality_id, ad_type, property_type,
    title, description, price, deposit, maintenance_charges, is_maintenance_included,
    bhk, bedrooms, bathrooms, balconies, built_up_area, carpet_area, furnishing, preferred_tenant,
    facing, floor_number, total_floors, latitude, longitude, address, status, is_verified, is_zero_brokerage, is_hot_deal
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567801',
    'XAT594',
    '3bhk-flat-apartment-for-rent-in-peelamedu-coimbatore-id-XAT594',
    '00000000-0000-0000-0000-000000000001',
    1, 1, 'RENT', 'FLAT',
    '3BHK Apartment for rent in Peelamedu, Coimbatore',
    'Spacious 3 BHK apartment with modular kitchen, 100% power backup, and dedicated covered car parking. Near PSG Tech and Fun Republic Mall.',
    34000.00, 68000.00, 2500.00, FALSE,
    '3 BHK', 3, 3, 2, 1650.00, 1380.00, 'SEMI_FURNISHED', 'FAMILY',
    'EAST', 4, 10, 11.0267, 77.0028,
    'Flat 402, Green Meadows, Peelamedu, Coimbatore', 'ACTIVE', TRUE, TRUE, FALSE
),
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567802',
    'BCTMV8',
    '2bhk-flat-apartment-for-rent-in-vilankurichi-coimbatore-id-BCTMV8',
    '00000000-0000-0000-0000-000000000001',
    1, 2, 'RENT', 'FLAT',
    '2BHK Apartment for rent in Vishweshwara Nagar, Vilankurichi, Coimbatore',
    'Modern 2 BHK gated community flat close to Tidel Park IT corridor. Gated security with 24 hours Kaveri water.',
    18000.00, 36000.00, 1200.00, TRUE,
    '2 BHK', 2, 2, 1, 1150.00, 950.00, 'UNFURNISHED', 'ANY',
    'NORTH', 2, 5, 11.0601, 77.0189,
    'B-204, Royal Palms, Vilankurichi Road, Coimbatore', 'ACTIVE', TRUE, TRUE, TRUE
),
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567803',
    'QUSESH',
    '3bhk-flat-apartment-for-rent-in-vadakovai-coimbatore-id-QUSESH',
    '00000000-0000-0000-0000-000000000001',
    1, 3, 'RENT', 'FLAT',
    '3BHK Apartment for rent in Vadakovai, Coimbatore',
    'Prime location 3 BHK home near railway station. Fully furnished with air conditioning, sofa, dining table, and smart TV.',
    27500.00, 55000.00, 2000.00, FALSE,
    '3 BHK', 3, 2, 2, 1450.00, 1220.00, 'FULLY_FURNISHED', 'FAMILY',
    'NORTH_EAST', 6, 8, 11.0183, 76.9602,
    'Skyline Heights, Vadakovai, Coimbatore', 'ACTIVE', TRUE, TRUE, FALSE
),
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567804',
    'BLTAUN',
    '1bhk-floor-for-rent-in-ram-nagar-coimbatore-id-BLTAUN',
    '00000000-0000-0000-0000-000000000001',
    1, 4, 'RENT', 'HOUSE',
    '1BHK Builder Floor for rent in Ram Nagar, Coimbatore',
    'Independent 1 BHK ground floor house suitable for working professionals or small families. 0% brokerage.',
    15500.00, 15500.00, 500.00, TRUE,
    '1 BHK', 1, 1, 1, 650.00, 550.00, 'SEMI_FURNISHED', 'BACHELORS',
    'EAST', 1, 2, 11.0125, 76.9622,
    '12, Cross Road 3, Ram Nagar, Coimbatore', 'ACTIVE', TRUE, TRUE, FALSE
)
ON CONFLICT (id) DO NOTHING;

-- 8. Sample Property Images
INSERT INTO property_images (id, property_id, image_url, thumbnail_url, caption, display_order, is_cover) VALUES
('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/apartments-for-rent-img.webp', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/apartments-for-rent-img.webp', 'Living Room', 0, TRUE),
('b1b2c3d4-e5f6-7890-abcd-ef1234567802', 'a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/2-3-bhk-houses-img.webp', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/2-3-bhk-houses-img.webp', 'Master Bedroom', 0, TRUE),
('b1b2c3d4-e5f6-7890-abcd-ef1234567803', 'a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/budget-friendly-homes-img.webp', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/budget-friendly-homes-img.webp', 'Balcony View', 0, TRUE),
('b1b2c3d4-e5f6-7890-abcd-ef1234567804', 'a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/homes-for-bachelor.webp', 'https://assets.hexahome.in/static/home/homepage/properties-for-rent/homes-for-bachelor.webp', 'Front View', 0, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Property Amenities
INSERT INTO property_amenities (property_id, amenity_id) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 3)
ON CONFLICT DO NOTHING;
