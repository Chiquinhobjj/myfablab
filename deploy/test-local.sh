#!/bin/bash

# 🧪 TESTE LOCAL DO EMERGENCY.HTML
# Por: @woz-myfablab

echo "🧪 TESTE LOCAL DO EMERGENCY.HTML"
echo "================================"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Diretório do projeto
PROJECT_DIR="/Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online"

echo -e "${YELLOW}📋 Iniciando testes...${NC}"
echo ""

# 1. Verificar se emergency.html existe
echo "1️⃣ Verificando arquivo emergency.html..."
if [ -f "$PROJECT_DIR/emergency.html" ]; then
    echo -e "${GREEN}✅ Arquivo existe${NC}"
    FILE_SIZE=$(du -h "$PROJECT_DIR/emergency.html" | cut -f1)
    echo "   Tamanho: $FILE_SIZE"
else
    echo -e "${RED}❌ Arquivo não encontrado!${NC}"
    exit 1
fi

# 2. Verificar estrutura HTML
echo ""
echo "2️⃣ Verificando estrutura HTML..."
if grep -q "<!DOCTYPE html>" "$PROJECT_DIR/emergency.html"; then
    echo -e "${GREEN}✅ DOCTYPE válido${NC}"
else
    echo -e "${RED}❌ DOCTYPE inválido${NC}"
fi

if grep -q "<title>" "$PROJECT_DIR/emergency.html"; then
    TITLE=$(grep "<title>" "$PROJECT_DIR/emergency.html" | sed 's/<[^>]*>//g' | xargs)
    echo -e "${GREEN}✅ Title encontrado: $TITLE${NC}"
else
    echo -e "${RED}❌ Title não encontrado${NC}"
fi

# 3. Verificar JavaScript inline
echo ""
echo "3️⃣ Verificando JavaScript..."
if grep -q "<script>" "$PROJECT_DIR/emergency.html"; then
    SCRIPT_COUNT=$(grep -c "<script>" "$PROJECT_DIR/emergency.html")
    echo -e "${GREEN}✅ $SCRIPT_COUNT bloco(s) de script encontrado(s)${NC}"
else
    echo -e "${YELLOW}⚠️ Nenhum script encontrado (pode ser intencional)${NC}"
fi

# 4. Verificar CSS inline
echo ""
echo "4️⃣ Verificando CSS..."
if grep -q "<style>" "$PROJECT_DIR/emergency.html"; then
    echo -e "${GREEN}✅ CSS inline encontrado${NC}"
else
    echo -e "${YELLOW}⚠️ Nenhum CSS inline (verificar links externos)${NC}"
fi

# 5. Verificar API key
echo ""
echo "5️⃣ Verificando configuração de API..."
if grep -q "sk-or-v1-" "$PROJECT_DIR/emergency.html"; then
    echo -e "${GREEN}✅ API key configurada${NC}"
else
    echo -e "${YELLOW}⚠️ API key não encontrada (verificar se está em variável)${NC}"
fi

# 6. Iniciar servidor local para teste
echo ""
echo "6️⃣ Iniciando servidor local..."
echo -e "${YELLOW}📡 Servidor rodando em: http://localhost:8888${NC}"
echo -e "${YELLOW}   Pressione Ctrl+C para parar${NC}"
echo ""

# Criar cópia temporária como index.html para teste
cp "$PROJECT_DIR/emergency.html" "$PROJECT_DIR/test-index.html"

# Iniciar servidor Python
cd "$PROJECT_DIR"
python3 -m http.server 8888 --bind localhost

# Limpar
rm "$PROJECT_DIR/test-index.html" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Teste local concluído!${NC}"
