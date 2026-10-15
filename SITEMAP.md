# HexaHome Reference Application Sitemap & Routing Architecture (Phase 1 Audit)

Reference URL: `https://www.hexahome.in/`  
Application Engine: Next.js (App Router), SSR + ISR with dynamic routing, Tailwind CSS, TypeScript.

---

## 1. Global Layout & Shell

### 1.1 Header / Navigation Bar (`/`)
- **Login Needed**: No (Public). Role-based adaptive options when authenticated.
- **Visual & Structural Elements**:
  - **Logo**: HexaHome Brand Logo (SVG/WebP, rendered size: `152px × 38px`), links to `/`.
  - **City Selector Dropdown**:
    - Default: Auto-detected or `Coimbatore` (in reference) / `Ahmedabad` / `Noida`.
    - Options: Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad, Coimbatore, Kochi, Lucknow, Jaipur, Chandigarh, Goa, etc. (50+ tier-1 & tier-2 cities).
    - Dependent Behavior: Selecting a city updates city-scoped queries, links, and local listings immediately.
  - **Main Navigation Category Links**:
    - `Rent` (`/rent/`)
    - `Buy` (`/sale/`)
    - `Commercial` (`/sale/commercial-property-for-sale-in-{city}/`)
    - `PG / Co-Living` (`/pg/` & `/roommates/`)
    - `Plots` (`/plot/`)
    - `Projects` (`/projects-in-{city}-hmpro/`)
  - **Action CTAs**:
    - **Post Property (FREE)**: Highlighted button (`#ffc209` gold / `#033487` navy), links to `/post-property/`.
    - **Login / Signup**: Trigger modal (Phone + OTP). When logged in: Profile Avatar with dropdown (`My Listings`, `Leads`, `Saved Properties`, `My Plan`, `Settings`, `Logout`).
- **Modals Triggered from Header**:
  - `LoginModal`: Phone number input -> 4/6-digit OTP verification -> Profile completion.
  - `CitySelectModal`: Search input + Popular cities grid + All cities list.

---

## 2. Core Pages Specification

### 2.1 Home Page (`/`)
- **URL Pattern**: `/` (with optional `?city={cityName}`)
- **Login Needed**: No (Public).
- **Sections in Sequence**:
  1. **Hero Search Section**:
     - Headline: `Ghar Aapka... Khoz hamari`
     - Subtitle: Verified direct owner listings with 0 brokerage.
     - Search Bar Console:
       - Category Tabs: `Rent` | `Buy` | `Commercial` | `PG / Co-Living` | `Plots`
       - Inputs: Location Autocomplete (Google Places / Backend City-Locality search), Property Type dropdown, BHK selector dropdown, Budget range slider.
       - CTA: "Search" button -> Navigates to `/search/property-for-{type}-in-{city}/`.
  2. **Our Offerings Carousel**:
     - Horizontal cards: Rent, Buy, Commercial, PG & Co-living, Plots, Projects.
  3. **Explore Residential Properties**:
     - Categories: Apartment/Flats, Independent House, Villa, Residential Plot/Land.
  4. **Explore by Furnishing Type**:
     - Categories: Fully Furnished, Semi Furnished, Unfurnished.
  5. **Commercial Offerings**:
     - Desktop: 2-column split (Left: Headline + `Explore Commercial Properties` button; Right: 3x2 grid with tall card for Office Space, Retail Shop, Warehouse, Showrooms, Commercial Plots).
     - Mobile: Horizontal scrollable strip (`w-[120px] h-[140px]`).
  6. **Properties for Rent in {City}**:
     - Curated categories: Apartments for Rent, 2 & 3 BHK Houses, Budget friendly Homes, Homes for Family, Homes for Bachelor.
  7. **Dual Action Banners**:
     - Card 1: "Looking for Buyers/Tenants!" -> Free property listing CTA.
     - Card 2: "Need Assistance to Post Property?" -> Expert callback CTA.
  8. **BHK in Mind Quick Filter**:
     - Pills: 1 BHK, 2 BHK, 3 BHK, 4 BHK, 5+ BHK.
  9. **Plots in {City}**:
     - Curated plot investments & gated community lands.
  10. **Commercial Properties for Sale**:
      - Office spaces, shops, warehouses, commercial land.
  11. **Mobile App Download Promo (`#download-banner`)**:
      - Blueprint SVG grid background, App benefits bullet list, Desktop QR code + Store badges, Hand-held smartphone 3D mockup.
  12. **Hot Deal Properties in {City}**:
      - High-discount, urgent verified listings with special price tags.
  13. **PG's in {City}**:
      - Boys PG, Girls PG, Unisex PG with meals.
  14. **Co-Living Offerings**:
      - Shared community living spaces, private rooms.
  15. **Explore Properties by Cities**:
      - Grid of top 12 Indian metros.
  16. **How to List Property on HexaHome**:
      - Step-by-step graphic explanation (Post -> Verify -> Connect).
  17. **Frequently Asked Questions (FAQ Accordion)**:
      - 6 interactive collapsible questions covering zero brokerage, safety, listing speed.
  18. **Testimonial / Social Proof**:
      - "Real People, Real Connections" reviews slider.
  19. **Footer with Locality Link Matrices**:
      - Massive internal SEO linking matrix categorized by Rent, Buy, Commercial, Plots.

