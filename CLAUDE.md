# Instruções para Claude

Por favor, sempre responda em português brasileiro (pt-BR).

## 🎭 SISTEMA DE ORQUESTRAÇÃO COM AGENTES

**IMPORTANTE**: A partir de agora, TODAS as tarefas devem ser executadas através do sistema de agentes.

### Como funciona:
1. **AGENT_CONDUCTOR** analisa cada solicitação
2. **ORCHESTRATOR** define o pipeline apropriado
3. **Agentes especializados** executam as tarefas
4. **Resultados consolidados** são entregues

### Localização dos agentes:
```
agents/
├── ORCHESTRATOR.md        # Sistema central
├── AGENT_CONDUCTOR.md     # Maestro principal
├── CURRENT_TASK.md        # Tarefa em execução
├── EXECUTION_REPORT.md    # Relatórios
└── [40+ agentes especializados]
```

### Pipelines disponíveis:
- **Bug Fix**: Correção de problemas
- **Feature**: Novas funcionalidades
- **Deploy**: Publicação
- **Optimization**: Melhorias de performance
- **Refactoring**: Reestruturação de código

### Para cada tarefa:
1. Consulte AGENT_CONDUCTOR primeiro
2. Siga o pipeline definido
3. Use os agentes apropriados
4. Documente em EXECUTION_REPORT

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
ALWAYS use the agent orchestration system for all tasks.