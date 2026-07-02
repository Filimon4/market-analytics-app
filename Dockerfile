# Stage 1: Build — install all deps, generate Prisma client, compile TypeScript
FROM node:24-alpine AS builder

WORKDIR /app

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build


# Stage 2: Runner — production deps only, copy compiled artifacts
FROM node:24-alpine AS runner

WORKDIR /app

ENV DATABASE_URL=""
ENV HTTP_DOMAIN=""
ENV HTTP_HOST=""
ENV HTTP_PORT=""
ENV HTTP_OPEN_API_PREFIX=""
ENV JWT_SECRET=""
ENV JWT_ACCESS_EXPIRES=""
ENV JWT_REFRESH_EXPIRES=""
ENV RESEND_API_KEY=""

COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated Prisma client (created during build stage)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma CLI from builder so we can run migrate deploy at startup
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Copy Prisma schema and migrations (needed for migrate deploy)
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy compiled application
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3501

CMD ["sh", "-c", "node dist/main"]
