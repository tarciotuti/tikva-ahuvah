#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
from datetime import datetime

file_an = "/home/ttuti/Downloads/an/conversa_anonimizada.txt"
file_bn = "/home/ttuti/Downloads/bn/conversa_anonimizada.txt"

# [M/D/YY HH:MM] Sender: Text
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
                # Parse date to sortable
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

msgs_bn = parse_file(file_bn)
msgs_an = parse_file(file_an)

all_msgs = msgs_bn + msgs_an
all_msgs.sort(key=lambda x: x["sort_key"])

print(f"Total parsed messages: {len(all_msgs)}")
if all_msgs:
    print(f"First message date: {all_msgs[0]['date']} by {all_msgs[0]['sender']}")
    print(f"Last message date: {all_msgs[-1]['date']} by {all_msgs[-1]['sender']}")
