// Database completo de modelos do OpenRouter
// Atualizado em: Dezembro 2024

export const OPENROUTER_MODELS = {
    // Modelos Gratuitos
    'nousresearch/hermes-3-llama-3.1-405b:free': {
        id: 'nousresearch/hermes-3-llama-3.1-405b:free',
        name: 'Hermes 3 (405B)',
        provider: 'NousResearch',
        description: 'Modelo Llama 3.1 405B ajustado para seguir instruções e conversação',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'analysis'],
        strengths: ['Raciocínio complexo', 'Seguimento de instruções', 'Código'],
        releaseDate: '2024-07',
        isFree: true,
        tags: ['free', 'llama', 'instruction-following']
    },
    'meta-llama/llama-3.2-1b-instruct:free': {
        id: 'meta-llama/llama-3.2-1b-instruct:free',
        name: 'Llama 3.2 1B Instruct',
        provider: 'Meta',
        description: 'Modelo compacto e eficiente da Meta, otimizado para dispositivos móveis',
        contextLength: 128000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Eficiência', 'Dispositivos móveis'],
        releaseDate: '2024-09',
        isFree: true,
        tags: ['free', 'llama', 'efficient', 'mobile']
    },
    'meta-llama/llama-3.2-3b-instruct:free': {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2 3B Instruct',
        provider: 'Meta',
        description: 'Versão maior do Llama 3.2, com melhor performance em tarefas complexas',
        contextLength: 128000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'analysis'],
        strengths: ['Equilíbrio performance/velocidade', 'Multilingual'],
        releaseDate: '2024-09',
        isFree: true,
        tags: ['free', 'llama', 'balanced']
    },
    'microsoft/phi-3-mini-128k-instruct:free': {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi-3 Mini 128K',
        provider: 'Microsoft',
        description: 'Modelo pequeno mas poderoso da Microsoft com contexto estendido',
        contextLength: 128000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'math'],
        strengths: ['Matemática', 'Raciocínio', 'Contexto longo'],
        releaseDate: '2024-04',
        isFree: true,
        tags: ['free', 'microsoft', 'math', 'long-context']
    },
    'google/gemma-2-9b-it:free': {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B',
        provider: 'Google',
        description: 'Modelo open-source do Google com excelente performance',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'analysis'],
        strengths: ['Qualidade de resposta', 'Segurança', 'Multilingual'],
        releaseDate: '2024-06',
        isFree: true,
        tags: ['free', 'google', 'open-source']
    },
    'mistralai/mistral-7b-instruct:free': {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B Instruct',
        provider: 'Mistral AI',
        description: 'Modelo eficiente e poderoso da Mistral AI',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Eficiência', 'Velocidade', 'Código'],
        releaseDate: '2023-09',
        isFree: true,
        tags: ['free', 'mistral', 'efficient']
    },
    'qwen/qwen-2.5-7b-instruct': {
        id: 'qwen/qwen-2.5-7b-instruct',
        name: 'Qwen 2.5 7B',
        provider: 'Alibaba',
        description: 'Modelo multilingual forte em idiomas asiáticos',
        contextLength: 32768,
        pricing: { prompt: 0.0002, completion: 0.0002 },
        capabilities: ['text', 'code', 'multilingual'],
        strengths: ['Chinês', 'Multilingual', 'Código'],
        releaseDate: '2024-11',
        isFree: false,
        tags: ['qwen', 'multilingual', 'asian-languages']
    },

    // Modelos Premium - Anthropic
    'anthropic/claude-3.5-sonnet': {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        description: 'Modelo mais avançado da Anthropic, excelente em raciocínio e código',
        contextLength: 200000,
        pricing: { prompt: 0.003, completion: 0.015 },
        capabilities: ['text', 'code', 'analysis', 'vision'],
        strengths: ['Raciocínio', 'Código', 'Análise detalhada', 'Visão'],
        releaseDate: '2024-10',
        isFree: false,
        tags: ['anthropic', 'claude', 'premium', 'vision']
    },
    'anthropic/claude-3-opus': {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        description: 'Modelo mais poderoso para tarefas complexas',
        contextLength: 200000,
        pricing: { prompt: 0.015, completion: 0.075 },
        capabilities: ['text', 'code', 'analysis', 'vision'],
        strengths: ['Tarefas complexas', 'Pesquisa', 'Análise profunda'],
        releaseDate: '2024-03',
        isFree: false,
        tags: ['anthropic', 'claude', 'premium', 'powerful']
    },
    'anthropic/claude-3-haiku': {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        description: 'Modelo rápido e eficiente da Anthropic',
        contextLength: 200000,
        pricing: { prompt: 0.00025, completion: 0.00125 },
        capabilities: ['text', 'code', 'vision'],
        strengths: ['Velocidade', 'Custo-benefício', 'Tarefas simples'],
        releaseDate: '2024-03',
        isFree: false,
        tags: ['anthropic', 'claude', 'fast', 'efficient']
    },

    // Modelos Premium - OpenAI
    'openai/gpt-4o': {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        description: 'Modelo multimodal mais recente da OpenAI',
        contextLength: 128000,
        pricing: { prompt: 0.005, completion: 0.015 },
        capabilities: ['text', 'code', 'vision', 'analysis'],
        strengths: ['Multimodal', 'Raciocínio', 'Velocidade'],
        releaseDate: '2024-05',
        isFree: false,
        tags: ['openai', 'gpt4', 'multimodal', 'premium']
    },
    'openai/gpt-4-turbo': {
        id: 'openai/gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: 'GPT-4 com contexto de 128k e conhecimento atualizado',
        contextLength: 128000,
        pricing: { prompt: 0.01, completion: 0.03 },
        capabilities: ['text', 'code', 'vision', 'analysis'],
        strengths: ['Contexto longo', 'Conhecimento atualizado', 'Visão'],
        releaseDate: '2024-04',
        isFree: false,
        tags: ['openai', 'gpt4', 'turbo', 'vision']
    },
    'openai/gpt-3.5-turbo': {
        id: 'openai/gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: 'Modelo rápido e eficiente da OpenAI',
        contextLength: 16385,
        pricing: { prompt: 0.0005, completion: 0.0015 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Custo-benefício', 'Confiabilidade'],
        releaseDate: '2023-03',
        isFree: false,
        tags: ['openai', 'gpt3.5', 'efficient']
    },

    // Modelos Premium - Google
    'google/gemini-pro-1.5': {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        provider: 'Google',
        description: 'Modelo avançado do Google com contexto ultra-longo',
        contextLength: 2097152,
        pricing: { prompt: 0.0035, completion: 0.0105 },
        capabilities: ['text', 'code', 'vision', 'analysis'],
        strengths: ['Contexto extremamente longo', 'Multimodal', 'Análise de documentos'],
        releaseDate: '2024-05',
        isFree: false,
        tags: ['google', 'gemini', 'long-context', 'multimodal']
    },
    'google/gemini-pro': {
        id: 'google/gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Modelo multimodal do Google',
        contextLength: 32768,
        pricing: { prompt: 0.00125, completion: 0.00375 },
        capabilities: ['text', 'code', 'vision'],
        strengths: ['Multimodal', 'Raciocínio', 'Eficiência'],
        releaseDate: '2023-12',
        isFree: false,
        tags: ['google', 'gemini', 'multimodal']
    },

    // Modelos Premium - Outros
    'x-ai/grok-2': {
        id: 'x-ai/grok-2',
        name: 'Grok 2',
        provider: 'xAI',
        description: 'Modelo da xAI com personalidade única e acesso a informações em tempo real',
        contextLength: 131072,
        pricing: { prompt: 0.01, completion: 0.03 },
        capabilities: ['text', 'code', 'real-time'],
        strengths: ['Humor', 'Informações atualizadas', 'Personalidade'],
        releaseDate: '2024-08',
        isFree: false,
        tags: ['xai', 'grok', 'real-time']
    },
    'perplexity/llama-3.1-sonar-large-128k-online': {
        id: 'perplexity/llama-3.1-sonar-large-128k-online',
        name: 'Sonar Large (Online)',
        provider: 'Perplexity',
        description: 'Modelo com acesso à internet para informações atualizadas',
        contextLength: 127072,
        pricing: { prompt: 0.001, completion: 0.001 },
        capabilities: ['text', 'web-search', 'real-time'],
        strengths: ['Busca na web', 'Informações atualizadas', 'Fontes'],
        releaseDate: '2024-07',
        isFree: false,
        tags: ['perplexity', 'online', 'web-search']
    },
    'cohere/command-r-plus': {
        id: 'cohere/command-r-plus',
        name: 'Command R+',
        provider: 'Cohere',
        description: 'Modelo otimizado para RAG e uso empresarial',
        contextLength: 128000,
        pricing: { prompt: 0.003, completion: 0.015 },
        capabilities: ['text', 'code', 'rag'],
        strengths: ['RAG', 'Multilingual', 'Uso empresarial'],
        releaseDate: '2024-04',
        isFree: false,
        tags: ['cohere', 'rag', 'enterprise']
    }
};

