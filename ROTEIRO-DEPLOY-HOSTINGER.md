# 📋 ROTEIRO COMPLETO DE DEPLOY - HOSTINGER VPS + EASYPANEL

## 🎯 Fluxo de Deploy Atual
```
GitHub (código) → EasyPanel (automação) → Hostinger VPS (hospedagem)
```

---

## 1️⃣ DEPLOY INICIAL (Primeira vez)

### Passo 1: Preparar o Código Localmente

```bash
# No seu computador
cd /Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online

# Verificar se está tudo ok
git status

# Se tiver mudanças, fazer commit
git add .
git commit -m "sua mensagem"
git push origin main
```

### Passo 2: Acessar o EasyPanel

1. Acesse: `http://SEU_IP_HOSTINGER:3000`
2. Login com suas credenciais do EasyPanel

### Passo 3: Criar Novo Projeto no EasyPanel

1. Clique em **"Create Project"**
2. Nome: `myfablab`
3. Tipo: **"App"**

### Passo 4: Configurar a Aplicação

```yaml
Configurações no EasyPanel:

1. Source:
   - Type: GitHub
   - Repository: https://github.com/Chiquinhobjj/myfablab
   - Branch: main
   - Auto Deploy: ✅ Ativado

2. Build:
   - Build Command: npm install && npm run build
   - Output Directory: public

3. Deploy:
   - Port: 3001
   - Health Check Path: /health

4. Environment Variables:
   OPENROUTER_API_KEY=sk-or-v1-sua-chave-aqui
   NODE_ENV=production
   PORT=3001
```

### Passo 5: Configurar Domínio

