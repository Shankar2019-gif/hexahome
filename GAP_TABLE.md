# HexaHome Comprehensive Gap Analysis (Phase 3 Deliverable)

Comparison between Reference Architecture ([SITEMAP.md](./SITEMAP.md) & [API_SPEC.md](./API_SPEC.md)) and the current local codebase.

---

## 1. Executive Summary
- **Current State**: A client-side Single Page Application (SPA) built with Vite, React 19, JavaScript (`.jsx`), and static mock data (`src/data/hexahomeData.js`).
- **Required Target**:
  - **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, TanStack React Query, React Hook Form + Zod, Google Maps JavaScript API, full SSR/ISR SEO.
  - **Backend**: Java 17 / 21, Spring Boot 3, Spring Security (JWT + Refresh Rotation), Spring Data JPA/Hibernate, Flyway, PostgreSQL + PostGIS, Redis (Rate Limiting), AWS S3 + CloudFront.

---

## 2. Core Gap Matrix

| Item | Reference Behaviour | My Status | Files to Change / Create |
| :--- | :--- | :--- | :--- |
| **Framework & Engine** | Next.js App Router (SSR, ISR, dynamic route segments, `generateMetadata`, server components) | **Wrong** (Vite SPA with `main.jsx` and client-only rendering) | Convert project structure to Next.js App Router / TypeScript (`app/layout.tsx`, `app/page.tsx`) |
| **Language & Types** | Strict TypeScript (`.ts`, `.tsx`), typed DTOs and Zod schema validations | **Missing** (Pure JavaScript `.jsx`) | Add `tsconfig.json`, define schema types |
| **Backend Service** | Java 21, Spring Boot 3 layered architecture (Controller -> Service -> Repository), Springdoc OpenAPI | **Missing** (Backend not started) | Initialize Spring Boot 3 project in `backend/` |
| **Database & Geo** | PostgreSQL 16 + PostGIS (`geography(Point)`), tsvector full-text search, trigram autocomplete, Flyway migrations | **Missing** (No database, hardcoded mock JSON) | Initialize Flyway migrations (`V1__init_schema.sql`), PostGIS queries |
| **Auth & Security** | Username/Email/Mobile + Password Auth, BCrypt hashing, JWT Access + Refresh rotation, RBAC | **Done** | Spring Security JWT module, BCrypt password encoder, Refresh token handler |
| **Header Component** | Dynamic city selector with 50+ cities, category links, role-based user avatar menu, Login trigger | **Partial** (`Header.jsx` exists, but has static city selector and mock login trigger without auth state) | `src/components/Header.jsx` |
| **Hero & Search Bar** | Category tabs (Rent, Buy, Commercial, PG, Plots), Location autocomplete with Google Places / backend API, BHK & budget filters | **Partial** (`Hero.jsx` exists with tabs, but lacks live backend autocomplete and router navigation) | `src/components/Hero.jsx` |
| **Commercial Offerings (Desktop)** | 2-column layout: Left (headline + "Explore Commercial Properties" button), Right (3x2 grid with tall card for Office Space) | **Wrong** (Single 5-column row without left column/CTA button) | `src/components/CommercialOfferings.jsx` |
| **Commercial Offerings (Mobile)** | Horizontal scrolling strip with cards (`w-[120px] h-[140px]`) | **Done** (Matches reference) | `src/components/CommercialOfferings.jsx` |
| **Properties for Rent Section** | Category showcase (5 cards: Apartments for Rent, 2 & 3 BHK Houses, Budget friendly Homes, Homes for Family, Homes for Bachelor) linking to category SEO pages | **Wrong** (Renders individual property listing cards with local filter pills instead of category showcase) | `src/components/PropertiesForRent.jsx` |
| **Dual Action Banners** | 2 cards: "Looking for Buyers/Tenants!" and "Need Assistance to Post Property?" | **Done** (Positioned and styled identically) | `src/components/ActionBanners.jsx` |
| **App Download Banner** | Blueprint grid SVG, feature list, QR code with download badges, responsive smartphone 3D mockup | **Done** (Pixel-perfect clone completed) | `src/components/AppDownloadBanner.jsx`, `src/App.css` |
| **PG Section** | PG cards with explore button and image overlays | **Done** (Matches reference) | `src/components/PgSection.jsx` |
| **Co-Living Offerings** | Community co-living cards with explore CTA | **Done** (Matches reference) | `src/components/CoLivingOfferings.jsx` |
| **Hot Deal Properties** | High-discount properties with "Hot Deal" tags and pricing breakdown | **Partial** (Uses mock static listings, lacks live API integration) | `src/components/HotDealProperties.jsx` |
| **Plots Section** | Curated plot investment cards | **Done** (Matches visual design) | `src/components/PlotsSection.jsx` |
| **Commercial Properties Sale** | Commercial sale cards | **Done** (Matches visual design) | `src/components/CommercialPropertiesSale.jsx` |
| **Explore Cities Grid** | Top 12 metros grid with property counts | **Done** (Matches reference) | `src/components/ExploreCities.jsx` |
| **How to List Property Guide** | 3-step listing process explanation | **Done** (Matches reference) | `src/components/HowToStepGuide.jsx` |
| **FAQ Accordion** | Interactive collapsible accordion with zero brokerage details | **Done** (Matches reference) | `src/components/FaqSection.jsx` |
| **Testimonials** | Review cards carousel | **Done** (Matches reference) | `src/components/TestimonialsSection.jsx` |
| **Footer** | Multi-column links with extensive city/locality SEO matrices | **Done** (Matches reference) | `src/components/Footer.jsx` |
| **Search / Listing Page** | Dedicated route `/search/property-for-{adType}-in-{city}/`, multi-facet sidebar, sort, map drawer, card stream | **Missing** (No search page exists; clicking search on Hero currently does not navigate) | Create `app/search/[...params]/page.tsx` or Search results component |
| **Property Details Page** | Dedicated route `/property-details/{slug}-id-{shortId}/`, gallery lightbox, specs, amenities, map marker, owner card, view number CTA | **Missing** (No property details route or standalone view) | Create `app/property-details/[slug]/page.tsx` |
| **Post Property Flow** | Dedicated 5-step form (`/post-property/`), React Hook Form + Zod, presigned S3 photo upload progress, draft autosave | **Partial / Missing** (Only a simple single-screen modal in `Modals.jsx`, no 5-step form or file upload) | Create dedicated `app/post-property/page.tsx` |
| **User Dashboard** | Dedicated `/account/` route, My Listings tab, Leads received table, Wishlist (`/account/bookmark/`), Plans view | **Missing** (No user dashboard views) | Create `app/account/page.tsx` and sub-routes |
| **Plans & Pricing Pages** | Dedicated `/plans/{role}/` routes for Tenant, Buyer, Landlord, Seller, Agent with feature tables & checkout | **Missing** (No pricing pages) | Create `app/plans/[role]/page.tsx` |
| **Real Estate Calculators (12 Tools)** | Dedicated routes for EMI, Stamp Duty, Loan Eligibility, Capital Gains, Rent Receipt, Rent Agreement PDF, etc. | **Partial** (`CalculatorsSection.jsx` has basic EMI widget, but lacks dedicated routes and the other 11 calculators) | Create `app/calculators/[tool]/page.tsx` |
| **Rent Agreement PDF Generator** | Form inputs -> Draft preview -> Downloadable legal PDF generation | **Missing** | Backend PDF generator service + frontend form |
| **Lead & Contact Quota System** | View Number tracking with plan quota deduction (e.g. 2 free, then upgrade CTA) | **Missing** (Static mock button) | Backend Leads module + modal quota check |
| **Media Pipeline** | Presigned S3 upload URLs, async image resize into thumbnail/medium/large WebP, CloudFront distribution | **Missing** (Assets currently point to external HexaHome CloudFront/Assets URLs) | Backend S3 service + async worker queue |
| **SEO & SSR Metadata** | Dynamic `generateMetadata` (title, description, canonical, OpenGraph), JSON-LD `RealEstateListing` schema, sitemap generator | **Missing** (Vite client-side HTML only) | Implement in Next.js route segments |

