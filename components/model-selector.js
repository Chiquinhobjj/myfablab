// Componente de seleção de modelos estilo OpenRouter
import { FREE_OPENROUTER_MODELS, filterFreeModels, getFreeModelProviders, getFreeModelCapabilities, groupModelsByCategory } from '../config/free-models-database.js';

export class ModelSelector {
    constructor(container, onModelSelect) {
        this.container = container;
        this.onModelSelect = onModelSelect;
        this.currentFilter = {
            search: '',
            free: true, // Sempre mostrar apenas gratuitos
            provider: null,
            capability: null,
            view: 'grid' // 'grid' ou 'table'
        };
        this.selectedModel = null;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="model-selector">
                <!-- Header com filtros -->
                <div class="model-selector-header">
                    <h2>Selecionar Modelo de IA Gratuito</h2>
                    <div class="model-stats">
                        <span class="stat-badge">🎉 59 modelos gratuitos disponíveis!</span>
                    </div>
                    <div class="model-view-toggle">
                        <button class="view-btn ${this.currentFilter.view === 'grid' ? 'active' : ''}" data-view="grid">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <rect x="1" y="1" width="6" height="6" rx="1"/>
                                <rect x="9" y="1" width="6" height="6" rx="1"/>
                                <rect x="1" y="9" width="6" height="6" rx="1"/>
                                <rect x="9" y="9" width="6" height="6" rx="1"/>
                            </svg>
                        </button>
                        <button class="view-btn ${this.currentFilter.view === 'table' ? 'active' : ''}" data-view="table">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <rect x="1" y="2" width="14" height="2" rx="0.5"/>
                                <rect x="1" y="7" width="14" height="2" rx="0.5"/>
                                <rect x="1" y="12" width="14" height="2" rx="0.5"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Barra de filtros -->
                <div class="model-filters">
                    <!-- Busca -->
                    <div class="filter-search">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        <input type="text" placeholder="Buscar modelos..." class="filter-search-input" value="${this.currentFilter.search}">
                    </div>

                    <!-- Filtro de contexto -->
                    <div class="filter-group">
                        <label>Contexto:</label>
                        <div class="filter-buttons">
                            <button class="filter-btn ${!this.currentFilter.minContext ? 'active' : ''}" data-filter="context" data-value="all">
                                Todos
                            </button>
                            <button class="filter-btn ${this.currentFilter.minContext === 100000 ? 'active' : ''}" data-filter="context" data-value="100k">
                                100K+
                            </button>
                            <button class="filter-btn ${this.currentFilter.minContext === 500000 ? 'active' : ''}" data-filter="context" data-value="500k">
                                500K+
                            </button>
                        </div>
                    </div>

                    <!-- Filtro de provider -->
                    <div class="filter-group">
                        <label>Provider:</label>
                        <select class="filter-select" data-filter="provider">
                            <option value="">Todos</option>
                            ${getFreeModelProviders().map(provider => 
                                `<option value="${provider}" ${this.currentFilter.provider === provider ? 'selected' : ''}>${provider}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <!-- Filtro de capacidade -->
                    <div class="filter-group">
                        <label>Capacidade:</label>
                        <select class="filter-select" data-filter="capability">
                            <option value="">Todas</option>
                            ${getFreeModelCapabilities().map(cap => 
                                `<option value="${cap}" ${this.currentFilter.capability === cap ? 'selected' : ''}>${this.getCapabilityLabel(cap)}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <!-- Lista de modelos -->
                <div class="model-list ${this.currentFilter.view}">
                    ${this.renderModels()}
                </div>
            </div>
        `;
    }

    renderModels() {
        const models = filterFreeModels(this.currentFilter);
        
        if (models.length === 0) {
            return '<div class="no-models">Nenhum modelo encontrado com os filtros selecionados.</div>';
        }

        // Adiciona seção de categorias antes da lista
        const categories = groupModelsByCategory();
        let categorySection = '';
        
        if (!this.currentFilter.search && !this.currentFilter.provider && !this.currentFilter.capability) {
            categorySection = `
                <div class="model-categories">
                    <h3>Categorias Populares</h3>
                    <div class="category-chips">
                        <button class="category-chip" data-category="ultra-context">
                            🌟 Ultra Context (${categories['Ultra Context (>500K)'].length})
                        </button>
                        <button class="category-chip" data-category="reasoning">
                            🧠 Raciocínio (${categories['Reasoning & Thinking'].length})
                        </button>
                        <button class="category-chip" data-category="vision">
                            👁️ Visão (${categories['Vision & Multimodal'].length})
                        </button>
                        <button class="category-chip" data-category="code">
                            💻 Código (${categories['Code & Development'].length})
                        </button>
                        <button class="category-chip" data-category="uncensored">
                            🔓 Sem Censura (${categories['Uncensored'].length})
                        </button>
                    </div>
                </div>
            `;
        }

        if (this.currentFilter.view === 'table') {
            return categorySection + this.renderTableView(models);
        }

        return categorySection + this.renderGridView(models);
    }

    renderGridView(models) {
        return models.map(model => `
            <div class="model-card ${this.selectedModel?.id === model.id ? 'selected' : ''}" data-model-id="${model.id}">
                <div class="model-card-header">
                    <div class="model-info">
                        <h3 class="model-name">${model.name}</h3>
                        <p class="model-provider">${model.provider}</p>
                    </div>
                    <div class="model-badges">
                        <span class="model-badge free">Gratuito</span>
                        ${model.tags.includes('new') ? '<span class="model-badge new">Novo</span>' : ''}
                        ${model.contextLength >= 1000000 ? '<span class="model-badge ultra">1M+</span>' : ''}
                        ${model.capabilities.includes('reasoning') ? '<span class="model-badge reasoning">🧠</span>' : ''}
                        ${model.capabilities.includes('vision') ? '<span class="model-badge vision">👁️</span>' : ''}
                        ${model.capabilities.includes('uncensored') ? '<span class="model-badge uncensored">🔓</span>' : ''}
                    </div>
                </div>
                
                <p class="model-description">${model.description}</p>
                
                <div class="model-capabilities">
                    ${model.capabilities.map(cap => 
                        `<span class="capability-chip">${this.getCapabilityIcon(cap)} ${this.getCapabilityLabel(cap)}</span>`
                    ).join('')}
                </div>
                
                <div class="model-stats">
                    <div class="stat">
                        <span class="stat-label">Contexto:</span>
                        <span class="stat-value">${this.formatContextLength(model.contextLength)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Lançamento:</span>
                        <span class="stat-value">${this.formatDate(model.releaseDate)}</span>
                    </div>
                </div>
                
                <div class="model-strengths">
                    <strong>Pontos fortes:</strong>
                    <ul>
                        ${model.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="model-footer">
                    <span class="model-date">Lançado: ${this.formatDate(model.releaseDate)}</span>
                    <button class="select-model-btn" data-model-id="${model.id}">Selecionar</button>
                </div>
            </div>
        `).join('');
    }

    renderTableView(models) {
        return `
            <table class="models-table">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Provider</th>
                        <th>Contexto</th>
                        <th>Capacidades</th>
                        <th>Preço</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${models.map(model => `
                        <tr class="${this.selectedModel?.id === model.id ? 'selected' : ''}">
                            <td>
                                <div class="table-model-info">
                                    <strong>${model.name}</strong>
                                    ${model.isFree ? '<span class="model-badge free">Gratuito</span>' : ''}
                                    <p class="model-description-table">${model.description}</p>
                                </div>
                            </td>
                            <td>${model.provider}</td>
                            <td>${this.formatContextLength(model.contextLength)}</td>
                            <td>
                                <div class="table-capabilities">
                                    ${model.capabilities.map(cap => 
                                        `<span class="capability-chip small">${this.getCapabilityIcon(cap)}</span>`
                                    ).join('')}
                                </div>
                            </td>
                            <td>
                                ${model.isFree ? 'Grátis' : `$${model.pricing.prompt}/$${model.pricing.completion}`}
                            </td>
                            <td>
                                <button class="select-model-btn small" data-model-id="${model.id}">Selecionar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    attachEventListeners() {
        // Busca
        this.container.querySelector('.filter-search-input').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.updateModelList();
        });

        // Toggle de view
        this.container.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter.view = btn.dataset.view;
                this.render();
            });
        });

        // Filtros de botão
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                const value = btn.dataset.value;
                
                if (filter === 'context') {
                    if (value === 'all') this.currentFilter.minContext = null;
                    else if (value === '100k') this.currentFilter.minContext = 100000;
                    else if (value === '500k') this.currentFilter.minContext = 500000;
                }
                
                this.updateModelList();
            });
        });

        // Filtros de select
        this.container.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filter = e.target.dataset.filter;
                this.currentFilter[filter] = e.target.value || null;
                this.updateModelList();
            });
        });

        // Seleção de modelo
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('select-model-btn')) {
                const modelId = e.target.dataset.modelId;
                this.selectModel(modelId);
            }
            
            // Clique no card também seleciona
            const card = e.target.closest('.model-card');
            if (card && !e.target.classList.contains('select-model-btn')) {
                const modelId = card.dataset.modelId;
                this.selectModel(modelId);
            }
            
            // Clique nas categorias
            if (e.target.classList.contains('category-chip')) {
                const category = e.target.dataset.category;
                this.currentFilter.search = '';
                this.currentFilter.provider = null;
                
                if (category === 'ultra-context') {
                    this.currentFilter.minContext = 500000;
                    this.currentFilter.capability = null;
                } else if (category === 'reasoning') {
                    this.currentFilter.capability = 'reasoning';
                    this.currentFilter.minContext = null;
                } else if (category === 'vision') {
                    this.currentFilter.capability = 'vision';
                    this.currentFilter.minContext = null;
                } else if (category === 'code') {
                    this.currentFilter.capability = 'code';
                    this.currentFilter.minContext = null;
                } else if (category === 'uncensored') {
                    this.currentFilter.capability = 'uncensored';
                    this.currentFilter.minContext = null;
                }
                
                this.render(); // Re-render completo para atualizar filtros
            }
        });
    }

    updateModelList() {
        const modelList = this.container.querySelector('.model-list');
        modelList.innerHTML = this.renderModels();
    }

    selectModel(modelId) {
        this.selectedModel = FREE_OPENROUTER_MODELS[modelId];
        if (this.onModelSelect) {
            this.onModelSelect(this.selectedModel);
        }
        this.updateModelList();
    }

    getCapabilityIcon(capability) {
        const icons = {
            'text': '💬',
            'code': '💻',
            'vision': '👁️',
            'analysis': '📊',
            'web-search': '🔍',
            'real-time': '⚡',
            'multilingual': '🌐',
            'rag': '📚',
            'reasoning': '🧠',
            'thinking': '💭',
            'uncensored': '🔓',
            'multimodal': '🎨',
            'ultra-context': '🌟',
            'math': '🔢',
            'data-science': '📈',
            'experimental': '🧪'
        };
        return icons[capability] || '✨';
    }

    getCapabilityLabel(capability) {
        const labels = {
            'text': 'Texto',
            'code': 'Código',
            'vision': 'Visão',
            'analysis': 'Análise',
            'web-search': 'Busca Web',
            'real-time': 'Tempo Real',
            'multilingual': 'Multilingual',
            'rag': 'RAG',
            'reasoning': 'Raciocínio',
            'thinking': 'Pensamento',
            'uncensored': 'Sem Censura',
            'multimodal': 'Multimodal',
            'ultra-context': 'Ultra Context',
            'math': 'Matemática',
            'data-science': 'Data Science',
            'experimental': 'Experimental'
        };
        return labels[capability] || capability;
    }

    formatContextLength(length) {
        if (length >= 1000000) {
            return `${(length / 1000000).toFixed(1)}M`;
        } else if (length >= 1000) {
            return `${(length / 1000).toFixed(0)}K`;
        }
        return length.toString();
    }

    formatDate(dateStr) {
        const [year, month] = dateStr.split('-');
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${months[parseInt(month) - 1]} ${year}`;
    }
}

// Exporta função para criar o seletor
export function createModelSelector(container, onModelSelect) {
    return new ModelSelector(container, onModelSelect);
}