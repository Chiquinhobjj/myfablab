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
