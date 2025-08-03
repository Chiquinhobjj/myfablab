#!/bin/bash

echo "🚀 Iniciando MyFabLab AI..."

# Verificar se o .env existe
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env a partir do exemplo..."
    cp .env.example backend/.env
    echo "✏️  Por favor, edite backend/.env e adicione sua OPENROUTER_API_KEY"
    echo "   Obtenha sua chave em: https://openrouter.ai/keys"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências..."
    cd backend
    npm install
    cd ..
fi

# Iniciar o servidor
echo "✅ Iniciando servidor..."
cd backend
npm start