# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package.json package-lock.json ./

# Install only dependencies required for build
RUN npm ci

# Copy source code
COPY . .

# Build React application
RUN npm run build


# ─────────────────────────────────────────────
# Stage 2: Production
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output
COPY --from=builder /app/dist /usr/share/nginx/html

# React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]