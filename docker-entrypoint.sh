#!/bin/sh

echo "Starting MyFabLab services..."

# Verificar se a API key foi passada
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "ERROR: OPENROUTER_API_KEY environment variable is not set!"
    echo "Please set it in EasyPanel environment variables"
    # Usar uma key padrão temporária apenas para o container iniciar
    export OPENROUTER_API_KEY="sk-or-v1-temp-key-replace-in-easypanel"
fi

# Criar .env file
echo "Creating .env file..."
cat > /app/backend/.env << EOF
PORT=3001
NODE_ENV=production
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
EOF

# Criar link simbólico para os arquivos estáticos
ln -sf /usr/share/nginx/html /app/public

# Iniciar o backend Node.js
echo "Starting backend server on port 3001..."
cd /app/backend
node server.js &
BACKEND_PID=$!

# Aguardar o backend iniciar
echo "Waiting for backend to start..."
for i in $(seq 1 30); do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    echo "Waiting for backend... ($i/30)"
    sleep 1
done

# Verificar se nginx já está rodando e parar se necessário
if pgrep nginx > /dev/null; then
    echo "Nginx already running, stopping it..."
    nginx -s stop
    sleep 2
fi

# Iniciar nginx
echo "Starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Função para tratar sinais
trap "echo 'Shutting down...'; kill $BACKEND_PID $NGINX_PID; exit" SIGTERM SIGINT

# Manter o container rodando
wait $NGINX_PID