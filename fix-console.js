// COPIE E COLE ESTE CÓDIGO NO CONSOLE DO NAVEGADOR

console.log('=== INICIANDO DEBUG DO DROPDOWN ===');

// 1. Verificar se existe
const dropdown = document.getElementById('modelDropdown');
console.log('1. Dropdown existe?', dropdown ? 'SIM' : 'NÃO');

if (dropdown) {
    // 2. Verificar conteúdo
    console.log('2. Tem conteúdo?', dropdown.innerHTML.length > 0 ? 'SIM' : 'NÃO');
    console.log('3. Tamanho do conteúdo:', dropdown.innerHTML.length, 'caracteres');
    
    // 3. Verificar estilos computados
    const styles = window.getComputedStyle(dropdown);
    console.log('4. Display atual:', styles.display);
    console.log('5. Position:', styles.position);
    console.log('6. Z-index:', styles.zIndex);
    console.log('7. Visibility:', styles.visibility);
    console.log('8. Opacity:', styles.opacity);
    
    // 4. Forçar display com !important
    dropdown.setAttribute('style', 'display: block !important; visibility: visible !important; opacity: 1 !important; z-index: 999999 !important; position: fixed !important; top: 100px !important; left: 100px !important; width: 300px !important; min-height: 100px !important; background: yellow !important; border: 5px solid red !important;');
    
    console.log('9. FORCEI ESTILOS - Você vê uma caixa AMARELA com borda VERMELHA?');
    
    // 5. Se não tem conteúdo, adicionar
    if (dropdown.innerHTML.length === 0) {
        dropdown.innerHTML = '<div style="padding: 20px; color: black; font-size: 20px;">TESTE - DROPDOWN FUNCIONANDO!</div>';
        console.log('10. Adicionei conteúdo de teste');
    }
    
    // 6. Verificar se apareceu
    const rect = dropdown.getBoundingClientRect();
    console.log('11. Posição na tela - Top:', rect.top, 'Left:', rect.left, 'Width:', rect.width, 'Height:', rect.height);
    
    // 7. Verificar se está visível
    const isVisible = rect.width > 0 && rect.height > 0;
    console.log('12. Está visível?', isVisible ? 'SIM' : 'NÃO');
    
    if (!isVisible) {
        console.log('⚠️ PROBLEMA: O dropdown existe mas não está visível!');
        console.log('Possíveis causas:');
        console.log('- CSS está sobrescrevendo com !important');
        console.log('- Elemento pai está com display: none');
        console.log('- Elemento está fora da viewport');
        
        // Verificar elemento pai
        const parent = dropdown.parentElement;
        const parentStyles = window.getComputedStyle(parent);
        console.log('13. Parent display:', parentStyles.display);
        console.log('14. Parent visibility:', parentStyles.visibility);
    }
} else {
    console.log('❌ ERRO: Dropdown não encontrado no DOM!');
}

console.log('=== FIM DO DEBUG ===');