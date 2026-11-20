#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Curador e Gerador de 90 a 100 Trechos Marcantes Autênticos (2021 a 2026)
Gera src/data/timelineData.ts sem leaderNote.
"""

import re
import json

file_an = "/home/ttuti/Downloads/an/conversa_anonimizada.txt"
file_bn = "/home/ttuti/Downloads/bn/conversa_anonimizada.txt"

pattern = re.compile(r'^\[(\d{1,2}/\d{1,2}/\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(Ela|Ele):\s*(.*)$')

def parse_file(path):
    messages = []
    current_msg = None
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line_str = line.strip()
            m = pattern.match(line_str)
            if m:
                date_str, time_str, sender, text = m.groups()
                parts = date_str.split('/')
                if len(parts) == 3:
                    m_val, d_val, y_val = int(parts[0]), int(parts[1]), int(parts[2])
                    if y_val < 100:
                        y_val += 2000
                    sort_key = (y_val, m_val, d_val, time_str)
                    formatted_date = f"{d_val:02d}/{m_val:02d}/{y_val}"
                else:
                    sort_key = (2021, 1, 1, time_str)
                    formatted_date = date_str

                current_msg = {
                    "year": sort_key[0],
                    "sort_key": sort_key,
                    "date": formatted_date,
                    "time": time_str[:5],
                    "sender": sender,
                    "text": text.strip()
                }
                messages.append(current_msg)
            else:
                if current_msg and line_str:
                    current_msg["text"] += " " + line_str
    return messages

all_msgs = parse_file(file_bn) + parse_file(file_an)
all_msgs.sort(key=lambda x: x["sort_key"])

def clean_text(text):
    text = re.sub(r'\[Ela/Tikvá\]|\[Ela\]', 'Tikva', text)
    text = re.sub(r'\[Ele/Líder\]|\[Ele\]', 'Líder', text)
    text = re.sub(r'\[TEL_REMOVIDO\]|\[EMAIL_REMOVIDO\]|\[URL_REMOVIDA\]', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Group into exchanges
exchanges = []
curr_exchange = []

for msg in all_msgs:
    txt = clean_text(msg["text"])
    if not txt or len(txt) < 3:
        continue
    if "vcf (file attached)" in txt or "omitted" in txt.lower():
        continue
    
    clean_msg = dict(msg)
    clean_msg["text"] = txt

    if not curr_exchange:
        curr_exchange.append(clean_msg)
    else:
        last = curr_exchange[-1]
        if last["date"] == clean_msg["date"] and len(curr_exchange) < 18:
            curr_exchange.append(clean_msg)
        else:
            if len(curr_exchange) >= 2:
                exchanges.append(curr_exchange)
            curr_exchange = [clean_msg]

if len(curr_exchange) >= 2:
    exchanges.append(curr_exchange)

THEMES = {
    "clamor_oracao": (["clamor", "madrugada", "oração", "orar", "orando", "bênção", "jejum", "joelho"], "Clamor & Oração", ["Clamor", "Oração", "Fé"]),
    "fe_ministerio": (["culto", "igreja", "ensaio", "coral", "pregação", "pastor", "versículo", "bíblia", "louvor", "mocidade", "evangelismo"], "Fé & Ministério", ["Igreja", "Ministério", "Fé"]),
    "afeto_declarado": (["te amo", "amo-te", "amo você", "minha vida", "meu amor", "coração", "carinho", "abraço", "beijo", "preciosa", "linda", "princesa"], "Afeto & Cumplicidade", ["Afeto", "Amor", "Carinho"]),
    "cuidado_apoio": (["cansaço", "cansada", "cansado", "descansa", "força", "lutar", "não desista", "estou aqui", "dorme bem", "saúde", "vitamina"], "Cuidado & Acolhimento", ["Cuidado", "Apoio", "Superação"]),
    "saudade_presenca": (["saudades", "saudade", "falta", "quando te vejo", "esperando", "presença", "conversar"], "Saudade & Presença", ["Saudades", "Presença"]),
    "alegria_sorrisos": (["líder", "abraçou", "palmas", "kkk", "😅", "😂", "engraçado", "olha a pessoa", "ciúmes"], "Leveza & Sorrisos", ["Leveza", "Alegria", "Cumplicidade"]),
}

def determine_title_and_context(window):
    full_text = " ".join(m["text"].lower() for m in window)
    
    best_cat = "afeto_declarado"
    best_hits = 0
    for cat, (keywords, cat_title, cat_tags) in THEMES.items():
        hits = sum(1 for kw in keywords if kw in full_text)
        if hits > best_hits:
            best_hits = hits
            best_cat = cat

    if "clamor" in full_text:
        title = "O Clamor da Madrugada e a Bênção do Altar"
        context = "A partilha da oração matinal que uniu os corações na presença de Deus."
    elif "poema" in full_text or "escrevi" in full_text:
        title = "Versos de Esperança e Inspiração"
        context = "A expressão dos sentimentos através de poesias e reflexões do coração."
    elif "te amo" in full_text or "amo você" in full_text or "amo-te" in full_text:
        title = "Declaração de Afeto e Amor Sincero"
        context = "Palavras de certeza, admiração e amor mútuo que fortalecem a aliança."
    elif "abraço" in full_text or "abracei" in full_text:
        title = "O Abraço que Acolhe e Protege"
        context = "A ternura do reencontro e o conforto de um abraço carinhoso."
    elif "cansaço" in full_text or "cansada" in full_text or "força" in full_text:
        title = "Renovo e Coragem em Dias Difíceis"
        context = "O incentivo e suporte mútuo quando a rotina e o cansaço pesam."
    elif "saudade" in full_text:
        title = "Saudades e a Vontade de Estar Junto"
        context = "A lembrança carinhosa e o desejo de compartilhar cada momento do dia."
    elif "palmas" in full_text or "trabalhadora" in full_text:
        title = "Palmas para a Trabalhadora Exemplar"
        context = "O incentivo e o orgulho das conquistas e dedicação dela nos estudos e trabalho."
    elif "culto" in full_text or "igreja" in full_text or "ensaio" in full_text:
        title = "Caminhada Ministerial e Compromisso na Casa de Deus"
        context = "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja."
    elif "dorme" in full_text or "boa noite" in full_text:
        title = "Paz da Noite e Bênção sob as Asas do Senhor"
        context = "A despedida com oração e votos de descanso tranquilo para o amanhecer."
    elif "líder" in full_text and ("😅" in full_text or "😂" in full_text):
        title = "Sorrisos e Brincadeiras Entre o Líder e a Amada"
        context = "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários."
    else:
        title = THEMES[best_cat][1]
        context = "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade."

    tags = THEMES[best_cat][2]
    return title, context, tags

snippets = []
used_dates = set()

for ex in exchanges:
    senders = set(m["sender"] for m in ex)
    if "Ela" not in senders or "Ele" not in senders:
        continue

    for w_len in (3, 4, 2, 5):
        if len(ex) < w_len:
            continue
        for i in range(0, len(ex) - w_len + 1, 3):
            win = ex[i:i+w_len]
            w_senders = set(m["sender"] for m in win)
            if len(w_senders) < 2:
                continue

            full_txt = " ".join(m["text"].lower() for m in win)
            
            score = 0
            for cat, (kws, _, _) in THEMES.items():
                score += sum(2 for kw in kws if kw in full_txt)
            
            if len(full_txt) > 60: score += 1
            if len(full_txt) > 120: score += 2

            d = win[0]["date"]
            if score >= 4 and d not in used_dates:
                title, context, tags = determine_title_and_context(win)
                snippets.append({
                    "date": d,
                    "sort_key": win[0]["sort_key"],
                    "title": title,
                    "context": context,
                    "messages": [
                        {
                            "sender": m["sender"],
                            "time": m["time"],
                            "text": m["text"]
                        } for m in win
                    ],
                    "tags": tags,
                    "score": score
                })
                used_dates.add(d)
                break
        if len(snippets) >= 120:
            break
    if len(snippets) >= 120:
        break

if len(snippets) < 100:
    for ex in exchanges:
        if len(snippets) >= 100:
            break
        for i in range(0, len(ex) - 2, 4):
            win = ex[i:i+3]
            w_senders = set(m["sender"] for m in win)
            if len(w_senders) < 2:
                continue
            full_txt = " ".join(m["text"].lower() for m in win)
            score = sum(sum(1 for kw in kws if kw in full_txt) for _, (kws, _, _) in THEMES.items())
            if score >= 2:
                title, context, tags = determine_title_and_context(win)
                if not any(s["date"] == win[0]["date"] and s["messages"][0]["text"] == win[0]["text"] for s in snippets):
                    snippets.append({
                        "date": win[0]["date"],
                        "sort_key": win[0]["sort_key"],
                        "title": title,
                        "context": context,
                        "messages": [
                            {
                                "sender": m["sender"],
                                "time": m["time"],
                                "text": m["text"]
                            } for m in win
                        ],
                        "tags": tags,
                        "score": score
                    })

snippets.sort(key=lambda x: x["sort_key"])
selected_snippets = snippets[:100]

final_snippets = []
for idx, s in enumerate(selected_snippets, 1):
    final_snippets.append({
        "id": f"snip-{idx}",
        "number": idx,
        "title": s["title"],
        "date": s["date"],
        "context": s["context"],
        "messages": s["messages"],
        "tags": s["tags"]
    })

ts_content = """import { TimelineMilestone, ConversationSnippet } from '../types';

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-2021',
    year: '2021',
    date: 'Setembro de 2021',
    title: 'O Primeiro Clamor & O Nome Tikvá',
    subtitle: 'O início da caminhada espiritual e mentoria',
    description: 'Os primeiros diálogos marcados pela reverência ministerial, o chamado matinal para a oração ("o clamor foi uma bênção") e o nascimento da saudação hebraica: "Shalom Tikva".',
    icon: 'sparkles',
    category: 'espiritual',
  },
  {
    id: 'm-2022',
    year: '2022',
    date: 'Ano de 2022',
    title: 'Poemas da Alma & Crescimento da Fé',
    subtitle: 'Expressão devocional e cumplicidade',
    description: 'Ela começa a partilhar seus poemas mais íntimos ("Recomeço", "A Cada Amanhecer"). O respeito mútuo floresce em trocas de afeto sincero, ensaios de coral e votos de perseverança nos estudos.',
    icon: 'book',
    category: 'espiritual',
  },
  {
    id: 'm-2023-2024',
    year: '2023-2024',
    date: '2023 – 2024',
    title: 'Aliança Firme no Ministério & Desafios',
    subtitle: 'Trabalho na igreja, juventude e constância',
    description: 'Superação das rotinas pesadas de escola e faculdade, evangelismo com a juventude da igreja, rifas, escalas de louvor e um companheirismo que se tornou porto seguro para ambos.',
    icon: 'heart-circle',
    category: 'conquista',
  },
  {
    id: 'm-2025',
    year: '2025',
    date: 'Ano de 2025',
    title: 'Cuidado na Enfermidade & Amor Declarado',
    subtitle: 'A prova do afeto incondicional',
    description: 'Quando ele enfrentou fraqueza física e esquecimentos por falta de vitamina B12, ela foi o suporte diário que insistiu no descanso. Em contrapartida, nas crises de cansaço dela, ele foi o refúgio seguro: "Eu te amo e amo ver essa força de lutar".',
    icon: 'shield-checkmark',
    category: 'superacao',
  },
  {
    id: 'm-2026',
    year: '2026',
    date: 'Novembro de 2026',
    title: 'Tikva Ahuvah • Minha Esperança',
    subtitle: 'A consagração de mais de 5 anos de história',
    description: 'Cinco anos depois, a história viva de amor cristão, oração e mentoria se materializa em um aplicativo exclusivo, desenhado para cuidar, abençoar e inspirar o coração dela todos os dias.',
    icon: 'ribbon',
    category: 'afeto',
  },
];

export const CONVERSATION_SNIPPETS: ConversationSnippet[] = """ + json.dumps(final_snippets, ensure_ascii=False, indent=2) + ";\n"

with open("src/data/timelineData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated src/data/timelineData.ts with {len(final_snippets)} snippets!")
