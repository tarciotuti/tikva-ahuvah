export const COLORS = {
  // Backgrounds acolhedores estilo linho e papel nobre
  background: '#F8F6F1',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0ECE4',
  
  // Verde Botânico / Esmeralda Sereno (Identidade Principal)
  primary: '#24523F',          // Verde esmeralda florestal profundo
  primaryDark: '#173B2C',
  primaryMedium: '#316B54',
  primaryLight: '#EBF4EF',      // Fundo suave sálvia
  primaryTint: '#C8DFD4',
  
  // Vermelho Rubi / Rosé Veludo (Toques de Afeto & Destaques)
  ruby: '#9E2A3B',             // Vermelho rubi sofisticado
  rubyDark: '#7A1C2B',
  rubyLight: '#FAF0F2',        // Fundo delicado rosé
  rubyTint: '#F2CDD4',
  
  // Dourado Esperança / Luz Espiritual
  gold: '#C28E34',             // Dourado clássico e acolhedor
  goldLight: '#FAF4E8',
  goldTint: '#EED9B2',

  // Tipografia e Neutros
  text: '#1C2621',             // Carvão botânico
  textSecondary: '#57665F',    // Verde pedra suave
  textMuted: '#8E9C95',        // Sálvia apagado
  border: '#E3DDD3',
  borderLight: '#ECE7DE',
  
  // Estados
  cardShadow: 'rgba(23, 59, 44, 0.07)',
  white: '#FFFFFF',
  danger: '#D9534F',
  heart: '#9E2A3B',
};

export const CATEGORIES: { label: string; icon: string }[] = [
  { label: 'Todas', icon: 'sparkles' },
  { label: 'Momentos Inesquecíveis', icon: 'star' },
  { label: 'Pequenas Alegrias', icon: 'heart' },
  { label: 'Família & Afeto', icon: 'people' },
  { label: 'Conquistas', icon: 'trophy' },
  { label: 'Viagens & Aventuras', icon: 'compass' },
];

export const NOTE_TYPES = [
  { id: 'todas', label: 'Todas', icon: 'layers-outline' },
  { id: 'pregacao', label: 'Pregações', icon: 'book-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  { id: 'devocional', label: 'Devocionais', icon: 'heart-outline', color: COLORS.ruby, bg: COLORS.rubyLight },
  { id: 'estudo', label: 'Estudos', icon: 'school-outline', color: COLORS.gold, bg: COLORS.goldLight },
  { id: 'geral', label: 'Anotações', icon: 'create-outline', color: COLORS.primaryMedium, bg: COLORS.surfaceSubtle },
] as const;
