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

ARG DATABASE_URL
ARG HTTP_DOMAIN
ARG HTTP_HOST
ARG HTTP_PORT
ARG NODE_ENV
ARG HTTP_OPEN_API_PREFIX
ARG JWT_SECRET
ARG JWT_ACCESS_EXPIRES
ARG JWT_REFRESH_EXPIRES
ARG RESEND_API_KEY

COPY package*.json ./
RUN npm ci --omit=dev

ENV DATABASE_URL=${DATABASE_URL}
ENV HTTP_DOMAIN=${HTTP_DOMAIN}
ENV HTTP_HOST=${HTTP_HOST}
ENV HTTP_PORT=${HTTP_PORT}
ENV NODE_ENV=${NODE_ENV}
ENV HTTP_OPEN_API_PREFIX=${HTTP_OPEN_API_PREFIX}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_ACCESS_EXPIRES=${JWT_ACCESS_EXPIRES}
ENV JWT_REFRESH_EXPIRES=${JWT_REFRESH_EXPIRES}
ENV RESEND_API_KEY=${RESEND_API_KEY}

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

CMD ["node", "dist/main"]