// Função helper para filtrar modelos
export function filterModels(filters = {}) {
    const models = Object.values(OPENROUTER_MODELS);
    
    return models.filter(model => {
        if (filters.free !== undefined && model.isFree !== filters.free) return false;
        if (filters.provider && model.provider !== filters.provider) return false;
        if (filters.capability && !model.capabilities.includes(filters.capability)) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return model.name.toLowerCase().includes(searchLower) ||
                   model.provider.toLowerCase().includes(searchLower) ||
                   model.description.toLowerCase().includes(searchLower) ||
                   model.tags.some(tag => tag.toLowerCase().includes(searchLower));
        }
        return true;
    });
}

// Função para obter apenas modelos gratuitos
export function getFreeModels() {
    return filterModels({ free: true });
}

// Função para agrupar modelos por provider
export function groupModelsByProvider() {
    const grouped = {};
    Object.values(OPENROUTER_MODELS).forEach(model => {
        if (!grouped[model.provider]) {
            grouped[model.provider] = [];
        }
        grouped[model.provider].push(model);
    });
    return grouped;
}

// Função para obter capabilities únicas
export function getAllCapabilities() {
    const capabilities = new Set();
    Object.values(OPENROUTER_MODELS).forEach(model => {
        model.capabilities.forEach(cap => capabilities.add(cap));
    });
    return Array.from(capabilities).sort();
}

// Função para obter providers únicos
export function getAllProviders() {
    const providers = new Set();
    Object.values(OPENROUTER_MODELS).forEach(model => {
        providers.add(model.provider);
    });
    return Array.from(providers).sort();
}