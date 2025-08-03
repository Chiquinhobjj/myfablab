// Lista completa de todos os 59 modelos gratuitos do OpenRouter
export const ALL_FREE_MODELS = [
    // Ultra Context (1M+)
    { value: "google/gemini-2.0-flash-exp:free", label: "🌟 Gemini 2.0 Flash (1M contexto)", group: "Ultra Context" },
    { value: "openrouter/horizon-beta", label: "Horizon Beta (256K)", group: "Ultra Context" },
    { value: "openrouter/horizon-alpha", label: "Horizon Alpha (256K)", group: "Ultra Context" },
    
    // Google Models
    { value: "google/gemini-2.5-pro-exp-03-25", label: "Gemini 2.5 Pro Exp", group: "Google" },
    { value: "google/gemini-exp-1206:free", label: "Gemini Exp 1206", group: "Google" },
    { value: "google/gemini-exp-1121:free", label: "Gemini Exp 1121", group: "Google" },
    { value: "google/gemini-exp-1114:free", label: "Gemini Exp 1114", group: "Google" },
    { value: "google/gemini-2-9b-it:free", label: "Gemma 2 9B", group: "Google" },
    { value: "google/gemma-7b-it:free", label: "Gemma 7B", group: "Google" },
    
    // Meta Llama
    { value: "meta-llama/llama-3.2-90b-vision-instruct:free", label: "Llama 3.2 90B Vision", group: "Meta Llama" },
    { value: "meta-llama/llama-3.2-11b-vision-instruct:free", label: "Llama 3.2 11B Vision", group: "Meta Llama" },
    { value: "meta-llama/llama-3.2-3b-instruct:free", label: "Llama 3.2 3B", group: "Meta Llama" },
    { value: "meta-llama/llama-3.2-1b-instruct:free", label: "Llama 3.2 1B", group: "Meta Llama" },
    { value: "meta-llama/llama-3.1-70b-instruct:free", label: "Llama 3.1 70B", group: "Meta Llama" },
    { value: "meta-llama/llama-3.1-8b-instruct:free", label: "Llama 3.1 8B", group: "Meta Llama" },
    { value: "meta-llama/llama-3-8b-instruct:free", label: "Llama 3 8B", group: "Meta Llama" },
    { value: "meta-llama/llama-guard-2-8b", label: "Llama Guard 2 8B", group: "Meta Llama" },
    
    // Qwen (Alibaba)
    { value: "qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 72B", group: "Qwen" },
    { value: "qwen/qwen-2.5-32b-instruct:free", label: "Qwen 2.5 32B", group: "Qwen" },
    { value: "qwen/qwen-2.5-14b-instruct:free", label: "Qwen 2.5 14B", group: "Qwen" },
    { value: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B", group: "Qwen" },
    { value: "qwen/qwen-2.5-3b-instruct:free", label: "Qwen 2.5 3B", group: "Qwen" },
    { value: "qwen/qwen-2.5-1.5b-instruct:free", label: "Qwen 2.5 1.5B", group: "Qwen" },
    { value: "qwen/qwen-2.5-0.5b-instruct:free", label: "Qwen 2.5 0.5B", group: "Qwen" },
    { value: "qwen/qvq-72b-preview:free", label: "QVQ 72B Preview (Vision)", group: "Qwen" },
    { value: "qwen/qwen-2-vl-72b-instruct:free", label: "Qwen 2 VL 72B (Vision)", group: "Qwen" },
    { value: "qwen/qwen-2-vl-7b-instruct:free", label: "Qwen 2 VL 7B (Vision)", group: "Qwen" },
    { value: "qwen/qwen-2-7b-instruct:free", label: "Qwen 2 7B", group: "Qwen" },
    { value: "qwen/qwen-2-1.5b-instruct:free", label: "Qwen 2 1.5B", group: "Qwen" },
    { value: "qwen/qwen-2-0.5b-instruct:free", label: "Qwen 2 0.5B", group: "Qwen" },
    
    // Microsoft Phi
    { value: "microsoft/phi-3.5-mini-128k-instruct:free", label: "Phi 3.5 Mini 128K", group: "Microsoft" },
    { value: "microsoft/phi-3-mini-128k-instruct:free", label: "Phi 3 Mini 128K", group: "Microsoft" },
    { value: "microsoft/phi-3-medium-128k-instruct:free", label: "Phi 3 Medium 128K", group: "Microsoft" },
    
    // Mistral
    { value: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B", group: "Mistral" },
    { value: "mistralai/mistral-7b-instruct-v0.1:free", label: "Mistral 7B v0.1", group: "Mistral" },
    { value: "mistralai/mistral-7b-instruct-v0.2:free", label: "Mistral 7B v0.2", group: "Mistral" },
    { value: "mistralai/mistral-7b-instruct-v0.3:free", label: "Mistral 7B v0.3", group: "Mistral" },
    { value: "mistralai/ministral-8b:free", label: "Ministral 8B", group: "Mistral" },
    { value: "mistralai/ministral-3b:free", label: "Ministral 3B", group: "Mistral" },
    { value: "mistralai/pixtral-12b:free", label: "Pixtral 12B (Vision)", group: "Mistral" },
    { value: "mistralai/codestral-mamba", label: "Codestral Mamba", group: "Mistral" },
    
    // Nous Research
    { value: "nousresearch/hermes-3-llama-3.1-70b:free", label: "Hermes 3 Llama 70B", group: "Nous Research" },
    { value: "nousresearch/hermes-3-llama-3.1-405b:free", label: "Hermes 3 Llama 405B", group: "Nous Research" },
    { value: "nousresearch/hermes-2-theta-llama-3-8b", label: "Hermes 2 Theta Llama 8B", group: "Nous Research" },
    { value: "nousresearch/hermes-2-pro-llama-3-8b", label: "Hermes 2 Pro Llama 8B", group: "Nous Research" },
    
    // Vision Models
    { value: "x-ai/grok-vision-beta:free", label: "Grok Vision Beta", group: "Vision Models" },
    
    // Other Models
    { value: "openchat/openchat-7b:free", label: "OpenChat 7B", group: "Community Models" },
    { value: "gryphe/mythomist-7b:free", label: "MythoMist 7B", group: "Community Models" },
    { value: "undi95/toppy-m-7b:free", label: "Toppy M 7B", group: "Community Models" },
    { value: "huggingfaceh4/zephyr-7b-beta:free", label: "Zephyr 7B Beta", group: "Community Models" },
    { value: "liquid/lfm-40b:free", label: "LFM 40B", group: "Community Models" },
    { value: "thedrummer/rocinante-12b", label: "Rocinante 12B", group: "Community Models" },
    { value: "eva-unit-01/eva-qwen-2.5-14b", label: "EVA Qwen 2.5 14B", group: "Community Models" },
    { value: "anthracite-org/magnum-v4-72b", label: "Magnum v4 72B", group: "Community Models" },
    { value: "sao10k/l3.1-euryale-70b", label: "L3.1 Euryale 70B", group: "Community Models" },
    { value: "inflection/inflection-3-pi", label: "Inflection 3 Pi", group: "Community Models" },
    { value: "inflection/inflection-3-productivity", label: "Inflection 3 Productivity", group: "Community Models" }
];

// Função para popular o select com todos os modelos
export function populateModelSelect(selectElement) {
    // Limpar opções existentes
    selectElement.innerHTML = '';
    
    // Agrupar modelos por categoria
    const groups = {};
    ALL_FREE_MODELS.forEach(model => {
        if (!groups[model.group]) {
            groups[model.group] = [];
        }
        groups[model.group].push(model);
    });
    
    // Adicionar modelos recomendados primeiro
    const recommended = document.createElement('optgroup');
    recommended.label = '⭐ Recomendados';
    recommended.innerHTML = `
        <option value="meta-llama/llama-3.2-3b-instruct:free">Llama 3.2 3B (Rápido)</option>
        <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (1M contexto)</option>
        <option value="qwen/qwen-2.5-72b-instruct:free">Qwen 2.5 72B (Poderoso)</option>
        <option value="microsoft/phi-3-mini-128k-instruct:free">Phi 3 Mini (Eficiente)</option>
    `;
    selectElement.appendChild(recommended);
    
    // Adicionar todos os outros grupos
    Object.keys(groups).forEach(groupName => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = groupName;
        
        groups[groupName].forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.label;
            optgroup.appendChild(option);
        });
        
        selectElement.appendChild(optgroup);
    });
}