#!/bin/bash
# Script de backup automático

set -e

# Configurações
BACKUP_DIR="/backups"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
S3_BUCKET=${S3_BUCKET:-""}
SLACK_WEBHOOK=${SLACK_WEBHOOK_URL:-""}

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para enviar notificação
notify() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"Backup MyFabLab: $status - $message\"}" \
            2>/dev/null || true
    fi
}

# Função para fazer backup dos logs
backup_logs() {
    echo "📁 Fazendo backup dos logs..."
    
    if [ -d "/var/log/nginx" ]; then
        tar -czf "$BACKUP_DIR/logs_$TIMESTAMP.tar.gz" -C / var/log/nginx
        echo -e "${GREEN}✅ Backup dos logs criado${NC}"
    else
        echo -e "${YELLOW}⚠️  Diretório de logs não encontrado${NC}"
    fi
}

# Função para fazer backup dos dados persistentes
backup_data() {
    echo "💾 Fazendo backup dos dados..."
    
    # Backup de volumes Docker se existirem
    for volume in $(docker volume ls -q | grep myfablab); do
        echo "Backing up volume: $volume"
        docker run --rm \
            -v "$volume":/source \
            -v "$BACKUP_DIR":/backup \
            alpine tar czf "/backup/volume_${volume}_$TIMESTAMP.tar.gz" -C /source .
    done
    
    echo -e "${GREEN}✅ Backup dos dados concluído${NC}"
}

# Função para fazer backup da configuração
backup_config() {
    echo "⚙️  Fazendo backup das configurações..."
    
    # Lista de arquivos de configuração para backup
    CONFIG_FILES=(
        "/etc/nginx/nginx.conf"
        "/etc/nginx/security-headers.conf"
    )
    
    mkdir -p "$BACKUP_DIR/config_$TIMESTAMP"
    
    for file in "${CONFIG_FILES[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$BACKUP_DIR/config_$TIMESTAMP/" || true
        fi
    done
    
    tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "config_$TIMESTAMP"
    rm -rf "$BACKUP_DIR/config_$TIMESTAMP"
    
    echo -e "${GREEN}✅ Backup das configurações concluído${NC}"
}

# Função para upload para S3 (opcional)
upload_to_s3() {
    if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
        echo "☁️  Fazendo upload para S3..."
        
        for file in "$BACKUP_DIR"/*_"$TIMESTAMP".tar.gz; do
            if [ -f "$file" ]; then
                aws s3 cp "$file" "s3://$S3_BUCKET/backups/$(basename "$file")" || {
                    echo -e "${RED}❌ Falha no upload para S3${NC}"
                    notify "❌ Falha" "Upload para S3 falhou"
                    return 1
                }
            fi
        done
        
        echo -e "${GREEN}✅ Upload para S3 concluído${NC}"
    fi
}

# Função para limpar backups antigos
cleanup_old_backups() {
    echo "🧹 Removendo backups antigos..."
    
    # Remover backups locais antigos
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Remover backups S3 antigos (se configurado)
    if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
        # Lista e remove objetos mais antigos que RETENTION_DAYS
        aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
            createDate=$(echo "$line" | awk '{print $1" "$2}')
            createDate=$(date -d "$createDate" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M:%S" "$createDate" +%s)
            olderThan=$(date -d "$RETENTION_DAYS days ago" +%s)
            
            if [ "$createDate" -lt "$olderThan" ]; then
                fileName=$(echo "$line" | awk '{print $4}')
                if [ -n "$fileName" ]; then
                    aws s3 rm "s3://$S3_BUCKET/backups/$fileName"
                fi
            fi
        done
    fi
    
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

# Função para verificar espaço em disco
check_disk_space() {
    local available=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    local required=1048576  # 1GB em KB
    
    if [ "$available" -lt "$required" ]; then
        echo -e "${RED}❌ Espaço em disco insuficiente${NC}"
        notify "❌ Falha" "Espaço em disco insuficiente para backup"
        exit 1
    fi
}

# Função para criar relatório de backup
create_backup_report() {
    local report_file="$BACKUP_DIR/backup_report_$TIMESTAMP.txt"
    
    {
        echo "Backup Report - MyFabLab"
        echo "========================"
        echo "Timestamp: $(date)"
        echo "Hostname: $(hostname)"
        echo ""
        echo "Backups criados:"
        ls -lh "$BACKUP_DIR"/*_"$TIMESTAMP".tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
        echo ""
        echo "Espaço em disco:"
        df -h "$BACKUP_DIR"
        echo ""
        echo "Backups existentes:"
        ls -lh "$BACKUP_DIR"/*.tar.gz | tail -20
    } > "$report_file"
    
    echo -e "${GREEN}✅ Relatório criado: $report_file${NC}"
}

# Função principal
main() {
    echo "======================================"
    echo "   MyFabLab Backup Script v1.0"
    echo "======================================"
    echo "Iniciando backup em: $(date)"
    echo ""
    
    # Criar diretório de backup se não existir
    mkdir -p "$BACKUP_DIR"
    
    # Verificar espaço em disco
    check_disk_space
    
    # Executar backups
    backup_logs
    backup_data
    backup_config
    
    # Upload para S3 (se configurado)
    upload_to_s3
    
    # Limpar backups antigos
    cleanup_old_backups
    
    # Criar relatório
    create_backup_report
    
    # Notificar sucesso
    notify "✅ Sucesso" "Backup concluído em $(date)"
    
    echo ""
    echo -e "${GREEN}🎉 Backup concluído com sucesso!${NC}"
    echo "Arquivos salvos em: $BACKUP_DIR"
}

# Tratamento de erros
trap 'echo -e "${RED}❌ Erro durante o backup${NC}"; notify "❌ Erro" "Backup falhou"; exit 1' ERR

# Executar script
main "$@"