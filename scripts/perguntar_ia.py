#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Assistente IA 100% Local e Offline (Ollama + Llama 3.2 3B)
Não envia nenhum dado para a internet. Funciona totalmente offline.
Uso:
  python3 scripts/perguntar_ia.py "Sua pergunta aqui"
  ou sem argumentos para modo de chat interativo.
"""

import sys
import json
import urllib.request

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"

SYSTEM_PROMPT = """Você é um assistente pessoal sábio, afetuoso, respeitoso e focado em fé cristã, edificação, ideias para o aplicativo Tikva Ahuvah e reflexões bíblicas. Responda sempre em português com clareza e carinho."""

def ask_ollama(prompt):
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "system": SYSTEM_PROMPT,
        "stream": True
    }
    
    req = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                if line:
                    data = json.loads(line.decode('utf-8'))
                    chunk = data.get("response", "")
                    sys.stdout.write(chunk)
                    sys.stdout.flush()
            print()
    except Exception as e:
        print(f"\n[Erro ao conectar ao Ollama local: {e}]")
        print("Certifique-se de que o servidor local está rodando com: ./scripts/iniciar_ia_local.sh")

def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        print(f"🤖 IA Local ({MODEL_NAME}):\n")
        ask_ollama(query)
    else:
        print("="*60)
        print(f"🌿 Tikva Ahuvah • IA 100% Local & Offline ({MODEL_NAME})")
        print("Digite sua mensagem (ou 'sair' para encerrar):")
        print("="*60)
        while True:
            try:
                user_input = input("\nVocê > ")
                if user_input.strip().lower() in ["sair", "exit", "quit"]:
                    print("Até logo!")
                    break
                if not user_input.strip():
                    continue
                print("\nIA Local > ", end="")
                ask_ollama(user_input)
            except (KeyboardInterrupt, EOFError):
                print("\nEncerrando...")
                break

if __name__ == "__main__":
    main()
