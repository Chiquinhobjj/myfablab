#!/bin/sh

echo "Starting MyFabLab services..."

# Verificar se a API key foi passada
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "ERROR: OPENROUTER_API_KEY environment variable is not set!"
    echo "Please set it in EasyPanel environment variables"
    # Usar uma key padrão temporária apenas para o container iniciar
    export OPENROUTER_API_KEY="sk-or-v1-temp-key-replace-in-easypanel"
fi

# Forçar porta 3001 para o backend (EasyPanel pode estar sobrescrevendo)
export PORT=3001

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
BACKEND_READY=0
for i in $(seq 1 30); do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        BACKEND_READY=1
        break
    fi
    echo "Waiting for backend... ($i/30)"
    sleep 1
done

if [ $BACKEND_READY -eq 0 ]; then
    echo "⚠️  WARNING: Backend didn't start properly, but continuing..."
fi

# Verificar se nginx já está rodando (pode ter sido iniciado pelo EasyPanel)
if pgrep nginx > /dev/null; then
    echo "ℹ️  Nginx already running (started by EasyPanel)"
    NGINX_PID=$(pgrep nginx | head -1)
else
    echo "Starting nginx..."
    nginx -g "daemon off;" &
    NGINX_PID=$!
    echo "✅ Nginx started"
fi

# Função para tratar sinais
trap "echo 'Shutting down...'; kill $BACKEND_PID $NGINX_PID; exit" SIGTERM SIGINT

# Log final
echo ""
echo "========================================="
echo "✅ MyFabLab AI está rodando!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:80"
echo "========================================="
echo ""

# Manter o container rodando
wait $NGINX_PID