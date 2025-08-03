# 🚀 Deploy Rápido - MyFabLab AI

## Opção 1: Deploy Local (Desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/Chiquinhobjj/myfablab.git
cd myfablab

# 2. Configure a API key
cp .env.example backend/.env
# Edite backend/.env e adicione sua OPENROUTER_API_KEY

# 3. Inicie o servidor
./start.sh

# 4. Acesse
# http://localhost:3001
```

## Opção 2: Deploy com Docker

```bash
# 1. Clone e configure
git clone https://github.com/Chiquinhobjj/myfablab.git
cd myfablab
cp .env.example backend/.env
# Edite backend/.env

# 2. Build e execute
docker-compose up -d

# 3. Acesse
# http://localhost:3001
```

## Opção 3: Deploy na Hostinger VPS

```bash
# 1. No seu computador local
./deploy.sh

# 2. Faça upload do myfablab-deploy.tar.gz para o servidor
scp myfablab-deploy.tar.gz root@SEU_IP:/root/

# 3. No servidor
ssh root@SEU_IP
tar -xzf myfablab-deploy.tar.gz
cd backend && cp ../.env.example .env
nano .env  # Adicione sua API key
cd ..
./start.sh
```

## Interfaces Disponíveis

- `/` - Interface Perplexity (limpa, sem ícones)
- `/arena` - MMAI Arena (batalhas entre IAs)
- `/premium` - Interface Premium (estilo Apple/ChatGPT)
- `/admin` - Painel Administrativo

## Requisitos

- Node.js 18+ 
- NPM 8+
- OpenRouter API Key (grátis em https://openrouter.ai/keys)

## Segurança

✅ API keys protegidas no backend
✅ Sanitização contra XSS
✅ Rate limiting configurado
✅ CORS configurado
✅ Headers de segurança

## Suporte

Problemas? Abra uma issue em:
https://github.com/Chiquinhobjj/myfablab/issues