#!/bin/sh

echo "Starting MyFabLab services..."

# Verificar se .env existe, senão criar um padrão
if [ ! -f /app/backend/.env ]; then
    echo "Creating default .env file..."
    cat > /app/backend/.env << EOF
PORT=3001
NODE_ENV=production
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
EOF
fi

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

# Iniciar nginx
echo "Starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Função para tratar sinais
trap "echo 'Shutting down...'; kill $BACKEND_PID $NGINX_PID; exit" SIGTERM SIGINT

# Manter o container rodando
wait $NGINX_PID