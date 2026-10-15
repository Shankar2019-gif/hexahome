# HexaHome (Fullstack Real Estate Platform)

HexaHome is a modern, high-performance real estate marketplace platform engineered with a decoupled architecture:
- **Frontend**: React 19 + Vite + Custom Design System + Axios Interceptors
- **Backend**: Java 17 + Spring Boot 3.3.4 + Spring Data JPA + Flyway + PostgreSQL (PostGIS) + Redis
- **Containerization**: Multi-stage Dockerfiles with Docker Compose orchestration

---

## 📁 Repository Architecture

The project is structured into dedicated, isolated tiers:

```text
hexahome/
├── frontend/                     # React 19 Client Application & SPA
│   ├── dist/                     # Production build artifacts
│   ├── public/                   # Static media, icons & assets
│   ├── src/                      # Components, pages, hooks, services
│   ├── .dockerignore             # Frontend Docker ignore rules
│   ├── .gitignore                # Frontend git ignore patterns
│   ├── .oxlintrc.json            # Oxlint configuration
│   ├── Dockerfile                # Production multi-stage Dockerfile (Node -> Nginx)
│   ├── index.html                # Vite HTML entry point
│   ├── nginx.conf                # Nginx production reverse proxy configuration
│   ├── package.json              # Frontend npm dependencies & scripts
│   ├── package-lock.json         # Locked npm dependencies
│   ├── README.md                 # Frontend documentation
│   └── vite.config.js            # Vite configuration with API reverse proxy
│
├── backend/                      # Spring Boot 3.3.4 REST API Service
│   ├── src/
│   │   ├── main/java/            # Controllers, Services, Repositories, Domain models
│   │   └── main/resources/       # application.yml, Flyway database migrations
│   ├── .dockerignore             # Backend Docker ignore rules
│   ├── Dockerfile                # Multi-stage production build (Maven -> Eclipse Temurin 17 JRE)
│   └── pom.xml                   # Maven dependencies and plugin configuration
│
├── gateway/                      # Spring Cloud Gateway (Reactive Edge API Gateway)
│   ├── src/
│   │   ├── main/java/            # JWT verification, Redis rate limiter, request logging
│   │   └── main/resources/       # application.yml routing predicates & CORS
│   ├── .dockerignore             # Gateway Docker ignore rules
│   ├── Dockerfile                # Multi-stage production build (Maven -> Eclipse Temurin 17 JRE)
│   └── pom.xml                   # Spring Cloud Gateway 2023.0.3 dependencies
│
├── .dockerignore                 # Root monorepo Docker ignore configuration
├── .env.example                  # Environment configuration template
├── .gitignore                    # Root monorepo Git ignore configuration
├── docker-compose.yml            # Complete stack orchestration (Postgres, Redis, Backend, Gateway, Frontend)
├── package.json                  # Root workspace helper scripts
├── API_SPEC.md                   # REST API contract specifications
├── ERD.md                        # Entity-relationship schema documentation
├── GAP_TABLE.md                  # Implementation gap analysis
├── openapi.yaml                  # OpenAPI 3.0 specification definition
├── README.md                     # Monorepo documentation
└── SITEMAP.md                    # Site routing and architecture map
```

---

## ⚡ Quick Start

### 1. Unified Docker Compose (Recommended)

Run the entire platform (PostgreSQL, Redis, Spring Boot Backend, Spring Cloud Gateway, React Frontend) with one command:

```bash
docker compose up --build -d
```

- **Frontend**: [http://localhost:80](http://localhost:80) or [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **API Gateway Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- **Backend API**: [http://localhost:8081/api/v1](http://localhost:8081/api/v1)
- **Swagger / OpenAPI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **PostgreSQL (PostGIS)**: `localhost:5432`
- **Redis**: `localhost:6379`

### 2. Local Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Or from the root directory:
```bash
npm run frontend:dev
```

The Vite dev server will start at `http://localhost:8085` and proxy `/api/*` and `/uploads/*` requests to the local backend at `http://localhost:8081`.

### 3. Local Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

Ensure PostgreSQL (with PostGIS) and Redis are running locally or via Docker.

---

## 🛡️ HexaHome Admin Operations Console

The platform includes a dedicated, production-grade administrative command center isolated from public customer sessions:

- **Admin URL**: `http://localhost:8085/admin` or `http://localhost/admin`
- **Default Bootstrap Credentials**:
  - **Username**: `admin`
  - **Password**: `Admin@HexaHome2025`
  - **Role**: `SUPER_ADMIN`

### Administrative Modules:
1. **Operational Dashboard** (`/admin/dashboard`): Platform vitals, real-time KPI metrics, pending moderation alerts, and live activity stream.
2. **Property Moderation** (`/admin/properties`): Listing review queue, approval, rejection with mandatory feedback, hot deal toggling, and bulk actions.
3. **User Management** (`/admin/users`): Account search, role filtering, suspension/reactivation, and audited PII revelation (restricted to Super Admin).
4. **Lead Pipeline** (`/admin/leads`): Inquiry tracking, sales representative assignment, status progression, and RFC-4180 CSV streaming export.
5. **Plans & Billing** (`/admin/billing`): Customer subscriptions, validity extensions (+days), contact credit grants, and Razorpay payment transaction browser.
6. **Content & Media** (`/admin/content`): Geographies (cities & localities), FAQs management, listing abuse reports moderation, and AWS S3 presigned PUT upload URL generator.
7. **System & Audit** (`/admin/system`): Immutable tamper-evident audit log viewer with state diffs, administrative staff account provisioning, and live JVM runtime memory/CPU diagnostics.
