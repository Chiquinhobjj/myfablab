#!/bin/bash

echo "🚀 Deploy do MyFabLab Chat AI no EasyPanel"
echo "=========================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📦 Preparando arquivos para deploy...${NC}"

# Criar pasta temporária
TEMP_DIR="myfablab-deploy-temp"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copiar arquivos necessários
echo "Copiando arquivos..."
cp -r *.html *.css *.js $TEMP_DIR/
cp -r components/ $TEMP_DIR/
cp -r config/ $TEMP_DIR/
cp -r styles/ $TEMP_DIR/
cp Dockerfile $TEMP_DIR/
cp nginx.conf $TEMP_DIR/
cp health.html $TEMP_DIR/

# Criar README para deploy
cat > $TEMP_DIR/README.md << 'EOF'
# MyFabLab Chat AI

Deploy automático via EasyPanel com 59 modelos gratuitos do OpenRouter.

## Configuração

As 3 API keys já estão configuradas no arquivo `config/api-keys.js`.

## Acesso

Após o deploy, acesse a aplicação pelo domínio configurado no EasyPanel.
EOF

echo -e "${GREEN}✅ Arquivos preparados!${NC}"

echo ""
echo -e "${YELLOW}📋 Instruções para deploy no EasyPanel:${NC}"
echo ""
echo "1. Acesse seu painel EasyPanel"
echo "2. Crie um novo projeto chamado 'myfablab-chat'"
echo "3. Escolha 'Deploy from GitHub' ou 'Upload Files'"
echo "4. Se usar GitHub:"
echo "   - Faça push desta pasta para um repositório"
echo "   - Configure o webhook no EasyPanel"
echo "5. Se usar Upload:"
echo "   - Faça upload da pasta '$TEMP_DIR'"
echo "   - Configure as portas: 80"
echo ""
echo -e "${GREEN}✅ Deploy via Docker Compose:${NC}"
echo "   docker-compose up -d"
echo ""
echo -e "${YELLOW}🔧 Configurações importantes:${NC}"
echo "   - Porta: 80"
echo "   - Domínio: Configure no EasyPanel"
echo "   - APIs: Já configuradas (3 chaves)"
echo ""

# Criar arquivo zip para upload manual
echo -e "${YELLOW}📦 Criando arquivo ZIP para upload...${NC}"
cd $TEMP_DIR
zip -r ../myfablab-deploy.zip .
cd ..

echo -e "${GREEN}✅ Arquivo criado: myfablab-deploy.zip${NC}"
echo ""
echo "Você pode fazer upload deste arquivo diretamente no EasyPanel!"