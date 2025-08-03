# 🚀 Deploy do MyFabLab Chat AI

## Arquivos Incluídos
- `backend/` - Servidor Node.js com API segura
- `public/` - Frontend otimizado
- `nginx.conf` - Configuração do nginx
- `install.sh` - Script de instalação automática

## Como fazer o deploy

### 1. Enviar arquivos para o servidor
```bash
scp -r deploy/* user@seu-servidor:/home/user/myfablab/
```

### 2. Conectar no servidor
```bash
ssh user@seu-servidor
```

### 3. Executar instalação
```bash
cd /home/user/myfablab
chmod +x install.sh
./install.sh
```

### 4. Configurar API Key
```bash
sudo nano /var/www/myfablab/backend/.env
# Adicione: OPENROUTER_API_KEY=sua_chave_aqui
```

### 5. Configurar SSL
```bash
sudo certbot --nginx -d myfablab.online -d www.myfablab.online
```

### 6. Reiniciar serviços
```bash
pm2 restart myfablab-backend
sudo systemctl restart nginx
```

## Monitoramento

### Ver logs do backend
```bash
pm2 logs myfablab-backend
```

### Ver status
```bash
pm2 status
```

### Monitorar recursos
```bash
pm2 monit
```

## Segurança
- ✅ API Keys seguras no backend
- ✅ HTTPS obrigatório
- ✅ Headers de segurança
- ✅ Rate limiting
- ✅ CORS configurado

## Performance
- ✅ Gzip ativado
- ✅ Cache de assets estáticos
- ✅ Service Worker para offline
