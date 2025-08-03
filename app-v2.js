// Chat AI Application v2.0 - Com suporte a múltiplas APIs e todos os modelos
import { apiKeyManager } from './config/api-keys.js';
import { OPENROUTER_MODELS, getFreeModels } from './config/models-database.js';
import { createModelSelector } from './components/model-selector.js';

class ChatAI {
    constructor() {
        // Remove necessidade de API key do usuário - usa as 3 configuradas
        this.apiKeyManager = apiKeyManager;
        this.selectedModel = null;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.conversationHistory = JSON.parse(localStorage.getItem('conversation_history') || '[]');
        this.settings = {
            temperature: parseFloat(localStorage.getItem('temperature') || '0.7'),
            maxTokens: parseInt(localStorage.getItem('max_tokens') || '2000'),
            systemPrompt: localStorage.getItem('system_prompt') || 'Você é um assistente AI útil e conhecedor.',
            appName: 'MyFabLab Chat AI'
        };
        
        this.isGenerating = false;
        this.currentAbortController = null;
        this.showModelSelector = true;
        
        this.quickPrompts = [
            'Explique quantum computing de forma simples',
            'Escreva um código Python para ordenar uma lista', 
            'Crie uma campanha de marketing digital',
            'Gere ideias de negócios inovadores',
            'Traduza este texto para inglês',
            'Resuma os principais pontos deste artigo'
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.updateSettings();
        this.loadConversation();
        
        // Mostra seletor de modelos em vez de carregar lista antiga
        this.showModelSelectorUI();
    }

    showModelSelectorUI() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div id="modelSelectorContainer"></div>
        `;
        
        // Cria o seletor de modelos
        const container = document.getElementById('modelSelectorContainer');
        this.modelSelector = createModelSelector(container, (model) => {
            this.selectModel(model);
        });
    }

    selectModel(model) {
        this.selectedModel = model;
        localStorage.setItem('selected_model', model.id);
        
        // Atualiza o select do sidebar se existir
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.innerHTML = `<option value="${model.id}">${model.name}</option>`;
            modelSelect.value = model.id;
        }
        
        // Esconde o seletor e mostra o chat
        this.showModelSelector = false;
        this.startChat();
    }

    startChat() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">${this.getModelIcon()}</div>
                <h3>Bem-vindo ao ${this.selectedModel.name}!</h3>
                <p>${this.selectedModel.description}</p>
                <div class="model-info-summary">
                    <span class="info-item">📏 Contexto: ${this.formatContextLength(this.selectedModel.contextLength)}</span>
                    <span class="info-item">🏢 Provider: ${this.selectedModel.provider}</span>
                    ${this.selectedModel.isFree ? '<span class="info-item free">✨ Gratuito</span>' : ''}
                </div>
            </div>
        `;
        
        // Habilita o botão de enviar
        const sendButton = document.getElementById('sendButton');
        if (sendButton) sendButton.disabled = false;
        
        // Atualiza status
        this.updateStatus('Pronto para conversar');
        
        // Carrega histórico se houver
        if (this.conversationHistory.length > 0) {
            this.conversationHistory.forEach(msg => {
                this.displayMessage(msg.role, msg.content);
            });
        }
    }

    getModelIcon() {
        const providerIcons = {
            'Meta': '🦙',
            'Google': '🔷',
            'Anthropic': '🤖',
            'OpenAI': '🧠',
            'Microsoft': '💠',
            'Mistral AI': '🌊',
            'NousResearch': '🔬',
            'Alibaba': '🌏',
            'xAI': '🚀',
            'Perplexity': '🔍',
            'Cohere': '🌀'
        };
        return providerIcons[this.selectedModel.provider] || '🤖';
    }

