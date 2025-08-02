# Deploy no EasyPanel

## 1. Instalação do EasyPanel

Conecte ao seu VPS via SSH e execute:

```bash
curl -sSL https://get.easypanel.io | sudo bash
```

## 2. Acesso ao EasyPanel

Após a instalação, acesse:
- URL: http://72.60.0.69:3000
- Crie uma conta de administrador na primeira vez

## 3. Criar Novo Projeto

1. Clique em "Create Project"
2. Escolha "App"
3. Nome: `myfablab`
4. Clique em "Create"

## 4. Configurar Source

1. Na aba "Source":
   - Type: **Git**
   - Repository: `https://github.com/Chiquinhobjj/myfablab`
   - Branch: `main`
   - Auto Deploy: **ON**

2. Na aba "Build":
   - Build Type: **Dockerfile**
   - Dockerfile Path: `./Dockerfile` (padrão)
   - Context: `.` (padrão)

## 5. Configurar Domínio

1. Na aba "Domains":
   - Clique em "Add Domain"
   - Domain: `myfablab.online`
   - Clique em "Add"
   - Ative "Enable HTTPS" (SSL automático)

2. Adicione também:
   - Domain: `www.myfablab.online`
   - Redirect to: `myfablab.online`

## 6. Variáveis de Ambiente

Na aba "Environment":
```
OPENROUTER_API_KEY=your-actual-api-key
SERVER_NAME=myfablab.online
CORS_ORIGIN=https://myfablab.online
```

## 7. Deploy

1. Clique em "Deploy"
2. Aguarde o build e deploy
3. Verifique os logs se houver erro

## 8. DNS

Mantenha os registros DNS apontando para o IP do VPS:
- A record: `@` → `72.60.0.69`
- A record: `www` → `72.60.0.69`

## Troubleshooting

### Se der erro de porta:
- O EasyPanel usa a porta 80/443 automaticamente
- Não precisa configurar porta no Dockerfile

### Se der erro de build:
- Verifique os logs de build
- Certifique-se que todos os arquivos estão no repositório

### SSL não funciona:
- Aguarde alguns minutos para o Let's Encrypt gerar o certificado
- Verifique se o DNS está apontando corretamente

## Comandos Úteis

```bash
# Ver status do EasyPanel
systemctl status easypanel

# Reiniciar EasyPanel
systemctl restart easypanel

# Ver logs
journalctl -u easypanel -f
```