export interface YouAreItem {
  id: string;
  keyword: string;
  hebrew?: string;
  hebrewTranslit?: string;
  badge: 'HEBRAICO' | 'PROPÓSITO' | 'CUIDADO' | 'AFETO' | 'ADMIRAÇÃO' | 'FÉ';
  source: 'mensagem' | 'coracao';
  declaration: string;
  text: string;
  icon: string;
  color: string;
  bg: string;
  verse?: string;
}

// Declarações locais privadas (mantidas fora do repositório público via .gitignore)
let loadedItems: YouAreItem[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const localModule = require('./youAreData.local');
  if (localModule && Array.isArray(localModule.PERSONAL_YOU_ARE_ITEMS)) {
    loadedItems = localModule.PERSONAL_YOU_ARE_ITEMS;
  }
} catch {
  loadedItems = [];
}

// Fallback público genérico caso o repositório seja clonado sem o arquivo local
export const YOU_ARE_ITEMS: YouAreItem[] = loadedItems.length > 0 ? loadedItems : [
  {
    id: 'devocional_padrao',
    keyword: 'Graça & Paz',
    badge: 'FÉ',
    source: 'coracao',
    declaration: 'Que a graça e a paz do Senhor renovem as suas forças a cada dia.',
    text: 'Abençoado seja cada instante do seu caminhar e crescimento espiritual.',
    icon: 'sparkles',
    color: '#C28E34',
    bg: '#FBF5E8',
    verse: 'Números 6:24-26',
  },
];
