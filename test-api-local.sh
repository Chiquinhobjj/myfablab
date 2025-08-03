#!/bin/bash
# Teste rápido da API local

echo "🧪 Testando API local..."

curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/llama-3.2-3b-instruct:free",
    "messages": [
      {"role": "user", "content": "Oi, teste"}
    ],
    "temperature": 0.7,
    "max_tokens": 100
  }' | jq '.'

echo -e "\n✅ Se apareceu uma resposta JSON acima, a API está funcionando!"