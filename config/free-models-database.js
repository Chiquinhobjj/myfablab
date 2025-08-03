// Database completo de modelos GRATUITOS do OpenRouter
// Atualizado em: Janeiro 2025
// Total: 59 modelos gratuitos!

export const FREE_OPENROUTER_MODELS = {
    // Modelos Horizon (Ultra Context)
    'openrouter/horizon-beta': {
        id: 'openrouter/horizon-beta',
        name: 'Horizon Beta',
        provider: 'OpenRouter',
        description: 'Modelo experimental com contexto ultra-longo',
        contextLength: 256000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'ultra-context'],
        strengths: ['Contexto extremamente longo', 'Experimental'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'ultra-context', 'experimental', 'new']
    },
    'openrouter/horizon-alpha': {
        id: 'openrouter/horizon-alpha',
        name: 'Horizon Alpha',
        provider: 'OpenRouter',
        description: 'Versão alpha do modelo Horizon',
        contextLength: 256000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'ultra-context'],
        strengths: ['Contexto ultra-longo', 'Versão alpha'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'ultra-context', 'alpha']
    },

    // Google Gemini (Top Models)
    'google/gemini-2.0-flash-exp:free': {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash Experimental',
        provider: 'Google',
        description: 'Modelo mais recente do Google com contexto de 1M tokens!',
        contextLength: 1048576,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'ultra-context', 'multimodal'],
        strengths: ['Contexto de 1M tokens', 'Multimodal', 'Ultra rápido'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'google', 'ultra-context', '1m-context', 'multimodal', 'new']
    },
    'google/gemini-2.5-pro-exp-03-25': {
        id: 'google/gemini-2.5-pro-exp-03-25',
        name: 'Gemini 2.5 Pro Experimental',
        provider: 'Google',
        description: 'Versão experimental do Gemini Pro com capacidades avançadas',
        contextLength: 1048576,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'ultra-context', 'multimodal'],
        strengths: ['1M tokens', 'Experimental', 'Capacidades avançadas'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'google', 'ultra-context', 'experimental', 'new']
    },
    'google/gemma-3-27b-it:free': {
        id: 'google/gemma-3-27b-it:free',
        name: 'Gemma 3 27B',
        provider: 'Google',
        description: 'Modelo Gemma de grande porte com excelente performance',
        contextLength: 96000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Alta qualidade', 'Contexto longo', 'Open source'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'google', 'gemma', 'open-source']
    },
    'google/gemma-3-12b-it:free': {
        id: 'google/gemma-3-12b-it:free',
        name: 'Gemma 3 12B',
        provider: 'Google',
        description: 'Versão média do Gemma 3 com bom equilíbrio',
        contextLength: 96000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Equilíbrio performance/velocidade', 'Open source'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'google', 'gemma', 'balanced']
    },
    'google/gemma-3-4b-it:free': {
        id: 'google/gemma-3-4b-it:free',
        name: 'Gemma 3 4B',
        provider: 'Google',
        description: 'Modelo Gemma compacto e eficiente',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Eficiência', 'Mobile-friendly'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'google', 'gemma', 'efficient']
    },
    'google/gemma-3n-e2b-it:free': {
        id: 'google/gemma-3n-e2b-it:free',
        name: 'Gemma 3n 2B',
        provider: 'Google',
        description: 'Versão nano do Gemma 3, ultra-compacta',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text'],
        strengths: ['Ultra-rápido', 'Dispositivos móveis'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'google', 'gemma', 'nano', 'mobile']
    },
    'google/gemma-3n-e4b-it:free': {
        id: 'google/gemma-3n-e4b-it:free',
        name: 'Gemma 3n 4B',
        provider: 'Google',
        description: 'Versão nano 4B do Gemma 3',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text'],
        strengths: ['Rápido', 'Compacto'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'google', 'gemma', 'nano']
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

    // DeepSeek Models (Reasoning)
    'deepseek/deepseek-r1:free': {
        id: 'deepseek/deepseek-r1:free',
        name: 'DeepSeek R1',
        provider: 'DeepSeek',
        description: 'Modelo de raciocínio avançado com Chain-of-Thought',
        contextLength: 163840,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'code', 'math'],
        strengths: ['Raciocínio profundo', 'Matemática', 'Código complexo'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'cot', 'math', 'new']
    },
    'deepseek/deepseek-r1-0528:free': {
        id: 'deepseek/deepseek-r1-0528:free',
        name: 'DeepSeek R1 0528',
        provider: 'DeepSeek',
        description: 'Versão específica do DeepSeek R1',
        contextLength: 163840,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'code'],
        strengths: ['Raciocínio', 'Estabilidade'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'stable']
    },
    'deepseek/deepseek-chat-v3-0324:free': {
        id: 'deepseek/deepseek-chat-v3-0324:free',
        name: 'DeepSeek V3 0324',
        provider: 'DeepSeek',
        description: 'Versão chat otimizada do DeepSeek',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'chat', 'code'],
        strengths: ['Conversação', 'Código'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'chat', 'deepseek']
    },
    'deepseek/deepseek-r1-distill-qwen-14b:free': {
        id: 'deepseek/deepseek-r1-distill-qwen-14b:free',
        name: 'DeepSeek R1 Distill Qwen 14B',
        provider: 'DeepSeek',
        description: 'Conhecimento do R1 destilado em modelo menor',
        contextLength: 64000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'code'],
        strengths: ['Raciocínio eficiente', 'Tamanho reduzido'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'distilled']
    },
    'deepseek/deepseek-r1-distill-llama-70b:free': {
        id: 'deepseek/deepseek-r1-distill-llama-70b:free',
        name: 'DeepSeek R1 Distill Llama 70B',
        provider: 'DeepSeek',
        description: 'R1 destilado em Llama 70B',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'code'],
        strengths: ['Raciocínio poderoso', 'Base Llama'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'llama', 'distilled']
    },

    // Meta Llama Models
    'meta-llama/llama-3.3-70b-instruct:free': {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'Llama 3.3 70B',
        provider: 'Meta',
        description: 'Modelo mais recente da Meta com 70B parâmetros',
        contextLength: 65536,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'analysis'],
        strengths: ['Alta qualidade', 'Multilingual', 'Versatilidade'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'llama', 'meta', 'powerful', 'new']
    },
    'meta-llama/llama-3.2-11b-vision-instruct:free': {
        id: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        name: 'Llama 3.2 11B Vision',
        provider: 'Meta',
        description: 'Modelo Llama com capacidades de visão',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'multimodal'],
        strengths: ['Análise de imagens', 'Contexto longo', 'Multimodal'],
        releaseDate: '2024-09',
        isFree: true,
        tags: ['free', 'llama', 'vision', 'multimodal']
    },
    'meta-llama/llama-3.2-3b-instruct:free': {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2 3B',
        provider: 'Meta',
        description: 'Versão compacta do Llama 3.2',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Eficiência', 'Contexto longo', 'Mobile-friendly'],
        releaseDate: '2024-09',
        isFree: true,
        tags: ['free', 'llama', 'efficient', 'mobile']
    },
    'meta-llama/llama-3.1-405b-instruct:free': {
        id: 'meta-llama/llama-3.1-405b-instruct:free',
        name: 'Llama 3.1 405B',
        provider: 'Meta',
        description: 'Um dos maiores modelos open-source disponíveis',
        contextLength: 65536,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'analysis', 'reasoning'],
        strengths: ['Extremamente poderoso', 'Raciocínio complexo', 'Multilingual'],
        releaseDate: '2024-07',
        isFree: true,
        tags: ['free', 'llama', 'massive', 'powerful']
    },

    // Qwen Models (Chinese + Reasoning)
    'qwen/qwq-32b:free': {
        id: 'qwen/qwq-32b:free',
        name: 'QwQ 32B',
        provider: 'Alibaba',
        description: 'Modelo de raciocínio estilo o1 da Alibaba',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'math', 'code'],
        strengths: ['Raciocínio passo-a-passo', 'Matemática', 'Problemas complexos'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'reasoning', 'qwen', 'math', 'cot']
    },
    'qwen/qwen-2.5-72b-instruct:free': {
        id: 'qwen/qwen-2.5-72b-instruct:free',
        name: 'Qwen 2.5 72B',
        provider: 'Alibaba',
        description: 'Modelo multilingual poderoso da Alibaba',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'multilingual'],
        strengths: ['Chinês', 'Multilingual', 'Código'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'qwen', 'multilingual', 'chinese']
    },
    'qwen/qwen-2.5-coder-32b-instruct:free': {
        id: 'qwen/qwen-2.5-coder-32b-instruct:free',
        name: 'Qwen 2.5 Coder 32B',
        provider: 'Alibaba',
        description: 'Especializado em programação e código',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['code', 'text'],
        strengths: ['Programação', 'Debug', 'Múltiplas linguagens'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'qwen', 'code', 'programming']
    },
    'qwen/qwen2.5-vl-72b-instruct:free': {
        id: 'qwen/qwen2.5-vl-72b-instruct:free',
        name: 'Qwen 2.5 VL 72B',
        provider: 'Alibaba',
        description: 'Modelo multimodal com visão',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'multimodal'],
        strengths: ['Análise de imagens', 'OCR', 'Multimodal'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'qwen', 'vision', 'multimodal']
    },
    'qwen/qwen2.5-vl-32b-instruct:free': {
        id: 'qwen/qwen2.5-vl-32b-instruct:free',
        name: 'Qwen 2.5 VL 32B',
        provider: 'Alibaba',
        description: 'Versão menor do modelo multimodal',
        contextLength: 8192,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'multimodal'],
        strengths: ['Visão', 'Eficiência', 'OCR'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'qwen', 'vision', 'efficient']
    },
    'qwen/qwen3-coder:free': {
        id: 'qwen/qwen3-coder:free',
        name: 'Qwen3 Coder',
        provider: 'Alibaba',
        description: 'Nova geração do Qwen especializada em código',
        contextLength: 262144,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['code', 'text'],
        strengths: ['Contexto ultra-longo para código', 'Múltiplas linguagens'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'qwen', 'code', 'ultra-context', 'new']
    },

    // Mistral Models
    'mistralai/mistral-small-3.2-24b-instruct:free': {
        id: 'mistralai/mistral-small-3.2-24b-instruct:free',
        name: 'Mistral Small 3.2 24B',
        provider: 'Mistral AI',
        description: 'Versão mais recente do Mistral Small',
        contextLength: 96000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Qualidade', 'Contexto longo'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'mistral', 'balanced', 'new']
    },
    'mistralai/mistral-small-3.1-24b-instruct:free': {
        id: 'mistralai/mistral-small-3.1-24b-instruct:free',
        name: 'Mistral Small 3.1 24B',
        provider: 'Mistral AI',
        description: 'Versão anterior do Mistral Small',
        contextLength: 128000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Contexto extra-longo', 'Estável'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'mistral', 'stable']
    },
    'mistralai/mistral-small-24b-instruct-2501:free': {
        id: 'mistralai/mistral-small-24b-instruct-2501:free',
        name: 'Mistral Small 3',
        provider: 'Mistral AI',
        description: 'Versão de janeiro 2025 do Mistral Small',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Atualizado', 'Eficiente'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'mistral', 'new']
    },
    'mistralai/mistral-nemo:free': {
        id: 'mistralai/mistral-nemo:free',
        name: 'Mistral Nemo',
        provider: 'Mistral AI',
        description: 'Modelo compacto e eficiente da Mistral',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Contexto longo', 'Eficiência', 'Velocidade'],
        releaseDate: '2024-07',
        isFree: true,
        tags: ['free', 'mistral', 'efficient', 'long-context']
    },
    'mistralai/mistral-7b-instruct:free': {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        provider: 'Mistral AI',
        description: 'Modelo clássico e confiável da Mistral',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Eficiência', 'Velocidade', 'Confiabilidade'],
        releaseDate: '2023-09',
        isFree: true,
        tags: ['free', 'mistral', 'classic', 'reliable']
    },
    'mistralai/devstral-small-2505:free': {
        id: 'mistralai/devstral-small-2505:free',
        name: 'Devstral Small',
        provider: 'Mistral AI',
        description: 'Modelo especializado para desenvolvimento',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['code', 'text'],
        strengths: ['Programação', 'DevOps', 'Documentação'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'mistral', 'code', 'dev', 'new']
    },

    // Moonshot/Kimi Models
    'moonshotai/kimi-k2:free': {
        id: 'moonshotai/kimi-k2:free',
        name: 'Kimi K2',
        provider: 'Moonshot AI',
        description: 'Modelo chinês com forte capacidade multilingual',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Chinês', 'Contexto', 'Conversação'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'kimi', 'chinese', 'multilingual']
    },
    'moonshotai/kimi-dev-72b:free': {
        id: 'moonshotai/kimi-dev-72b:free',
        name: 'Kimi Dev 72B',
        provider: 'Moonshot AI',
        description: 'Versão de desenvolvimento do Kimi',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'multilingual'],
        strengths: ['Contexto longo', 'Desenvolvimento', 'Chinês'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'kimi', 'dev', 'long-context']
    },
    'moonshotai/kimi-vl-a3b-thinking:free': {
        id: 'moonshotai/kimi-vl-a3b-thinking:free',
        name: 'Kimi VL A3B Thinking',
        provider: 'Moonshot AI',
        description: 'Modelo multimodal com raciocínio',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'vision', 'reasoning', 'multimodal'],
        strengths: ['Visão', 'Raciocínio', 'Análise de imagens'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'kimi', 'vision', 'reasoning', 'multimodal']
    },

    // Dolphin Models (Uncensored)
    'cognitivecomputations/dolphin-mistral-24b-venice-edition:free': {
        id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        name: 'Venice Uncensored',
        provider: 'Cognitive Computations',
        description: 'Modelo sem censura para casos de uso especiais',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'uncensored'],
        strengths: ['Sem censura', 'Criatividade', 'Flexibilidade'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'uncensored', 'dolphin', 'venice']
    },
    'cognitivecomputations/dolphin3.0-r1-mistral-24b:free': {
        id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
        name: 'Dolphin 3.0 R1',
        provider: 'Cognitive Computations',
        description: 'Dolphin com capacidades de raciocínio',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'uncensored'],
        strengths: ['Raciocínio', 'Sem censura', 'Versatilidade'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'uncensored', 'dolphin', 'reasoning']
    },
    'cognitivecomputations/dolphin3.0-mistral-24b:free': {
        id: 'cognitivecomputations/dolphin3.0-mistral-24b:free',
        name: 'Dolphin 3.0',
        provider: 'Cognitive Computations',
        description: 'Versão padrão do Dolphin 3.0',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'uncensored'],
        strengths: ['Sem censura', 'Conversação natural'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'uncensored', 'dolphin']
    },

    // Specialized Models
    'z-ai/glm-4.5-air:free': {
        id: 'z-ai/glm-4.5-air:free',
        name: 'GLM 4.5 Air',
        provider: 'Z.AI',
        description: 'Modelo chinês eficiente',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Chinês', 'Contexto longo', 'Eficiência'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'glm', 'chinese', 'efficient']
    },
    'thudm/glm-z1-32b:free': {
        id: 'thudm/glm-z1-32b:free',
        name: 'GLM Z1 32B',
        provider: 'THUDM',
        description: 'Modelo GLM otimizado',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Chinês', 'Inglês', 'Eficiência'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'glm', 'chinese']
    },
    'nvidia/llama-3.1-nemotron-ultra-253b-v1:free': {
        id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        name: 'Nemotron Ultra 253B',
        provider: 'NVIDIA',
        description: 'Modelo massivo otimizado pela NVIDIA',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'reasoning'],
        strengths: ['Extremamente poderoso', 'Otimizado', 'Contexto longo'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'nvidia', 'massive', 'powerful']
    },
    'rekaai/reka-flash-3:free': {
        id: 'rekaai/reka-flash-3:free',
        name: 'Reka Flash 3',
        provider: 'Reka AI',
        description: 'Modelo rápido e eficiente da Reka',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Eficiência', 'Qualidade'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'reka', 'fast', 'efficient']
    },
    'sarvamai/sarvam-m:free': {
        id: 'sarvamai/sarvam-m:free',
        name: 'Sarvam M',
        provider: 'Sarvam AI',
        description: 'Modelo especializado em idiomas indianos',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Hindi', 'Idiomas indianos', 'Multilingual'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'indian', 'multilingual', 'hindi']
    },
    'tencent/hunyuan-a13b-instruct:free': {
        id: 'tencent/hunyuan-a13b-instruct:free',
        name: 'Hunyuan A13B',
        provider: 'Tencent',
        description: 'Modelo chinês da Tencent',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Chinês', 'Contexto', 'Tencent ecosystem'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'chinese', 'tencent']
    },

    // Reasoning & Thinking Models
    'tngtech/deepseek-r1t2-chimera:free': {
        id: 'tngtech/deepseek-r1t2-chimera:free',
        name: 'DeepSeek R1T2 Chimera',
        provider: 'TNG Tech',
        description: 'Modelo híbrido com raciocínio avançado',
        contextLength: 163840,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'code'],
        strengths: ['Raciocínio híbrido', 'Contexto longo'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'chimera', 'hybrid']
    },
    'arliai/qwq-32b-arliai-rpr-v1:free': {
        id: 'arliai/qwq-32b-arliai-rpr-v1:free',
        name: 'QwQ 32B RpR v1',
        provider: 'ArliAI',
        description: 'Versão otimizada do QwQ com raciocínio melhorado',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'math'],
        strengths: ['Raciocínio profundo', 'Matemática', 'Lógica'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'qwq', 'math']
    },
    'microsoft/mai-ds-r1:free': {
        id: 'microsoft/mai-ds-r1:free',
        name: 'MAI DS R1',
        provider: 'Microsoft',
        description: 'Modelo da Microsoft com foco em data science',
        contextLength: 163840,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'data-science'],
        strengths: ['Data Science', 'Análise', 'Código'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'microsoft', 'data-science', 'analysis']
    },

    // Code Specialized
    'agentica-org/deepcoder-14b-preview:free': {
        id: 'agentica-org/deepcoder-14b-preview:free',
        name: 'DeepCoder 14B Preview',
        provider: 'Agentica',
        description: 'Especializado em geração e análise de código',
        contextLength: 96000,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['code', 'text'],
        strengths: ['Código complexo', 'Debug', 'Refactoring'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'code', 'programming', 'preview']
    },

    // Additional Models
    'featherless/qwerky-72b:free': {
        id: 'featherless/qwerky-72b:free',
        name: 'Qrwkv 72B',
        provider: 'Featherless',
        description: 'Modelo experimental com arquitetura RWKV',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'experimental'],
        strengths: ['Arquitetura única', 'Experimental'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'experimental', 'rwkv']
    },
    'shisa-ai/shisa-v2-llama3.3-70b:free': {
        id: 'shisa-ai/shisa-v2-llama3.3-70b:free',
        name: 'Shisa V2 Llama 3.3 70B',
        provider: 'Shisa AI',
        description: 'Modelo japonês baseado em Llama',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Japonês', 'Inglês', 'Qualidade'],
        releaseDate: '2024-12',
        isFree: true,
        tags: ['free', 'japanese', 'llama', 'multilingual']
    },
    'nous/deephermes-3-llama-3-8b-preview:free': {
        id: 'nous/deephermes-3-llama-3-8b-preview:free',
        name: 'DeepHermes 3 Preview',
        provider: 'Nous Research',
        description: 'Modelo Hermes otimizado para instruções',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Seguimento de instruções', 'Contexto longo'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'nous', 'instructions', 'preview']
    },

    // Legacy Qwen Models (included for completeness)
    'qwen/qwen3-235b-a22b:free': {
        id: 'qwen/qwen3-235b-a22b:free',
        name: 'Qwen3 235B A22B',
        provider: 'Alibaba',
        description: 'Modelo massivo Qwen com arquitetura MoE',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code', 'multilingual'],
        strengths: ['Extremamente poderoso', 'MoE', 'Contexto longo'],
        releaseDate: '2024-10',
        isFree: true,
        tags: ['free', 'qwen', 'massive', 'moe']
    },
    'qwen/qwen3-30b-a3b:free': {
        id: 'qwen/qwen3-30b-a3b:free',
        name: 'Qwen3 30B A3B',
        provider: 'Alibaba',
        description: 'Modelo Qwen com arquitetura eficiente',
        contextLength: 40960,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Eficiência', 'Qualidade', 'Multilingual'],
        releaseDate: '2024-10',
        isFree: true,
        tags: ['free', 'qwen', 'efficient']
    },
    'qwen/qwen3-14b:free': {
        id: 'qwen/qwen3-14b:free',
        name: 'Qwen3 14B',
        provider: 'Alibaba',
        description: 'Modelo Qwen médio',
        contextLength: 40960,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Equilíbrio', 'Multilingual'],
        releaseDate: '2024-10',
        isFree: true,
        tags: ['free', 'qwen', 'balanced']
    },
    'qwen/qwen3-8b:free': {
        id: 'qwen/qwen3-8b:free',
        name: 'Qwen3 8B',
        provider: 'Alibaba',
        description: 'Modelo Qwen compacto',
        contextLength: 40960,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'code'],
        strengths: ['Velocidade', 'Eficiência'],
        releaseDate: '2024-10',
        isFree: true,
        tags: ['free', 'qwen', 'compact']
    },
    'qwen/qwen3-4b:free': {
        id: 'qwen/qwen3-4b:free',
        name: 'Qwen3 4B',
        provider: 'Alibaba',
        description: 'Modelo Qwen ultra-compacto',
        contextLength: 40960,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text'],
        strengths: ['Ultra-rápido', 'Mobile'],
        releaseDate: '2024-10',
        isFree: true,
        tags: ['free', 'qwen', 'tiny', 'mobile']
    },

    // Additional specialized models
    'deepseek/deepseek-r1-0528-qwen3-8b:free': {
        id: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        name: 'DeepSeek R1 Qwen3 8B',
        provider: 'DeepSeek',
        description: 'Híbrido DeepSeek-Qwen com raciocínio',
        contextLength: 131072,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning'],
        strengths: ['Raciocínio', 'Eficiência', 'Híbrido'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'hybrid', 'deepseek']
    },
    'tngtech/deepseek-r1t-chimera:free': {
        id: 'tngtech/deepseek-r1t-chimera:free',
        name: 'DeepSeek R1T Chimera',
        provider: 'TNG Tech',
        description: 'Versão thinking do modelo Chimera',
        contextLength: 163840,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'reasoning', 'thinking'],
        strengths: ['Pensamento profundo', 'Análise'],
        releaseDate: '2025-01',
        isFree: true,
        tags: ['free', 'reasoning', 'thinking', 'chimera']
    },
    'thudm/glm-4-32b:free': {
        id: 'thudm/glm-4-32b:free',
        name: 'GLM 4 32B',
        provider: 'THUDM',
        description: 'Modelo GLM de quarta geração',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        capabilities: ['text', 'multilingual'],
        strengths: ['Chinês', 'Inglês', 'Qualidade'],
        releaseDate: '2024-11',
        isFree: true,
        tags: ['free', 'glm', 'chinese', 'multilingual']
    }
};

