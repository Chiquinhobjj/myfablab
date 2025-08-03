// Script de teste para verificar funcionamento dos cliques
console.log('=== TESTE DE CLIQUES INICIADO ===');

// Função para testar se um elemento é clicável
function testClickable(selector, description) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`❌ ${description}: Elemento não encontrado`);
        return false;
    }
    
    // Verificar propriedades CSS
    const styles = window.getComputedStyle(element);
    const issues = [];
    
    if (styles.pointerEvents === 'none') {
        issues.push('pointer-events: none');
    }
    
    if (styles.visibility === 'hidden') {
        issues.push('visibility: hidden');
    }
    
    if (styles.display === 'none') {
        issues.push('display: none');
    }
    
    if (parseFloat(styles.opacity) === 0) {
        issues.push('opacity: 0');
    }
    
    // Verificar se está coberto por outro elemento
    const rect = element.getBoundingClientRect();
    const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    );
    
    if (elementAtPoint && !element.contains(elementAtPoint) && !elementAtPoint.contains(element)) {
        issues.push(`Coberto por: ${elementAtPoint.tagName}.${elementAtPoint.className}`);
    }
    
    if (issues.length === 0) {
        console.log(`✅ ${description}: Clicável`);
        return true;
    } else {
        console.error(`❌ ${description}: Problemas encontrados:`, issues);
        return false;
    }
}

// Aguardar carregamento completo
setTimeout(() => {
    console.log('\n--- Testando elementos principais ---');
    
    // Testar botões principais
    testClickable('#themeToggle', 'Botão de tema');
    testClickable('#settingsBtn', 'Botão de configurações');
    testClickable('#modelSelect', 'Seletor de modelo');
    testClickable('#sendButton', 'Botão enviar');
    testClickable('#clearChat', 'Botão limpar chat');
    testClickable('#exportChat', 'Botão exportar');
    
    // Testar quick prompts
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');
    console.log(`\n--- Testando ${quickPrompts.length} quick prompts ---`);
    quickPrompts.forEach((btn, i) => {
        testClickable(`.quick-prompt-btn:nth-child(${i + 1})`, `Quick prompt ${i + 1}`);
    });
    
    // Testar model cards se existirem
    const modelCards = document.querySelectorAll('.model-card');
    if (modelCards.length > 0) {
        console.log(`\n--- Testando ${modelCards.length} model cards ---`);
        modelCards.forEach((card, i) => {
            testClickable(`.model-card:nth-child(${i + 1}) .select-model-btn`, `Model card ${i + 1}`);
        });
    }
    
    // Adicionar listener global para debug
    document.addEventListener('click', function(e) {
        console.log('🖱️ Click detectado em:', e.target.tagName, e.target.className || e.target.id);
    }, true);
    
    console.log('\n=== TESTE CONCLUÍDO ===');
    console.log('Cliques agora estão sendo monitorados no console.');
    
}, 2000);