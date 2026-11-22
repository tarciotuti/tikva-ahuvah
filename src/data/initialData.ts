import { Memory, Capsule, Note } from '../types';

export interface DailyVerse {
  reference: string;
  text: string;
  theme: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    reference: 'Salmos 62:5 (ARC)',
    text: 'Ó minha alma, espera somente em Deus, porque dele vem a minha esperança.',
    theme: 'Esperança em Deus',
  },
  {
    reference: 'Lamentações 3:21 (ARC)',
    text: 'Disso me recordarei no meu coração; por isso, tenho esperança.',
    theme: 'Recordação & Fé',
  },
  {
    reference: 'Romanos 5:5 (ARC)',
    text: 'E a esperança não traz confusão, porquanto o amor de Deus está derramado em nosso coração pelo Espírito Santo que nos foi dado.',
    theme: 'Amor & Certeza',
  },
  {
    reference: 'Romanos 8:24 (ARC)',
    text: 'Porque, em esperança, somos salvos. Ora, a esperança que se vê não é esperança; porque o que alguém vê, como o esperará?',
    theme: 'Salvação & Esperança',
  },
  {
    reference: 'Romanos 12:12 (ARC)',
    text: 'Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração;',
    theme: 'Alegria & Oração',
  },
  {
    reference: 'Romanos 15:13 (ARC)',
    text: 'Ora, o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.',
    theme: 'Deus da Esperança',
  },
  {
    reference: '1 Coríntios 13:13 (ARC)',
    text: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.',
    theme: 'Fé, Esperança & Amor',
  },
  {
    reference: 'Tito 1:2 (ARC)',
    text: '...em esperança da vida eterna, a qual Deus, que não pode mentir, prometeu antes dos tempos dos séculos;',
    theme: 'Promessa Eterna',
  },
  {
    reference: 'Hebreus 10:23 (ARC)',
    text: '...retenhamos firmes a confissão da nossa esperança, porque fiel é o que prometeu.',
    theme: 'Fidelidade Divina',
  },
  {
    reference: '1 Pedro 1:3 (ARC)',
    text: 'Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, que, segundo a sua grande misericórdia, nos gerou de novo para uma viva esperança, pela ressurreição de Jesus Cristo dentre os mortos...',
    theme: 'Viva Esperança',
  },
  {
    reference: 'Salmos 42:11 (NVI)',
    text: 'Por que você está assim tão triste, ó minha alma? Por que está assim tão perturbada dentro de mim? Ponha a sua esperança em Deus! Pois ainda o louvarei; ele é o meu Salvador e o meu Deus.',
    theme: 'Paz para a Alma',
  },
  {
    reference: 'Salmos 130:5 (NVI)',
    text: 'Espero no Senhor com todo o meu ser, e na sua palavra ponho a minha esperança.',
    theme: 'Na Sua Palavra',
  },
  {
    reference: 'Jeremias 29:11 (NVI)',
    text: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.',
    theme: 'Planos de Paz & Futuro',
  },
  {
    reference: '1 Timóteo 4:10 (ARA)',
    text: 'Ora, é para esse fim que labutamos e nos esforçamos sobremodo, porquanto temos posto a nossa esperança no Deus vivo, Salvador de todos os homens, especialmente dos fiéis.',
    theme: 'No Deus Vivo',
  },
  {
    reference: 'Hebreus 6:19 (NVI)',
    text: 'Temos esta esperança como âncora da alma, firme e segura, a qual adentra o santuário interior, por trás do véu.',
    theme: 'Âncora da Alma',
  },
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'O Primeiro Capítulo deste Diário',
    description: 
      'Este aplicativo foi criado especialmente para você, com muito carinho e oração. ' +
      'A vida é cheia de pequenos instantes que merecem ser guardados: os risos soltos, ' +
      'as vitórias que pareciam difíceis, as viagens inesperadas e a beleza de quem você é. ' +
      'Que este seja o seu cantinho seguro para lembrar de onde veio e se orgulhar de quem você está se tornando.',
    date: '2024-01-01',
    category: 'Momentos Inesquecíveis',
    isFavorite: true,
    location: 'Feito com carinho',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'mem-2',
    title: 'A Força que Você Tem (e que às vezes esquece)',
    description: 
      'Ver você crescer, aprender e superar desafios é um presente enorme. ' +
      'Mesmo nos dias em que tudo parece confuso ou cansativo, nunca se esqueça da menina ' +
      'brilhante, determinada e generosa que você é. O mundo é muito melhor com você nele.',
    date: '2024-03-15',
    category: 'Família & Afeto',
    isFavorite: true,
    location: 'No coração',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: 'mem-3',
    title: 'Aquele Sorriso Espontâneo',
    description: 
      'Algumas das melhores memórias não precisam de grandes palcos: são as conversas leves, ' +
      'as piadas que só vocês entendem e o conforto de ter alguém especial por perto. ' +
      'Continue espalhando essa sua luz por onde passar!',
    date: '2024-06-20',
    category: 'Pequenas Alegrias',
    isFavorite: false,
    location: 'Momentos simples',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
];

