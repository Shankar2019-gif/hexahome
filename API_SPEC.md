# HexaHome Backend API Specification & Contract (Phase 2 Deliverable)

Backend Engine: Java 21, Spring Boot 3, Spring Security (JWT Access + Refresh Rotation), PostgreSQL + PostGIS, Redis (OTP TTL + Rate Limiting), AWS S3 + CloudFront.

---

## 1. Authentication & Security Architecture

### 1.1 Auth Flow Overview
1. **Passwordless OTP**: Users log in exclusively using their 10-digit Indian mobile number.
2. **OTP Generation**:
   - 6-digit numeric OTP generated via cryptographically secure pseudo-random generator.
   - Stored in Redis with key `otp:{phone}` and TTL = 300 seconds (5 minutes).
   - Rate limiting: Max 3 OTP requests per 10 minutes per IP/Phone via Redis sliding window counter.
   - Max 3 invalid verification attempts before the OTP is invalidated.
3. **JWT Token Issuance**:
   - **Access Token**: Short-lived (15 minutes). Contains `sub` (userId), `phone`, `role`, `authorities`.
   - **Refresh Token**: Long-lived (7 days). Stored as an HTTP-only secure cookie or secure header, with hash stored in Redis/DB (`refresh_tokens` table) to support instantaneous revocation and token rotation.
4. **Roles & Authorities**:
   - `ROLE_TENANT`
   - `ROLE_BUYER`
   - `ROLE_OWNER`
   - `ROLE_LANDLORD`
   - `ROLE_AGENT`
   - `ROLE_PG_OWNER`
   - `ROLE_PG_SEEKER`
   - `ROLE_ADMIN`

---

## 2. API Endpoints by Domain

### 2.1 Auth Module (`/api/auth`)