---

## 3. Recommended Phased Implementation Path

1. **Phase 4: Database & Entity Architecture**:
   - Establish PostgreSQL + PostGIS schema (`users`, `roles`, `cities`, `localities`, `properties`, `property_images`, `leads`, `plans`, `subscriptions`).
   - Write Flyway migration scripts (`V1__init_schema.sql`, `V2__seed_data.sql`).
   - Mermaid ERD diagram showing foreign keys, spatial geometry indexes, and full-text search indexes.

2. **Phase 5: Backend Modules (Spring Boot 3)**:
   - Module 1: Project setup, exceptions, CORS, Swagger.
   - Module 2: User Password Auth + JWT Security.
   - Module 3: User profile, wishlist, saved searches.
   - Module 4: Property CRUD & moderation.
   - Module 5: PostGIS geo search & multi-facet filtering.
   - Module 6: S3 presigned upload & media pipeline.
   - Module 7: Leads, view-number quota system.
   - Module 8: Monetization plans & Razorpay payment integration.
   - Module 9: Calculators, CMS, Rent Agreement PDF.

3. **Phase 6: Frontend Integration & Pages (Next.js)**:
   - Page 1: Align existing home page sections (`CommercialOfferings.jsx` desktop 2-column grid, `PropertiesForRent.jsx` category showcase).
   - Page 2: Search & Listing results page with filter drawer and map.
   - Page 3: Property Details page with gallery lightbox and contact modal.
   - Page 4: 5-Step Post Property flow with React Hook Form + Zod.
   - Page 5: User Dashboard (`/account/`).
   - Page 6: Calculators & Tools suite.