---

### 2.2 Search & Listing Results Page (`/search/...`)
- **URL Patterns**:
  - `/search/property-for-rent-in-{city}/`
  - `/search/property-for-buy-in-{city}/`
  - `/search/plots-for-sale-in-{city}/`
  - `/roommates/shared-coliving-pg-in-{city}/`
  - With query parameters:
    `?adType={rent|buy|plot}&propertyType={flat|house|villa|commercial}&bhk={1BHK,2BHK}&min_amount={min}&max_amount={max}&min_built_area={min}&max_built_area={max}&furnish_type={fully|semi|unfurnished}&preferred_tenant={family|bachelor|female|male}&facing={north|east|south|west}&sort_by={relevance|price_asc|price_desc|date_desc}&page=1`
- **Login Needed**: No (Public). Contact/View Number prompts login if unauthenticated.
- **Sections in Sequence**:
  1. **Breadcrumb**: Home > {City} > Property for {Rent|Buy}.
  2. **Search Refinement Bar**: Location search chip, category tabs, filter drawer trigger.
  3. **Main Content (Two Columns on Desktop)**:
     - **Left Filter Sidebar (Desktop, 280px)**:
       - Price Range slider (Min: ₹5,000 to ₹10,00,000+).
       - BHK Type checkboxes (1 RK, 1 BHK, 2 BHK, 3 BHK, 4+ BHK).
       - Property Subtype (Apartment, Independent House, Villa, Builder Floor).
       - Furnishing (Fully Furnished, Semi-Furnished, Unfurnished).
       - Tenant Preference (Family, Bachelors, Any).
       - Availability (Immediate, Within 15 days, Within 30 days).
       - Verified Listings Only toggle.
       - Zero Brokerage Only toggle.
     - **Right Listing Stream**:
       - Results Header: Total count (`Showing 45 properties in Coimbatore`), Sort dropdown (`Relevance`, `Price: Low to High`, `Price: High to Low`, `Newest First`), Map View Toggle.
       - **Property Card**:
         - Multi-image slider with dot pagination and arrow navigation.
         - Price (Large bold typography) + Maintenance breakdown.
         - Title + Locality + City badge.
         - Specs grid: BHK, Baths, Carpet/Super Built-up Area, Furnishing status.
         - Badges: `Verified`, `Zero Brokerage`, `Hot Deal`, `Direct Owner`.
         - CTAs: `Contact Owner` (modal/WhatsApp), `View Phone Number` (deducts plan lead), `Save to Wishlist` (heart icon).
       - Pagination / Infinite scroll loader.
  4. **Map View Drawer / Modal**:
     - Google Map interactive view with custom price markers. Clicking marker highlights card.
- **States**:
  - **Loading**: Skeleton cards (shimmer effect on image and text lines).
  - **Empty**: "No properties found matching your criteria" + Reset Filters CTA + "Post your requirement" banner.
  - **Error**: Retry CTA with network diagnostic notice.

---

### 2.3 Property Details Page (`/property-details/...`)
- **URL Pattern**: `/property-details/{slug}-id-{shortId}/`  
  *(e.g., `/property-details/3bhk-flat-apartment-for-rent-in-peelamedu-coimbatore-id-XAT594/`)*