#### `POST /api/auth/send-otp`
- **Trigger**: Login modal, Post Property verification, Lead view verification.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "phone": "9876543210"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to +91 9876543210",
    "expiresInSeconds": 300
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "INVALID_PHONE_NUMBER", "message": "Phone number must be a valid 10-digit Indian number"}`
  - `429 Too Many Requests`: `{"error": "RATE_LIMIT_EXCEEDED", "message": "Too many OTP requests. Try again after 10 minutes"}`

#### `POST /api/auth/verify-otp/`
- **Trigger**: Entering 6-digit OTP in verification modal.
- **Request Body**:
  ```json
  {
    "phone": "9876543210",
    "otp": "458921",
    "role": "TENANT"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d8e3c12a-89a1-432a-bc91-23e5a782b891",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "usr_98a72b11",
      "phone": "9876543210",
      "name": "Arun Kumar",
      "email": "arun@example.com",
      "role": "TENANT",
      "isVerified": true,
      "profilePicUrl": "https://img.hexahome.in/media/users/usr_98a72b11.webp",
      "createdAt": "2026-03-15T10:20:00Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "INVALID_OTP", "message": "The OTP entered is incorrect. 2 attempts remaining"}`
  - `410 Gone`: `{"error": "OTP_EXPIRED", "message": "The OTP has expired. Please request a new OTP"}`

#### `POST /api/auth/refresh-token`
- **Request Body**:
  ```json
  {
    "refreshToken": "d8e3c12a-89a1-432a-bc91-23e5a782b891"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "f12c98a3-412e-4b21-9a1b-90f1283c7123",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
  ```

#### `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response 200 OK**: `{"success": true, "message": "Logged out successfully"}`

---

### 2.2 User Profile & Account (`/v1/user`)

#### `GET /v1/user/profile`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response 200 OK**:
  ```json
  {
    "id": "usr_98a72b11",
    "phone": "9876543210",
    "name": "Arun Kumar",
    "email": "arun@example.com",
    "role": "TENANT",
    "activeSubscription": {
      "planId": "plan_tenant_pro",
      "name": "Tenant Assisted Pro",
      "totalCredits": 25,
      "remainingCredits": 19,
      "validUntil": "2026-11-15T23:59:59Z"
    }
  }
  ```

#### `PUT /v1/user/profile`
- **Request Body**:
  ```json
  {
    "name": "Arun K. Sharma",
    "email": "arun.sharma@example.com",
    "city": "Coimbatore"
  }
  ```

#### `GET /v1/user/wishlist` & `POST /v1/user/wishlist/{propertyId}` & `DELETE /v1/user/wishlist/{propertyId}`
- Wishlist CRUD for saving/bookmarking properties.

#### `GET /v1/user/saved-searches` & `POST /v1/user/saved-searches`
- Allows users to save alert filters for real-time WhatsApp/Email notifications.

---

### 2.3 Property Search & Discovery (`/v1/property`)

#### `GET /v1/property/search`
- **Trigger**: Search results page, filter adjustments, map move.
- **Query Parameters**:
  - `city` (string, required): e.g. `Coimbatore`
  - `adType` (string, required): `rent` | `sale` | `plot` | `pg`
  - `propertyType` (string): `flat`, `independent_house`, `villa`, `builder_floor`, `office`, `shop`, `plot`
  - `bhk` (string): comma-separated, e.g. `1BHK,2BHK,3BHK`
  - `minPrice`, `maxPrice` (number)
  - `minArea`, `maxArea` (number, in sq.ft)
  - `furnishing` (string): `fully_furnished`, `semi_furnished`, `unfurnished`
  - `preferredTenant` (string): `family`, `bachelor`, `any`
  - `facing` (string): `north`, `east`, `north_east`, etc.
  - `boundaryWall` (boolean): for plots
  - `verifiedOnly` (boolean)
  - `zeroBrokerage` (boolean)
  - `lat`, `lng`, `radiusKm` (number): for geolocation-based radius search
  - `sortBy` (string): `relevance` | `price_asc` | `price_desc` | `date_desc`
  - `page` (int, default: 1), `limit` (int, default: 20)
- **Response 200 OK**:
  ```json
  {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "properties": [
      {
        "id": "prop_99182",
        "shortId": "XAT594",
        "slug": "3bhk-flat-apartment-for-rent-in-peelamedu-coimbatore",
        "title": "3 BHK Spacious Apartment with Modular Kitchen",
        "adType": "rent",
        "propertyType": "flat",
        "price": 28000,
        "deposit": 100000,
        "bhk": "3 BHK",
        "baths": 3,
        "builtUpArea": 1650,
        "carpetArea": 1380,
        "furnishing": "semi_furnished",
        "locality": "Peelamedu",
        "city": "Coimbatore",
        "isVerified": true,
        "isZeroBrokerage": true,
        "isHotDeal": false,
        "availableFrom": "2026-11-01",
        "coverImage": "https://img.hexahome.in/media/properties/prop_99182/cover.webp",
        "imagesCount": 8,
        "coordinates": {
          "lat": 11.0267,
          "lng": 77.0028
        },
        "postedAt": "2026-10-05T09:30:00Z"
      }
    ]
  }
  ```

#### `GET /v1/property/{slugOrShortId}`
- **Trigger**: Property Details page.
- **Response 200 OK**: Full specification object including owner details (redacted phone unless authorized), complete gallery URLs, society details, amenities checklist, and GPS coordinates.

#### `GET /v1/property/similar-ads`
- **Query Params**: `propertyId={id}&city={city}&limit=6`

---

### 2.4 Property CRUD & Owner Management (`/v1/property`)

#### `POST /v1/property`
- **Trigger**: Post Property form submission.
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "adType": "rent",
    "propertyType": "flat",
    "city": "Coimbatore",
    "locality": "Peelamedu",
    "address": "42, Green Avenue, Near PSG Tech",
    "latitude": 11.0267,
    "longitude": 77.0028,
    "bhk": "3 BHK",
    "bedrooms": 3,
    "bathrooms": 3,
    "balconies": 2,
    "builtUpArea": 1650,
    "carpetArea": 1380,
    "floorNumber": 4,
    "totalFloors": 10,
    "facing": "east",
    "furnishing": "semi_furnished",
    "price": 28000,
    "deposit": 100000,
    "maintenanceCharges": 2500,
    "isMaintenanceIncluded": false,
    "availableFrom": "2026-11-01",
    "preferredTenant": "family",
    "amenities": ["LIFT", "COVERED_PARKING", "POWER_BACKUP", "SECURITY", "GYM"],
    "description": "Well ventilated East facing apartment with piped gas and power backup.",
    "images": [
      "https://img.hexahome.in/media/properties/temp/img1.webp",
      "https://img.hexahome.in/media/properties/temp/img2.webp"
    ]
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": "prop_99182",
    "shortId": "XAT594",
    "slug": "3bhk-flat-apartment-for-rent-in-peelamedu-coimbatore-id-XAT594",
    "status": "PENDING_VERIFICATION",
    "message": "Property listed successfully and scheduled for automated verification"
  }
  ```

#### `PUT /v1/property/{id}`
- Update property details or images.

#### `DELETE /v1/property/{id}`
- Unpublish / soft-delete property.

#### `POST /v1/property/{id}/renew`
- Renew an expired listing for another 30/60 days.

#### `GET /v1/property/user`
- List all properties owned by the authenticated user.

---

### 2.5 Media Upload (`/v1/upload-signed-url`)

#### `POST /v1/upload-signed-url/property`
- **Request Body**:
  ```json
  {
    "fileName": "bedroom_view.jpg",
    "contentType": "image/jpeg",
    "fileSizeBytes": 2450800
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "uploadUrl": "https://hexahome-uploads.s3.ap-south-1.amazonaws.com/raw/properties/temp/98a72b11-bedroom_view.jpg?AWSAccessKeyId=...",
    "fileKey": "raw/properties/temp/98a72b11-bedroom_view.jpg",
    "publicWebpUrl": "https://img.hexahome.in/media/properties/temp/98a72b11-bedroom_view.webp"
  }
  ```
- **Note**: Upload occurs directly to S3 via PUT `uploadUrl`. An S3 Event triggers async Lambda/worker to resize images into thumbnail (200x150), medium (600x400), large (1200x800) WebP formats.

---

### 2.6 Leads, Inquiries & Quota (`/v1/leads`)

#### `POST /v1/property/{id}/view-number`
- **Trigger**: Click "View Phone Number" on a property card or details page.
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "ownerPhone": "+91 9842109876",
    "ownerName": "K. Venkatesh",
    "remainingCredits": 18,
    "deductedCredit": 1
  }
  ```
