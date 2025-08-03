#!/bin/bash

echo "🚀 Iniciando deploy do MyFabLab AI..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se o backend tem as dependências
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
fi

# Verificar se o arquivo .env existe
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Arquivo backend/.env não encontrado!"
    echo "📝 Copie .env.example para backend/.env e adicione sua OPENROUTER_API_KEY"
    exit 1
fi

# Criar arquivo tar com os arquivos necessários
echo "📦 Criando pacote de deploy..."
tar -czf myfablab-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env \
    --exclude=*.log \
    --exclude=deploy.sh \
    public/ \
    backend/ \
    .env.example \
    start.sh \
    nginx.conf \
    Dockerfile \
    docker-compose.yaml \
    README.md \
    SECURITY.md

echo "✅ Pacote criado: myfablab-deploy.tar.gz"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça upload do arquivo myfablab-deploy.tar.gz para seu servidor"
echo "2. No servidor, execute:"
echo "   tar -xzf myfablab-deploy.tar.gz"
echo "   cd backend && cp ../.env.example .env"
echo "   # Edite .env com sua OPENROUTER_API_KEY"
echo "   ./start.sh"
echo ""
echo "🌐 Ou use Docker:"
echo "   docker-compose up -d"
echo ""
echo "✨ Deploy preparado com sucesso!"