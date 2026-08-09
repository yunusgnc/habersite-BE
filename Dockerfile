# syntax=docker/dockerfile:1.7

# ─── BUILDER ─────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .
RUN npm run build

RUN npm prune --omit=dev

# ─── RUNNER ──────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat openssl tini

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node dist/main.js"]
