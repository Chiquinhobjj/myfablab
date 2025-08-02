# Checklist de Pré-Deploy - MyFabLab.online

## 📋 Antes de Começar

### Requisitos da Hostinger
- [ ] VPS contratada (mínimo KVM 2 recomendado)
- [ ] Acesso SSH à VPS configurado
- [ ] IP da VPS anotado: `_______________`
- [ ] Domínio registrado e ativo

### Credenciais Necessárias
- [ ] API Key do OpenRouter obtida
- [ ] Conta GitHub configurada
- [ ] Token de acesso pessoal do GitHub criado (para registry)
- [ ] Email para notificações preparado

### Arquivos do Projeto
- [ ] Repositório no GitHub criado
- [ ] Arquivos do projeto enviados para o repositório
- [ ] Branch `main` como padrão
- [ ] `.gitignore` configurado

## 🚀 Durante o Deploy

### 1. Preparação da VPS (10-15 min)
- [ ] Sistema atualizado (`apt update && apt upgrade`)
- [ ] Firewall configurado
- [ ] Swap criado (4GB)
- [ ] Usuário não-root criado

### 2. Instalação do Coolify (5-10 min)
- [ ] Coolify instalado via script oficial
- [ ] Dashboard acessível em `http://IP:8000`
- [ ] Conta de admin criada
- [ ] Servidor principal configurado

### 3. Configuração DNS (5 min + propagação)
- [ ] Registro A para `@` apontando para IP da VPS
- [ ] Registro A para `www` apontando para IP da VPS
- [ ] Registro A para `*` (wildcard) opcional
- [ ] Propagação DNS verificada (`dig myfablab.online`)

### 4. Projeto no Coolify (15-20 min)
- [ ] Projeto criado: `myfablab-production`
- [ ] Aplicação Docker Compose adicionada
- [ ] Variáveis de ambiente configuradas:
  - [ ] `DOMAIN`
  - [ ] `SERVER_NAME`
  - [ ] `CORS_ORIGIN`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `GITHUB_REPOSITORY`
- [ ] Docker Compose configurado (usar `coolify-docker-compose.yml`)

### 5. Integração GitHub (10-15 min)
- [ ] Deploy key gerada na VPS
- [ ] Deploy key adicionada ao repositório GitHub
- [ ] Webhook copiado do Coolify
- [ ] Webhook configurado no GitHub
- [ ] Secrets adicionados ao GitHub Actions:
  - [ ] `COOLIFY_WEBHOOK_URL`

### 6. Primeiro Deploy (5-10 min)
- [ ] Commit de teste realizado
- [ ] GitHub Actions executado com sucesso
- [ ] Deploy no Coolify concluído
- [ ] Aplicação acessível via HTTP

### 7. SSL/HTTPS (5 min)
- [ ] Domínios adicionados no Coolify
- [ ] SSL automático ativado
- [ ] HTTPS funcionando
- [ ] Redirecionamento HTTP→HTTPS ativo

## ✅ Verificações Pós-Deploy

### Funcionalidade
- [ ] Site acessível em `https://myfablab.online`
- [ ] Chat AI funcionando corretamente
- [ ] API do OpenRouter respondendo
- [ ] Sem erros no console do navegador

### Performance
- [ ] Tempo de carregamento < 3 segundos
- [ ] Compressão gzip ativa
- [ ] Headers de cache configurados
- [ ] CDN considerado (Cloudflare)

### Segurança
- [ ] HTTPS forçado
- [ ] Headers de segurança presentes
- [ ] Rate limiting funcionando
- [ ] Acesso SSH seguro (sem root, com chave)

### Monitoramento
- [ ] Netdata instalado e acessível
- [ ] Health checks configurados
- [ ] Logs sendo coletados
- [ ] Alertas configurados

### Backup
- [ ] Script de backup criado
- [ ] Backup agendado no cron
- [ ] Teste de backup realizado
- [ ] Procedimento de restore documentado

## 🔧 Troubleshooting Rápido

### Site não carrega
```bash
# Verificar se container está rodando
docker ps | grep myfablab

# Ver logs
docker logs myfablab-web

# Reiniciar aplicação
docker restart myfablab-web
```

### Erro 502
```bash
# Verificar Traefik
docker logs coolify-proxy

# Reiniciar proxy
docker restart coolify-proxy
```

### SSL não funciona
```bash
# Verificar DNS
dig myfablab.online

# Forçar renovação SSL
# No Coolify: Settings > Domains > Regenerate Certificate
```

## 📊 Métricas de Sucesso

- [ ] Uptime > 99.9% no primeiro mês
- [ ] Tempo de resposta < 200ms (p95)
- [ ] Zero incidentes de segurança
- [ ] Deploys automáticos funcionando
- [ ] Custos dentro do orçamento

## 🎯 Próximos Passos

1. **Otimização**
   - [ ] Configurar CDN (Cloudflare)
   - [ ] Otimizar imagens
   - [ ] Implementar PWA completo

2. **Monitoramento Avançado**
   - [ ] Configurar Grafana
   - [ ] Implementar APM
   - [ ] Logs centralizados

3. **Segurança Adicional**
   - [ ] WAF configurado
   - [ ] Audit logs
   - [ ] Pen test básico

4. **Documentação**
   - [ ] Runbook de incidentes
   - [ ] Guia de troubleshooting expandido
   - [ ] Documentação de API

---

## 📞 Contatos de Emergência

- **Hostinger Support**: https://www.hostinger.com.br/contato
- **Coolify Discord**: https://discord.gg/coolify
- **Status Page**: Criar em https://statuspage.io

---

✅ **Deploy concluído com sucesso!**

Data: ___/___/______  
Responsável: ________________  
Versão: _____________________