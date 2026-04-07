# Dockerfile para la aplicación MEAN de Remisiones IT TOCSA S.A.

# Etapa 1: Construcción del Frontend (Angular)
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Etapa 2: Construcción del Backend (Node.js/Express)
FROM node:20-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Etapa 3: Entorno de Producción
FROM node:20-alpine
WORKDIR /app

# Copiar dependencias de producción del backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Instalar variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Copiar el código compilado del backend y frontend
COPY --from=build-backend /app/backend/dist ./dist
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

# Exponer el puerto
EXPOSE 3000

# Iniciar servidor
CMD ["node", "dist/server.js"]
