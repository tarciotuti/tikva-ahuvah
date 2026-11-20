import { TimelineMilestone, ConversationSnippet } from '../types';

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

export const CONVERSATION_SNIPPETS: ConversationSnippet[] = [
  {
    "id": "snip-1",
    "number": 1,
    "title": "Renovo e Coragem em Dias Difíceis",
    "date": "09/09/2021",
    "context": "O incentivo e suporte mútuo quando a rotina e o cansaço pesam.",
    "messages": [
      {
        "sender": "Ela",
        "time": "09:21",
        "text": "Normal Cansada"
      },
      {
        "sender": "Ele",
        "time": "09:21",
        "text": "Eu estou sempre a desinstalar o meu whatsapp, por isso, se eu não responder alguma mensagem, saiba que não a recebi"
      },
      {
        "sender": "Ele",
        "time": "09:21",
        "text": "Norma do mal"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-2",
    "number": 2,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "10/09/2021",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "22:34",
        "text": "Paz, mana Como estás?"
      },
      {
        "sender": "Ela",
        "time": "22:38",
        "text": "Estou bem no físico mais triste na alma pk faltei no culto"
      },
      {
        "sender": "Ele",
        "time": "22:38",
        "text": "Faltaste?"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-3",
    "number": 3,
    "title": "Cuidado & Acolhimento",
    "date": "15/09/2021",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "22:31",
        "text": "Essa não deve ser a minha irmã Tikva"
      },
      {
        "sender": "Ele",
        "time": "22:32",
        "text": "Se a vires por aí, diz-lhe que estou a procura dela...."
      },
      {
        "sender": "Ele",
        "time": "22:32",
        "text": ".... Estou a ir descansar"
      },
      {
        "sender": "Ela",
        "time": "22:36",
        "text": "Eu estava a me sentir mal e vc nã me perguntou hj como tava Eu não te responde antes pk não sabia o que dizer e tbm estava mal As dores de cabeça não tinham parado Não assiste os últimos tempos de aula E nem sai no campo orei e cheguei em casa e dormir agora ja estou normal"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-4",
    "number": 4,
    "title": "O Clamor da Madrugada e a Bênção do Altar",
    "date": "16/09/2021",
    "context": "A partilha da oração matinal que uniu os corações na presença de Deus.",
    "messages": [
      {
        "sender": "Ela",
        "time": "06:27",
        "text": "Ta bem Perdão pelas palavras"
      },
      {
        "sender": "Ela",
        "time": "06:29",
        "text": "Então eu hj vou ser a primeira a te perguntar acho ne 😅 Como estas ? Como passaste a noite? Como foi o clamor ?"
      },
      {
        "sender": "Ela",
        "time": "06:29",
        "text": "E como foi o culto hj"
      },
      {
        "sender": "Ele",
        "time": "07:49",
        "text": "Very Good!"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-5",
    "number": 5,
    "title": "Leveza & Sorrisos",
    "date": "29/09/2021",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "21:33",
        "text": "Não, faz tempo já"
      },
      {
        "sender": "Ela",
        "time": "21:49",
        "text": "Eeeee 😂😂😂😂😂"
      },
      {
        "sender": "Ele",
        "time": "21:59",
        "text": "É Verdade. Eu ainda te falei que não me deste o que estavas a comet"
      },
      {
        "sender": "Ela",
        "time": "22:38",
        "text": "A ta bem Quando eu fizer vou dar te ta bom"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-6",
    "number": 6,
    "title": "Leveza & Sorrisos",
    "date": "30/09/2021",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "07:06",
        "text": "😂😂😂😅😅😅"
      },
      {
        "sender": "Ele",
        "time": "07:11",
        "text": "Paz"
      },
      {
        "sender": "Ele",
        "time": "07:11",
        "text": "Como passou a noite?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-7",
    "number": 7,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "03/01/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "08:28",
        "text": "Eu tbm nunca mais ti vi lider 🤔🙄"
      },
      {
        "sender": "Ele",
        "time": "08:41",
        "text": "Eu estou sempre na igreja"
      },
      {
        "sender": "Ela",
        "time": "11:57",
        "text": "Eu tbm 😅😁"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-8",
    "number": 8,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "04/01/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "07:58",
        "text": "😂😂😂É isso Hoje vou ir buscar a minha alegria😊"
      },
      {
        "sender": "Ela",
        "time": "07:58",
        "text": "Paz do senhor líder😇"
      },
      {
        "sender": "Ele",
        "time": "08:45",
        "text": "Paz do Senhor, mana"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-9",
    "number": 9,
    "title": "Leveza & Sorrisos",
    "date": "06/01/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "09:21",
        "text": "Parece que vejo o reflexo do teu telefone"
      },
      {
        "sender": "Ela",
        "time": "09:34",
        "text": "😂😂😂humm sério"
      },
      {
        "sender": "Ele",
        "time": "09:34",
        "text": "kkkkkkkkkk"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-10",
    "number": 10,
    "title": "Leveza & Sorrisos",
    "date": "17/01/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:59",
        "text": "Não fugi Eu Espliquei ao Líder Líder O pk da minha ausência E tbm ontem não tava muito bem assim Isso nã me permitia ficar no meio de muita gente"
      },
      {
        "sender": "Ele",
        "time": "11:00",
        "text": "E porquê não estavas muito bem?"
      },
      {
        "sender": "Ele",
        "time": "11:00",
        "text": "O que tinhas?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-11",
    "number": 11,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "28/01/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:19",
        "text": "Não são horas de ensaio?"
      },
      {
        "sender": "Ela",
        "time": "12:23",
        "text": "Tava me preparar para ir a escola Líder ja fizeram a entrega das provas?"
      },
      {
        "sender": "Ele",
        "time": "12:58",
        "text": "Já.... Ontem. Não estavas no culto?"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-12",
    "number": 12,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "29/01/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "23:17",
        "text": "Não estou a entender uma coisa: Várias pessoas estão a faltar no culto por causa da prova"
      },
      {
        "sender": "Ele",
        "time": "23:17",
        "text": "Será que 1hora e meia conseguiram fazer tanto (e não seria possível fazer depois)?"
      },
      {
        "sender": "Ela",
        "time": "23:27",
        "text": "Nada Comecei a fazer desde o momento que sai ai e so terminei so ja agora"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-13",
    "number": 13,
    "title": "Clamor & Oração",
    "date": "03/02/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:49",
        "text": "Mais ou menos Acordei com gripe 🤧"
      },
      {
        "sender": "Ele",
        "time": "11:17",
        "text": "E agora já melhoraste?"
      },
      {
        "sender": "Ela",
        "time": "12:03",
        "text": "Ta normal😇"
      },
      {
        "sender": "Ela",
        "time": "20:21",
        "text": "A cada amanhecer Tu despertas o meu entender Como então não agradecer A tamanha graça e amor Como então não agradecer Pela libertação e salvação Desde o princípio da linha até o fim Tu tiveste comigo Nas magoas e nas aflições Tu estavas aí com a consolação Enfermidades e doenças, saraste Tive nu me vestiste Tive fome, me alimentaste Oh pai como então irei agradecer Como, poderei expressar a tamanha gratidão Gratidão Oh gratidão Parece apenas uma palavra simples no meio de várias expressões Mais capaz de demostrar a mais pura sinceridade. Oh gratidão Oh gratidão Parece ser apenas uma palavra inútil no meio de palavra radiantes Mais capaz de demostrar a mais sincera honestidade. Entre várias palavras radiantes e encantadoras eu encontrei uma palavra simples e humilde Capaz de demostrar a sinceridade em mim . Gratidão Oh gratidão O meu ser é grato ao senhor Bendiga oh ! minha alma ao senhor Bendiga ao criador Seja grata ao teu redentor Que te resgatou com amor E te coroou pelo seu favor Todo meu ser agradece ao senhor Pois não me esqueci de nenhuma bênção Senhor aqui cheguei graças a ti Em mim não há palavras capaz de expressar a tamanha gratidão que existe em meu coração Simplesmente digo pai, muito obrigado pelo teu favor e o teu amor Coro: Ebenezer 2x Até aqui o senhor nos ajudou"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-14",
    "number": 14,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "11/02/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:29",
        "text": "Eu ja não estou no templo estou em casa"
      },
      {
        "sender": "Ele",
        "time": "11:44",
        "text": "Amém"
      },
      {
        "sender": "Ela",
        "time": "22:01",
        "text": "Amanhã não estarei no culto pk , a mama não dormiu em casa Tenho que estar aqui em casa"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-15",
    "number": 15,
    "title": "Clamor & Oração",
    "date": "14/02/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:45",
        "text": "Sim, conta ao Pastor assim que tiveres oportunidade"
      },
      {
        "sender": "Ele",
        "time": "10:46",
        "text": "Depois vamos conversar sobre os sonhos."
      },
      {
        "sender": "Ele",
        "time": "10:46",
        "text": "O bom é aproveitares, ora e pede que Deus te esclareça sobre estes sonhos."
      },
      {
        "sender": "Ele",
        "time": "10:50",
        "text": "Eu também levarei em oração"
      },
      {
        "sender": "Ela",
        "time": "12:44",
        "text": "Amém"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-16",
    "number": 16,
    "title": "Clamor & Oração",
    "date": "18/02/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "09:07",
        "text": "Amém😇"
      },
      {
        "sender": "Ele",
        "time": "09:09",
        "text": "O que estás a fazer?"
      },
      {
        "sender": "Ela",
        "time": "21:52",
        "text": "Amanhã tem o jejum não é ?"
      },
      {
        "sender": "Ele",
        "time": "22:05",
        "text": "Tem sim"
      },
      {
        "sender": "Ele",
        "time": "22:06",
        "text": "Vamos orar por: Arrependimento Vida com Deus (consagração)"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-17",
    "number": 17,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "21/02/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "17:42",
        "text": "Irmã Tikva"
      },
      {
        "sender": "Ela",
        "time": "20:24",
        "text": "Paz do senhor"
      },
      {
        "sender": "Ele",
        "time": "22:04",
        "text": "Descansa já, amanhã terá culto e ensaio"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-18",
    "number": 18,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "28/02/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "13:35",
        "text": "Hj não"
      },
      {
        "sender": "Ele",
        "time": "13:37",
        "text": "Amém"
      },
      {
        "sender": "Ele",
        "time": "13:37",
        "text": "Amanhã após o culto de libertação, pretendo conversar com as harpas"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-19",
    "number": 19,
    "title": "Leveza & Sorrisos",
    "date": "17/03/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:16",
        "text": "Bem obgd"
      },
      {
        "sender": "Ele",
        "time": "22:18",
        "text": "Não estás a me dar confiança"
      },
      {
        "sender": "Ela",
        "time": "22:19",
        "text": "Eu não😅 Pk eu faria isso"
      },
      {
        "sender": "Ele",
        "time": "22:24",
        "text": "Não sei Não sou eu quem está a fazer"
      },
      {
        "sender": "Ela",
        "time": "22:39",
        "text": "Bem Eu não estou a fazer nada 🤷‍♀️"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-20",
    "number": 20,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "24/03/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:20",
        "text": "Amém Paz do senhor tbm para te meu líder Eu estou bem obgd por perguntar, e como está o líder ? Tbm dormi bem obgd, e o líder?"
      },
      {
        "sender": "Ela",
        "time": "10:23",
        "text": "Nada Se essa pergunta é por causa da minha ausência no culto Eu penso que não seria deste modo a pergunta Mais amém o líder sabe o que faz"
      },
      {
        "sender": "Ele",
        "time": "10:38",
        "text": "Não foi pela tua ausência Eu nem sabia que estiveste ausente hoje A minha mensagem é de ontem, não notaste isso?"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-21",
    "number": 21,
    "title": "Declaração de Afeto e Amor Sincero",
    "date": "05/04/2022",
    "context": "Palavras de certeza, admiração e amor mútuo que fortalecem a aliança.",
    "messages": [
      {
        "sender": "Ele",
        "time": "09:23",
        "text": "TE AMO, primeiro 😅"
      },
      {
        "sender": "Ele",
        "time": "09:30",
        "text": "Mas eu amei primeiro"
      },
      {
        "sender": "Ela",
        "time": "09:54",
        "text": "😅😅Ta bom ja que dizes isso 🥰"
      }
    ],
    "tags": [
      "Afeto",
      "Amor",
      "Carinho"
    ]
  },
  {
    "id": "snip-22",
    "number": 22,
    "title": "Leveza & Sorrisos",
    "date": "07/04/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "09:02",
        "text": "Eu disse não todos merecem"
      },
      {
        "sender": "Ele",
        "time": "09:03",
        "text": "E tá aonde ?"
      },
      {
        "sender": "Ela",
        "time": "09:04",
        "text": "A ok Ja entende 😅 Não eu so falei na mama depois vou falar dos outros 😁"
      },
      {
        "sender": "Ele",
        "time": "09:10",
        "text": "Agora eu já não quero mais"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-23",
    "number": 23,
    "title": "Cuidado & Acolhimento",
    "date": "11/04/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:44",
        "text": "O que estás a fazer agora?"
      },
      {
        "sender": "Ela",
        "time": "11:13",
        "text": "Vou Descansar um pouco Porque da que a pouco tenho de arrumar a casa e o quarto das confusões E depois vou cozinhar A mama disse que hoje não vou sair 😭😭 Talvez so para ir apanhar pica"
      },
      {
        "sender": "Ele",
        "time": "11:16",
        "text": "Porquê?"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-24",
    "number": 24,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "24/04/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "17:38",
        "text": "Já estava a pensar em ti há uma hora"
      },
      {
        "sender": "Ele",
        "time": "17:38",
        "text": "Nunca mais falei contigo"
      },
      {
        "sender": "Ela",
        "time": "17:42",
        "text": "Estou bem e pai ?"
      },
      {
        "sender": "Ela",
        "time": "17:42",
        "text": "Eu sou Tikva Não te hj Depois do culto"
      },
      {
        "sender": "Ele",
        "time": "18:39",
        "text": "Eu estou bem, minha filha"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-25",
    "number": 25,
    "title": "Leveza & Sorrisos",
    "date": "13/05/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "16:26",
        "text": "Esse desenho ta estranho eu faço melhor 😌😅"
      },
      {
        "sender": "Ele",
        "time": "16:27",
        "text": "Disso eu não tenho dúvidas"
      },
      {
        "sender": "Ela",
        "time": "16:30",
        "text": "Amm sério 😅 Ja viste alguns dos meus desenhos"
      },
      {
        "sender": "Ele",
        "time": "16:32",
        "text": "Sério"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-26",
    "number": 26,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "19/05/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "07:27",
        "text": "Acho que no sábado não estarei vou para o calemba2 Mais não vou dormir la Talvez volte a tempos do culto então se for para o sábado so será após o culto"
      },
      {
        "sender": "Ela",
        "time": "07:28",
        "text": "No trabalhas so na segunda e quinta que é hj"
      },
      {
        "sender": "Ele",
        "time": "08:13",
        "text": "Amém Vais ir fazer"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-27",
    "number": 27,
    "title": "Clamor & Oração",
    "date": "30/05/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "12:02",
        "text": "Hj saímos para evangelizar nas casas Foi uma bênção 😇"
      },
      {
        "sender": "Ele",
        "time": "12:06",
        "text": "Sério?"
      },
      {
        "sender": "Ele",
        "time": "12:06",
        "text": "No bairro mesmo?"
      },
      {
        "sender": "Ele",
        "time": "12:14",
        "text": "Tikva"
      },
      {
        "sender": "Ele",
        "time": "12:15",
        "text": "Preciso de alguém para editar as fotos das atividades da juventude e publicar Será que conseguirias ter tempo para isso? Caso sim, eu poderia ensinar-te a fazê-lo."
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-28",
    "number": 28,
    "title": "Leveza & Sorrisos",
    "date": "31/05/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "12:09",
        "text": "A Tikva"
      },
      {
        "sender": "Ela",
        "time": "13:03",
        "text": "😅😅Kkk"
      },
      {
        "sender": "Ele",
        "time": "13:09",
        "text": "Já estás na escola?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-29",
    "number": 29,
    "title": "Clamor & Oração",
    "date": "02/07/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "22:20",
        "text": "Filha"
      },
      {
        "sender": "Ela",
        "time": "22:22",
        "text": "Líder Líder vamos falar amanhã Porque vou aproveitar comer e dormir mais cedo Mais eu peço vamos orar por ela, amanhã eu explico o porquê Pode ser 🥺🙏🙏"
      },
      {
        "sender": "Ela",
        "time": "22:23",
        "text": "Orar pela sua vida espiritual"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-30",
    "number": 30,
    "title": "Leveza & Sorrisos",
    "date": "06/07/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "00:16",
        "text": "Quando a filha é tão agarrada que até não fala no pai que fez bolinho só para não lhe dar"
      },
      {
        "sender": "Ela",
        "time": "09:15",
        "text": "Sério 🙄 Mais eu publiquei afinal sou agarrada 😕😟"
      },
      {
        "sender": "Ela",
        "time": "09:15",
        "text": "Espera ai sou agarrada a quê ?😅😅😅"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-31",
    "number": 31,
    "title": "Leveza & Sorrisos",
    "date": "14/07/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "15:01",
        "text": "Já sabia antes de fazeres as provas"
      },
      {
        "sender": "Ela",
        "time": "15:03",
        "text": "😂amem tive boas médias ☺ Amanhã vou ir la ver não vi bem na foto 😅"
      },
      {
        "sender": "Ele",
        "time": "15:05",
        "text": "Amém"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-32",
    "number": 32,
    "title": "Leveza & Sorrisos",
    "date": "22/07/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "14:22",
        "text": "Essa tristeza ....."
      },
      {
        "sender": "Ela",
        "time": "15:43",
        "text": "😂😂é sério eu gosto Limpar quarto de banho se for pequeno melhor"
      },
      {
        "sender": "Ele",
        "time": "15:46",
        "text": "Misericórdia!!!!"
      },
      {
        "sender": "Ele",
        "time": "15:46",
        "text": "Está a fugir trabalho 🤣"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-33",
    "number": 33,
    "title": "Fé & Ministério",
    "date": "09/08/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:45",
        "text": "Amém"
      },
      {
        "sender": "Ela",
        "time": "22:31",
        "text": "A líder consolo pediu para poder lhe enviar Os louvores todos que estamos a ensaiar No se liga 😁"
      },
      {
        "sender": "Ele",
        "time": "22:40",
        "text": "Está bem"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-34",
    "number": 34,
    "title": "Clamor & Oração",
    "date": "18/08/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "12:00",
        "text": "Porque está igualzinha à ultima vez que te vi"
      },
      {
        "sender": "Ela",
        "time": "12:01",
        "text": "A ok"
      },
      {
        "sender": "Ela",
        "time": "22:51",
        "text": "Esse louvor não é em Ebraico 🧐 Mais eu gostei 🥰😇"
      },
      {
        "sender": "Ele",
        "time": "23:01",
        "text": "É uma bênção"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-35",
    "number": 35,
    "title": "Leveza & Sorrisos",
    "date": "24/08/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "07:57",
        "text": "Só às 16 horas?"
      },
      {
        "sender": "Ela",
        "time": "07:58",
        "text": "Yha o líder pensou em que horas ?"
      },
      {
        "sender": "Ela",
        "time": "08:08",
        "text": "A ta bem a Graça hoje não vem podemos gravar a conversa depois lhe mandar"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-36",
    "number": 36,
    "title": "Leveza & Sorrisos",
    "date": "29/08/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "06:38",
        "text": "Parece mesmo você 😅"
      },
      {
        "sender": "Ele",
        "time": "06:38",
        "text": "Paz do Senhor, minha filha"
      },
      {
        "sender": "Ela",
        "time": "06:39",
        "text": "😅😂😂"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-37",
    "number": 37,
    "title": "Saudade & Presença",
    "date": "01/09/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "08:43",
        "text": "Dia 24 não saímos tivemos reunião com a liderança da secção presença L.Líder Graça Tikva"
      },
      {
        "sender": "Ela",
        "time": "08:43",
        "text": "A de hoje depois mando"
      },
      {
        "sender": "Ele",
        "time": "08:45",
        "text": "Paz do Senhor, filha"
      }
    ],
    "tags": [
      "Saudades",
      "Presença"
    ]
  },
  {
    "id": "snip-38",
    "number": 38,
    "title": "Renovo e Coragem em Dias Difíceis",
    "date": "05/09/2022",
    "context": "O incentivo e suporte mútuo quando a rotina e o cansaço pesam.",
    "messages": [
      {
        "sender": "Ela",
        "time": "15:16",
        "text": "Normal vou lavar uma montanha de roupas a mão 😖"
      },
      {
        "sender": "Ele",
        "time": "16:38",
        "text": "Misericórdia"
      },
      {
        "sender": "Ele",
        "time": "16:38",
        "text": "Vai nessa tua força"
      },
      {
        "sender": "Ele",
        "time": "16:39",
        "text": "Temos alguma notícia sobre a questão da escola?"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-39",
    "number": 39,
    "title": "Fé & Ministério",
    "date": "10/09/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "05:35",
        "text": "Ta bom gostei ☺️"
      },
      {
        "sender": "Ele",
        "time": "17:12",
        "text": "Paz do Senhor, filha Vamos precisar de fazer um plano do Evangelismo para o resto do ano"
      },
      {
        "sender": "Ele",
        "time": "17:13",
        "text": "E nele vamos incluir também uma formação, que deve começar pouco depois da campanha em massa"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-40",
    "number": 40,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "14/09/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:33",
        "text": "Actividade da secção de evangelismo Duas(2) semanas de visitação as almas alcançadas pela secção. Dias a realizar: Primeira semana do dia 10 até o 14 de Outubro . Segunda semana do dia 17 até o dia 21de Outubro ."
      },
      {
        "sender": "Ela",
        "time": "22:34",
        "text": "Pensamos em trabalhar com todos os jovem"
      },
      {
        "sender": "Ela",
        "time": "22:38",
        "text": "Tendo duas estratégias A primeira tem os jovens que estaram visitando e A segunda tem os jovens que passaram a ir pegar as almas para estarem no culto até elas ganharem o habito ,😇 O que acha líder"
      },
      {
        "sender": "Ele",
        "time": "23:21",
        "text": "Eu gostei"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-41",
    "number": 41,
    "title": "Leveza & Sorrisos",
    "date": "17/09/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "20:07",
        "text": "É brincadeira, não ouvi"
      },
      {
        "sender": "Ele",
        "time": "20:08",
        "text": "Mas envia, pode ser que me dá uma ideia"
      },
      {
        "sender": "Ela",
        "time": "20:16",
        "text": "😂😂😂😅tutu"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-42",
    "number": 42,
    "title": "Clamor & Oração",
    "date": "22/09/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "20:20",
        "text": "Sim"
      },
      {
        "sender": "Ele",
        "time": "20:20",
        "text": "Uma bênção"
      },
      {
        "sender": "Ele",
        "time": "20:21",
        "text": "Já têm proposta para a estruturação?"
      },
      {
        "sender": "Ele",
        "time": "20:21",
        "text": "Eu tenho uma, para vice líder"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-43",
    "number": 43,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "05/10/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "05:52",
        "text": "Paz do senhor meu líder como está ? Durmiu bem ? Como está a começar o dia ?"
      },
      {
        "sender": "Ela",
        "time": "05:54",
        "text": "Bem sei que ja estas preocupado comigo ,mais peço que não estejes estarei falando com o líder o porquê das minhas ausências 😊"
      },
      {
        "sender": "Ela",
        "time": "05:55",
        "text": "No entanto podes preparar os cocos🤛 para mim 😁😅"
      },
      {
        "sender": "Ele",
        "time": "06:22",
        "text": "Paz do Senhor, minha filha"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-44",
    "number": 44,
    "title": "Leveza & Sorrisos",
    "date": "13/10/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "12:03",
        "text": "Voltei sozinha 😢"
      },
      {
        "sender": "Ele",
        "time": "12:11",
        "text": "Porquê?"
      },
      {
        "sender": "Ele",
        "time": "12:11",
        "text": "Não havíamos combinado algo?"
      },
      {
        "sender": "Ela",
        "time": "12:30",
        "text": "Sim não tive com ligar e o líder tbm não enviou mensagem a perguntar se ja havia saído"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-45",
    "number": 45,
    "title": "Renovo e Coragem em Dias Difíceis",
    "date": "14/10/2022",
    "context": "O incentivo e suporte mútuo quando a rotina e o cansaço pesam.",
    "messages": [
      {
        "sender": "Ela",
        "time": "09:22",
        "text": "Paz"
      },
      {
        "sender": "Ela",
        "time": "09:23",
        "text": "Muito cansada eu ja durmo Eu desmaio depois acordo 😅"
      },
      {
        "sender": "Ele",
        "time": "16:49",
        "text": "Alegria, amarelo?"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-46",
    "number": 46,
    "title": "Leveza & Sorrisos",
    "date": "15/10/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "20:01",
        "text": "Você é mesmo minha filha"
      },
      {
        "sender": "Ela",
        "time": "20:02",
        "text": "😂afinal porquê isso ?😅"
      },
      {
        "sender": "Ele",
        "time": "20:02",
        "text": "Oh!!!! Não sabias?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-47",
    "number": 47,
    "title": "Leveza & Sorrisos",
    "date": "18/10/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "13:45",
        "text": "Correram bem"
      },
      {
        "sender": "Ela",
        "time": "13:53",
        "text": "Líder eu vou precisar uma ajuda com um trabalho que tenho de apresentar Meu telefone não ta tão bom assim e não sei porque Mais a Google tem me dado conteúdos incompletos😞"
      },
      {
        "sender": "Ele",
        "time": "16:13",
        "text": "Como posso ajudar-te, filha?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-48",
    "number": 48,
    "title": "Leveza & Sorrisos",
    "date": "19/10/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "15:48",
        "text": "Líder me ajuda so a fazer um trabalho é para a escola"
      },
      {
        "sender": "Ela",
        "time": "15:49",
        "text": "O tema é A pessoa e o Mundo"
      },
      {
        "sender": "Ele",
        "time": "15:50",
        "text": "Misericórdia!!"
      },
      {
        "sender": "Ela",
        "time": "15:50",
        "text": "A minha conta Google tem me dado conteúdos incompleto"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-49",
    "number": 49,
    "title": "O Clamor da Madrugada e a Bênção do Altar",
    "date": "29/10/2022",
    "context": "A partilha da oração matinal que uniu os corações na presença de Deus.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:48",
        "text": "Estás a dormir pouco?"
      },
      {
        "sender": "Ele",
        "time": "11:48",
        "text": "Ou é do mal estar que tinhas?"
      },
      {
        "sender": "Ela",
        "time": "11:52",
        "text": "As duas coisas 😅 Eu volto em casa22h Como sozinha na mesa ,durmo 23h acordo 6h para levar o Josué a escola Agora tbm passarei acordar as 3h o clamor tem que voltar tenho saudades 😇 Então passarei a dormir mais tarde ainda"
      }
    ],
    "tags": [
      "Saudades",
      "Presença"
    ]
  },
  {
    "id": "snip-50",
    "number": 50,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "04/11/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:15",
        "text": "You deleted this message"
      },
      {
        "sender": "Ela",
        "time": "11:22",
        "text": "Sim 😂😅 Ta bom então fica so líder"
      },
      {
        "sender": "Ele",
        "time": "11:23",
        "text": "Oh!!!!!"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-51",
    "number": 51,
    "title": "Cuidado & Acolhimento",
    "date": "09/11/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:51",
        "text": "Amém"
      },
      {
        "sender": "Ele",
        "time": "22:52",
        "text": "Estás a fazer o quê acordada a essa hora?"
      },
      {
        "sender": "Ela",
        "time": "22:55",
        "text": "Queria pesquisar um trabalho ja que o telefone está ligado,, mais eu vou dormir tenho muito sono"
      },
      {
        "sender": "Ele",
        "time": "22:59",
        "text": "Descansa mesmo, filhinha"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-52",
    "number": 52,
    "title": "Leveza & Sorrisos",
    "date": "16/11/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "08:25",
        "text": "Nãooooooooooooooooooooooooooo eu fiz 17 aninhos 😂😅🙌"
      },
      {
        "sender": "Ele",
        "time": "08:25",
        "text": "Misericórdia"
      },
      {
        "sender": "Ele",
        "time": "08:25",
        "text": "Isso tudo?????"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-53",
    "number": 53,
    "title": "Leveza & Sorrisos",
    "date": "19/11/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:22",
        "text": "É, mais ta difícil 😭 E a situação de hoje ainda ta me doer 😞😔"
      },
      {
        "sender": "Ele",
        "time": "22:30",
        "text": "Significa que não só é normal as tribulações na vida do crente, mas também são importantes, necessárias"
      },
      {
        "sender": "Ela",
        "time": "22:30",
        "text": "Gostaria de ver isso tbm 😅"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-54",
    "number": 54,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "20/11/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "03:31",
        "text": "Filha Hoje marquei com o Carlos, a alma do Sambizanga. Para o culto das 10 horas"
      },
      {
        "sender": "Ele",
        "time": "03:31",
        "text": "Depois vamos lhe buscar"
      },
      {
        "sender": "Ele",
        "time": "21:07",
        "text": "Visitar as almas da evangelização, de 5 a 9 Evangelismo durante o culto da Juventude, a partir do próximo sábado Meta para todos os membros, trazer uma alma nova no culto de sábado, dia 26 de Novembro."
      },
      {
        "sender": "Ela",
        "time": "21:32",
        "text": "Amém Estarei fazendo as listas das almas tanto as antigas como as novas"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-55",
    "number": 55,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "23/11/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "09:16",
        "text": "E não esquece do relatório do dia"
      },
      {
        "sender": "Ele",
        "time": "09:16",
        "text": "Mais tarde, após o culto, me faz lembrar para eu fazer o relatório mensal"
      },
      {
        "sender": "Ela",
        "time": "13:38",
        "text": "Ta bem"
      },
      {
        "sender": "Ela",
        "time": "13:38",
        "text": "Ja vou mandar"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-56",
    "number": 56,
    "title": "Leveza & Sorrisos",
    "date": "24/11/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "08:05",
        "text": "Ontem não te vi"
      },
      {
        "sender": "Ele",
        "time": "08:05",
        "text": "O líder Perdão te entregou alguma coisa?"
      },
      {
        "sender": "Ela",
        "time": "08:08",
        "text": "Se não me falares mais isso ficarei muito agradecida. Apenas Minha filha basta"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-57",
    "number": 57,
    "title": "Leveza & Sorrisos",
    "date": "25/11/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "08:30",
        "text": "Pois,.... Não mesmo"
      },
      {
        "sender": "Ele",
        "time": "08:30",
        "text": "Pelo menos, as minhas filhas não fazem isso"
      },
      {
        "sender": "Ele",
        "time": "08:31",
        "text": "Isso é coisa das endemoninhadas 😅"
      },
      {
        "sender": "Ele",
        "time": "08:31",
        "text": "Paz do Senhor, filha Dormiste bem?"
      },
      {
        "sender": "Ela",
        "time": "10:18",
        "text": "Paz sim graças a Deus"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-58",
    "number": 58,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "26/11/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "20:46",
        "text": "Quando uma poetisa prega"
      },
      {
        "sender": "Ele",
        "time": "20:46",
        "text": "Cada versículo, uma poesia"
      },
      {
        "sender": "Ele",
        "time": "20:46",
        "text": "O culto não ia acabar mais"
      },
      {
        "sender": "Ela",
        "time": "21:36",
        "text": "😅😅😅 Misericórdia 😅"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-59",
    "number": 59,
    "title": "Saudade & Presença",
    "date": "01/12/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "09:28",
        "text": "You turned off disappearing messages. Change timer"
      },
      {
        "sender": "Ele",
        "time": "09:29",
        "text": "Vocês procuram sempre um artifício para faltar"
      },
      {
        "sender": "Ele",
        "time": "09:29",
        "text": "Mas enfim..... Terminar uma greve a meio da semana nunca dá certo"
      },
      {
        "sender": "Ele",
        "time": "09:30",
        "text": "Eu acredito que as aulas só voltarão mesmo efetivamente na segunda-feira"
      },
      {
        "sender": "Ela",
        "time": "09:30",
        "text": "Tikva [Sobrenome] updated the message timer. New messages will disappear from this chat 7 days after they're sent, except when kept. Change timer"
      }
    ],
    "tags": [
      "Saudades",
      "Presença"
    ]
  },
  {
    "id": "snip-60",
    "number": 60,
    "title": "Clamor & Oração",
    "date": "03/12/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:39",
        "text": "Bem Acabei de comer,, agora vou estudar um dos temas da tarefa do discipulado"
      },
      {
        "sender": "Ele",
        "time": "21:40",
        "text": "Não esquece de orar antes de dormir. É hora também pelo papá"
      },
      {
        "sender": "Ele",
        "time": "21:40",
        "text": "Bons estudos"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-61",
    "number": 61,
    "title": "Clamor & Oração",
    "date": "05/12/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "22:09",
        "text": "O coração assim fica no lugar"
      },
      {
        "sender": "Ela",
        "time": "22:09",
        "text": "Yha 😂"
      },
      {
        "sender": "Ela",
        "time": "22:11",
        "text": "Tive 17 Naquele trabalho que haviam mandado no prof de G.D 🥲 Deus é bom 🙏"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-62",
    "number": 62,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "06/12/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "07:28",
        "text": "Conseguiste ir ao culto?"
      },
      {
        "sender": "Ele",
        "time": "08:32",
        "text": "Filha, não me enviaste as fotos até hoje"
      },
      {
        "sender": "Ele",
        "time": "08:32",
        "text": "Quero fechar o relatório do Evangelismo, porque vou pedir o anual na sexta-feira"
      },
      {
        "sender": "Ela",
        "time": "10:30",
        "text": "Não só ao ensaio"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-63",
    "number": 63,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "07/12/2022",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:03",
        "text": "O que acha líder Da poesia que comecei a escrever para o culto dos adolescentes"
      },
      {
        "sender": "Ele",
        "time": "22:32",
        "text": "Essa voz está uma bênção"
      },
      {
        "sender": "Ele",
        "time": "22:33",
        "text": "Parece de alguém que bebeu whisky"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-64",
    "number": 64,
    "title": "Clamor & Oração",
    "date": "12/12/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:04",
        "text": "Não tivemos provas"
      },
      {
        "sender": "Ela",
        "time": "22:06",
        "text": "Hoje só não fui ao estudo porque tive que cozinhar Tava a me sentir normal😇"
      },
      {
        "sender": "Ela",
        "time": "22:06",
        "text": "Vou já tomar a medicação agora 😞"
      },
      {
        "sender": "Ele",
        "time": "22:16",
        "text": "Estás a chorar o quê?"
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-65",
    "number": 65,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "13/12/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "06:44",
        "text": "Ontem a essas horas já estava a dormir"
      },
      {
        "sender": "Ela",
        "time": "06:44",
        "text": "Paz do senhor líder"
      },
      {
        "sender": "Ele",
        "time": "07:41",
        "text": "Paz do Senhor, minha filha"
      },
      {
        "sender": "Ele",
        "time": "15:47",
        "text": "Que nacionalidade é essa?"
      },
      {
        "sender": "Ela",
        "time": "20:55",
        "text": ",🤣🤣🤣😅tbm não sei Só sei que sou filha de Abraão"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-66",
    "number": 66,
    "title": "Saudades e a Vontade de Estar Junto",
    "date": "14/12/2022",
    "context": "A lembrança carinhosa e o desejo de compartilhar cada momento do dia.",
    "messages": [
      {
        "sender": "Ele",
        "time": "21:49",
        "text": "Então não fala"
      },
      {
        "sender": "Ele",
        "time": "21:49",
        "text": "Tive saudades da minha filha"
      },
      {
        "sender": "Ele",
        "time": "21:50",
        "text": "As tuas irmãs mais velhas estão a fazer tutu"
      },
      {
        "sender": "Ela",
        "time": "21:50",
        "text": "Quais?"
      }
    ],
    "tags": [
      "Saudades",
      "Presença"
    ]
  },
  {
    "id": "snip-67",
    "number": 67,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "15/12/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "09:00",
        "text": "Paz líder"
      },
      {
        "sender": "Ela",
        "time": "09:00",
        "text": "Correu rápido 😅"
      },
      {
        "sender": "Ela",
        "time": "09:00",
        "text": "Não"
      },
      {
        "sender": "Ele",
        "time": "09:19",
        "text": "E vai terminar quando?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-68",
    "number": 68,
    "title": "Declaração de Afeto e Amor Sincero",
    "date": "17/12/2022",
    "context": "Palavras de certeza, admiração e amor mútuo que fortalecem a aliança.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:00",
        "text": "Falamos amanhã é melhor 😊😇"
      },
      {
        "sender": "Ela",
        "time": "21:01",
        "text": "Obg pelo presente 🎁😊 Ainda mesmo me portanto mal"
      },
      {
        "sender": "Ele",
        "time": "21:13",
        "text": "Você é minha filha, e eu te amo. Mesmo que não faças nada"
      }
    ],
    "tags": [
      "Afeto",
      "Amor",
      "Carinho"
    ]
  },
  {
    "id": "snip-69",
    "number": 69,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "26/12/2022",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "12:36",
        "text": "Já sim Vou procurar a foto depois mostro ao líder 😁😅"
      },
      {
        "sender": "Ela",
        "time": "12:37",
        "text": "Já me sinto bem melhor É só já a tosse 😕"
      },
      {
        "sender": "Ele",
        "time": "12:56",
        "text": "Isso eu quero ver"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-70",
    "number": 70,
    "title": "Leveza & Sorrisos",
    "date": "27/12/2022",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "09:55",
        "text": "Dormiste tarde porque estavas com sono?"
      },
      {
        "sender": "Ela",
        "time": "09:56",
        "text": "😂😂😂😅"
      },
      {
        "sender": "Ele",
        "time": "10:06",
        "text": "Amém"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-71",
    "number": 71,
    "title": "Cuidado & Acolhimento",
    "date": "01/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:42",
        "text": "You turned off disappearing messages. Change timer"
      },
      {
        "sender": "Ela",
        "time": "13:09",
        "text": "Paz do senhor 😇"
      },
      {
        "sender": "Ele",
        "time": "13:11",
        "text": "Fico feliz sempre que olho para ti. Vejo que, o ano do teu nascimento foi 2022. E já consigo ver que o Senhor tem muito para a tua vida. Aplica-te, avança, não desista, não pares. Breve o Senhor confirmará a você grandes dádivas."
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-72",
    "number": 72,
    "title": "Saudade & Presença",
    "date": "02/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:52",
        "text": "*Tema para novos folhetos:* + Uma nova vida / Uma vida nova (Em Cristo) + Cristo Vive + Salvos pela Graça + Tenha Fé (em Deus/Jesus) + Caminhando com Cristo/Deus + O Verdadeiro Amor"
      },
      {
        "sender": "Ele",
        "time": "10:53",
        "text": "Falta um tema, dá sugestões"
      },
      {
        "sender": "Ela",
        "time": "11:35",
        "text": "TRABALHO DE VISITAÇÃO: 9/11/2022 Presenças: Freddy Etifânia Graça Tânia Fé Tikva Lorivaldo Momento de Oração: Dirigente:Tikva Exortação:_______ Oração final: Fé Grupos (2): 1-(Tikva, Fé , Freddy)_Ngola Nbande, Precol . 2-(Tânia, Etifânia, Lorivaldo)_Sambizanga 12 de julho. Cota: Tikva 100kz Oferta: 100kz"
      }
    ],
    "tags": [
      "Saudades",
      "Presença"
    ]
  },
  {
    "id": "snip-73",
    "number": 73,
    "title": "Clamor & Oração",
    "date": "03/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:44",
        "text": "*Amanhã apresentaremos:* + Relatório + Aplicação para controle das almas + Plano anual de 2023"
      },
      {
        "sender": "Ela",
        "time": "11:15",
        "text": "TRABALHO DE VISITAÇÃO Presenças: Tikva Luís_10:00 Freddy_10:01 Etifânia_10:06 Fé_10:14 Tânia_10:17 Tomé_10:24 Momento devocional: Dirigente_ Tikva Exortação_ Tikva Oração_ Fé Grupos(2): 1-(Freddy, Fé, Etifânia, e Luís)_Sambizanga (12 de julho). 2-(Tomé, Tânia, e Tikva)_ Ngula Nbande até a Precol. Campos(2): 1-Sambizanga (12 de julho). 2-Ngula Nbande até a Precol. Oferta: Não tiramos. Cota: _______________________ Nota: Ausência da líder por conta do estágio."
      },
      {
        "sender": "Ela",
        "time": "11:16",
        "text": "Trabalhamos com a secção de visitação. Presenças dos membros do evangelismo: Tikva Zenilda Graça Tânia Odilon Fé _ atrasou Tomé _ atrasou Momento devocional: Dirigente_ Tikva Exortação_ Graça Oração_ Tomé Ouve dois grupos: O primeiro grupo evangelizou. O segundo grupo visitou as almas. 1-(Tikva, Graça, Zenilda, Odilon)_ Ngula Nbande. 2-(Líder Perdão, ir. Paciência, Fé, Tomé e Tânia)_ Oferta: 100kz Cota: ___________________ Nota: O relatório das almas evangelizadas neste dia se perderam, (Irresponsabilidade da Secretária) ."
      }
    ],
    "tags": [
      "Clamor",
      "Oração",
      "Fé"
    ]
  },
  {
    "id": "snip-74",
    "number": 74,
    "title": "Leveza & Sorrisos",
    "date": "04/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "16:33",
        "text": "Não"
      },
      {
        "sender": "Ela",
        "time": "16:53",
        "text": "Eu mesmo já tava para pedir Obg 😊"
      },
      {
        "sender": "Ele",
        "time": "22:13",
        "text": "É o que acontece quando se come o bolo do Pai. Se vê bué de fumo"
      },
      {
        "sender": "Ela",
        "time": "22:25",
        "text": "🤧😅é isso"
      },
      {
        "sender": "Ele",
        "time": "22:30",
        "text": "Continua assim mesmo"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-75",
    "number": 75,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "05/01/2023",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:36",
        "text": "Da fruta 😁"
      },
      {
        "sender": "Ele",
        "time": "21:38",
        "text": "As mães são mesmo assim Gostam atoa"
      },
      {
        "sender": "Ela",
        "time": "21:41",
        "text": "😂😂😂😂"
      },
      {
        "sender": "Ela",
        "time": "21:58",
        "text": "Líder Líder bem vamos ao trabalho 😁 Bem para a contribuição das tcherts eu pensei o seguinte Que cada evangelista dê 2000kz Agora para os megafone cada secção dê 5000kz E tbm pensei em termos ofertas voluntárias Quem quiser dar ou cobrir uma responsabilidade que faça 😕 O que, o líder pensa disso?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-76",
    "number": 76,
    "title": "Leveza & Sorrisos",
    "date": "07/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "20:24",
        "text": "Harpas **** Filhinha. Faltou a letra H"
      },
      {
        "sender": "Ela",
        "time": "20:27",
        "text": "Yha eu sempre esqueço 😂😅😂"
      },
      {
        "sender": "Ele",
        "time": "20:36",
        "text": "Me envia então as fotos"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-77",
    "number": 77,
    "title": "Leveza & Sorrisos",
    "date": "08/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "20:35",
        "text": "Roubaram no rato 😂😂😂"
      },
      {
        "sender": "Ele",
        "time": "20:41",
        "text": "Lhe manda pagar"
      },
      {
        "sender": "Ela",
        "time": "20:47",
        "text": "😁😂😂😂😂ele não fala E tbm é muito pequeno para usar a batedeira"
      },
      {
        "sender": "Ele",
        "time": "20:51",
        "text": "Mas para comer não foi pequeno"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-78",
    "number": 78,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "09/01/2023",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ele",
        "time": "08:11",
        "text": "Não havias me dado 1000kz?"
      },
      {
        "sender": "Ela",
        "time": "08:20",
        "text": "Ammmm sim 😁😅o líder só lembrou hoje"
      },
      {
        "sender": "Ele",
        "time": "08:20",
        "text": "Sim"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-79",
    "number": 79,
    "title": "Leveza & Sorrisos",
    "date": "10/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "11:14",
        "text": "Sim Eu tbm não vi o líder 😁"
      },
      {
        "sender": "Ela",
        "time": "11:14",
        "text": "Como o líder está?"
      },
      {
        "sender": "Ele",
        "time": "11:15",
        "text": "Estou bem, graças a Deus"
      },
      {
        "sender": "Ele",
        "time": "11:15",
        "text": "Pensei que passarias no estudo antes de ir para a escola"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-80",
    "number": 80,
    "title": "Leveza & Sorrisos",
    "date": "17/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:23",
        "text": "Líder Eu tenho um trabalho da escola a fazer, e não tenho material, E a entrega do trabalho é já na quinta Preciso de um empréstimo de valores Será que podes me ajudar com isso?"
      },
      {
        "sender": "Ele",
        "time": "10:29",
        "text": "No momento não tenho, mas até na quinta feira creio que terei. De quanto precisas?"
      },
      {
        "sender": "Ela",
        "time": "10:33",
        "text": "Quinta feira é o dia da entrega😕 😞 Esse trabalho é o primeiro trabalho da minha disciplina chave ,, até porque se eu não fizer não preciso ir a escola 🙁 Preciso de 6mil"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-81",
    "number": 81,
    "title": "Leveza & Sorrisos",
    "date": "19/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:42",
        "text": "Com Yogurte*"
      },
      {
        "sender": "Ele",
        "time": "10:42",
        "text": "Pelo menos, eu vou 😁"
      },
      {
        "sender": "Ela",
        "time": "10:43",
        "text": "🥹😂 Tbm me dá só iogurte"
      },
      {
        "sender": "Ele",
        "time": "10:44",
        "text": "Cada um compra o dele"
      },
      {
        "sender": "Ele",
        "time": "10:44",
        "text": "Agora volta aos traços, riscos e circunferências...."
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-82",
    "number": 82,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "21/01/2023",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "13:07",
        "text": "Ainda não estás no ensaio porquê?"
      },
      {
        "sender": "Ele",
        "time": "13:15",
        "text": "Não queres me responder, menina?"
      },
      {
        "sender": "Ela",
        "time": "13:16",
        "text": "Eu não consegui chegar a tempos então não vou mais"
      },
      {
        "sender": "Ele",
        "time": "13:16",
        "text": "Tânia, vai buscar a mangueira 📢"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-83",
    "number": 83,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "24/01/2023",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ele",
        "time": "01:12",
        "text": "Paz do Senhor, irmã Tikva Até agora ainda não recebi os relatórios"
      },
      {
        "sender": "Ele",
        "time": "05:46",
        "text": "Nesse sábado estaremos a começar com o evangelismo no decorrer do culto Depois me faz recordar para eu indicar as pessoas que estarão nesse sábado"
      },
      {
        "sender": "Ela",
        "time": "12:36",
        "text": "Já vou mandar Mando no grupo ou aqui mesmo?"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-84",
    "number": 84,
    "title": "Leveza & Sorrisos",
    "date": "25/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "23:24",
        "text": "E já agora.... .... Não pensa que fugiste"
      },
      {
        "sender": "Ela",
        "time": "23:25",
        "text": "Eu não tenho por onde fugir"
      },
      {
        "sender": "Ele",
        "time": "23:27",
        "text": "Ainda bem que sabes"
      },
      {
        "sender": "Ele",
        "time": "23:27",
        "text": "Então, responde....."
      },
      {
        "sender": "Ela",
        "time": "23:30",
        "text": "Ammm Pensei que era outra coisa,, 😂 Se for isso então já fugi mesmo"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-85",
    "number": 85,
    "title": "Leveza & Sorrisos",
    "date": "27/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "16:37",
        "text": "O diabo às vezes tem conselhos que parecem bons"
      },
      {
        "sender": "Ela",
        "time": "22:44",
        "text": "Paz do Senhor líder"
      },
      {
        "sender": "Ela",
        "time": "22:45",
        "text": "Esses são os dados das almas evangelizadas do dia 11, 18 e 25"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-86",
    "number": 86,
    "title": "Leveza & Sorrisos",
    "date": "28/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:17",
        "text": "Isso é quê? Será que hj terei que consolar duas almas 😁"
      },
      {
        "sender": "Ele",
        "time": "21:17",
        "text": "Não... Eu não preciso"
      },
      {
        "sender": "Ele",
        "time": "21:18",
        "text": "Mas a tua irmã sim"
      },
      {
        "sender": "Ela",
        "time": "21:18",
        "text": "Yha não precisas Os líderes são fortes 🤜🏼🙃😇💪🏽"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-87",
    "number": 87,
    "title": "Leveza & Sorrisos",
    "date": "31/01/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "10:45",
        "text": "...."
      },
      {
        "sender": "Ela",
        "time": "11:05",
        "text": "Já vou mandar o relatório de sábado lá no grupo"
      },
      {
        "sender": "Ela",
        "time": "11:28",
        "text": "Líder as cartas para os irmãos que já não estarão fazendo parte da secção já foram enviadas ?!🤔"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-88",
    "number": 88,
    "title": "Leveza & Sorrisos",
    "date": "01/02/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "05:44",
        "text": "Se o líder não responde então não sei o que fazer 👆🏽 Pode não responder as mensagens normais Mais acho que as de trabalho é necessário a resposta do líder Se não eu não faço nada 🤧, Porque não posso fazer o que não me foi orientaram"
      },
      {
        "sender": "Ele",
        "time": "08:49",
        "text": "Paz do Senhor"
      },
      {
        "sender": "Ele",
        "time": "08:50",
        "text": "Isso é poesia?"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-89",
    "number": 89,
    "title": "Fé & Ministério",
    "date": "05/02/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "21:32",
        "text": "E o tema dessa pregação é qual?"
      },
      {
        "sender": "Ela",
        "time": "21:37",
        "text": "😅🤣🤣🤣"
      },
      {
        "sender": "Ele",
        "time": "21:40",
        "text": "Quero saber"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-90",
    "number": 90,
    "title": "Leveza & Sorrisos",
    "date": "11/02/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:23",
        "text": "A dor já parou , então estou bem graças a Deus 🙌"
      },
      {
        "sender": "Ele",
        "time": "21:24",
        "text": "Eu nem sei qual dor....."
      },
      {
        "sender": "Ela",
        "time": "21:25",
        "text": "Eu quis explicar ao líder Mais simplesmente o líder me ignorou"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-91",
    "number": 91,
    "title": "Leveza & Sorrisos",
    "date": "16/02/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "21:25",
        "text": "Paz do Senhor,....."
      },
      {
        "sender": "Ela",
        "time": "22:45",
        "text": "Paz líder O líder me deve né? 🤔"
      },
      {
        "sender": "Ele",
        "time": "22:46",
        "text": "Sim...."
      },
      {
        "sender": "Ele",
        "time": "22:46",
        "text": "1000kz Precisas já?"
      },
      {
        "sender": "Ela",
        "time": "22:52",
        "text": "Não É só para o líder não esquecer O líder diz que esqueces as vezes"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-92",
    "number": 92,
    "title": "Leveza & Sorrisos",
    "date": "19/02/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:08",
        "text": "Hoje não nos vimos?🤔"
      },
      {
        "sender": "Ele",
        "time": "22:09",
        "text": "Perguntaste isso porque te perguntei como estás?"
      },
      {
        "sender": "Ela",
        "time": "22:13",
        "text": "Sim , porque me pareceu que líder está preocupado comigo, mais o líder me viu hj , e eu estou bem, então não motivos para preocupação 🙂😊"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-93",
    "number": 93,
    "title": "Paz da Noite e Bênção sob as Asas do Senhor",
    "date": "22/02/2023",
    "context": "A despedida com oração e votos de descanso tranquilo para o amanhecer.",
    "messages": [
      {
        "sender": "Ele",
        "time": "23:29",
        "text": "Dorme bem"
      },
      {
        "sender": "Ela",
        "time": "23:30",
        "text": "Talvez se conseguir dormir"
      },
      {
        "sender": "Ele",
        "time": "23:32",
        "text": "E porque não coseguirias?"
      },
      {
        "sender": "Ela",
        "time": "23:34",
        "text": "Tbm não sei Estou a espera das respostas Agora eu vou 👋"
      },
      {
        "sender": "Ele",
        "time": "23:44",
        "text": "????"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-94",
    "number": 94,
    "title": "Renovo e Coragem em Dias Difíceis",
    "date": "23/02/2023",
    "context": "O incentivo e suporte mútuo quando a rotina e o cansaço pesam.",
    "messages": [
      {
        "sender": "Ela",
        "time": "22:12",
        "text": "O quê que isso significa"
      },
      {
        "sender": "Ele",
        "time": "22:37",
        "text": "Não é crer contra você 😅"
      },
      {
        "sender": "Ele",
        "time": "22:37",
        "text": "Fica descansada"
      }
    ],
    "tags": [
      "Cuidado",
      "Apoio",
      "Superação"
    ]
  },
  {
    "id": "snip-95",
    "number": 95,
    "title": "Caminhada Ministerial e Compromisso na Casa de Deus",
    "date": "25/02/2023",
    "context": "A fidelidade no serviço cristão, nos ensaios e no amor pela igreja.",
    "messages": [
      {
        "sender": "Ela",
        "time": "10:29",
        "text": "Líder Líder No total temos 4mil"
      },
      {
        "sender": "Ele",
        "time": "11:45",
        "text": "Amém"
      },
      {
        "sender": "Ele",
        "time": "11:45",
        "text": "Leva até a igreja"
      }
    ],
    "tags": [
      "Igreja",
      "Ministério",
      "Fé"
    ]
  },
  {
    "id": "snip-96",
    "number": 96,
    "title": "Sorrisos e Brincadeiras Entre o Líder e a Amada",
    "date": "28/02/2023",
    "context": "A leveza de rir juntos e compartilhar a doçura dos pequenos detalhes diários.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:01",
        "text": "Quanto é que te devo?"
      },
      {
        "sender": "Ela",
        "time": "11:05",
        "text": "😅 Eu sabia que o líder quis esse tema"
      },
      {
        "sender": "Ela",
        "time": "11:06",
        "text": "Da secção Ou só meu aparte? 😁"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-97",
    "number": 97,
    "title": "Leveza & Sorrisos",
    "date": "02/03/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ele",
        "time": "11:27",
        "text": "É o pecado....."
      },
      {
        "sender": "Ela",
        "time": "12:51",
        "text": "Errado 😅😂"
      },
      {
        "sender": "Ela",
        "time": "12:52",
        "text": "Isso é muito fácil 😂😅 Não pensei que iam errar assim"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-98",
    "number": 98,
    "title": "Leveza & Sorrisos",
    "date": "03/03/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "07:56",
        "text": "Melhor ficar só assim"
      },
      {
        "sender": "Ele",
        "time": "09:16",
        "text": "Acreditas que isso está certo?"
      },
      {
        "sender": "Ela",
        "time": "09:18",
        "text": "Se o líder não lembra para quê eu vou tocar de novo no assunto Fica só assim Já esqueci"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-99",
    "number": 99,
    "title": "Leveza & Sorrisos",
    "date": "07/03/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "21:41",
        "text": "Paz do Senhor líder Como está ?"
      },
      {
        "sender": "Ela",
        "time": "21:45",
        "text": "O líder já está informado de tudo concernente ao sector administrativo Voltando aos secretários?!"
      },
      {
        "sender": "Ele",
        "time": "22:30",
        "text": "Paz do Senhor"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  },
  {
    "id": "snip-100",
    "number": 100,
    "title": "Leveza & Sorrisos",
    "date": "08/03/2023",
    "context": "Troca de afeto e diálogo diário compartilhando a rotina com cumplicidade.",
    "messages": [
      {
        "sender": "Ela",
        "time": "06:13",
        "text": "Posso saber se essa resposta é concernente a qual das perguntas que eu fiz 1 Ou 2"
      },
      {
        "sender": "Ele",
        "time": "06:29",
        "text": "A esta"
      },
      {
        "sender": "Ela",
        "time": "06:38",
        "text": "A ok O líder já está no grupo. Vou fazer um resumo de tudo Vou mandar ao líder e posteriormente estarei saindo do grupo Bem porque eu não sou Secretária do Sector 🙃"
      }
    ],
    "tags": [
      "Leveza",
      "Alegria",
      "Cumplicidade"
    ]
  }
];
