# ── Build Stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time environment variables
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_APP_NAME

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Install dependencies (leverage Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ── Runtime Stage ─────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

LABEL maintainer="Smart Inventory ERP Team"
LABEL description="Smart Inventory ERP — React Frontend"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config for SPA routing
COPY --from=builder /app/dist /usr/share/nginx/html

# Inline SPA-aware nginx site config
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React SPA — always serve index.html for any path
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /ping {
        return 200 "pong\n";
        add_header Content-Type text/plain;
    }
}
EOF

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ping || exit 1

CMD ["nginx", "-g", "daemon off;"]
