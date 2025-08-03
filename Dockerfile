# Build stage para Node.js
FROM node:18-alpine as builder

WORKDIR /app

# Copiar e instalar dependências do backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Stage final
FROM nginx:alpine

# Instalar Node.js no nginx para rodar o backend
RUN apk add --no-cache nodejs npm curl

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

# Copiar arquivos estáticos para o nginx
COPY index.html /usr/share/nginx/html/
COPY fix-app.js /usr/share/nginx/html/
COPY fix-styles.css /usr/share/nginx/html/
COPY index-*.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY sw.js /usr/share/nginx/html/
COPY config/ /usr/share/nginx/html/config/
COPY components/ /usr/share/nginx/html/components/
COPY styles/ /usr/share/nginx/html/styles/

# Copiar backend
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY backend/ /app/backend/

# Copiar script de inicialização
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expor portas
EXPOSE 80 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Iniciar ambos os serviços
CMD ["/docker-entrypoint.sh"]