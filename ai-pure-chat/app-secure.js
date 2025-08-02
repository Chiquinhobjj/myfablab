// Chat AI Application - Versão Segura com Proxy
// Esta versão usa o proxy do servidor para proteger a API key

class ChatAI {
    constructor() {
        // Removido: não armazena mais API key no frontend
        this.selectedModel = localStorage.getItem('selected_model') || '';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.conversationHistory = JSON.parse(localStorage.getItem('conversation_history') || '[]');
        this.settings = {
            temperature: parseFloat(localStorage.getItem('temperature') || '0.7'),
            maxTokens: parseInt(localStorage.getItem('max_tokens') || '2000'),
            systemPrompt: localStorage.getItem('system_prompt') || 'Você é um assistente AI útil e conhecedor.',
            appName: localStorage.getItem('app_name') || 'Chat AI'
        };
        
        // Mesmos modelos disponíveis
        this.models = [
            {
                id: "openai/gpt-4o",
                name: "GPT-4o",
                provider: "OpenAI",
                description: "Modelo mais avançado da OpenAI",
                category: "general"
            },
            {
                id: "openai/gpt-4o-mini",
                name: "GPT-4o Mini",
                provider: "OpenAI",
                description: "Versão otimizada e econômica",
                category: "general"
            },
            {
                id: "anthropic/claude-3.5-sonnet",
                name: "Claude 3.5 Sonnet",
                provider: "Anthropic",
                description: "Excelente para análise e raciocínio",
                category: "reasoning"
            },
            {
                id: "anthropic/claude-4",
                name: "Claude 4",
                provider: "Anthropic",
                description: "Último modelo da Anthropic",
                category: "reasoning"
            },
            {
                id: "google/gemini-2.0-flash",
                name: "Gemini 2.0 Flash",
                provider: "Google",
                description: "Rápido e multimodal",
                category: "multimodal"
            },
            {
                id: "deepseek/deepseek-r1",
                name: "DeepSeek R1",
                provider: "DeepSeek",
                description: "Especialista em raciocínio",
                category: "reasoning"
            },
            {
                id: "meta-llama/llama-3.3-70b-instruct",
                name: "Llama 3.3 70B",
                provider: "Meta",
                description: "Modelo open-source poderoso",
                category: "general"
            },
            {
                id: "mistralai/mistral-large",
                name: "Mistral Large",
                provider: "Mistral",
                description: "Modelo europeu avançado",
                category: "general"
            }
        ];

        this.quickPrompts = [
            "Explique quantum computing de forma simples",
            "Escreva um código Python para ordenar uma lista",
            "Crie um resumo sobre inteligência artificial",
            "Analise os prós e contras da energia solar",
            "Traduza este texto para inglês",
            "Como funciona o machine learning?",
            "Explique blockchain em termos simples",
            "Dicas de produtividade para trabalho remoto"
        ];

        this.isGenerating = false;
        this.currentController = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateModelSelect();
        this.populateQuickPrompts();
        this.loadConversation();
        this.applyTheme();
        this.updateSettings();
        this.updateStatus();
        this.autoResizeTextarea();
    }

    // Função modificada para usar o proxy
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isGenerating) return;

        // Verifica se um modelo foi selecionado
        if (!this.selectedModel) {
            this.showToast('Por favor, selecione um modelo de IA', 'error');
            return;
        }

        this.isGenerating = true;
        this.updateStatus('Gerando resposta...');
        this.sendButton.disabled = true;
        this.messageInput.disabled = true;

        // Adiciona mensagem do usuário
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.autoResizeTextarea();

        // Prepara mensagens para a API
        const messages = this.prepareMessages(message);

        // Cria controller para cancelamento
        this.currentController = new AbortController();

        try {
            // USA O PROXY DO SERVIDOR em vez da API direta
            const response = await fetch('/api/openrouter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Não envia mais Authorization header
                },
                body: JSON.stringify({
                    model: this.selectedModel,
                    messages: messages,
                    temperature: this.settings.temperature,
                    max_tokens: this.settings.maxTokens,
                    stream: true
                }),
                signal: this.currentController.signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Erro HTTP: ${response.status}`);
            }

            // Processa resposta em streaming
            await this.handleStreamResponse(response);

        } catch (error) {
            if (error.name === 'AbortError') {
                this.showToast('Resposta cancelada', 'info');
            } else {
                console.error('Erro ao enviar mensagem:', error);
                this.showToast(`Erro: ${error.message}`, 'error');
                this.removeLastAssistantMessage();
            }
        } finally {
            this.isGenerating = false;
            this.currentController = null;
            this.sendButton.disabled = false;
            this.messageInput.disabled = false;
            this.messageInput.focus();
            this.updateStatus('Pronto para conversar');
            this.saveConversation();
        }
    }

    // Outras funções permanecem iguais...
    setupEventListeners() {
        // Elementos do DOM
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.modelSelect = document.getElementById('modelSelect');
        this.temperatureSlider = document.getElementById('temperature');
        this.maxTokensSlider = document.getElementById('maxTokens');
        this.systemPromptTextarea = document.getElementById('systemPrompt');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        this.statusText = document.getElementById('statusText');
        this.tokenCount = document.getElementById('tokenCount');

        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateTokenCount();
        });

        this.modelSelect.addEventListener('change', (e) => {
            this.selectedModel = e.target.value;
            localStorage.setItem('selected_model', this.selectedModel);
            this.updateStatus();
        });

        this.temperatureSlider.addEventListener('input', (e) => {
            this.settings.temperature = parseFloat(e.target.value);
            document.getElementById('tempValue').textContent = this.settings.temperature;
            localStorage.setItem('temperature', this.settings.temperature);
        });

        this.maxTokensSlider.addEventListener('input', (e) => {
            this.settings.maxTokens = parseInt(e.target.value);
            document.getElementById('tokensValue').textContent = this.settings.maxTokens;
            localStorage.setItem('max_tokens', this.settings.maxTokens);
        });

        this.systemPromptTextarea.addEventListener('input', (e) => {
            this.settings.systemPrompt = e.target.value;
            localStorage.setItem('system_prompt', this.settings.systemPrompt);
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());

        // Removido: não há mais modal de configurações de API
    }

    // Restante do código permanece igual ao original...
    // (Copie todas as outras funções do arquivo original)
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
    new ChatAI();
});