- **Error Response**:
  - `402 Payment Required`: `{"error": "QUOTA_EXHAUSTED", "message": "You have exhausted your owner contact credits. Upgrade your plan to view more numbers", "upgradeUrl": "/plans/tenant/"}`

#### `POST /v1/property/{id}/contact`
- Send inquiry/lead to owner with user's details.

#### `POST /v1/property/{id}/request-photos`
- Notify owner via push/WhatsApp to add photos when < 3 photos exist.

#### `GET /v1/leads`
- Dashboard API for property owners to see all inquiries received on their listings.

---

### 2.7 Plans, Subscriptions & Payments (`/v1/subscriptions`)

#### `GET /v1/plans`
- **Query Params**: `role={tenant|buyer|seller|landlord|agent|pg_owner}`
- **Response 200 OK**: List of available plans, credit quotas, pricing in INR, duration in days.

#### `POST /v1/subscriptions/create-order`
- **Request Body**: `{"planId": "plan_tenant_gold", "gateway": "RAZORPAY"}`
- **Response 200 OK**: `{"orderId": "order_RzP129381", "amount": 149900, "currency": "INR", "key": "rzp_live_..."}`

#### `POST /v1/subscriptions/verify-payment`
- Verifies Razorpay signature and activates credits.

#### `POST /v1/webhooks/payment`
- Asynchronous idempotency webhook for payment callbacks.

---

### 2.8 CMS, City & Locality Tools (`/v1/tools` & `/v1/cms`)

#### `GET /v1/property/rate-trends`
- Historical price per sq.ft data points for charts.

#### `GET /v1/circle-rates`
- Government circle rates by zone/locality.

#### `POST /v1/tools/rent-agreement/generate-pdf`
- Generates downloadable PDF rent agreement from form inputs.

#### `POST /v1/reports`
- Report listing abuse, fake property, or already rented status.
