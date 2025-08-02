#!/bin/sh

# Entrypoint script para substituir variáveis de ambiente

# Definir valores padrão se não estiverem definidos
export SERVER_NAME=${SERVER_NAME:-"myfablab.online"}
export CORS_ORIGIN=${CORS_ORIGIN:-"https://myfablab.online"}
export OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-""}

# Verificar se a API key está configurada
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "WARNING: OPENROUTER_API_KEY not set. API proxy will not work!"
fi

# Substituir variáveis no nginx.conf
envsubst '${SERVER_NAME} ${CORS_ORIGIN} ${OPENROUTER_API_KEY}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Criar páginas de erro customizadas
cat > /usr/share/nginx/html/404.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Página não encontrada</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .error-container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 4rem;
            margin: 0;
            color: #333;
        }
        p {
            font-size: 1.2rem;
            color: #666;
            margin: 1rem 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404</h1>
        <p>Página não encontrada</p>
        <p><a href="/">Voltar ao início</a></p>
    </div>
</body>
</html>
EOF

cat > /usr/share/nginx/html/50x.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erro do servidor</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .error-container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 4rem;
            margin: 0;
            color: #e74c3c;
        }
        p {
            font-size: 1.2rem;
            color: #666;
            margin: 1rem 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>500</h1>
        <p>Erro interno do servidor</p>
        <p>Por favor, tente novamente mais tarde.</p>
        <p><a href="/">Voltar ao início</a></p>
    </div>
</body>
</html>
EOF

# Iniciar nginx
exec nginx -g 'daemon off;'