// Função helper para obter apenas modelos gratuitos (todos neste arquivo são gratuitos)
export function getAllFreeModels() {
    return Object.values(FREE_OPENROUTER_MODELS);
}

// Função para filtrar modelos
export function filterFreeModels(filters = {}) {
    const models = getAllFreeModels();
    
    return models.filter(model => {
        if (filters.provider && model.provider !== filters.provider) return false;
        if (filters.capability && !model.capabilities.includes(filters.capability)) return false;
        if (filters.minContext && model.contextLength < filters.minContext) return false;
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

// Função para agrupar modelos por categoria
export function groupModelsByCategory() {
    return {
        'Ultra Context (>500K)': filterFreeModels({ minContext: 500000 }),
        'Reasoning & Thinking': filterFreeModels({ capability: 'reasoning' }),
        'Vision & Multimodal': filterFreeModels({ capability: 'vision' }),
        'Code & Development': filterFreeModels({ capability: 'code' }),
        'Uncensored': filterFreeModels({ search: 'uncensored' }),
        'Multilingual': filterFreeModels({ capability: 'multilingual' }),
        'Experimental': filterFreeModels({ search: 'experimental' })
    };
}

// Função para obter providers únicos
export function getFreeModelProviders() {
    const providers = new Set();
    getAllFreeModels().forEach(model => {
        providers.add(model.provider);
    });
    return Array.from(providers).sort();
}

// Função para obter capabilities únicas
export function getFreeModelCapabilities() {
    const capabilities = new Set();
    getAllFreeModels().forEach(model => {
        model.capabilities.forEach(cap => capabilities.add(cap));
    });
    return Array.from(capabilities).sort();
}

// Função para obter estatísticas
export function getFreeModelStats() {
    const models = getAllFreeModels();
    return {
        total: models.length,
        byProvider: getFreeModelProviders().map(provider => ({
            provider,
            count: models.filter(m => m.provider === provider).length
        })),
        byCapability: getFreeModelCapabilities().map(capability => ({
            capability,
            count: models.filter(m => m.capabilities.includes(capability)).length
        })),
        ultraContext: models.filter(m => m.contextLength >= 500000).length,
        reasoning: models.filter(m => m.capabilities.includes('reasoning')).length,
        vision: models.filter(m => m.capabilities.includes('vision')).length,
        newest: models.filter(m => m.tags.includes('new')).length
    };
}