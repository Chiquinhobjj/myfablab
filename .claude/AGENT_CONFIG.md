# Claude Code Agent Configuration
# This file contains agent configuration for the MyFabLab project
# Place this information in your agent markdown files' frontmatter

## How Claude Code Actually Works with Agents

Claude Code recognizes agents through:
1. Markdown files in `.claude/agents/` directory
2. Frontmatter in each agent file with specific format
3. Using @agent-name to invoke them

## Agent Files Structure

Each agent file should have this structure:

```markdown
---
name: agent-name
description: |
  What triggers this agent and what it does
color: blue
tools: Read, Write, Task, WebSearch
---

Agent content and instructions here
```

## Our Agents Are Already Configured!

All our agents in `.claude/agents/fazedoria/` and `.claude/agents/debug/` 
are already properly formatted with the correct frontmatter.

## How to Use Agents in Claude Code

### Manual Invocation
Simply type @ and the agent name:
- @ceo-myfablab
- @woz-myfablab
- @jobson-myfablab
- @gates-myfablab
- @seth-myfablab
- @equipe-myfablab
- @emergency-fixer

### Auto-Detection
Claude Code will suggest agents based on context and keywords in their descriptions.

## Project Context (for reference)

Project: MyFabLab Chat AI
URL: https://myfablab.online
Stack: Vanilla JS, OpenRouter API
Infrastructure: VPS Hostinger + EasyPanel
Current Issue: JavaScript modules not loading

## Agent Specializations

- **@ceo-myfablab**: Strategic decisions, conflict resolution
- **@woz-myfablab**: Technical debugging, architecture
- **@jobson-myfablab**: UX/UI design, simplification
- **@gates-myfablab**: Business strategy, monetization
- **@seth-myfablab**: Growth hacking, marketing
- **@equipe-myfablab**: DevOps, deployment
- **@emergency-fixer**: Crisis resolution, urgent fixes

## Workflow Examples

### Emergency Response
1. User: "Site is broken!"
2. Use: @emergency-fixer for immediate fix
3. Then: @woz-myfablab for root cause
4. Finally: @equipe-myfablab for deployment

### New Feature
1. User: "Add payment system"
2. Use: @ceo-myfablab for approval
3. Then: @gates-myfablab for pricing strategy
4. Then: @jobson-myfablab for UI design
5. Then: @woz-myfablab for implementation
6. Finally: @equipe-myfablab for deployment

## Testing Agents

Run these commands in Claude Code to test:

```
@woz-myfablab "Check if emergency.html works"
@emergency-fixer "Production is down!"
@ceo-myfablab "Should we migrate to React?"
```

## Important Notes

1. Claude Code automatically discovers agents in `.claude/agents/`
2. No additional configuration needed in settings.local.json
3. Agents are invoked with @ prefix
4. Multiple agents can be called in one message
5. Agents can reference each other

## Troubleshooting

If agents don't appear:
1. Ensure files are in `.claude/agents/` directory
2. Check that each .md file has proper frontmatter
3. Restart Claude Code
4. Try invoking directly with @agent-name

The agents are already properly configured and ready to use!