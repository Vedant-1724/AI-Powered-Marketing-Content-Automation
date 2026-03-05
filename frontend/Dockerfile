FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npx vite build

# ── Production image ──
FROM nginx:alpine

# Security: run as non-root
RUN addgroup -S markai && adduser -S markai -G markai

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions
RUN chown -R markai:markai /usr/share/nginx/html && \
    chown -R markai:markai /var/cache/nginx && \
    chown -R markai:markai /var/log/nginx && \
    touch /var/run/nginx.pid && chown markai:markai /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
