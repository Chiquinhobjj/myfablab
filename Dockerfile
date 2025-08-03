# Use a imagem oficial do Nginx
FROM nginx:alpine

# Instalar ferramentas necessárias
RUN apk add --no-cache gettext bash curl

# Copiar arquivos da aplicação
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY fix-styles.css /usr/share/nginx/html/
COPY fix-app.js /usr/share/nginx/html/
COPY health.html /usr/share/nginx/html/health
COPY deploy-check.txt /usr/share/nginx/html/

# Copiar diretórios
COPY config/ /usr/share/nginx/html/config/
COPY components/ /usr/share/nginx/html/components/
COPY styles/ /usr/share/nginx/html/styles/

# Copiar configurações
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY entrypoint.sh /entrypoint.sh

# Tornar entrypoint executável
RUN chmod +x /entrypoint.sh

# Criar diretórios necessários e ajustar permissões
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx && \
    chmod -R 755 /var/run

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Usar entrypoint customizado
ENTRYPOINT ["/entrypoint.sh"]