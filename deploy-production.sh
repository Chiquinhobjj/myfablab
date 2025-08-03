#!/bin/bash

# Script de Deploy Seguro para MyFabLab Chat AI
# ============================================

echo "🚀 Iniciando deploy seguro do MyFabLab Chat AI"
echo "============================================"

# Verificar se estamos no diretório correto
if [ ! -f "backend/server.js" ]; then
    echo "❌ Erro: Execute este script do diretório raiz do projeto"
    exit 1
fi

# 1. Criar estrutura de deploy
echo "📁 Criando estrutura de deploy..."
mkdir -p deploy/{backend,public}

# 2. Copiar backend (sem node_modules)
echo "📦 Preparando backend..."
cp -r backend/* deploy/backend/
cp backend/.env.example deploy/backend/.env

# 3. Copiar frontend público
echo "🎨 Preparando frontend..."
cp -r public/* deploy/public/

# 4. Criar arquivo de configuração do nginx
echo "🔧 Criando configuração do nginx..."
cat > deploy/nginx.conf << 'EOF'
server {
    listen 80;
    server_name myfablab.online www.myfablab.online;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myfablab.online www.myfablab.online;
    
    # SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/myfablab.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myfablab.online/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://myfablab.online;" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Frontend
    root /var/www/myfablab/public;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 5. Criar script de instalação no servidor
echo "📝 Criando script de instalação..."
cat > deploy/install.sh << 'EOF'
#!/bin/bash

# Script de instalação no servidor VPS
echo "🚀 Instalando MyFabLab Chat AI no servidor..."

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Criar diretórios
sudo mkdir -p /var/www/myfablab/{backend,public}

# Copiar arquivos
sudo cp -r backend/* /var/www/myfablab/backend/
sudo cp -r public/* /var/www/myfablab/public/

# Instalar dependências
cd /var/www/myfablab/backend
npm install --production

# Configurar variáveis de ambiente
echo "⚠️  IMPORTANTE: Edite /var/www/myfablab/backend/.env com sua API key!"

# Configurar PM2
pm2 start server.js --name myfablab-backend
pm2 save
pm2 startup

# Configurar nginx
sudo cp nginx.conf /etc/nginx/sites-available/myfablab
sudo ln -s /etc/nginx/sites-available/myfablab /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Instalação concluída!"
echo "📝 Próximos passos:"
echo "1. Configure a API key em /var/www/myfablab/backend/.env"
echo "2. Configure SSL com: sudo certbot --nginx -d myfablab.online -d www.myfablab.online"
echo "3. Reinicie o backend: pm2 restart myfablab-backend"
EOF

chmod +x deploy/install.sh

# 6. Criar README de deploy
echo "📚 Criando documentação..."
cat > deploy/README.md << 'EOF'
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
EOF

# 7. Criar arquivo de deploy compactado
echo "📦 Criando arquivo de deploy..."
cd deploy
tar -czf ../myfablab-deploy-secure.tar.gz *
cd ..

echo "✅ Deploy preparado com sucesso!"
echo "📦 Arquivo criado: myfablab-deploy-secure.tar.gz"
echo ""
echo "🚀 Próximos passos:"
echo "1. Envie o arquivo para o servidor:"
echo "   scp myfablab-deploy-secure.tar.gz user@servidor:/home/user/"
echo ""
echo "2. No servidor, extraia e instale:"
echo "   tar -xzf myfablab-deploy-secure.tar.gz"
echo "   ./install.sh"
echo ""
echo "3. Configure a API key em .env"
echo "4. Configure SSL com Let's Encrypt"
echo ""
echo "🔐 Lembre-se: NUNCA commite o arquivo .env com as chaves reais!"