#!/bin/bash

# Claude Code Auto-Setup Script
# This ensures the Fazedoria Team is always loaded

echo "🚀 Initializing Fazedoria Team for Claude Code..."

# Check if we're in the right directory
if [ ! -d ".claude/agents/fazedoria" ]; then
    echo "❌ Error: Not in the MyFabLab project directory!"
    echo "Please run this from: /Users/chiquinho/Downloads/startups/agentes_vibecoding/perplexity/myfablab.online"
    exit 1
fi

# Create agent shortcuts in root for easier access
echo "📁 Creating agent shortcuts..."

cat > .claude-agents << 'EOF'
# Quick Agent Access
# Source this file to get quick access to agents

# Technical
alias woz="echo '@woz-myfablab'"
alias emergency="echo '@emergency-fixer'"
alias devops="echo '@equipe-myfablab'"

# Product
alias ux="echo '@jobson-myfablab'"

# Business
alias business="echo '@gates-myfablab'"
alias growth="echo '@seth-myfablab'"

# Leadership
alias ceo="echo '@ceo-myfablab'"

# Teams
alias tech-team="echo '@woz-myfablab @equipe-myfablab'"
alias product-team="echo '@jobson-myfablab @woz-myfablab'"
alias business-team="echo '@gates-myfablab @seth-myfablab'"
alias all-hands="echo '@ceo-myfablab @woz-myfablab @jobson-myfablab @gates-myfablab @seth-myfablab @equipe-myfablab'"

echo "✅ Agent shortcuts loaded!"
echo ""
echo "Available agents:"
echo "  Technical: woz, emergency, devops"
echo "  Product: ux"
echo "  Business: business, growth"
echo "  Leadership: ceo"
echo "  Teams: tech-team, product-team, business-team, all-hands"
EOF

# Create a startup message for Claude Code
cat > .claude/startup.md << 'EOF'
# 🚀 MyFabLab Chat AI - Fazedoria Team Active

## Current Status
- **Production**: https://myfablab.online
- **Issue**: JavaScript modules not loading
- **Emergency Fix**: emergency.html ready

## Available Agents
- @ceo-myfablab - Strategic decisions
- @woz-myfablab - Technical solutions
- @jobson-myfablab - UX/Design
- @gates-myfablab - Business strategy
- @seth-myfablab - Growth hacking
- @equipe-myfablab - DevOps
- @emergency-fixer - Crisis response

## Quick Start
1. For current issue: `@emergency-fixer "Fix production now"`
2. For debugging: `@woz-myfablab "Why modules not loading?"`
3. For decisions: `@ceo-myfablab "What's the priority?"`

## Workflows Active
- Emergency Response
- Development Pipeline
- Growth Strategy

The Fazedoria Team is ready to help!
EOF

# Create VSCode settings for better integration
if [ ! -d ".vscode" ]; then
    mkdir .vscode
fi

cat > .vscode/settings.json << 'EOF'
{
  "files.associations": {
    "*.md": "markdown",
    ".claude-agents": "shellscript"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "workbench.colorCustomizations": {
    "activityBar.background": "#667eea",
    "statusBar.background": "#764ba2"
  },
  "terminal.integrated.env.osx": {
    "CLAUDE_PROJECT": "myfablab",
    "CLAUDE_AGENTS": "fazedoria"
  }
}
EOF

echo "✅ VSCode settings configured"

# Create a test file to verify agents are working
cat > test-agents.md << 'EOF'
# Test Agent Commands

Copy and paste these in Claude Code to test:

## Test Individual Agents
```
@woz-myfablab "What's the current tech stack?"
@jobson-myfablab "How can we improve the UI?"
@gates-myfablab "What's our monetization strategy?"
@seth-myfablab "How to get first 1000 users?"
@equipe-myfablab "How to setup monitoring?"
@emergency-fixer "Site is down, help!"
@ceo-myfablab "What should we prioritize?"
```

## Test Team Workflows
```
"The site is broken in production" 
(Should trigger: emergency-fixer → woz → equipe)

"We need to implement user authentication"
(Should trigger: ceo → jobson → woz → equipe)

"How can we make money from this?"
(Should trigger: gates → seth → ceo)
```
EOF

echo "✅ Test file created: test-agents.md"

# Final check
echo ""
echo "🎉 Setup Complete!"
echo ""
echo "✅ Agents installed in: .claude/agents/"
echo "✅ Settings configured in: .claude/settings.local.json"
echo "✅ Project config in: .claude/project.yaml"
echo "✅ Index created in: .claude/agents/index.md"
echo ""
echo "📝 Next steps:"
echo "1. Restart Claude Code"
echo "2. Agents will auto-load based on context"
echo "3. Use @ to manually invoke any agent"
echo "4. Check test-agents.md for examples"
echo ""
echo "🚀 The Fazedoria Team is ready to rock!"