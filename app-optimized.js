// Chat AI Application - Versão Otimizada para Performance
class ChatAI {
    constructor() {
        // Lazy initialization
        this.config = null;
        this.modelsCache = null;
        this.conversationHistory = [];
        this.isGenerating = false;
        this.currentController = null;
        
        // Performance optimizations
        this.MAX_HISTORY_SIZE = 50;
        this.eventListeners = [];
        this.intersectionObserver = null;
        
        // Debounced functions
        this.debouncedSave = this.debounce(this.saveToStorage.bind(this), 1000);
        this.debouncedScroll = this.debounce(this.scrollToBottom.bind(this), 100);
        this.throttledResize = this.throttle(this.autoResizeTextarea.bind(this), 50);
        
        // Initialize when idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.init(), { timeout: 2000 });
        } else {
            setTimeout(() => this.init(), 1);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    async init() {
        // Inject main content first
        this.injectMainContent();
        
        // Load config asynchronously
        await this.loadConfig();
        
        // Setup core functionality
        this.setupEventListeners();
        this.applyTheme();
        
        // Defer non-critical tasks
        requestAnimationFrame(() => {
            this.populateModelSelect();
            this.populateQuickPrompts();
            this.loadConversation();
            this.updateSettings();
            this.updateStatus();
            
            // Setup intersection observer for lazy loading
            this.setupIntersectionObserver();
        });
    }

    injectMainContent() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <div class="container">
                <!-- Sidebar -->
                <aside class="sidebar" role="complementary">
                    <div class="sidebar-section">
                        <h3>Modelo de IA</h3>
                        <select class="form-control" id="modelSelect" aria-label="Selecionar modelo de IA">
                            <option value="">Carregando modelos...</option>
                        </select>
                    </div>
                    <div class="sidebar-section">
                        <h3>Configurações</h3>
                        <div class="form-group">
                            <label class="form-label" for="temperature">Temperature: <span id="tempValue">0.7</span></label>
                            <input type="range" id="temperature" min="0.1" max="2" step="0.1" value="0.7" class="range-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="maxTokens">Max Tokens: <span id="tokensValue">2000</span></label>
                            <input type="range" id="maxTokens" min="100" max="4000" step="100" value="2000" class="range-input">
                        </div>
                    </div>
                    <div class="sidebar-section">
                        <h3>Ações</h3>
                        <button class="btn btn--outline btn--full-width" id="clearChat">🗑️ Limpar</button>
                        <button class="btn btn--outline btn--full-width" id="exportChat">📄 Exportar</button>
                    </div>
                    <div class="sidebar-section">
                        <h3>Prompts Rápidos</h3>
                        <div class="quick-prompts" id="quickPrompts"></div>
                    </div>
                </aside>
                
                <!-- Chat Area -->
                <div class="chat-container" role="main">
                    <div class="chat-messages" id="chatMessages" role="log" aria-live="polite">
                        <div class="welcome-message">
                            <div class="welcome-icon">👋</div>
                            <h3>Bem-vindo ao Chat AI!</h3>
                            <p>Selecione um modelo e comece a conversar.</p>
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <textarea class="chat-input" id="messageInput" 
                                placeholder="Digite sua mensagem..." 
                                rows="1" aria-label="Digite sua mensagem"></textarea>
                            <button class="send-button" id="sendButton" disabled aria-label="Enviar mensagem">
                                <span class="send-icon">📤</span>
                            </button>
                        </div>
                        <div class="chat-info">
                            <span id="statusText">Pronto</span>
                            <span id="tokenCount">0 tokens</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Inject modals
        this.injectModals();
    }

