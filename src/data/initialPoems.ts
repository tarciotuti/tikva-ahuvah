import { Poem } from '../types';

export const INITIAL_POEMS: Poem[] = [
  {
    id: 'poem-1',
    title: 'Recomeço',
    date: '2022-01-06',
    content: `Se na caminhada você tropeçou
Lembre-se, que deves recomeçar e continuar
Pois na vida há vários embates que nos fazem cair
Mas devemos sempre nos lembrar
Que se tropeçamos é necessário voltar a nos levantar.

Pois um tropeço não é o fim de tudo,
E sim a oportunidade de recomeçar
Com mais força, sabedoria e fé.`,
    authorNote: 'Escrito por ela em um dia de renovo e perseverança na caminhada cristã.',
    tags: ['Superação', 'Fé', 'Recomeço'],
    isOriginal: true,
    createdAt: new Date('2022-01-06').getTime(),
  },
  {
    id: 'poem-2',
    title: 'A Cada Amanhecer',
    date: '2022-02-03',
    content: `A cada amanhecer 
Tu despertas o meu entender
Como então não agradecer
A tamanha graça e amor

Como então não agradecer
Pela libertação e salvação

Desde o princípio da linha até o fim
Tu tiveste comigo,
Guardando a minha alma e guiando os meus passos.`,
    authorNote: 'Oração matinal em versos agradecendo a fidelidade e a salvação do Senhor.',
    tags: ['Gratidão', 'Graça', 'Salvação'],
    isOriginal: true,
    createdAt: new Date('2022-02-03').getTime(),
  },
  {
    id: 'poem-3',
    title: 'Hoje Decidi Exaltar',
    date: '2022-07-09',
    content: `Hoje decidi exaltar
Exaltar Aquele que por amor deu Seu Filho amado,
Manifestou Sua benignidade e concedeu-me Sua salvação.

Hoje decidi exaltar
Exaltar e bendizer
Ao Todo-Poderoso,
Que com misericórdia eterna sustenta o meu viver.`,
    authorNote: 'Salmo autoral de louvor e adoração à benignidade de Deus.',
    tags: ['Adoração', 'Louvor', 'Benignidade'],
    isOriginal: true,
    createdAt: new Date('2022-07-09').getTime(),
  },
];
