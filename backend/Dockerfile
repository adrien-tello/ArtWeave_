FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src/

RUN npm install --prefer-offline --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 --fetch-retries 5

# 1. Generate Prisma client into src/generated/prisma (types needed by tsc)
RUN PRISMA_CLI_QUERY_ENGINE_TYPE=none \
    DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx prisma generate --config prisma.config.ts

# 2. Compile TypeScript (src/ -> dist/)
RUN npm run build

# 3. Copy generated client into dist/ so runtime can resolve ../generated/prisma from dist/db/
RUN cp -r src/generated dist/generated

# ── Runtime image ──────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install --omit=dev --prefer-offline --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 --fetch-retries 5

# dist/ contains compiled JS + generated Prisma client
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy --schema prisma/schema.prisma --url ${DATABASE_URL:-postgresql://ecommerce_user:TKcooporation12@kscgkggcc4sssskgc8ogokcw:5432/ecommerce_db} && node dist/index.js"]
