#!/bin/bash
# Script de Deploy Rápido para MyFabLab.online
# Este script automatiza o processo de deploy inicial

set -e  # Para em caso de erro

echo "==================================="
echo "MyFabLab Deploy Script v1.0"
echo "==================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Verificar se está rodando como root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script deve ser executado como root"
   exit 1
fi

# Pedir informações necessárias
echo ""
read -p "Digite o IP da sua VPS Hostinger: " VPS_IP
read -p "Digite seu domínio (ex: myfablab.online): " DOMAIN
read -p "Digite seu usuário do GitHub: " GITHUB_USER
read -p "Digite sua API Key do OpenRouter: " OPENROUTER_KEY
echo ""

# Confirmar informações
echo "Configurações:"
echo "- VPS IP: $VPS_IP"
echo "- Domínio: $DOMAIN"
echo "- GitHub User: $GITHUB_USER"
echo ""
read -p "Confirmar e continuar? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deploy cancelado"
    exit 1
fi

# 1. Preparar Sistema
print_status "Atualizando sistema..."
apt update && apt upgrade -y

print_status "Instalando dependências..."
apt install -y curl wget git htop ufw fail2ban

# 2. Configurar Firewall
print_status "Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp
ufw --force enable

# 3. Configurar Swap
print_status "Configurando swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p
fi

# 4. Criar usuário coolify
print_status "Criando usuário coolify..."
if ! id "coolify" &>/dev/null; then
    adduser --disabled-password --gecos "" coolify
    usermod -aG sudo coolify
    echo "coolify ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
fi

# 5. Instalar Coolify
print_status "Instalando Coolify..."
su - coolify -c "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash"

# 6. Criar arquivo de configuração
print_status "Criando arquivo de configuração..."
cat > /home/coolify/myfablab-env.txt << EOF
# Configurações do MyFabLab
DOMAIN=$DOMAIN
SERVER_NAME=$DOMAIN
CORS_ORIGIN=https://$DOMAIN
OPENROUTER_API_KEY=$OPENROUTER_KEY
GITHUB_REPOSITORY=$GITHUB_USER/myfablab.online
EOF

chown coolify:coolify /home/coolify/myfablab-env.txt
chmod 600 /home/coolify/myfablab-env.txt

# 7. Criar script de backup
print_status "Configurando backup automático..."
cat > /home/coolify/backup.sh << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/home/coolify/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup do Coolify
docker exec coolify-db pg_dump -U coolify coolify > $BACKUP_DIR/coolify_$DATE.sql

# Backup dos volumes
docker run --rm -v myfablab_logs:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_$DATE.tar.gz -C /data .

# Limpar backups antigos
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
BACKUP_EOF

chmod +x /home/coolify/backup.sh
chown coolify:coolify /home/coolify/backup.sh

# Agendar backup
(crontab -u coolify -l 2>/dev/null; echo "0 3 * * * /home/coolify/backup.sh") | crontab -u coolify -

# 8. Instalar Netdata para monitoramento
print_status "Instalando Netdata..."
wget -O /tmp/netdata-kickstart.sh https://my-netdata.io/kickstart.sh
sh /tmp/netdata-kickstart.sh --dont-wait --dont-start-it

# Configurar Netdata para iniciar com o sistema
systemctl enable netdata
systemctl start netdata

# 9. Criar script de health check
print_status "Configurando health checks..."
cat > /home/coolify/health-check.sh << HEALTH_EOF
#!/bin/bash
LOG_FILE="/home/coolify/health-check.log"

# Check se o site está respondendo
if ! curl -f -s https://$DOMAIN/health > /dev/null 2>&1; then
    echo "[$(date)] Site offline" >> \$LOG_FILE
fi

# Check uso de CPU
CPU=\$(top -bn1 | grep "Cpu(s)" | awk '{print \$2}' | cut -d'%' -f1)
if (( \$(echo "\$CPU > 80" | bc -l) )); then
    echo "[$(date)] CPU alta: \$CPU%" >> \$LOG_FILE
fi

# Rotacionar log se ficar muito grande
if [ -f \$LOG_FILE ] && [ \$(stat -c%s "\$LOG_FILE") -gt 1048576 ]; then
    mv \$LOG_FILE \$LOG_FILE.old
fi
HEALTH_EOF

chmod +x /home/coolify/health-check.sh
chown coolify:coolify /home/coolify/health-check.sh

# Agendar health check
(crontab -u coolify -l 2>/dev/null; echo "*/5 * * * * /home/coolify/health-check.sh") | crontab -u coolify -

# 10. Instruções finais
echo ""
echo "==================================="
print_status "Deploy inicial concluído!"
echo "==================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1. Acesse o Coolify em: http://$VPS_IP:8000"
echo "   - Crie sua conta de administrador"
echo "   - Configure o servidor principal"
echo ""
echo "2. Configure o DNS na Hostinger:"
echo "   - A record: @ -> $VPS_IP"
echo "   - A record: www -> $VPS_IP"
echo ""
echo "3. No Coolify:"
echo "   - Crie novo projeto: 'myfablab-production'"
echo "   - Adicione aplicação Docker Compose"
echo "   - Use o arquivo coolify-docker-compose.yml"
echo "   - Configure as variáveis de ambiente do arquivo:"
echo "     /home/coolify/myfablab-env.txt"
echo ""
echo "4. Configure o GitHub:"
echo "   - Adicione deploy key (gere com: ssh-keygen -t ed25519)"
echo "   - Configure webhook do Coolify"
echo "   - Adicione secrets no GitHub Actions"
echo ""
echo "5. Monitoramento:"
echo "   - Netdata: http://$VPS_IP:19999"
echo "   - Logs: /home/coolify/health-check.log"
echo ""
echo "6. Documentação completa:"
echo "   - /Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online/DEPLOYMENT-GUIDE.md"
echo ""
print_warning "Lembre-se de configurar SSH keys e desabilitar login root!"
echo ""
echo "==================================="
print_status "Boa sorte com seu deploy!"
echo "==================================="