const FALLBACK_CAPSULES: Capsule[] = [
  {
    id: 'cap-1',
    title: 'Abra quando o dia parecer pesado demais',
    subtitle: 'Para lembrar que tempestades passam',
    content: 
      'Respira fundo. Solte os ombros. Você não precisa carregar o peso do mundo nas costas hoje.\n\n' +
      'Tudo bem desacelerar, tudo bem estar cansada, tudo bem ter um dia que não saiu perfeito. ' +
      'Dias ruins não definem a sua história; eles são apenas páginas difíceis de um livro lindo que você ainda está escrevendo.\n\n' +
      'Tome uma água gelada ou um chá quentinho, descanse a cabeça no travesseiro e saiba: amanhã é um novo recomeço, ' +
      'e você tem gente aqui que te ama incondicionalmente e torce pela sua paz.',
    quote: 'Você é mais forte do que imagina e mais querida do que consegue ver.',
    authorNote: 'Com todo o carinho e admiração',
    category: 'dia_dificil',
    icon: 'cloud-rain',
    isOpened: false,
    createdAt: Date.now(),
  },
  {
    id: 'cap-2',
    title: 'Abra quando duvidar de si mesma e do seu valor',
    subtitle: 'Para recalibrar a sua confiança',
    content: 
      'Se você está lendo isso, é porque aquela vozinha da insegurança tentou sussurrar que você não é capaz. ' +
      'Não escute ela.\n\n' +
      'Olhe para trás e veja o quanto você já caminhou. Cada tropeço que você superou, cada desafio que parecia ' +
      'impossível e que você venceu com a sua coragem e fé.\n\n' +
      'Você tem inteligência, sensibilidade e um talento único. Confie no seu processo e nos seus passos. ' +
      'Eu acredito em você, de olhos fechados.',
    quote: 'Nunca diminua o seu brilho para caber na sombra de ninguém.',
    authorNote: 'Orgulho imenso de você',
    category: 'confianca',
    icon: 'sparkles',
    isOpened: false,
    createdAt: Date.now(),
  },
  {
    id: 'cap-3',
    title: 'Abra para dar uma boa risada',
    subtitle: 'Uma dose de bom humor para o seu dia',
    content: 
      'Lembrete oficial do dia:\n\n' +
      '1. Os problemas parecem 50% menores depois de um bom lanche.\n' +
      '2. Ninguém sabe exatamente o que está fazendo na vida adulta, todo mundo está apenas improvisando.\n' +
      '3. Você é genial (mesmo quando faz aquela cara engraçada quando está concentrada).\n\n' +
      'Dá um sorriso aí agora! Pronto, o dia acabou de ficar 100% mais bonito.',
    quote: 'Rir de si mesma e das pequenas bobagens da vida é o melhor remédio.',
    category: 'sorriso',
    icon: 'happy',
    isOpened: false,
    createdAt: Date.now(),
  },
  {
    id: 'cap-4',
    title: 'Abra quando sentir saudades ou quiser um abraço',
    subtitle: 'Um lembrete de que você nunca está sozinha',
    content: 
      'A distância física ou a correria do dia a dia não mudam em nada a importância que você tem.\n\n' +
      'Sempre que bater uma saudade, lembre-se de que você tem um porto seguro. Alguém que quer ouvir ' +
      'como foi o seu dia, que se importa de verdade com o que você sente e que sempre estará aqui para te estender a mão.\n\n' +
      'Receba agora um abraço bem apertado, daquele tipo que recarrega as baterias.',
    quote: 'Quem mora no nosso coração nunca está longe de verdade.',
    authorNote: 'Sempre torcendo por você',
    category: 'saudades',
    icon: 'heart-half',
    isOpened: false,
    createdAt: Date.now(),
  },
  {
    id: 'cap-5',
    title: 'Abra antes de dar um grande passo ou novo desafio',
    subtitle: 'Um empurrãozinho de coragem',
    content: 
      'Dar frio na barriga é o sinal de que você está viva e crescendo!\n\n' +
      'Seja uma prova, um novo emprego, uma mudança ou uma decisão corajosa: vá com medo mesmo, mas vá com toda a sua dedicação. ' +
      'Você se preparou, você merece estar aí e o Senhor guiará cada um dos seus passos.\n\n' +
      'Erguer a cabeça e dar o primeiro passo: você já venceu!',
    quote: 'A coragem não é a ausência de medo, mas a certeza de que algo é maior que ele.',
    category: 'futuro',
    icon: 'rocket',
    isOpened: false,
    createdAt: Date.now(),
  },
  {
    id: 'cap-6',
    title: 'Abra no seu próximo aniversário',
    subtitle: 'Uma celebração especial para o seu dia',
    content: 
      'Mais uma volta ao sol!\n\n' +
      'Que orgulho e que alegria é ver mais um ano da sua vida se completando. ' +
      'Desejo que este novo ciclo venha repleto de saúde, gargalhadas sinceras, conquistas merecidas e momentos leves sob a bênção de Deus.\n\n' +
      'Celebre com intensidade, coma o que tiver vontade e comemore a pessoa incrível que você é. Parabéns hoje e sempre!',
    quote: 'Que o seu novo ano seja tão especial e radiante quanto o seu coração.',
    authorNote: 'Com todo amor e respeito',
    category: 'geral',
    icon: 'gift',
    isOpened: false,
    createdAt: Date.now(),
  },
];

