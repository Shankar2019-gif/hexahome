# HexaHome Frontend

HexaHome real estate platform frontend application built with React 19, Vite, and Lucide React.

---

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS & Custom Design System (`hexahome-ref.css`, `App.css`)
- **HTTP Client**: Axios with centralized request/response interceptors & token rotation
- **Icons**: Lucide React
- **Linter**: Oxlint
- **Production Server**: Nginx Alpine

---

## 📂 Project Structure

```text
frontend/
├── dist/                  # Production build output
├── node_modules/          # Node dependencies
├── public/                # Static assets (images, icons, webp banners)
├── src/
│   ├── components/        # Reusable UI components & section blocks
│   │   ├── auth/          # Authentication modals & forms
│   │   ├── property/      # Property post wizard & listing cards
│   ├── data/              # Static data, mock listings, city data
│   ├── hooks/             # Custom React hooks (e.g. usePropertyForm)
│   ├── pages/             # Route views (HomePage, AuthPage, PostPropertyPage)
│   ├── services/          # API layer (apiClient.js, api.js)
│   ├── App.css            # Global component styling
│   ├── App.jsx            # Main app router & layout wrapper
│   ├── hexahome-ref.css   # Reference design tokens & color schemes
│   ├── index.css          # Core CSS reset & typography
│   └── main.jsx           # React DOM root entry point
├── .dockerignore          # Docker build exclusion rules
├── .gitignore             # Git ignore patterns
├── .oxlintrc.json         # Oxlint linting configuration
├── Dockerfile             # Multi-stage production build (Node + Nginx)
├── index.html             # HTML5 entry template
├── nginx.conf             # Production Nginx reverse proxy configuration
├── package.json           # Frontend package manifests and scripts
├── package-lock.json      # Locked dependency tree
└── vite.config.js         # Vite configuration with backend API proxy
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Runs on [http://localhost:8085](http://localhost:8085). Requests to `/api` and `/uploads` are automatically proxied to the backend at `http://127.0.0.1:8081`.

### Production Build

```bash
npm run build
```

Build outputs are compiled into `frontend/dist/`.

### Linting

```bash
npm run lint
```