    formatContextLength(length) {
        if (length >= 1000000) {
            return `${(length / 1000000).toFixed(1)}M tokens`;
        } else if (length >= 1000) {
            return `${(length / 1000).toFixed(0)}K tokens`;
        }
        return `${length} tokens`;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Settings modal - removido pois não precisa mais de API key
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
        
        // Model select - agora mostra o seletor completo
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModelSelectorUI();
            });
        }
        
        // Temperature slider
        const tempSlider = document.getElementById('temperature');
        const tempValue = document.getElementById('tempValue');
        if (tempSlider && tempValue) {
            tempSlider.addEventListener('input', (e) => {
                this.settings.temperature = parseFloat(e.target.value);
                tempValue.textContent = e.target.value;
                localStorage.setItem('temperature', e.target.value);
            });
        }
        
        // Max tokens slider
        const tokensSlider = document.getElementById('maxTokens');
        const tokensValue = document.getElementById('tokensValue');
        if (tokensSlider && tokensValue) {
            tokensSlider.addEventListener('input', (e) => {
                this.settings.maxTokens = parseInt(e.target.value);
                tokensValue.textContent = e.target.value;
                localStorage.setItem('max_tokens', e.target.value);
            });
        }
        
        // System prompt
        const systemPrompt = document.getElementById('systemPrompt');
        if (systemPrompt) {
            systemPrompt.addEventListener('change', (e) => {
                this.settings.systemPrompt = e.target.value;
                localStorage.setItem('system_prompt', e.target.value);
            });
        }
        
        // Clear chat
        const clearChat = document.getElementById('clearChat');
        if (clearChat) {
            clearChat.addEventListener('click', () => this.clearConversation());
        }
        
        // Export chat
        const exportChat = document.getElementById('exportChat');
        if (exportChat) {
            exportChat.addEventListener('click', () => this.exportConversation());
        }
        
        // Send message
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
            messageInput.addEventListener('input', () => {
                this.handleInputChange();
                this.autoResizeTextarea();
            });
        }
        
        // Quick prompts
        this.populateQuickPrompts();
    }

    showSettings() {
        // Mostra apenas configurações relevantes (sem API key)
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>⚙️ Configurações</h3>
                    <button class="modal-close" onclick="document.getElementById('settingsModal').classList.add('hidden')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="api-status">
                        <h4>Status das APIs</h4>
                        ${this.apiKeyManager.getUsageStats().map(stat => `
                            <div class="api-stat">
                                <span class="api-name">${stat.name}</span>
                                <span class="api-requests">${stat.requestCount} requisições</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="btn btn--secondary" onclick="chatAI.resetAPIStats()">
                        Resetar Contadores
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    resetAPIStats() {
        this.apiKeyManager.resetStats();
        this.showSettings(); // Atualiza a view
        this.showToast('Contadores resetados!', 'success');
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

    updateSettings() {
        // Update UI elements with current settings
        const tempSlider = document.getElementById('temperature');
        const tempValue = document.getElementById('tempValue');
        if (tempSlider && tempValue) {
            tempSlider.value = this.settings.temperature;
            tempValue.textContent = this.settings.temperature;
        }
        
        const tokensSlider = document.getElementById('maxTokens');
        const tokensValue = document.getElementById('tokensValue');
        if (tokensSlider && tokensValue) {
            tokensSlider.value = this.settings.maxTokens;
            tokensValue.textContent = this.settings.maxTokens;
        }
        
        const systemPrompt = document.getElementById('systemPrompt');
        if (systemPrompt) {
            systemPrompt.value = this.settings.systemPrompt;
        }
    }

    populateQuickPrompts() {
        const container = document.getElementById('quickPrompts');
        if (!container) return;
        
        container.innerHTML = this.quickPrompts.map(prompt => `
            <button class="quick-prompt-btn" data-prompt="${prompt}">
                ${prompt}
            </button>
        `).join('');
        
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-prompt-btn')) {
                const prompt = e.target.dataset.prompt;
                const input = document.getElementById('messageInput');
                if (input) {
                    input.value = prompt;
                    this.handleInputChange();
                    this.autoResizeTextarea();
                    input.focus();
                }
            }
        });
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (input && sendButton) {
            const hasText = input.value.trim().length > 0;
            const canSend = hasText && this.selectedModel && !this.isGenerating;
            sendButton.disabled = !canSend;
            
            // Update token count
            this.updateTokenCount(input.value);
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.isGenerating && this.selectedModel) {
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

    clearConversation() {
        if (!confirm('Tem certeza que deseja limpar toda a conversa?')) return;
        
        this.conversationHistory = [];
        localStorage.setItem('conversation_history', '[]');
        
        if (!this.showModelSelector) {
            this.startChat();
        }
        
        this.showToast('Conversa limpa!', 'success');
    }

    exportConversation() {
        const date = new Date().toISOString().split('T')[0];
        const content = this.conversationHistory.map(msg => 
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n---\n\n');
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${date}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Conversa exportada!', 'success');
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const userMessage = input.value.trim();
        
        if (!userMessage || !this.selectedModel || this.isGenerating) return;

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
            this.handleError(error);
        }
    }

    async streamCompletion(userMessage) {
        this.currentAbortController = new AbortController();
        
        // Usa a próxima API key disponível
        const apiKey = this.apiKeyManager.getNextKey();
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': this.settings.appName,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.selectedModel.id,
                messages: [
                    { role: 'system', content: this.settings.systemPrompt },
                    ...this.conversationHistory.slice(-10) // Last 10 messages for context
                ],
                temperature: this.settings.temperature,
                max_tokens: this.settings.maxTokens,
                stream: true
            }),
            signal: this.currentAbortController.signal
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        // Hide typing indicator
        this.hideTypingIndicator();

        // Create message element for streaming
        const messageId = Date.now();
        this.displayMessage('assistant', '', messageId);
        
        let fullResponse = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const content = data.choices[0]?.delta?.content || '';
                        if (content) {
                            fullResponse += content;
                            this.updateStreamingMessage(messageId, fullResponse);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE:', e);
                    }
                }
            }
        }

        // Add to conversation history
        this.addToConversation('assistant', fullResponse);
        this.isGenerating = false;
        this.updateStatus();
        this.saveConversation();
    }

    displayMessage(role, content, messageId = null) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Remove welcome message if it exists
        const welcomeMessage = chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        if (messageId) messageDiv.dataset.messageId = messageId;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${role === 'user' ? '👤' : this.getModelIcon()}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-role">${role === 'user' ? 'Você' : this.selectedModel.name}</span>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-text">${this.formatMessage(content)}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateStreamingMessage(messageId, content) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"] .message-text`);
        if (messageElement) {
            messageElement.innerHTML = this.formatMessage(content);
            
            // Auto-scroll to bottom
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }

    formatMessage(content) {
        // Basic markdown formatting
        return content
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">${this.getModelIcon()}</div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    addToConversation(role, content) {
        this.conversationHistory.push({ role, content });
        // Keep conversation history reasonable size
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
    }

    saveConversation() {
        localStorage.setItem('conversation_history', JSON.stringify(this.conversationHistory));
    }

    loadConversation() {
        // Conversation is loaded in constructor
        // This method can be used to refresh from storage
    }

    updateStatus(customStatus = null) {
        const statusText = document.getElementById('statusText');
        if (!statusText) return;
        
        if (customStatus) {
            statusText.textContent = customStatus;
        } else if (this.isGenerating) {
            statusText.textContent = 'Gerando resposta...';
        } else if (!this.selectedModel) {
            statusText.textContent = 'Selecione um modelo';
        } else {
            statusText.textContent = 'Pronto para conversar';
        }
    }

    handleError(error) {
        console.error('Chat error:', error);
        this.hideTypingIndicator();
        this.isGenerating = false;
        this.updateStatus();
        
        let errorMessage = 'Ocorreu um erro ao processar sua mensagem.';
        
        if (error.message.includes('API Error')) {
            errorMessage = 'Erro na API. Tentando com próxima chave...';
            // Tenta novamente com a próxima API key
            setTimeout(() => {
                const lastMessage = this.conversationHistory[this.conversationHistory.length - 1];
                if (lastMessage && lastMessage.role === 'user') {
                    this.conversationHistory.pop(); // Remove a última mensagem para reenviar
                    this.sendMessage();
                }
            }, 1000);
        }
        
        this.showToast(errorMessage, 'error');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatAI = new ChatAI();
});