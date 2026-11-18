import { Memory, Capsule } from '../types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'O Primeiro Capítulo deste Diário',
    description: 
      'Este aplicativo foi criado especialmente para você, com muito carinho. ' +
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

export const INITIAL_CAPSULES: Capsule[] = [
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
      'impossível e que você venceu com a sua coragem e honestidade.\n\n' +
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
      'Você se preparou, você merece estar aí e nada que for seu deixará de encontrar o seu caminho.\n\n' +
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
      'Desejo que este novo ciclo venha repleto de saúde, gargalhadas sinceras, conquistas merecidas e momentos leves.\n\n' +
      'Celebre com intensidade, coma o que tiver vontade e celebre a pessoa incrível que você é. Parabéns hoje e sempre!',
    quote: 'Que o seu novo ano seja tão especial e radiante quanto o seu coração.',
    authorNote: 'Com todo amor e respeito',
    category: 'geral',
    icon: 'gift',
    isOpened: false,
    createdAt: Date.now(),
  },
];