    injectModals() {
        // Settings Modal
        const settingsModal = document.createElement('div');
        settingsModal.className = 'modal hidden';
        settingsModal.id = 'settingsModal';
        settingsModal.innerHTML = `
            <div class="modal-content" role="dialog" aria-labelledby="settingsTitle">
                <div class="modal-header">
                    <h3 id="settingsTitle">⚙️ Configurações da API</h3>
                    <button class="modal-close" id="closeSettings" aria-label="Fechar">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label" for="apiKey">API Key do OpenRouter:</label>
                        <input type="password" class="form-control" id="apiKey" placeholder="sk-or-...">
                        <small class="help-text">
                            Armazenada apenas localmente.
                            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">Obter API Key</a>
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--secondary" id="cancelSettings">Cancelar</button>
                    <button class="btn btn--primary" id="saveSettings">Salvar</button>
                </div>
            </div>
        `;
        document.body.appendChild(settingsModal);
        
        // Toast Container
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.id = 'toastContainer';
        toastContainer.setAttribute('role', 'status');
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
    }

    async loadConfig() {
        if (!this.config) {
            // Batch localStorage reads
            const keys = ['openrouter_api_key', 'selected_model', 'theme', 'temperature', 'max_tokens', 'system_prompt'];
            const values = keys.map(key => localStorage.getItem(key));
            
            this.config = {
                apiKey: values[0] || '',
                selectedModel: values[1] || '',
                currentTheme: values[2] || 'light',
                settings: {
                    temperature: parseFloat(values[3] || '0.7'),
                    maxTokens: parseInt(values[4] || '2000'),
                    systemPrompt: values[5] || 'Você é um assistente AI útil e conhecedor.'
                }
            };
            
            // Load conversation history separately
            const history = localStorage.getItem('conversation_history');
            if (history) {
                try {
                    this.conversationHistory = JSON.parse(history);
                    this.cleanupHistory();
                } catch (e) {
                    console.error('Failed to load conversation history:', e);
                }
            }
        }
        return this.config;
    }

