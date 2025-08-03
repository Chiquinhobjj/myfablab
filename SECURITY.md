# 🔐 Segurança - MyFabLab AI

## ⚠️ AVISO IMPORTANTE

As correções de segurança foram implementadas. **NUNCA** commite arquivos com API keys!

## ✅ Correções Implementadas

### 1. **Backend Proxy Seguro**
- Criado servidor backend em Node.js/Express
- API keys agora ficam apenas no servidor
- Todas as chamadas passam pelo proxy `/api/chat`

### 2. **Sanitização de Inputs**
- Função `sanitizeInput()` remove scripts maliciosos
- Proteção contra XSS (Cross-Site Scripting)
- Validação de dados antes de enviar para API

### 3. **Rate Limiting**
- Limite de 10 requisições por minuto
- Proteção contra abuso e custos excessivos

### 4. **Configuração Segura**
- API keys em arquivo `.env` (não versionado)
- Arquivo `.env.example` como template
- Verificação de configuração ao iniciar

## 🚀 Como Usar

### 1. Configurar API Key
```bash
# Copie o arquivo de exemplo
cp .env.example backend/.env

# Edite e adicione sua chave
nano backend/.env
```

### 2. Instalar Dependências
```bash
cd backend
npm install
```

### 3. Iniciar Servidor
```bash
# Usar o script de inicialização
./start.sh

# Ou manualmente
cd backend
npm start
```

### 4. Acessar Aplicação
- Local: http://localhost:3001
- Produção: https://myfablab.online

## 🛡️ Checklist de Segurança

- [x] API keys removidas do frontend
- [x] Backend proxy implementado
- [x] Sanitização de inputs
- [x] Rate limiting configurado
- [x] CORS configurado corretamente
- [x] Validação de dados
- [x] Tratamento de erros
- [x] Headers de segurança

## 📝 Arquivos Importantes

- `backend/server.js` - Servidor seguro
- `.env.example` - Template de configuração
- `.gitignore` - Garante que .env não seja commitado
- `start.sh` - Script de inicialização

## ⚠️ O Que NÃO Fazer

1. **NUNCA** coloque API keys no código frontend
2. **NUNCA** commite o arquivo `.env`
3. **NUNCA** desabilite a sanitização de inputs
4. **NUNCA** remova o rate limiting

## 🔍 Monitoramento

Monitore regularmente:
- Logs do servidor para tentativas de abuso
- Uso da API no dashboard do OpenRouter
- Erros de autenticação

## 📞 Suporte

Em caso de problemas de segurança:
1. Revogue imediatamente a API key comprometida
2. Gere uma nova chave no OpenRouter
3. Atualize o arquivo `.env`
4. Reinicie o servidor

---
**Lembre-se**: A segurança é uma responsabilidade contínua!