- **Login Needed**: No (Public). Contact actions require auth.
- **Sections in Sequence**:
  1. **Sticky Header**: Property title, price, "Contact Owner" quick button on scroll.
  2. **Image Gallery**:
     - Desktop: 1 large main image + 4 grid thumbnails + "View all Photos (N)" trigger.
     - Lightbox Modal: Fullscreen high-res image carousel with pan/zoom.
     - Fallback: "Request Photos from Owner" button if listing has < 3 photos.
  3. **Overview Card**:
     - Price & Rent advance / Security deposit.
     - Configuration (3 BHK, 3 Bath, 2 Balconies).
     - Area (Built-up & Carpet area in sq.ft).
     - Floor number / Total floors, Facing (East, North-East, etc.), Age of property.
  4. **Property Highlights & Badges**:
     - Verified Owner, Zero Brokerage, Gated Society, Pet Friendly, Bachelors Allowed.
  5. **Amenities Grid**:
     - Verified icons: Lift, Covered Car Parking, Power Backup, 24x7 Security, Swimming Pool, Gymnasium, Clubhouse, Children Play Area, Rainwater Harvesting, Gas Pipeline.
  6. **Detailed Description**:
     - Owner's narrative text, society rules, key distances.
  7. **Location & Society Details**:
     - Embedded Google Map with pinpoint marker.
     - Landmark distances: Nearest Metro/Bus stand, Schools, Hospitals, Tech Parks.
  8. **Owner / Advertiser Profile Card**:
     - Advertiser Role (`Owner`, `Individual Landlord`, `Authorized Agent`).
     - Response rate & Member since date.
     - CTAs: `View Phone Number`, `Chat on WhatsApp`, `Schedule a Visit`.
  9. **Similar Properties / Recommendations Carousel**:
     - Nearby properties in the same locality and budget range.
- **SEO Elements**:
  - Structured Data: `schema.org/RealEstateListing` & `schema.org/Product` JSON-LD.
  - Meta Tags: Dynamic title `"{BHK} {Type} for {Rent|Sale} in {Locality}, {City} - {Price}"`.

---

### 2.4 Post Property Flow (`/post-property/`)
- **URL Pattern**: `/post-property/` & `/post-property-in-{city}-hmpp/`
- **Login Needed**: Yes (Redirects to OTP login before final publishing, allows draft filling).
- **Multi-Step Form Sequence**:
  - **Step 1: Basic Details**:
    - Property For: `Rent` | `Resale/Sale` | `PG/Hostel` | `Commercial`
    - Property Type: `Flat/Apartment`, `Independent House`, `Villa`, `Plot`, `Office Space`, `Shop`
    - City & Locality autocomplete (Google Places / internal database)
    - Sub-locality / Society / Project Name
  - **Step 2: Property Specifications**:
    - Bedrooms (1 RK, 1, 2, 3, 4, 5+), Bathrooms, Balconies
    - Super Built-up Area & Carpet Area (sq.ft)
    - Floor number, Total floors, Facing direction
    - Furnishing details: checklist of furniture/appliances (AC, TV, Fridge, Beds, Wardrobes, Modular Kitchen)
    - Parking: Car & Bike (Covered/Open)
  - **Step 3: Rental / Pricing Details**:
    - Expected Rent / Price (₹)
    - Expected Deposit / Advance (₹)
    - Maintenance Charges (Included or separate amount)
    - Available from (Date picker)
    - Preferred Tenant (Family, Bachelors, Company Lease, Any)
    - Non-veg allowed, Pets allowed
  - **Step 4: Media Upload**:
    - Drag-and-drop multi-image uploader (Max 15 images, PNG/JPG/WebP, max 10MB each)
    - Client-side thumbnail preview, reordering, cover photo selection
    - Presigned S3 upload progress bars
  - **Step 5: Review & Publish**:
    - Complete summary preview card
    - Phone verification modal if not already logged in
    - Submit -> Moderation status (`Pending Verification` -> `Active`).

---

### 2.5 Auth & User Dashboard (`/account/...`)
- **Login / Signup Pattern**:
  - Modal accessible from any page: `/api/auth/verify-otp/`
  - Input: Indian Mobile Number (10 digits).
  - OTP Input: 6 digit auto-focus inputs with 60-second resend timer.
  - New User: Name, Email, Primary Role selection (`Tenant`, `Buyer`, `Owner`, `Agent`).
- **Dashboard Routes**:
  - `/account/`: General overview, active listings count, leads count, active subscription status.
  - `/account/my-properties/`: Tabbed list (`Active`, `Under Review`, `Expired`, `Drafts`). Actions: Edit, Delete, Mark as Rented/Sold, Boost/Promote.
  - `/account/leads/`: Table of inquiries received with tenant names, phone numbers, contact timestamps, status flags (`Contacted`, `Visited`, `Not Interested`).
  - `/account/bookmark/`: Saved properties wishlist.
  - `/account/plans/`: Current active plan, quota consumed (e.g. `4/10 Owner Numbers Viewed`), upgrade buttons.
  - `/account/feedback/`: Bug reports, listing abuse reports, feature suggestions.