    setupEventListeners() {
        // Use event delegation where possible
        const addListener = (element, event, handler) => {
            if (element) {
                element.addEventListener(event, handler);
                this.eventListeners.push({ element, event, handler });
            }
        };
        
        // Theme toggle
        addListener(document.getElementById('themeToggle'), 'click', () => this.toggleTheme());
        
        // Settings
        addListener(document.getElementById('settingsBtn'), 'click', () => this.openSettings());
        addListener(document.getElementById('closeSettings'), 'click', () => this.closeSettings());
        addListener(document.getElementById('saveSettings'), 'click', () => this.saveSettings());
        
        // Model selection
        addListener(document.getElementById('modelSelect'), 'change', (e) => this.selectModel(e.target.value));
        
        // Chat input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            addListener(messageInput, 'input', () => {
                this.handleInputChange();
                this.throttledResize();
            });
            addListener(messageInput, 'keydown', (e) => this.handleKeyDown(e));
        }
        
        // Send button
        addListener(document.getElementById('sendButton'), 'click', () => this.sendMessage());
        
        // Actions
        addListener(document.getElementById('clearChat'), 'click', () => this.clearChat());
        addListener(document.getElementById('exportChat'), 'click', () => this.exportChat());
        
        // Quick prompts - event delegation
        const quickPromptsContainer = document.getElementById('quickPrompts');
        if (quickPromptsContainer) {
            addListener(quickPromptsContainer, 'click', (e) => {
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
        
        // Modal backdrop click
        addListener(document.getElementById('settingsModal'), 'click', (e) => {
            if (e.target === e.currentTarget) this.closeSettings();
        });
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            // Stop observing once visible
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '50px' }
            );
        }
    }

    getModels() {
        if (!this.modelsCache) {
            this.modelsCache = [
                { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
                { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
                { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
                { id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google" },
                { id: "deepseek/deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek" },
                { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", provider: "Meta" }
            ];
        }
        return this.modelsCache;
    }

    populateModelSelect() {
        const select = document.getElementById('modelSelect');
        if (!select) return;
        
        const models = this.getModels();
        const fragment = document.createDocumentFragment();
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um modelo...';
        fragment.appendChild(defaultOption);
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.provider})`;
            fragment.appendChild(option);
        });
        
        select.innerHTML = '';
        select.appendChild(fragment);
        
        if (this.config.selectedModel) {
            select.value = this.config.selectedModel;
        }
    }

    populateQuickPrompts() {
        const container = document.getElementById('quickPrompts');
        if (!container) return;
        
        const prompts = [
            "Explique quantum computing",
            "Código Python para ordenar lista",
            "Como funciona machine learning?",
            "Dicas de produtividade"
        ];
        
        const fragment = document.createDocumentFragment();
        prompts.forEach(prompt => {
            const button = document.createElement('button');
            button.className = 'quick-prompt';
            button.dataset.prompt = prompt;
            button.textContent = prompt;
            fragment.appendChild(button);
        });
        
        container.appendChild(fragment);
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const userMessage = input.value.trim();
        if (!userMessage || !this.config.apiKey || !this.config.selectedModel || this.isGenerating) return;
        
        // Clear input
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
            this.showToast(`Erro: ${error.message}`, 'error');
        } finally {
            this.isGenerating = false;
            this.updateStatus();
            this.handleInputChange();
        }
    }

    async streamCompletion(userMessage) {
        const messages = [
            { role: 'system', content: this.config.settings.systemPrompt },
            ...this.conversationHistory
        ];
        
        this.currentController = new AbortController();
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Chat AI'
            },
            body: JSON.stringify({
                model: this.config.selectedModel,
                messages: messages,
                max_tokens: this.config.settings.maxTokens,
                temperature: this.config.settings.temperature,
                stream: true
            }),
            signal: this.currentController.signal
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        this.hideTypingIndicator();
        const messageElement = this.displayMessage('assistant', '', true);
        const contentElement = messageElement.querySelector('.message-text');
        
        let fullResponse = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
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
                                    contentElement.textContent = fullResponse;
                                    this.debouncedScroll();
                                }
                            }
                        } catch (e) {
                            // Ignore parse errors
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

    displayMessage(role, content, isStreaming = false) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return null;
        
        // Remove welcome message if exists
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
                <p class="message-text">${content}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Observe for lazy loading
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(messageElement);
        }
        
        if (!isStreaming) {
            this.addMessageActions(messageElement, content);
        }
        
        this.debouncedScroll();
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
        this.debouncedScroll();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    copyMessage(content) {
        navigator.clipboard.writeText(content).then(() => {
            this.showToast('Mensagem copiada!', 'success');
        }).catch(() => {
            this.showToast('Erro ao copiar', 'error');
        });
    }

    addToConversation(role, content) {
        this.conversationHistory.push({ role, content });
        this.cleanupHistory();
        this.debouncedSave();
    }

    cleanupHistory() {
        if (this.conversationHistory.length > this.MAX_HISTORY_SIZE) {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY_SIZE);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('conversation_history', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.error('Failed to save conversation:', e);
            // Clear old data if storage is full
            if (e.name === 'QuotaExceededError') {
                this.conversationHistory = this.conversationHistory.slice(-20);
                this.saveToStorage();
            }
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }

    toggleTheme() {
        this.config.currentTheme = this.config.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.config.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.config.currentTheme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.config.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        const apiKeyInput = document.getElementById('apiKey');
        
        if (modal && apiKeyInput) {
            apiKeyInput.value = this.config.apiKey;
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
        if (!apiKeyInput) return;
        
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            this.showToast('Por favor, insira uma API Key', 'error');
            return;
        }
        
        this.config.apiKey = apiKey;
        localStorage.setItem('openrouter_api_key', apiKey);
        
        this.closeSettings();
        this.updateStatus();
        this.showToast('Configurações salvas!', 'success');
    }

    selectModel(modelId) {
        this.config.selectedModel = modelId;
        localStorage.setItem('selected_model', modelId);
        this.updateStatus();
    }

    updateStatus() {
        const statusText = document.getElementById('statusText');
        if (!statusText) return;
        
        if (!this.config.apiKey) {
            statusText.textContent = 'Configure sua API key';
        } else if (!this.config.selectedModel) {
            statusText.textContent = 'Selecione um modelo';
        } else if (this.isGenerating) {
            statusText.textContent = 'Gerando...';
        } else {
            statusText.textContent = 'Pronto';
        }
    }

    updateSettings() {
        const tempSlider = document.getElementById('temperature');
        const tokensSlider = document.getElementById('maxTokens');
        
        if (tempSlider) {
            tempSlider.value = this.config.settings.temperature;
            const tempValue = document.getElementById('tempValue');
            if (tempValue) tempValue.textContent = this.config.settings.temperature;
            
            tempSlider.addEventListener('input', (e) => {
                this.config.settings.temperature = parseFloat(e.target.value);
                if (tempValue) tempValue.textContent = e.target.value;
                localStorage.setItem('temperature', e.target.value);
            });
        }
        
        if (tokensSlider) {
            tokensSlider.value = this.config.settings.maxTokens;
            const tokensValue = document.getElementById('tokensValue');
            if (tokensValue) tokensValue.textContent = this.config.settings.maxTokens;
            
            tokensSlider.addEventListener('input', (e) => {
                this.config.settings.maxTokens = parseInt(e.target.value);
                if (tokensValue) tokensValue.textContent = e.target.value;
                localStorage.setItem('max_tokens', e.target.value);
            });
        }
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (!input || !sendButton) return;
        
        const hasContent = input.value.trim().length > 0;
        const canSend = hasContent && this.config.apiKey && this.config.selectedModel && !this.isGenerating;
        
        sendButton.disabled = !canSend;
        this.updateTokenCount(input.value);
    }

    updateTokenCount(text) {
        const tokenCount = Math.ceil(text.length / 4);
        const tokenCountElement = document.getElementById('tokenCount');
        if (tokenCountElement) {
            tokenCountElement.textContent = `${tokenCount} tokens`;
        }
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

    loadConversation() {
        if (this.conversationHistory.length === 0) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = '';
        
        // Use fragment for better performance
        const fragment = document.createDocumentFragment();
        this.conversationHistory.forEach(message => {
            const messageEl = this.createMessageElement(message.role, message.content);
            fragment.appendChild(messageEl);
        });
        
        messagesContainer.appendChild(fragment);
        this.scrollToBottom();
    }

    createMessageElement(role, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p class="message-text">${content}</p>
            </div>
        `;
        
        return messageElement;
    }

    clearChat() {
        if (confirm('Limpar toda a conversa?')) {
            this.conversationHistory = [];
            localStorage.removeItem('conversation_history');
            
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        <div class="welcome-icon">👋</div>
                        <h3>Conversa limpa!</h3>
                        <p>Comece uma nova conversa.</p>
                    </div>
                `;
            }
            
            this.showToast('Conversa limpa!', 'success');
        }
    }

    exportChat() {
        if (this.conversationHistory.length === 0) {
            this.showToast('Nenhuma conversa para exportar', 'info');
            return;
        }
        
        const chatData = {
            timestamp: new Date().toISOString(),
            model: this.config.selectedModel,
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
        
        this.showToast('Chat exportado!', 'success');
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
        
        // Auto remove
        const timeoutId = setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timeoutId);
                toast.remove();
            });
        }
    }

    // Cleanup method
    destroy() {
        // Cancel pending requests
        if (this.currentController) {
            this.currentController.abort();
        }
        
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // Disconnect observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Clear timeouts
        clearTimeout(this.autoSaveTimer);
    }
}

// Initialize when DOM is ready
let chatAI;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatAI = new ChatAI();
    });
} else {
    chatAI = new ChatAI();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (chatAI) {
        chatAI.destroy();
    }
});