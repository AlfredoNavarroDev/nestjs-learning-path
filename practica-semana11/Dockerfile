# ── Etapa 1: build ───────────────────────────────────────────────────────
# Imagen completa (con devDependencies) solo para compilar TS -> JS.
# ── TODO 1: FROM node:20-alpine AS build ──
# ── TODO 2: WORKDIR /app ──

COPY package*.json ./
RUN npm ci

COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ── Etapa 2: producción ─────────────────────────────────────────────────
# Imagen final: solo dependencias de producción + el dist compilado. Esto
# es lo que reduce el tamaño de la imagen final frente a copiar todo el
# proyecto con node_modules de dev incluidos.
# ── TODO 3: FROM node:20-alpine AS production ──
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# ── TODO 4: COPY --from=build /app/dist ./dist ──
RUN mkdir -p uploads/portadas

EXPOSE 3000
CMD ["node", "dist/main"]
