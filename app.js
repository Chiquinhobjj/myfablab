// Chat AI Application
class ChatAI {
    constructor() {
        this.apiKey = localStorage.getItem('openrouter_api_key') || '';
        this.selectedModel = localStorage.getItem('selected_model') || '';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.conversationHistory = JSON.parse(localStorage.getItem('conversation_history') || '[]');
        this.settings = {
            temperature: parseFloat(localStorage.getItem('temperature') || '0.7'),
            maxTokens: parseInt(localStorage.getItem('max_tokens') || '2000'),
            systemPrompt: localStorage.getItem('system_prompt') || 'Você é um assistente AI útil e conhecedor.',
            appName: localStorage.getItem('app_name') || 'Chat AI'
        };
        
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

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Settings modal
        const settingsBtn = document.getElementById('settingsBtn');
        const closeSettings = document.getElementById('closeSettings');
        const cancelSettings = document.getElementById('cancelSettings');
        const saveSettings = document.getElementById('saveSettings');
        
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettings());
        if (closeSettings) closeSettings.addEventListener('click', () => this.closeSettings());
        if (cancelSettings) cancelSettings.addEventListener('click', () => this.closeSettings());
        if (saveSettings) saveSettings.addEventListener('click', () => this.saveSettings());

        // Model selection
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => this.selectModel(e.target.value));
        }

        // Settings controls
        const temperatureSlider = document.getElementById('temperature');
        const maxTokensSlider = document.getElementById('maxTokens');
        const systemPromptTextarea = document.getElementById('systemPrompt');
        
        if (temperatureSlider) {
            temperatureSlider.addEventListener('input', (e) => this.updateSlider('temperature', e.target.value));
        }
        if (maxTokensSlider) {
            maxTokensSlider.addEventListener('input', (e) => this.updateSlider('maxTokens', e.target.value));
        }
        if (systemPromptTextarea) {
            systemPromptTextarea.addEventListener('input', (e) => {
                this.settings.systemPrompt = e.target.value;
                localStorage.setItem('system_prompt', e.target.value);
            });
        }

        // Chat controls
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput) {
            messageInput.addEventListener('input', () => this.handleInputChange());
            messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Action buttons
        const clearChat = document.getElementById('clearChat');
        const exportChat = document.getElementById('exportChat');
        
        if (clearChat) clearChat.addEventListener('click', () => this.clearChat());
        if (exportChat) exportChat.addEventListener('click', () => this.exportChat());

        // Modal click outside to close
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) this.closeSettings();
            });
        }

        // Auto-resize textarea
        if (messageInput) {
            messageInput.addEventListener('input', () => this.autoResizeTextarea());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        const apiKeyInput = document.getElementById('apiKey');
        const appNameInput = document.getElementById('appName');
        
        if (modal && apiKeyInput && appNameInput) {
            apiKeyInput.value = this.apiKey;
            appNameInput.value = this.settings.appName;
            modal.classList.remove('hidden');
            apiKeyInput.focus();
        }
    }

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveSettings() {
        const apiKeyInput = document.getElementById('apiKey');
        const appNameInput = document.getElementById('appName');
        
        if (!apiKeyInput || !appNameInput) return;
        
        const apiKey = apiKeyInput.value.trim();
        const appName = appNameInput.value.trim();

        if (!apiKey) {
            this.showToast('Por favor, insira uma API Key válida', 'error');
            return;
        }

        this.apiKey = apiKey;
        this.settings.appName = appName || 'Chat AI';

        localStorage.setItem('openrouter_api_key', this.apiKey);
        localStorage.setItem('app_name', this.settings.appName);

        this.closeSettings();
        this.updateStatus();
        this.showToast('Configurações salvas com sucesso!', 'success');
    }

    populateModelSelect() {
        const select = document.getElementById('modelSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione um modelo...</option>';
        
        this.models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.provider})`;
            option.title = model.description;
            select.appendChild(option);
        });

        if (this.selectedModel) {
            select.value = this.selectedModel;
        }
    }

    selectModel(modelId) {
        this.selectedModel = modelId;
        localStorage.setItem('selected_model', modelId);
        this.updateStatus();
    }

    populateQuickPrompts() {
        const container = document.getElementById('quickPrompts');
        if (!container) return;
        
        container.innerHTML = this.quickPrompts.map(prompt => 
            `<button class="quick-prompt" data-prompt="${prompt}">${prompt}</button>`
        ).join('');

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-prompt')) {
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.value = e.target.dataset.prompt;
                    this.handleInputChange();
                    messageInput.focus();
                }
            }
        });
    }

    updateSlider(setting, value) {
        this.settings[setting] = setting === 'temperature' ? parseFloat(value) : parseInt(value);
        const displayElement = document.getElementById(setting === 'temperature' ? 'tempValue' : 'tokensValue');
        if (displayElement) {
            displayElement.textContent = value;
        }
        localStorage.setItem(setting === 'temperature' ? 'temperature' : 'max_tokens', value);
    }

    updateSettings() {
        const temperatureSlider = document.getElementById('temperature');
        const maxTokensSlider = document.getElementById('maxTokens');
        const systemPromptTextarea = document.getElementById('systemPrompt');
        const tempValue = document.getElementById('tempValue');
        const tokensValue = document.getElementById('tokensValue');
        
        if (temperatureSlider) temperatureSlider.value = this.settings.temperature;
        if (maxTokensSlider) maxTokensSlider.value = this.settings.maxTokens;
        if (systemPromptTextarea) systemPromptTextarea.value = this.settings.systemPrompt;
        if (tempValue) tempValue.textContent = this.settings.temperature;
        if (tokensValue) tokensValue.textContent = this.settings.maxTokens;
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (!input || !sendButton) return;
        
        const hasContent = input.value.trim().length > 0;
        const canSend = hasContent && this.apiKey && this.selectedModel && !this.isGenerating;
        
        sendButton.disabled = !canSend;
        this.updateTokenCount(input.value);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const sendButton = document.getElementById('sendButton');
            if (sendButton && !sendButton.disabled) {
                this.sendMessage();
            }
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }

    updateTokenCount(text) {
        // Simple token estimation (rough approximation)
        const tokenCount = Math.ceil(text.length / 4);
        const tokenCountElement = document.getElementById('tokenCount');
        if (tokenCountElement) {
            tokenCountElement.textContent = `${tokenCount} tokens`;
        }
    }

    updateStatus() {
        const statusText = document.getElementById('statusText');
        if (!statusText) return;
        
        if (!this.apiKey) {
            statusText.textContent = 'Configure sua API key para começar';
        } else if (!this.selectedModel) {
            statusText.textContent = 'Selecione um modelo de IA';
        } else if (this.isGenerating) {
            statusText.textContent = 'Gerando resposta...';
        } else {
            const model = this.models.find(m => m.id === this.selectedModel);
            statusText.textContent = `Pronto - ${model ? model.name : 'Modelo selecionado'}`;
        }
    }

    loadConversation() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        if (this.conversationHistory.length === 0) {
            return;
        }

        // Clear welcome message
        messagesContainer.innerHTML = '';

        this.conversationHistory.forEach(message => {
            this.displayMessage(message.role, message.content, false);
        });

        this.scrollToBottom();
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const userMessage = input.value.trim();
        
        if (!userMessage || !this.apiKey || !this.selectedModel || this.isGenerating) return;

        // Clear input and disable sending
        input.value = '';
        this.handleInputChange();
        this.autoResizeTextarea();

        // Add user message
        this.addToConversation('user', userMessage);
        this.displayMessage('user', userMessage);

        // Show typing indicator
        this.showTypingIndicator();

        this.isGenerating = true;
        this.updateStatus();

        try {
            await this.streamCompletion(userMessage);
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            this.displayMessage('assistant', `❌ Erro: ${error.message}`);
            this.showToast(`Erro ao gerar resposta: ${error.message}`, 'error');
        } finally {
            this.isGenerating = false;
            this.updateStatus();
            this.handleInputChange();
        }
    }

    async streamCompletion(userMessage) {
        const messages = [
            { role: 'system', content: this.settings.systemPrompt },
            ...this.conversationHistory
        ];

        this.currentController = new AbortController();

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': this.settings.appName
            },
            body: JSON.stringify({
                model: this.selectedModel,
                messages: messages,
                max_tokens: this.settings.maxTokens,
                temperature: this.settings.temperature,
                stream: true
            }),
            signal: this.currentController.signal
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        this.hideTypingIndicator();
        const messageElement = this.displayMessage('assistant', '', true);
        const contentElement = messageElement.querySelector('.message-text');

        let fullResponse = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            
                            if (content) {
                                fullResponse += content;
                                if (contentElement) {
                                    contentElement.innerHTML = this.formatMessage(fullResponse);
                                    this.scrollToBottom();
                                }
                            }
                        } catch (e) {
                            // Ignore parse errors for partial chunks
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        if (fullResponse) {
            this.addToConversation('assistant', fullResponse);
            this.addMessageActions(messageElement, fullResponse);
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typingIndicator';
        
        typingIndicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span>Digitando...</span>
            </div>
        `;
        
        messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    displayMessage(role, content, isStreaming = false) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return null;
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${role} fade-in`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p class="message-text">${this.formatMessage(content)}</p>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        
        if (!isStreaming) {
            this.addMessageActions(messageElement, content);
        }
        
        this.scrollToBottom();
        return messageElement;
    }

    addMessageActions(messageElement, content) {
        if (!messageElement) return;
        
        const messageContent = messageElement.querySelector('.message-content');
        if (!messageContent) return;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'message-action';
        copyBtn.innerHTML = '📋 Copiar';
        copyBtn.addEventListener('click', () => this.copyMessage(content));
        
        actionsDiv.appendChild(copyBtn);
        messageContent.appendChild(actionsDiv);
    }

    formatMessage(content) {
        if (!content) return '';
        
        // Basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\n/g, '<br>');
    }

    copyMessage(content) {
        const textContent = content.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(textContent).then(() => {
            this.showToast('Mensagem copiada!', 'success');
        }).catch(() => {
            this.showToast('Erro ao copiar mensagem', 'error');
        });
    }

    addToConversation(role, content) {
        this.conversationHistory.push({ role, content });
        localStorage.setItem('conversation_history', JSON.stringify(this.conversationHistory));
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    clearChat() {
        if (confirm('Tem certeza que deseja limpar toda a conversa?')) {
            this.conversationHistory = [];
            localStorage.removeItem('conversation_history');
            
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        <div class="welcome-icon">👋</div>
                        <h3>Conversa limpa!</h3>
                        <p>Comece uma nova conversa digitando uma mensagem.</p>
                    </div>
                `;
            }
            
            this.showToast('Conversa limpa com sucesso!', 'success');
        }
    }

    exportChat() {
        if (this.conversationHistory.length === 0) {
            this.showToast('Nenhuma conversa para exportar', 'info');
            return;
        }

        const chatData = {
            timestamp: new Date().toISOString(),
            model: this.selectedModel,
            modelName: this.models.find(m => m.id === this.selectedModel)?.name || 'Desconhecido',
            settings: this.settings,
            conversation: this.conversationHistory
        };

        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Chat exportado com sucesso!', 'success');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }
    }
}

// Initialize the application
let chatAI;
document.addEventListener('DOMContentLoaded', () => {
    chatAI = new ChatAI();
});