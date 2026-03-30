# ==============================================
# Frontend Dockerfile — Angular 19 + Nginx
# outputPath: dist/academy-app-frontend
# Archivos estáticos SPA en: dist/academy-app-frontend/browser/
# ==============================================

# Etapa 1: Build Angular
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar gestores de dependencias primero para cachear la capa
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --legacy-peer-deps

# Copiar fuentes y construir en modo producción
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine AS runtime

# Reemplazar configuración por defecto con la del proyecto
COPY --from=builder /app/dist/academy-app-frontend/browser/ /usr/share/nginx/html/

# Copiar configuración Nginx (SPA routing + security headers + gzip)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
