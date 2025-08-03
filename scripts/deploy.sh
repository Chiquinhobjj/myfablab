#!/bin/bash
# Script de deploy para EasyPanel

set -e

echo "🚀 Iniciando deploy para MyFabLab..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar comandos necessários
check_requirements() {
    echo "📋 Verificando requisitos..."
    
    local requirements=("docker" "docker-compose" "git")
    for cmd in "${requirements[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            echo -e "${RED}❌ $cmd não está instalado${NC}"
            exit 1
        fi
    done
    echo -e "${GREEN}✅ Todos os requisitos atendidos${NC}"
}

# Função para verificar variáveis de ambiente
check_env() {
    echo "🔍 Verificando variáveis de ambiente..."
    
    if [ -z "$OPENROUTER_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  OPENROUTER_API_KEY não definida. API proxy não funcionará!${NC}"
    fi
    
    # Definir valores padrão
    export SERVER_NAME=${SERVER_NAME:-"myfablab.online"}
    export CORS_ORIGIN=${CORS_ORIGIN:-"https://myfablab.online"}
    
    echo -e "${GREEN}✅ Variáveis de ambiente configuradas${NC}"
}

# Função para fazer backup antes do deploy
backup_current() {
    echo "💾 Criando backup..."
    
    BACKUP_DIR="backups/pre-deploy"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    if docker-compose ps | grep -q "Up"; then
        docker-compose exec web tar czf - /usr/share/nginx/html > "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" || true
        echo -e "${GREEN}✅ Backup criado: backup_$TIMESTAMP.tar.gz${NC}"
    else
        echo -e "${YELLOW}⚠️  Nenhum container rodando para backup${NC}"
    fi
}

# Função principal de deploy
deploy() {
    echo "🏗️  Executando deploy..."
    
    # Pull da última imagem
    if [ -n "$DOCKER_IMAGE" ]; then
        echo "📦 Baixando imagem: $DOCKER_IMAGE"
        docker pull "$DOCKER_IMAGE"
    fi
    
    # Parar containers antigos
    echo "🛑 Parando containers antigos..."
    docker-compose down --remove-orphans
    
    # Iniciar novos containers
    echo "🚀 Iniciando novos containers..."
    docker-compose up -d
    
    # Aguardar containers ficarem healthy
    echo "⏳ Aguardando containers ficarem saudáveis..."
    sleep 5
    
    # Verificar status
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    else
        echo -e "${RED}❌ Falha no deploy${NC}"
        docker-compose logs
        exit 1
    fi
}

# Função para verificar saúde após deploy
health_check() {
    echo "🏥 Verificando saúde da aplicação..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:3001/health > /dev/null; then
            echo -e "${GREEN}✅ Aplicação está saudável${NC}"
            return 0
        fi
        
        echo "⏳ Tentativa $attempt de $max_attempts..."
        sleep 3
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Aplicação não está respondendo${NC}"
    return 1
}

# Função para rollback em caso de falha
rollback() {
    echo -e "${RED}🔄 Executando rollback...${NC}"
    
    # Tentar restaurar do backup mais recente
    LATEST_BACKUP=$(ls -t backups/pre-deploy/backup_*.tar.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        echo "📦 Restaurando do backup: $LATEST_BACKUP"
        docker-compose down
        # Aqui você implementaria a lógica de restauração
        echo -e "${YELLOW}⚠️  Rollback manual necessário${NC}"
    else
        echo -e "${RED}❌ Nenhum backup encontrado para rollback${NC}"
    fi
}

# Função para limpar recursos antigos
cleanup() {
    echo "🧹 Limpando recursos antigos..."
    
    # Remover imagens não utilizadas
    docker image prune -f
    
    # Remover volumes não utilizados (cuidado!)
    # docker volume prune -f
    
    # Limpar backups antigos (manter últimos 7 dias)
    find backups/ -name "backup_*.tar.gz" -mtime +7 -delete 2>/dev/null || true
    
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

# Função principal
main() {
    echo "======================================"
    echo "   MyFabLab Deploy Script v1.0"
    echo "======================================"
    echo ""
    
    check_requirements
    check_env
    backup_current
    
    # Tentar deploy
    if deploy; then
        if health_check; then
            cleanup
            echo ""
            echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
            echo "📊 URL: https://$SERVER_NAME"
            echo ""
        else
            rollback
            exit 1
        fi
    else
        rollback
        exit 1
    fi
}

# Executar script
main "$@"