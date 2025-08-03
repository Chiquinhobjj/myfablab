// Exemplo de configuração das API Keys do OpenRouter
// INSTRUÇÕES: 
// 1. Copie este arquivo para api-keys.js
// 2. Substitua as chaves de exemplo pelas suas chaves reais
// 3. NUNCA commite o arquivo api-keys.js no repositório!

export const API_KEYS = [
    {
        id: 'myfablab-01',
        key: 'sk-or-v1-YOUR_API_KEY_HERE_1',
        name: 'MyFabLab API 1',
        requestCount: 0,
        lastUsed: null
    },
    {
        id: 'myfablab-02', 
        key: 'sk-or-v1-YOUR_API_KEY_HERE_2',
        name: 'MyFabLab API 2',
        requestCount: 0,
        lastUsed: null
    },
    {
        id: 'myfablab-03',
        key: 'sk-or-v1-YOUR_API_KEY_HERE_3',
        name: 'MyFabLab API 3',
        requestCount: 0,
        lastUsed: null
    }
];

// Gerenciador de API Keys com rotação automática
export class APIKeyManager {
    constructor() {
        this.keys = [...API_KEYS];
        this.currentIndex = 0;
        this.loadState();
    }

    // Obtém a próxima API key disponível
    getNextKey() {
        const key = this.keys[this.currentIndex];
        key.requestCount++;
        key.lastUsed = new Date().toISOString();
        
        // Rotaciona para a próxima key
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        
        this.saveState();
        return key.key;
    }

    // Obtém a key atual sem rotacionar
    getCurrentKey() {
        return this.keys[this.currentIndex].key;
    }

    // Obtém informações sobre o uso das APIs
    getUsageStats() {
        return this.keys.map(key => ({
            id: key.id,
            name: key.name,
            requestCount: key.requestCount,
            lastUsed: key.lastUsed
        }));
    }

    // Salva o estado no localStorage
    saveState() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('apiKeyState', JSON.stringify({
                currentIndex: this.currentIndex,
                keys: this.keys.map(k => ({
                    id: k.id,
                    requestCount: k.requestCount,
                    lastUsed: k.lastUsed
                }))
            }));
        }
    }

    // Carrega o estado do localStorage
    loadState() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem('apiKeyState');
            if (saved) {
                try {
                    const state = JSON.parse(saved);
                    this.currentIndex = state.currentIndex || 0;
                    
                    // Atualiza contadores das keys
                    state.keys.forEach(savedKey => {
                        const key = this.keys.find(k => k.id === savedKey.id);
                        if (key) {
                            key.requestCount = savedKey.requestCount || 0;
                            key.lastUsed = savedKey.lastUsed || null;
                        }
                    });
                } catch (e) {
                    console.error('Erro ao carregar estado das API keys:', e);
                }
            }
        }
    }

    // Reseta os contadores
    resetStats() {
        this.keys.forEach(key => {
            key.requestCount = 0;
            key.lastUsed = null;
        });
        this.currentIndex = 0;
        this.saveState();
    }
}

// Exporta uma instância única do gerenciador
export const apiKeyManager = new APIKeyManager();