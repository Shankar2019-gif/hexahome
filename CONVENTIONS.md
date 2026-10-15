# HexaHome Engineering Conventions

## 1. Architectural Integrity (Onion Architecture)
- **Domain**: Pure Java. Zero imports of Spring, JPA, or Hibernate. Plain Java business models, exceptions, and policies.
- **Application**: 
  - Inbound Ports (`port.in.*`): Use cases declared as pure interfaces.
  - Outbound Ports (`port.out.*`): Infrastructure interfaces (e.g. AuditLogPort, StoragePort, PaymentGatewayPort).
  - DTOs: Grouped by domain context (`auth`, `billing`, `content`, `engagement`, `lead`, `location`, `media`, `meta`, `property`, `user`, `admin`).
  - Application Services: Implement Inbound Ports and orchestrate transactions, domain rules, and outbound ports.
- **Persistence**: Entities mapped strictly to PostgreSQL tables. `@BatchSize(size = 25)` on lazy collections. Zero JPA entities exposed directly in REST controllers or API responses.
- **Presentation**: REST controllers communicate only through Inbound Ports (`*UseCase`). All endpoints produce `ApiResponse<T>`.
- **Infrastructure**: Security filters, JWT providers, storage adapters, external gateways.

## 2. Database & Migrations
- PostgreSQL with `spring.jpa.hibernate.ddl-auto=validate`.
- Every schema change must be written as a versioned Flyway migration script in `backend/src/main/resources/db/migration/`.
- Never mutate, drop, or rename existing columns. Never modify historical migrations.
- Version naming: `V{next_number}__{descriptive_name}.sql` (Next: `V6__...`).
- UUID for transactional entities (`User`, `Property`, `Lead`, `Payment`, `AdminUser`, `AdminAuditLog`); SERIAL integer for master dictionaries.

## 3. Admin Authentication & RBAC
- Admin API base routes: `/api/admin/**`.
- Admin roles: `ROLE_SUPER_ADMIN`, `ROLE_MODERATOR`, `ROLE_SUPPORT`, `ROLE_SALES`, `ROLE_CONTENT`.
- Dedicated `admin_users` and `admin_refresh_tokens` tables completely separated from platform users.
- Short-lived JWT access token (15 mins); refresh token hashes stored and rotated upon every use.
- Authorization enforced via `@PreAuthorize` on controller and service boundaries.
- Rate limit failed login attempts.

## 4. Audit Logging
- Every administrative mutation must log an audit entry via `AuditLogPort`.
- Required fields: `adminId`, `action`, `entityType`, `entityId`, `previousValue`, `newValue`, `reason`, `ipAddress`, `timestamp`, `outcome`.
- No credentials, unmasked PII, or tokens in audit logs.
- Transaction consistency: Audit record is bound to the transaction lifecycle; failed mutations do not produce misleading success audits.

## 5. AWS S3 Storage
- Use AWS SDK v2 (`software.amazon.awssdk.services.s3`).
- Presigned upload endpoint: `POST /api/admin/files/presign`.
- Strict validation of file types (JPEG, PNG, WebP only), size limits, and folder allowlists.
- Object key format: `folder/yyyy-MM/uuid.ext`.
- Non-public private S3 bucket configuration with signed URLs or CloudFront distribution.

## 6. Frontend & UI System
- Enterprise, data-dense layout.
- Primary Brand Color: `#033487` (`brand-300`). Subtle borders: `#dddddd` (`dark-100`). 4px grid spacing. Minimal visual noise.
- Every data view handles 4 explicit states: Loading, Empty, Error, Unauthorized.
- Centralized Axios calls with 401 token refresh queue to eliminate token-rotation race conditions.
- Reusable components: DataTable, StatusBadge, FilterBar, ConfirmDialog, RoleGuard.
