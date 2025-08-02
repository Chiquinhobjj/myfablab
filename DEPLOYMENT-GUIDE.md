# Guia Completo de Deployment - MyFabLab.online

## Sumário
1. [Preparação da VPS Hostinger](#1-preparação-da-vps-hostinger)
2. [Instalação e Configuração do Coolify](#2-instalação-e-configuração-do-coolify)
3. [Configuração do Projeto no Coolify](#3-configuração-do-projeto-no-coolify)
4. [Integração com GitHub](#4-integração-com-github)
5. [Configuração de Domínio e SSL](#5-configuração-de-domínio-e-ssl)
6. [Monitoramento e Manutenção](#6-monitoramento-e-manutenção)
7. [Troubleshooting Comum](#7-troubleshooting-comum)
8. [Custos Estimados](#8-custos-estimados)

---

## 1. Preparação da VPS Hostinger

### 1.1 Requisitos Mínimos
- **VPS**: KVM 2 (recomendado) ou superior
- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Armazenamento**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS

### 1.2 Acesso Inicial à VPS

```bash
# Conecte-se à VPS via SSH
ssh root@SEU_IP_VPS

# Atualize o sistema
apt update && apt upgrade -y

# Instale pacotes essenciais
apt install -y curl wget git htop ufw fail2ban
```

### 1.3 Configuração de Segurança Básica

```bash
# Configure o firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8000/tcp  # Coolify Dashboard
ufw --force enable

# Configure fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Crie um usuário não-root
adduser coolify
usermod -aG sudo coolify

# Configure SSH para maior segurança
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 1.4 Configuração de Swap (Importante para VPS com pouca RAM)

```bash
# Crie arquivo swap de 4GB
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Torne permanente
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Configure swappiness para servidores
echo 'vm.swappiness=10' >> /etc/sysctl.conf
sysctl -p
```

---

## 2. Instalação e Configuração do Coolify

### 2.1 Instalação do Coolify v4

```bash
# Mude para o usuário coolify
su - coolify

# Baixe e execute o instalador do Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# O script irá:
# - Instalar Docker e Docker Compose
# - Configurar o Coolify
# - Iniciar os serviços necessários
```

### 2.2 Acesso ao Dashboard do Coolify

```bash
# Após a instalação, acesse:
# http://SEU_IP_VPS:8000

# Na primeira vez, você precisará:
# 1. Criar uma conta de administrador
# 2. Configurar o servidor principal
```

### 2.3 Configuração Inicial do Coolify

No dashboard do Coolify:

1. **Configurações do Servidor**:
   - Nome: `production-vps`
   - IP: Deixe como `localhost`
   - Porta SSH: `22`

2. **Configurações de Proxy (Traefik)**:
   - Ative o proxy Traefik
   - Configure para usar portas 80 e 443

3. **Configurações de Email** (para notificações):
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: seu-email@gmail.com
   SMTP Password: senha-de-app-google
   From Email: noreply@myfablab.online
   ```

---

## 3. Configuração do Projeto no Coolify

### 3.1 Criar Novo Projeto

1. No dashboard, clique em **"New Project"**
2. Nome do projeto: `myfablab-production`
3. Descrição: `MyFabLab AI Chat Application`

### 3.2 Adicionar Aplicação

1. Dentro do projeto, clique em **"New Application"**
2. Escolha: **"Docker Compose"**
3. Configure:
   - Nome: `myfablab-web`
   - Tipo de fonte: `GitHub`

### 3.3 Configurar Variáveis de Ambiente

No Coolify, adicione as seguintes variáveis:

```env
# Domínio e Configurações
DOMAIN=myfablab.online
SERVER_NAME=myfablab.online
CORS_ORIGIN=https://myfablab.online

# API Keys (Seguras)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# GitHub Registry
GITHUB_REPOSITORY=seu-usuario/myfablab.online

# Configurações de Build
BUILDPACK=dockerfile
DOCKERFILE_PATH=./Dockerfile
```

### 3.4 Configurar Docker Compose

Use o arquivo `coolify-docker-compose.yml` já criado:

1. No Coolify, na seção **"Docker Compose Configuration"**
2. Cole o conteúdo do arquivo `coolify-docker-compose.yml`
3. Salve as configurações

---

## 4. Integração com GitHub

### 4.1 Configurar Deploy Key no GitHub

```bash
# No servidor VPS, gere uma chave SSH
ssh-keygen -t ed25519 -C "coolify@myfablab.online" -f ~/.ssh/coolify_deploy

# Copie a chave pública
cat ~/.ssh/coolify_deploy.pub
```

No GitHub:
1. Vá para **Settings > Deploy keys** do repositório
2. Adicione nova deploy key com a chave pública
3. Marque **"Allow write access"**

### 4.2 Configurar Webhook no Coolify

1. No Coolify, na configuração da aplicação
2. Copie a **Webhook URL** fornecida
3. No GitHub, vá para **Settings > Webhooks**
4. Adicione novo webhook:
   - Payload URL: `URL copiada do Coolify`
   - Content type: `application/json`
   - Events: `Push events`

### 4.3 Configurar GitHub Actions Secrets

No repositório GitHub, adicione os seguintes secrets:

```
COOLIFY_WEBHOOK_URL = https://coolify.myfablab.online/webhook/xxxxx
SLACK_WEBHOOK_URL = https://hooks.slack.com/services/xxxxx (opcional)
```

### 4.4 Testar Deploy Automático

```bash
# Faça um commit de teste
git add .
git commit -m "test: coolify deployment"
git push origin main

# Acompanhe o deploy no dashboard do Coolify
```

---

## 5. Configuração de Domínio e SSL

### 5.1 Configurar DNS na Hostinger

No painel da Hostinger:

1. **Gerenciar Domínio** > **DNS Zone**
2. Adicione/Edite registros:

```
Tipo | Nome | Conteúdo         | TTL
-----|------|------------------|-----
A    | @    | SEU_IP_VPS      | 3600
A    | www  | SEU_IP_VPS      | 3600
A    | *    | SEU_IP_VPS      | 3600
```

### 5.2 Configurar SSL no Coolify

O Coolify usa Let's Encrypt automaticamente:

1. Na configuração da aplicação
2. Seção **"Domains"**
3. Adicione:
   - `myfablab.online`
   - `www.myfablab.online`
4. Marque **"Generate SSL Certificate"**
5. Clique em **"Save"**

### 5.3 Forçar HTTPS

O Traefik do Coolify já força HTTPS automaticamente. Verifique em:
- **Settings > Proxy > Force HTTPS**: Ativado

---

## 6. Monitoramento e Manutenção

### 6.1 Configurar Monitoramento Básico

```bash
# Instale o Netdata para monitoramento em tempo real
wget -O /tmp/netdata-kickstart.sh https://my-netdata.io/kickstart.sh
sh /tmp/netdata-kickstart.sh --dont-wait

# Acesse em: http://SEU_IP_VPS:19999
```

### 6.2 Configurar Alertas no Coolify

1. **Settings > Notifications**
2. Configure alertas para:
   - Deploy falhou
   - Aplicação offline
   - Uso alto de recursos

### 6.3 Backup Automático

Crie script de backup:

```bash
# Crie o script
cat > /home/coolify/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/coolify/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do Coolify
docker exec coolify-db pg_dump -U coolify coolify > $BACKUP_DIR/coolify_$DATE.sql

# Backup dos volumes Docker
docker run --rm -v myfablab_logs:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_$DATE.tar.gz -C /data .

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Enviar para storage externo (opcional)
# rclone copy $BACKUP_DIR/coolify_$DATE.sql remote:backups/
EOF

chmod +x /home/coolify/backup.sh

# Agendar no cron
(crontab -l 2>/dev/null; echo "0 3 * * * /home/coolify/backup.sh") | crontab -
```

### 6.4 Monitoramento de Logs

```bash
# Logs do Coolify
docker logs -f coolify

# Logs da aplicação
docker logs -f myfablab-web

# Logs do Nginx (dentro do container)
docker exec myfablab-web tail -f /var/log/nginx/access.log
docker exec myfablab-web tail -f /var/log/nginx/error.log
```

### 6.5 Health Checks

Configure health checks adicionais:

```bash
# Crie script de health check
cat > /home/coolify/health-check.sh << 'EOF'
#!/bin/bash
WEBHOOK_URL="SEU_WEBHOOK_SLACK_OU_DISCORD"

# Check se o site está respondendo
if ! curl -f -s https://myfablab.online/health > /dev/null; then
    curl -X POST $WEBHOOK_URL -H 'Content-type: application/json' \
    -d '{"text":"⚠️ MyFabLab está offline!"}'
fi

# Check uso de recursos
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if (( $(echo "$CPU > 80" | bc -l) )); then
    curl -X POST $WEBHOOK_URL -H 'Content-type: application/json' \
    -d '{"text":"⚠️ CPU alta: '$CPU'%"}'
fi
EOF

chmod +x /home/coolify/health-check.sh

# Agendar para rodar a cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/coolify/health-check.sh") | crontab -
```

---

## 7. Troubleshooting Comum

### 7.1 Aplicação não inicia

```bash
# Verificar logs
docker logs myfablab-web

# Verificar se o container está rodando
docker ps -a

# Reiniciar manualmente
docker restart myfablab-web

# Verificar configuração do Nginx
docker exec myfablab-web nginx -t
```

### 7.2 Erro 502 Bad Gateway

```bash
# Verificar se o Traefik está rodando
docker ps | grep traefik

# Verificar labels do container
docker inspect myfablab-web | grep -A 20 Labels

# Reiniciar Traefik
docker restart coolify-proxy
```

### 7.3 SSL não funciona

```bash
# Verificar certificados
docker exec coolify-proxy cat /etc/traefik/acme.json | jq

# Forçar renovação
docker exec coolify-proxy rm /etc/traefik/acme.json
docker restart coolify-proxy

# Verificar DNS
dig myfablab.online
nslookup myfablab.online
```

### 7.4 Deploy falha no GitHub Actions

```bash
# Verificar webhook
curl -X POST $COOLIFY_WEBHOOK_URL -d '{"test": true}'

# Verificar permissões do registry
docker login ghcr.io -u SEU_USUARIO -p SEU_TOKEN

# Rebuild manual
docker build -t ghcr.io/seu-usuario/myfablab:latest .
docker push ghcr.io/seu-usuario/myfablab:latest
```

### 7.5 Performance lenta

```bash
# Verificar uso de recursos
htop
docker stats

# Limpar cache Docker
docker system prune -a -f

# Verificar logs de erro
journalctl -xe

# Otimizar Docker
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker
```

### 7.6 Comandos Úteis de Debug

```bash
# Status geral do Coolify
docker exec coolify-db psql -U coolify -c "SELECT * FROM applications;"

# Verificar portas em uso
netstat -tulpn | grep LISTEN

# Verificar certificados SSL
echo | openssl s_client -connect myfablab.online:443 -servername myfablab.online

# Testar endpoint da API
curl -X POST https://myfablab.online/api/openrouter \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Monitorar tráfego em tempo real
docker exec myfablab-web tail -f /var/log/nginx/access.log | grep -v "health"
```

---

## 8. Custos Estimados

### 8.1 Hostinger VPS

| Plano | vCPU | RAM | Storage | Preço/mês |
|-------|------|-----|---------|-----------|
| KVM 1 | 1    | 4GB | 50GB    | R$ 45     |
| KVM 2 | 2    | 8GB | 100GB   | R$ 85     |
| KVM 4 | 4    | 16GB| 200GB   | R$ 170    |

**Recomendado**: KVM 2 para produção

### 8.2 Custos Adicionais

| Serviço | Custo/mês | Observação |
|---------|-----------|------------|
| Domínio | R$ 4      | Anual ~R$ 50 |
| SSL | Grátis | Let's Encrypt |
| GitHub Actions | Grátis | 2000 min/mês |
| Monitoramento | Grátis | Netdata Community |
| Backup Storage | R$ 10 | Opcional (B2/S3) |

### 8.3 Custo Total Estimado

- **Mínimo (KVM 1)**: R$ 49/mês
- **Recomendado (KVM 2)**: R$ 89/mês
- **Premium (KVM 4)**: R$ 174/mês

### 8.4 Otimização de Custos

1. **Use Coolify Community** (grátis)
2. **Aproveite créditos** da Hostinger para novos usuários
3. **Pague anualmente** para desconto de ~20%
4. **Monitore uso** para fazer downgrade se necessário
5. **Use CDN grátis** (Cloudflare) para economizar banda

---

## Checklist Final de Deploy

- [ ] VPS configurada e segura
- [ ] Coolify instalado e funcionando
- [ ] Projeto criado no Coolify
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub integrado (webhook + deploy key)
- [ ] Domínio apontando para VPS
- [ ] SSL funcionando
- [ ] Backup automático configurado
- [ ] Monitoramento ativo
- [ ] Health checks configurados
- [ ] Documentação atualizada

---

## Suporte e Recursos

- **Coolify Docs**: https://coolify.io/docs
- **Hostinger Support**: https://www.hostinger.com.br/suporte
- **GitHub Actions**: https://docs.github.com/en/actions
- **Traefik Docs**: https://doc.traefik.io/traefik/

---

## Notas de Segurança

1. **NUNCA** commite credenciais no repositório
2. **SEMPRE** use HTTPS em produção
3. **MANTENHA** o sistema atualizado
4. **FAÇA** backups regulares
5. **MONITORE** logs de acesso suspeitos
6. **USE** 2FA em todas as contas (GitHub, Hostinger, etc)

---

*Última atualização: 02/08/2025*