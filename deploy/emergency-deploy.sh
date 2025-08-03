#!/bin/bash

# 🚨 EMERGENCY DEPLOY SCRIPT - MYFABLAB
# Criado por: @woz-myfablab
# Data: 2024-12-16
# Objetivo: Deploy imediato do emergency.html

echo "🚀 INICIANDO DEPLOY EMERGENCIAL DO MYFABLAB..."
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
SERVER="seu_servidor_hostinger"  # ATUALIZAR COM SEU IP/HOST
USER="seu_usuario"                # ATUALIZAR COM SEU USUÁRIO
REMOTE_PATH="/var/www/myfablab.online/public_html"
LOCAL_PATH="/Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online"

echo -e "${YELLOW}📋 PLANO DE DEPLOY:${NC}"
echo "1. Fazer backup do index.html atual"
echo "2. Copiar emergency.html como novo index.html"
echo "3. Testar funcionamento"
echo ""

# Opção 1: Deploy via SSH (Recomendado)
deploy_ssh() {
    echo -e "${GREEN}🔧 Método: Deploy via SSH${NC}"
    
    # Backup do atual
    echo "📦 Fazendo backup do index.html atual..."
    ssh $USER@$SERVER "cd $REMOTE_PATH && cp index.html index_broken_$(date +%Y%m%d_%H%M%S).html"
    
    # Upload do emergency.html
    echo "📤 Enviando emergency.html..."
    scp $LOCAL_PATH/emergency.html $USER@$SERVER:$REMOTE_PATH/index.html
    
    # Verificar
    echo "✅ Verificando deploy..."
    curl -s -o /dev/null -w "%{http_code}" https://myfablab.online
}

# Opção 2: Deploy via FTP (se SSH não estiver disponível)
deploy_ftp() {
    echo -e "${GREEN}🔧 Método: Deploy via FTP${NC}"
    
    # Criar script FTP
    cat > /tmp/ftp_deploy.txt <<EOF
open $SERVER
user $USER
binary
cd $REMOTE_PATH
rename index.html index_broken_$(date +%Y%m%d_%H%M%S).html
put emergency.html index.html
quit
EOF
    
    # Executar FTP
    ftp -n < /tmp/ftp_deploy.txt
    
    # Limpar
    rm /tmp/ftp_deploy.txt
}

# Opção 3: Deploy Manual (instruções)
deploy_manual() {
    echo -e "${YELLOW}📝 INSTRUÇÕES PARA DEPLOY MANUAL:${NC}"
    echo ""
    echo "1. Acesse seu painel de controle Hostinger"
    echo "2. Vá para o File Manager"
    echo "3. Navegue até: /public_html/"
    echo "4. Renomeie index.html para index_broken.html"
    echo "5. Faça upload do emergency.html"
    echo "6. Renomeie emergency.html para index.html"
    echo "7. Teste em: https://myfablab.online"
}

# Menu de seleção
echo -e "${YELLOW}Escolha o método de deploy:${NC}"
echo "1) SSH (Recomendado)"
echo "2) FTP"
echo "3) Manual (Instruções)"
echo ""
read -p "Opção (1-3): " opcao

case $opcao in
    1)
        deploy_ssh
        ;;
    2)
        deploy_ftp
        ;;
    3)
        deploy_manual
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO!${NC}"
echo ""
echo "🧪 TESTANDO O SITE..."
echo "------------------------"

# Teste básico
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://myfablab.online)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Site respondendo com sucesso (HTTP $HTTP_STATUS)${NC}"
    echo ""
    echo "🎯 PRÓXIMOS PASSOS:"
    echo "1. Abra https://myfablab.online em um navegador"
    echo "2. Teste o chat com uma mensagem"
    echo "3. Verifique se os modelos estão carregando"
    echo "4. Teste em mobile"
else
    echo -e "${RED}⚠️ Site retornando HTTP $HTTP_STATUS${NC}"
    echo "Verifique manualmente!"
fi

echo ""
echo "📊 CHECKLIST PÓS-DEPLOY:"
echo "[ ] Site carrega sem erros"
echo "[ ] Interface aparece corretamente"
echo "[ ] Chat funciona"
echo "[ ] Modelos de IA disponíveis"
echo "[ ] Mobile responsivo"
echo ""
echo "🚀 Deploy emergencial completo!"