let initialCapsules = FALLBACK_CAPSULES;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const local = require('./initialCapsules.local');
  if (local && local.INITIAL_CAPSULES && Array.isArray(local.INITIAL_CAPSULES)) {
    initialCapsules = local.INITIAL_CAPSULES;
  }
} catch {
  // Arquivo local privado ausente no repositório público
}

export const INITIAL_CAPSULES: Capsule[] = initialCapsules;


export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'A Esperança que Renova as Forças',
    type: 'pregacao',
    scripture: 'Isaías 40:29-31',
    speaker: 'Mensagem de Domingo',
    content: 
      'Pontos marcantes da palavra:\n\n' +
      '1. Até os jovens se cansam e ficam exaustos, mas a nossa força não vem do nosso próprio braço, vem do Senhor.\n' +
      '2. "Esperar no Senhor" não é ficar parada sem fazer nada; é descansar o coração enquanto as mãos continuam trabalhando com fidelidade.\n' +
      '3. As asas da águia: voar acima das nuvens da tempestade em vez de se debater nelas.\n\n' +
      'Aplicação prática: Naqueles dias em que a faculdade ou o trabalho pesarem, lembrar de entregar o controle antes de ir dormir.',
    isFavorite: true,
    date: '2024-02-18',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: 'note-2',
    title: 'A Graça das Manhãs Silenciosas',
    type: 'devocional',
    scripture: 'Lamentações 3:22-24',
    speaker: 'Momento Pessoal',
    content: 
      'Hoje o dia começou lembrando que cada manhã é um recomeço em branco oferecido por Deus.\n\n' +
      'Não preciso carregar as falhas ou as frustrações de ontem para o dia de hoje. A misericórdia dele se renova agora cedo. ' +
      'Que a minha oração seja: "Ensina-me a viver este dia com leveza, gratidão e um coração atento a quem precisa de amor."',
    isFavorite: false,
    date: '2024-04-10',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'note-3',
    title: 'Ideias, Livros e Sonhos para Cultivar',
    type: 'geral',
    content: 
      'Lista de inspirações e planos para os próximos meses:\n\n' +
      '• Livros para ler: biografias inspiradoras, teologia prática e um bom romance clássico.\n' +
      '• Hobbies para experimentar: cerâmica ou uma aula de culinária com amigos.\n' +
      '• Lugares para visitar: aquele café tranquilo com jardim no centro.\n' +
      '• Lembrete: celebrar as pequenas vitórias do dia a dia, mesmo aquelas que ninguém mais viu!',
    isFavorite: true,
    date: '2024-05-01',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];
