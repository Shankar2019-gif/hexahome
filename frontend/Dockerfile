# ==============================================================================
# HexaHome Frontend Dockerfile - Multi-Stage Production Build
# Framework: React 19 • Vite • Tailored Nginx Alpine Server
# ==============================================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies with clean install using locked versions
COPY package.json package-lock.json ./
RUN npm ci

# Copy project source and build static bundle
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.27-alpine AS runtime

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy optimized nginx reverse proxy & SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Basic container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
