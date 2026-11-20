#!/usr/bin/env bash
# Inicia o servidor local do Ollama em background
export PATH="$HOME/.local/bin:$PATH"

if ! command -v ollama &> /dev/null; then
    echo "Ollama ainda está sendo descompactado. Aguarde alguns minutos."
    exit 1
fi

echo "Iniciando o servidor Ollama localmente..."
ollama serve > "$HOME/.local/ollama_server.log" 2>&1 &
PID=$!
echo "Ollama rodando no PID $PID (100% offline, localhost:11434)"
