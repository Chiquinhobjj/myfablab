# Build stage para otimização
FROM node:20-alpine AS builder

# Instalar nginx e ferramentas de build
RUN apk add --no-cache nginx gettext

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos estáticos
COPY index.html app.js style.css ./public/
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY entrypoint.sh /entrypoint.sh

# Tornar entrypoint executável
RUN chmod +x /entrypoint.sh

# Stage de produção
FROM nginx:alpine

# Instalar ferramentas necessárias
RUN apk add --no-cache gettext bash curl

# Copiar configurações e arquivos
COPY --from=builder /app/public /usr/share/nginx/html
COPY --from=builder /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=builder /etc/nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=builder /entrypoint.sh /entrypoint.sh

# Garantir permissões corretas
RUN chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chmod 644 /var/run/nginx.pid

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Comentado para resolver problema de permissões
# USER nginx-user

# Usar entrypoint customizado
ENTRYPOINT ["/entrypoint.sh"]