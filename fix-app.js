// Correções emergenciais para o JavaScript

// Desabilitar service worker se existir
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('Service Worker removido:', registration.scope);
        }
    });
}

// Limpar cache do navegador
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) {
            caches.delete(name);
            console.log('Cache removido:', name);
        }
    });
}

// Sobrescrever função autoResizeTextarea com debounce
let resizeTimeout;
window.autoResizeTextareaFixed = function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const textarea = document.getElementById('messageInput');
        if (textarea && textarea.offsetParent !== null) {
            try {
                const scrollPos = textarea.scrollTop;
                textarea.style.height = 'auto';
                const newHeight = Math.min(textarea.scrollHeight, 120);
                textarea.style.height = newHeight + 'px';
                textarea.scrollTop = scrollPos;
            } catch (e) {
                console.error('Erro ao redimensionar textarea:', e);
            }
        }
    }, 50);
};

// Aguardar DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - aplicando correções...');
    
    // Substituir função original se a classe ChatAI existir
    setTimeout(() => {
        if (window.chatAI && window.chatAI.autoResizeTextarea) {
            window.chatAI.autoResizeTextarea = window.autoResizeTextareaFixed;
            console.log('Função autoResizeTextarea substituída');
        }
        
        // Re-adicionar event listener com a função corrigida
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            // Remover listeners antigos
            const newInput = messageInput.cloneNode(true);
            messageInput.parentNode.replaceChild(newInput, messageInput);
            
            // Adicionar novo listener
            newInput.addEventListener('input', window.autoResizeTextareaFixed);
            console.log('Event listener do textarea corrigido');
        }
    }, 1000);
    
    // Verificar se há elementos sobrepostos e corrigir
    const checkOverlap = () => {
        const elements = document.querySelectorAll('.modal, .loading-overlay, .toast-container');
        elements.forEach(el => {
            // Só ocultar se o elemento estiver visível mas sem conteúdo
            if (el.style.display !== 'none' && !el.classList.contains('hidden')) {
                const rect = el.getBoundingClientRect();
                // Verificar se está bloqueando a tela sem ter conteúdo
                if (rect.width > 0 && rect.height > 0 && !el.querySelector('*')) {
                    el.style.display = 'none';
                    console.log('Elemento vazio oculto:', el.className);
                }
            }
        });
    };
    
    checkOverlap();
    setInterval(checkOverlap, 5000);
    
    // Garantir que o chat input esteja acessível
    const chatInput = document.getElementById('messageInput');
    if (chatInput) {
        chatInput.removeAttribute('disabled');
        chatInput.style.pointerEvents = 'auto';
        chatInput.style.opacity = '1';
        console.log('Chat input habilitado');
    }
    
    // Verificar se há erros no console a cada 2 segundos
    let errorCount = 0;
    const originalError = console.error;
    console.error = function(...args) {
        errorCount++;
        if (errorCount > 10) {
            console.warn('Muitos erros detectados, recarregando a página...');
            setTimeout(() => location.reload(), 2000);
        }
        originalError.apply(console, args);
    };
});

console.log('Arquivo de correções carregado');