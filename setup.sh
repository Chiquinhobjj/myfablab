#!/bin/bash

echo "🚀 MyFabLab Chat AI - Setup Inicial"
echo "=================================="
echo ""

# Verifica se o arquivo api-keys.js já existe
if [ -f "config/api-keys.js" ]; then
    echo "✅ Arquivo config/api-keys.js já existe!"
else
    echo "📋 Copiando arquivo de exemplo para config/api-keys.js..."
    cp config/api-keys.example.js config/api-keys.js
    echo "⚠️  IMPORTANTE: Edite o arquivo config/api-keys.js com suas chaves reais do OpenRouter!"
fi

# Cria diretórios necessários
echo ""
echo "📁 Criando diretórios..."
mkdir -p styles
mkdir -p components
mkdir -p config

# Verifica arquivos
echo ""
echo "🔍 Verificando arquivos necessários..."

files_to_check=(
    "index-v2.html"
    "app-v2.js"
    "style.css"
    "styles/model-selector.css"
    "components/model-selector.js"
    "config/models-database.js"
    "fix-styles.css"
    "fix-app.js"
)

all_good=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file não encontrado!"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "✨ Tudo pronto! Você pode agora:"
    echo "1. Editar config/api-keys.js com suas chaves do OpenRouter"
    echo "2. Renomear index-v2.html para index.html quando estiver pronto"
    echo "3. Fazer deploy da aplicação"
else
    echo "⚠️  Alguns arquivos estão faltando. Verifique a instalação."
fi

echo ""
echo "📚 Documentação: https://github.com/Chiquinhobjj/myfablab"
echo "🔑 Obter API Keys: https://openrouter.ai/keys"