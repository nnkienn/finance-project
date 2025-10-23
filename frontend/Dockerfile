# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Chọn file env để nhúng vào build (NEXT_PUBLIC_* sẽ được embed)
# Mặc định dùng .env.prod; có thể override bằng --build-arg ENV_FILE=.env.dev
ARG ENV_FILE=.env.prod
RUN if [ -f "$ENV_FILE" ]; then cp "$ENV_FILE" .env.production; fi

# Build Next (đã có output: 'standalone' trong next.config.ts)
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# (nếu dùng next/image với sharp, cần libc6-compat trên Alpine)
RUN apk add --no-cache libc6-compat

# Copy đúng layout standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# User không phải root
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
