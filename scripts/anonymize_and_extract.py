#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Anonimização e Extração Temática Segura para conversas do WhatsApp
Processa os diretórios /home/ttuti/Downloads/an e /home/ttuti/Downloads/bn.
Blindagem de dados pessoais (nomes, telefones, e-mails, dados bancários, links).
"""

import re
import json
import os
from collections import Counter

FILES_TO_PROCESS = [
    {
        "input": "/home/ttuti/Downloads/an/WhatsApp Chat with Esperança Aéneas.txt",
        "output_anon": "/home/ttuti/Downloads/an/conversa_anonimizada.txt",
        "output_themes": "/home/ttuti/Downloads/an/extracao_tematica.json",
        "label": "Parte 1 (an)"
    },
    {
        "input": "/home/ttuti/Downloads/bn/WhatsApp Chat with Esperança Aeneas.txt",
        "output_anon": "/home/ttuti/Downloads/bn/conversa_anonimizada.txt",
        "output_themes": "/home/ttuti/Downloads/bn/extracao_tematica.json",
        "label": "Parte 2 (bn)"
    }
]
CONSOLIDATED_OUTPUT = "/home/ttuti/Downloads/extracao_consolidada_total.json"

TIMESTAMP_PATTERN = re.compile(r'^(\d{1,2}/\d{1,2}/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$')
PHONE_PATTERN = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}\b')
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
URL_PATTERN = re.compile(r'https?://\S+|www\.\S+')
IBAN_OR_ACCOUNT = re.compile(r'\b(?:AO\d{2}[0-9A-Z]{21}|\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4,9})\b')

OMITTED_PATTERNS = [
    '<Arquivo de mídia oculto>',
    '<Media omitted>',
    'Mensagem apagada',
    'This message was deleted',
    'Chamada de voz perdida',
    'Chamada de vídeo perdida',
    'Missed voice call',
    'Missed video call',
    'As mensagens e as chamadas são protegidas',
    'Messages and calls are end-to-end encrypted',
]

THEMES = {
    "fe_e_oracao": [
        "deus", "senhor", "jesus", "orar", "orando", "oração", "oracoes", "amém", "amen", 
        "bíblia", "biblia", "versículo", "versiculo", "igreja", "culto", "louvor", 
        "fé", "fe", "propósito", "bênção", "bencao", "abençoada", "abencoada", 
        "abençoado", "abencoado", "pastor", "esperança", "esperanca", "paz", "graça"
    ],
    "afeto_e_carinho": [
        "amor", "amo-te", "amo você", "te amo", "amo te", "minha vida", "meu amor", 
        "minha linda", "meu bem", "princesa", "saudade", "saudades", "coração", 
        "carinho", "abraço", "beijo", "beijos", "preciosa", "linda", "lindo", 
        "te adoro", "tikva", "ahuvah", "sheli", "querida", "querido"
    ],
    "apoio_e_cuidado": [
        "descansa", "dorme bem", "bom descanso", "como foi o dia", "estou aqui", 
        "força", "vai dar tudo certo", "estou contigo", "se cuida", "comeu", 
        "almoçou", "jantou", "cansaço", "cansada", "cansado", "prova", "faculdade", 
        "estudo", "trabalho", "parabéns", "orgulho"
    ],
    "cumplicidade_e_humor": [
        "kkk", "hahaha", "rsrs", "engraçado", "brincadeira", "rir", "sorriso", 
        "tonto", "bobo", "boba", "chato", "chata", "palhaço", "palhaça"
    ],
    "sonhos_e_futuro": [
        "futuro", "casamento", "nossa casa", "filhos", "vida juntos", "quando casarmos", 
        "sonho", "planejar", "anos", "para sempre", "eterno", "vida inteira"
    ]
}

def clean_text(text):
    text = URL_PATTERN.sub('[LINK_REMOVIDO]', text)
    text = EMAIL_PATTERN.sub('[EMAIL_REMOVIDO]', text)
    text = PHONE_PATTERN.sub('[TEL_REMOVIDO]', text)
    text = IBAN_OR_ACCOUNT.sub('[DADOS_BANCARIOS_REMOVIDOS]', text)
    text = re.sub(r'\bGozo\b', '[Ele]', text, flags=re.IGNORECASE)
    text = re.sub(r'\bAéneas\b', '[Sobrenome]', text, flags=re.IGNORECASE)
    text = re.sub(r'\bAeneas\b', '[Sobrenome]', text, flags=re.IGNORECASE)
    text = re.sub(r'\bEsperança\b', '[Ela/Tikvá]', text, flags=re.IGNORECASE)
    return text.strip()

def process_file(cfg):
    input_path = cfg["input"]
    if not os.path.exists(input_path):
        print(f"Arquivo não encontrado: {input_path}")
        return None

    print(f"\n--- Processando {cfg['label']}: {input_path} ---")
    messages = []
    current_msg = None
    
    with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            m = TIMESTAMP_PATTERN.match(line)
            if m:
                if current_msg:
                    messages.append(current_msg)
                date_str, time_str, sender, content = m.groups()
                
                if "Gozo" in sender:
                    sender_role = "Ele"
                elif "Esperança" in sender:
                    sender_role = "Ela"
                else:
                    sender_role = "Outro"
                
                current_msg = {
                    "date": date_str,
                    "time": time_str,
                    "sender": sender_role,
                    "content": content
                }
            else:
                if current_msg:
                    current_msg["content"] += "\n" + line.strip()
        
        if current_msg:
            messages.append(current_msg)

    print(f"Total bruto de mensagens: {len(messages)}")

    anonymized_msgs = []
    categorized = {k: [] for k in THEMES}
    sender_counts = Counter()

    for msg in messages:
        sender = msg["sender"]
        raw_content = msg["content"].strip()
        
        if any(omitted in raw_content for omitted in OMITTED_PATTERNS):
            continue
        if len(raw_content) == 0:
            continue
            
        cleaned = clean_text(raw_content)
        if not cleaned:
            continue
            
        sender_counts[sender] += 1
        
        anon_entry = {
            "date": msg["date"],
            "time": msg["time"],
            "sender": sender,
            "text": cleaned
        }
        anonymized_msgs.append(anon_entry)
        
        lower_txt = cleaned.lower()
        for theme_key, keywords in THEMES.items():
            if any(kw in lower_txt for kw in keywords):
                if len(cleaned) > 10:
                    categorized[theme_key].append({
                        "date": msg["date"],
                        "sender": sender,
                        "text": cleaned
                    })

    # Save anonymized text
    with open(cfg["output_anon"], 'w', encoding='utf-8') as f:
        for m in anonymized_msgs:
            f.write(f"[{m['date']} {m['time']}] {m['sender']}: {m['text']}\n")

    print(f"Salvo anonimizado: {cfg['output_anon']} ({len(anonymized_msgs)} mensagens)")

    summary = {
        "label": cfg["label"],
        "total_mensagens_validas": len(anonymized_msgs),
        "mensagens_por_remetente": dict(sender_counts),
        "estatisticas_por_tema": {k: len(v) for k, v in categorized.items()},
        "amostras_destaques": {
            k: v[:60] for k, v in categorized.items()
        }
    }

    with open(cfg["output_themes"], 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    return {
        "categorized": categorized,
        "anonymized_msgs": anonymized_msgs,
        "sender_counts": sender_counts
    }

def main():
    all_categorized = {k: [] for k in THEMES}
    all_anon = []
    total_senders = Counter()

    for cfg in FILES_TO_PROCESS:
        res = process_file(cfg)
        if res:
            all_anon.extend(res["anonymized_msgs"])
            total_senders += res["sender_counts"]
            for k in THEMES:
                all_categorized[k].extend(res["categorized"][k])

    consolidated = {
        "total_geral_mensagens_validas": len(all_anon),
        "total_por_remetente": dict(total_senders),
        "total_por_tema": {k: len(v) for k, v in all_categorized.items()},
        "amostras_destaques": {
            k: all_categorized[k][:100] for k in all_categorized
        }
    }

    with open(CONSOLIDATED_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(consolidated, f, ensure_ascii=False, indent=2)

    print("\n================ CONSOLIDAÇÃO GERAL ================")
    print(f"Total de mensagens anonimizadas somadas: {len(all_anon)}")
    print(f"Total por remetente: {dict(total_senders)}")
    print("Total por tema:")
    for k, v in all_categorized.items():
        print(f"  * {k}: {len(v)} mensagens relevantes")
    print(f"Salvo em: {CONSOLIDATED_OUTPUT}")

if __name__ == '__main__':
    main()
