const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://myfablab.online'],
    credentials: true
}));
app.use(express.json());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 20, // limite de 20 requisições por minuto
    message: 'Muitas requisições, tente novamente em um minuto'
});

app.use('/api/', limiter);

// API Key do OpenRouter (DEVE estar no .env, NUNCA no código)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Verificar se a API key está configurada
if (!OPENROUTER_API_KEY) {
    console.error('⚠️  ERRO: OPENROUTER_API_KEY não configurada no arquivo .env');
    console.error('📝 Crie um arquivo .env na pasta backend com: OPENROUTER_API_KEY=sua_chave_aqui');
}

// Função para sanitizar input
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove scripts e elementos perigosos
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}

// Endpoint principal do chat
app.post('/api/chat', async (req, res) => {
    try {
        // Verificar se API key existe
        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({ 
                error: 'Servidor não configurado corretamente. Entre em contato com o administrador.' 
            });
        }
        
        const { messages, model, temperature, max_tokens } = req.body;
        
        // Validação básica
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Mensagens inválidas' });
        }
        
        // Sanitizar mensagens
        const sanitizedMessages = messages.map(msg => ({
            ...msg,
            content: sanitizeInput(msg.content)
        }));
        
        // Fazer requisição para OpenRouter com mensagens sanitizadas
        const response = await axios.post(OPENROUTER_URL, {
            model: model || 'meta-llama/llama-3.2-3b-instruct:free',
            messages: sanitizedMessages,
            temperature: temperature || 0.7,
            max_tokens: max_tokens || 1000
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://myfablab.online',
                'X-Title': 'MyFabLab Chat',
                'X-OpenRouter-Data-Collection': 'deny'
            }
        });
        
        // Retornar resposta
        res.json(response.data);
        
    } catch (error) {
        console.error('Erro na API:', error.response?.data || error.message);
        
        if (error.response?.status === 429) {
            res.status(429).json({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' });
        } else if (error.response?.status === 401) {
            res.status(500).json({ error: 'Erro de configuração do servidor' });
        } else {
            res.status(500).json({ error: 'Erro ao processar requisição' });
        }
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Listar modelos disponíveis
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            }
        });
        
        // Filtrar apenas modelos gratuitos
        const freeModels = response.data.data.filter(model => 
            model.id.includes(':free') || model.pricing?.prompt === 0
        );
        
        res.json({ models: freeModels });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar modelos' });
    }
});

// Servir arquivos estáticos
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Rotas específicas para cada interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/arena', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index-arena.html'));
});

app.get('/premium', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index-premium.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🔐 API Keys seguras no backend`);
    console.log(`🌍 CORS configurado para: ${process.env.ALLOWED_ORIGINS || 'localhost e myfablab.online'}`);
});