No EasyPanel:
1. Vá em **Domains**
2. Adicione: `myfablab.online`
3. Adicione: `www.myfablab.online`
4. Ative **SSL** (Let's Encrypt automático)

No Painel da Hostinger:
1. Acesse **Domínios → DNS Zone**
2. Configure:
```
Tipo | Nome | Valor          | TTL
A    | @    | SEU_IP_VPS    | 3600
A    | www  | SEU_IP_VPS    | 3600
```

### Passo 6: Deploy Inicial

1. No EasyPanel, clique em **"Deploy"**
2. Aguarde o processo:
   - Cloning repository... ✅
   - Building application... ✅
   - Starting container... ✅
   - Health check passed... ✅

**Tempo estimado: 2-3 minutos**

---

## 2️⃣ ATUALIZAÇÕES (Deploy de mudanças)

### Método 1: Automático (Recomendado)

```bash
# Fazer suas alterações localmente
# Exemplo: editar public/index.html

# Commit e push
git add .
git commit -m "fix: Corrigir interface"
git push origin main

# PRONTO! EasyPanel detecta e faz deploy automático
# Tempo: 1-2 minutos
```

### Método 2: Manual (se necessário)

1. Acesse EasyPanel: `http://SEU_IP_HOSTINGER:3000`
2. Vá no projeto `myfablab`
3. Clique em **"Redeploy"**
4. Aguarde 1-2 minutos

---

## 3️⃣ VERIFICAÇÃO PÓS-DEPLOY

### Checklist de Verificação

```bash
# 1. Verificar se o site está online
curl https://myfablab.online
# Deve retornar HTML

# 2. Verificar health check
curl https://myfablab.online/health
# Deve retornar: {"status":"ok"}

# 3. Verificar API
curl https://myfablab.online/api/health
# Deve retornar: {"status":"ok"}

# 4. Testar no navegador
# - Acesse https://myfablab.online
# - Teste enviar mensagem no chat
# - Verifique se as interfaces funcionam:
#   - / (Perplexity)
#   - /arena (MMAI Arena)
#   - /premium (Premium)
#   - /admin (Admin)
```

---

## 4️⃣ MONITORAMENTO

### No EasyPanel

1. Acesse o projeto `myfablab`
2. Veja em tempo real:
   - **Logs**: Aba "Logs" mostra output do servidor
   - **Metrics**: CPU, RAM, Network
   - **Status**: Running/Stopped
   - **Deployments**: Histórico de deploys

### Comandos Úteis SSH

```bash
# Conectar na VPS
ssh root@SEU_IP_HOSTINGER

# Ver containers rodando
docker ps

# Ver logs da aplicação
docker logs myfablab

# Ver uso de recursos
docker stats

# Reiniciar aplicação (emergência)
docker restart myfablab
```

---

## 5️⃣ TROUBLESHOOTING

### Problema: Site mostra interface roxa antiga

**Solução:**
```bash
# Limpar cache do navegador
# Ou forçar redeploy:
git commit --allow-empty -m "force: redeploy"
git push origin main
```

### Problema: Erro 502 Bad Gateway

**Solução:**
```bash
# SSH na VPS
ssh root@SEU_IP_HOSTINGER

# Verificar se container está rodando
docker ps | grep myfablab

# Se não estiver, no EasyPanel:
# Clique em "Start" no projeto
```

### Problema: API não funciona

**Solução:**
1. Verifique a env var `OPENROUTER_API_KEY` no EasyPanel
2. Certifique-se que a chave está correta
3. Redeploy após corrigir

### Problema: Deploy falha

**Solução:**
1. Verifique os logs no EasyPanel (aba "Build Logs")
2. Erros comuns:
   - Falta de memória: Reinicie a VPS
   - Erro de build: Verifique package.json
   - Porta em uso: Mude para outra porta

---

## 6️⃣ BACKUP & ROLLBACK

### Fazer Backup

```bash
# SSH na VPS
ssh root@SEU_IP_HOSTINGER

# Backup do código
cd /var/lib/easypanel/projects/myfablab
tar -czf backup-$(date +%Y%m%d).tar.gz .

# Backup do banco (se tiver)
docker exec myfablab-db pg_dump > backup-db-$(date +%Y%m%d).sql
```

### Rollback para Versão Anterior

No EasyPanel:
1. Vá em **"Deployments"**
2. Encontre o deploy anterior que funcionava
3. Clique em **"Rollback to this version"**

Ou via Git:
```bash
# Ver commits anteriores
git log --oneline -10

# Reverter para commit anterior
git revert HEAD
git push origin main
```

---

## 7️⃣ COMANDOS RÁPIDOS

### Deploy Rápido
```bash
# Alias útil - adicione ao seu .zshrc ou .bashrc
alias deploy="git add . && git commit -m 'update' && git push origin main"

# Uso:
deploy
```

### Verificação Rápida
```bash
# Criar script check.sh
#!/bin/bash
echo "🔍 Verificando MyFabLab..."
curl -s https://myfablab.online/health | grep ok && echo "✅ Site OK" || echo "❌ Site DOWN"
curl -s https://myfablab.online/api/health | grep ok && echo "✅ API OK" || echo "❌ API DOWN"
```

---

## 📊 TEMPOS MÉDIOS

| Ação | Tempo |
|------|-------|
| Push para GitHub | Instantâneo |
| EasyPanel detecta | 5-10 segundos |
| Build da aplicação | 30-60 segundos |
| Deploy do container | 10-20 segundos |
| SSL/HTTPS ativo | 30 segundos |
| **TOTAL** | **1-2 minutos** |

---

## 🚨 IMPORTANTE

1. **NUNCA** edite arquivos diretamente no servidor
2. **SEMPRE** faça mudanças localmente e use Git
3. **SEMPRE** teste localmente antes do deploy
4. **MANTENHA** backup das env vars em local seguro
5. **MONITORE** após cada deploy por 5 minutos

---

## 📞 SUPORTE

- **EasyPanel**: https://easypanel.io/docs
- **Hostinger VPS**: Ticket no painel Hostinger
- **Problemas no código**: Issues no GitHub

---

**Última atualização**: 03/08/2025
**Versão**: 2.0 (Sem Coolify, apenas EasyPanel)