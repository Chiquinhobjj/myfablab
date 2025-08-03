# Variáveis de Ambiente para EasyPanel

## IMPORTANTE: Configure estas variáveis no EasyPanel

No painel do EasyPanel, vá em **Environment Variables** e adicione:

```env
OPENROUTER_API_KEY=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
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=*
```

## Como configurar:

1. Acesse o EasyPanel: http://SEU_IP_HOSTINGER:3000
2. Clique no seu projeto MyFabLab
3. Vá em "Environment Variables" 
4. Adicione cada variável acima
5. Clique em "Save" e depois "Redeploy"

## Verificação:

Após o deploy, o backend deve mostrar no log:
```
✅ Servidor rodando na porta 3001
🔐 API Keys seguras no backend
🌍 CORS configurado para: *
```

Se aparecer "OPENROUTER_API_KEY não configurada", verifique as variáveis de ambiente no EasyPanel.