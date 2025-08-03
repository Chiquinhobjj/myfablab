#!/bin/bash

# 🧪 TESTE DE TODOS OS AGENTES INSTALADOS
# Por: @woz-myfablab
# Data: 2024-12-16

echo "🚀 TESTANDO TIME COMPLETO MYFABLAB COGNETICA"
echo "============================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório base
BASE_DIR="/Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online/.claude/agents"

echo -e "${YELLOW}📊 Verificando estrutura de diretórios...${NC}"
echo ""

# Verificar diretórios
directories=(
    "fazedoria"
    "cognetica"
    "leadership"
    "debug"
)

for dir in "${directories[@]}"; do
    if [ -d "$BASE_DIR/$dir" ]; then
        count=$(ls -1 "$BASE_DIR/$dir" | grep -c ".md$")
        echo -e "${GREEN}✅ $dir/ - $count agentes encontrados${NC}"
    else
        echo -e "${RED}❌ $dir/ - Diretório não encontrado${NC}"
    fi
done

echo ""
echo -e "${YELLOW}📋 Listando todos os agentes instalados...${NC}"
echo ""

# Time Fazedoria
echo -e "${BLUE}🛠️ TIME FAZEDORIA:${NC}"
fazedoria_agents=(
    "ceo-orchestrator.md"
    "woz-tech.md"
    "jobson-ux.md"
    "tobias-creative.md"
    "gates-business.md"
    "seth-growth.md"
    "equipe-devops.md"
)

for agent in "${fazedoria_agents[@]}"; do
    if [ -f "$BASE_DIR/fazedoria/$agent" ]; then
        echo -e "  ${GREEN}✅ $agent${NC}"
    else
        echo -e "  ${RED}❌ $agent - NÃO ENCONTRADO${NC}"
    fi
done

# Time Cognetica
echo ""
echo -e "${BLUE}🧠 TIME COGNETICA:${NC}"
cognetica_agents=(
    "riley-prompt.md"
    "jerry-rag.md"
    "harrison-memory.md"
)

for agent in "${cognetica_agents[@]}"; do
    if [ -f "$BASE_DIR/cognetica/$agent" ]; then
        echo -e "  ${GREEN}✅ $agent${NC}"
    else
        echo -e "  ${RED}❌ $agent - NÃO ENCONTRADO${NC}"
    fi
done

# Time Leadership
echo ""
echo -e "${BLUE}🏢 TIME LEADERSHIP:${NC}"
leadership_agents=(
    "demis-ceo.md"
    "tony-product.md"
    "karpathy-tech.md"
    "dario-ethics.md"
    "sama-growth.md"
)

for agent in "${leadership_agents[@]}"; do
    if [ -f "$BASE_DIR/leadership/$agent" ]; then
        echo -e "  ${GREEN}✅ $agent${NC}"
    else
        echo -e "  ${RED}❌ $agent - NÃO ENCONTRADO${NC}"
    fi
done

# Time Debug
echo ""
echo -e "${BLUE}🚨 TIME DEBUG:${NC}"
if [ -f "$BASE_DIR/debug/emergency-fixer.md" ]; then
    echo -e "  ${GREEN}✅ emergency-fixer.md${NC}"
else
    echo -e "  ${RED}❌ emergency-fixer.md - NÃO ENCONTRADO${NC}"
fi

# Estatísticas
echo ""
echo -e "${YELLOW}📊 ESTATÍSTICAS FINAIS:${NC}"
echo "------------------------"

total_expected=16
total_found=$(find "$BASE_DIR" -name "*.md" -type f | wc -l)

echo "Agentes esperados: $total_expected"
echo "Agentes encontrados: $total_found"

if [ "$total_found" -ge "$total_expected" ]; then
    echo -e "${GREEN}✅ TODOS OS AGENTES INSTALADOS COM SUCESSO!${NC}"
else
    echo -e "${RED}⚠️ Faltam $(($total_expected - $total_found)) agentes${NC}"
fi

echo ""
echo -e "${YELLOW}🎯 COMANDOS DE TESTE:${NC}"
echo "------------------------"
echo ""
echo "# Testar time Fazedoria:"
echo '@woz-tech "Você está operacional?"'
echo ""
echo "# Testar time Cognetica:"
echo '@riley-prompt "Como criar o prompt perfeito?"'
echo ""
echo "# Testar time Leadership:"
echo '@demis-ceo "Qual nossa visão de longo prazo?"'
echo ""
echo "# Testar colaboração:"
echo '@tony-product @jobson-ux @tobias-creative "Como simplificar o onboarding?"'
echo ""
echo -e "${GREEN}✨ Time completo pronto para ação!${NC}"
