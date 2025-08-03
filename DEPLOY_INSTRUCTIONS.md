# 🚀 Instruções de Deploy - MyFabLab Chat AI

## Deploy via GitHub no EasyPanel

### 1. Criar Repositório no GitHub

```bash
# Na pasta do projeto, execute:
git remote add origin https://github.com/SEU_USUARIO/myfablab-chat-ai.git
git branch -M main
git push -u origin main
```

### 2. Configurar no EasyPanel

1. Acesse seu painel EasyPanel
2. Clique em **"Create New Service"**
3. Selecione **"GitHub"**
4. Configure:
   - **Repository**: `https://github.com/SEU_USUARIO/myfablab-chat-ai`
   - **Branch**: `main`
   - **Build Type**: `Dockerfile`
   - **Port**: `80`

### 3. Variáveis de Ambiente

Não é necessário configurar variáveis! As 3 API keys já estão no código:
- MyFabLab API 1
- MyFabLab API 2  
- MyFabLab API 3

### 4. Domínio

Configure seu domínio personalizado ou use o fornecido pelo EasyPanel.

### 5. Deploy Automático

Após conectar o GitHub, cada push para `main` fará deploy automático!

## 🎯 Recursos Disponíveis

- ✅ 59 modelos gratuitos do OpenRouter
- ✅ Interface moderna com filtros
- ✅ Categorias: Ultra Context, Reasoning, Vision, Code, Uncensored
- ✅ Rotação automática entre 3 API keys
- ✅ Visualização Grid e Table
- ✅ Tema claro/escuro

## 📝 Comandos Úteis

```bash
# Ver status
git status

# Fazer commit de mudanças
git add .
git commit -m "Descrição das mudanças"
git push

# Ver logs do deploy
# Acesse o painel do EasyPanel
```

## 🔧 Troubleshooting

Se houver problemas:
1. Verifique os logs no EasyPanel
2. Confirme que o Dockerfile está correto
3. Verifique se a porta 80 está configurada
4. Teste localmente com: `docker build -t myfablab . && docker run -p 8080:80 myfablab`

---

**Pronto para deploy!** 🚀