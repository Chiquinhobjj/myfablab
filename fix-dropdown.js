// Script de correção para o dropdown
console.log('Fix dropdown script loaded');

// Esperar o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, fixing dropdown...');
    
    // Pegar elementos
    const button = document.getElementById('modelSelectorBtn');
    const dropdown = document.getElementById('modelDropdown');
    
    if (!button || !dropdown) {
        console.error('Button or dropdown not found!');
        return;
    }
    
    // Remover onclick antigo e adicionar novo
    button.onclick = null;
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked!');
        
        // Toggle direto
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    console.log('Dropdown fix applied!');
});

// Fallback se DOMContentLoaded já passou
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, applying fix now...');
    
    const button = document.getElementById('modelSelectorBtn');
    const dropdown = document.getElementById('modelDropdown');
    
    if (button && dropdown) {
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked (fallback)!');
            
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                dropdown.style.display = 'block';
            }
            return false;
        };
    }
}