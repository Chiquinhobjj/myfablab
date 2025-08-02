# 🚀 Guia de Deploy - MyFabLab.online

Este documento contém todas as instruções para fazer o deploy seguro da aplicação MyFabLab na Hostinger usando Coolify.

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Coolify](#configuração-do-coolify)
4. [Configuração do GitHub](#configuração-do-github)
5. [Deploy Inicial](#deploy-inicial)
6. [Monitoramento](#monitoramento)
7. [Backup e Recovery](#backup-e-recovery)
8. [Troubleshooting](#troubleshooting)

## 🏗️ Arquitetura

### Componentes Principais:
- **Frontend**: SPA (Single Page Application) com HTML/CSS/JS
- **Proxy**: Nginx com rate limiting e headers de segurança
- **API Proxy**: Endpoint seguro para OpenRouter (esconde API key)
- **SSL/TLS**: Let's Encrypt via Coolify/Traefik
- **CI/CD**: GitHub Actions + Coolify webhooks

### Fluxo de Deploy:
```
GitHub Push → GitHub Actions → Build Docker Image → Push to GHCR → Coolify Webhook → Deploy
```

## 📦 Pré-requisitos

### Na Hostinger VPS:
1. Ubuntu 22.04 LTS ou superior
2. Docker e Docker Compose instalados
3. Coolify instalado e configurado
4. Domínio apontando para o IP da VPS

### No GitHub:
1. Repositório criado
2. Secrets configurados:
   - `COOLIFY_WEBHOOK_URL`
   - `SLACK_WEBHOOK_URL` (opcional)

## 🔧 Configuração do Coolify

### 1. Criar Novo Projeto no Coolify

1. Acesse o painel do Coolify
2. Clique em "New Project"
3. Nome: `myfablab-online`
4. Descrição: `Chat AI com OpenRouter`

### 2. Adicionar Aplicação

1. Tipo: `Docker Compose`
2. Source: `GitHub`
3. Repository: `seu-usuario/myfablab.online`
4. Branch: `main`
5. Docker Compose File: `coolify-docker-compose.yml`

### 3. Configurar Variáveis de Ambiente

No painel do Coolify, adicione:

```env
# Domínio
DOMAIN=myfablab.online
SERVER_NAME=myfablab.online
CORS_ORIGIN=https://myfablab.online

# API Key (IMPORTANTE: Mantenha segura!)
OPENROUTER_API_KEY=sk-or-v1-sua-chave-aqui

# GitHub Registry
GITHUB_REPOSITORY=seu-usuario/myfablab.online

# Opcional
BACKUP_RETENTION_DAYS=7
```

### 4. Configurar Webhook

1. No Coolify, vá em Settings → Webhooks
2. Copie a URL do webhook
3. Adicione como secret no GitHub: `COOLIFY_WEBHOOK_URL`

## 🐙 Configuração do GitHub

### 1. Adicionar Secrets

No GitHub, vá em Settings → Secrets and variables → Actions:

```bash
COOLIFY_WEBHOOK_URL=https://coolify.seu-dominio.com/webhook/...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/... (opcional)
```

### 2. Habilitar GitHub Packages

1. Settings → Packages
2. Habilite Container Registry
3. Configure visibility como necessário

## 🚀 Deploy Inicial

### 1. Preparar Ambiente Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/myfablab.online.git
cd myfablab.online

# Copie e configure o .env
cp .env.example .env
# Edite .env com suas configurações

# Teste localmente
docker-compose build
docker-compose up -d
```

### 2. Fazer Push Inicial

```bash
# Adicione todos os arquivos
git add .
git commit -m "Initial deploy configuration"
git push origin main
```

### 3. Verificar Deploy

1. Acompanhe o GitHub Actions
2. Verifique o status no Coolify
3. Acesse https://myfablab.online

## 📊 Monitoramento

### 1. Logs em Tempo Real

```bash
# Via SSH na VPS
docker logs -f myfablab-web

# Ou no Coolify
# Applications → myfablab → Logs
```

### 2. Métricas

O Prometheus está configurado para coletar:
- Uso de CPU/Memória
- Requisições HTTP
- Taxa de erro
- Latência

### 3. Alertas Configurados

- Site fora do ar (> 2 min)
- Alto uso de CPU (> 80%)
- Alto uso de memória (> 85%)
- Muitos erros 5xx (> 5%)
- Certificado SSL expirando (< 7 dias)
- Espaço em disco baixo (< 15%)

## 💾 Backup e Recovery

### Backup Automático

O container de backup executa diariamente:

```bash
# Verificar backups
docker exec myfablab-backup ls -la /backups/

# Backup manual
docker exec myfablab-web /scripts/backup.sh
```

### Restaurar Backup

```bash
# Listar backups disponíveis
ls -la ./backups/

# Restaurar um backup específico
tar -xzf ./backups/logs_20240101_120000.tar.gz -C /
```

## 🔒 Segurança

### Headers de Segurança Implementados:
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer Policy
- Permissions Policy

### Rate Limiting:
- Geral: 10 req/s (burst: 20)
- API: 5 req/s (burst: 10)
- Por IP: máximo 10 conexões

### API Key Segura:
- Armazenada apenas no servidor
- Nunca exposta ao frontend
- Proxy reverso para OpenRouter

## 🐛 Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker logs myfablab-web

# Verificar configuração nginx
docker exec myfablab-web nginx -t
```

### Erro 502 Bad Gateway

1. Verifique se a API key está configurada
2. Verifique os logs do nginx
3. Teste o health check: `curl http://localhost:8080/health`

### Certificado SSL não funciona

1. Verifique configuração do Traefik no Coolify
2. Confirme que o domínio aponta para o IP correto
3. Verifique firewall (portas 80 e 443)

### Deploy falha no GitHub Actions

1. Verifique os secrets do GitHub
2. Verifique permissões do GHCR
3. Verifique a URL do webhook do Coolify

## 📝 Checklist de Deploy

- [ ] Domínio configurado e apontando para VPS
- [ ] Coolify instalado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets do GitHub configurados
- [ ] Teste local bem-sucedido
- [ ] GitHub Actions executando sem erros
- [ ] SSL/HTTPS funcionando
- [ ] Monitoramento ativo
- [ ] Backup automático configurado
- [ ] Documentação atualizada

## 🆘 Suporte

Em caso de problemas:

1. Verifique os logs no Coolify
2. Verifique o GitHub Actions
3. Consulte a documentação do Coolify
4. Abra uma issue no repositório

---

**Última atualização**: Janeiro 2024
**Versão**: 1.0.0