---

### 2.6 Pricing & Plans (`/plans/...`)
- **URL Patterns**:
  - `/plans/tenant/`
  - `/plans/buyer/`
  - `/plans/landlord/`
  - `/plans/seller/`
  - `/plans/agent/`
  - `/plans/pg_owner/`
- **Features & Comparison**:
  - Free Tier: 2 contact numbers, standard listing visibility.
  - Assisted / Premium Plans: Direct owner contact credits (25-50 numbers), relationship manager assistance, top listing badge, instant WhatsApp alerts for new matching properties.
  - Payment Flow: Razorpay / Cashfree integration modal -> Webhook confirmation -> Plan activation.

---

### 2.7 Real Estate Calculators & Tools
- **Route Patterns**:
  1. `/home-loan-emi-calculator-hmemic/`: Loan amount, interest rate, tenure -> Monthly EMI, Total Interest, Amortization chart.
  2. `/stamp-duty-calculator-hmsd/`: State/City, property value, gender -> Exact Stamp duty & Registration charges.
  3. `/home-loan-eligibility-calculator-hmhlec/`: Monthly income, existing EMIs, tenure -> Max loan amount.
  4. `/capital-gains-tax-calculator-hmcgtc/`: Purchase price, sale price, holding period -> LTCG/STCG tax liability.
  5. `/rent-receipt-generator-hmrrg/`: Tenant name, landlord name & PAN, rent amount, period -> Downloadable PDF rent receipts for HRA tax exemption.
  6. `/rent-agreement-generator-hmrag/`: Step-by-step digital rent agreement creator with customized clauses -> Draft preview & downloadable PDF.
  7. `/vastu-score-calculator-hmvsc/`: Entrance facing, kitchen direction, master bedroom -> Vastu compatibility score (0-100%).
  8. `/compare-property-prices-hmcpp/`: Side-by-side comparison of 2-3 properties across price/sq.ft, amenities, location.
  9. `/property-rate-trends-hmprt/`: Historical price trends per sq.ft by city and locality over 1, 3, 5 years.
  10. `/locality-guide-hmlg/`: In-depth locality reviews, livability scores, safety, infrastructure, commute times.
  11. `/circle-rate-hmcrr/`: Government circle rates by zone/locality.
  12. `/area-converter-hmac/`: Square feet, square yards, square meters, acres, bigha, gaj converter.

---

### 2.8 Content & Static Pages
- `/blog/`: Real estate articles, buying guides, market news.
- `/help/about/`: Company mission, zero brokerage model, founders.
- `/help/faq/`: Comprehensive customer FAQ.
- `/help/privacy-policy/`: Data collection, storage, cookie policies.
- `/help/terms-and-conditions/`: Platform terms, user obligations, listing guidelines.
- `/help/safety-guide/`: Guidelines for preventing fraud, inspection checklist, payment safety tips.
- `/help/support/`: Customer support contact form, email, helpline hours.

---

## 3. SEO & Dynamic Route Matrix

| Route Pattern | Next.js App Router Path | SEO Strategy | Meta Title Template | Canonical |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `app/page.tsx` | SSR | `HexaHome: Buy, Rent, Sell Properties & PG with Zero Brokerage` | `https://www.hexahome.in/` |
| **City Landing** | `app/[city]/page.tsx` | ISR | `Properties in {City} - Buy, Rent, PG & Commercial - HexaHome` | `https://www.hexahome.in/{city}/` |
| **Rental Category** | `app/[slug]-hmfr/page.tsx` | SSR / ISR | `{Category} in {Locality}, {City} - Rent without Brokerage` | `https://www.hexahome.in/{slug}-hmfr/` |
| **Sale Category** | `app/[slug]-hmfs/page.tsx` | SSR / ISR | `{Category} for Sale in {Locality}, {City} - HexaHome` | `https://www.hexahome.in/{slug}-hmfs/` |
| **Property Details**| `app/property-details/[slug]-id-[shortId]/page.tsx` | SSR + Dynamic Metadata | `{BHK} {Type} for {Ad} in {Locality}, {City} - HexaHome ID {shortId}` | `https://www.hexahome.in/property-details/...` |
| **Search Filter** | `app/search/[...params]/page.tsx` | Client SSR with URL query | `Search {adType} Properties in {City} - Filters & Map - HexaHome` | `noindex, follow` (for deep param filters) |
| **Calculators** | `app/[toolName]/page.tsx` | SSG / ISR | `{Tool Name} - Online Real Estate Calculator - HexaHome` | `https://www.hexahome.in/{toolName}/` |
