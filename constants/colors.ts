export const Colors = {
  // Couleurs principales
  primary: '#FF6B00',
  primaryLight: '#FF8800',
  primaryLighter: '#FFA200',

  // Couleurs de fond
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',

  // Couleurs de texte
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#FFFFFF',

  // Couleurs d'état
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Couleurs d'accentuation
  accent1: 'rgba(255, 107, 0, 0.1)',
  accent2: 'rgba(255, 136, 0, 0.1)',
  accent3: 'rgba(255, 162, 0, 0.1)',

  // Couleurs de bordure
  border: 'rgba(255, 107, 0, 0.1)',
  borderDark: 'rgba(255, 107, 0, 0.2)',

  // Couleurs de gradient
  gradient: {
    primary: ['#FF6B00', '#FF8800', '#FFA200'],
    secondary: ['#FF8800', '#FFA200'],
    dark: ['#333333', '#666666'],
  },

  // Couleurs d'ombre
  shadow: '#FF6B00',
  shadowLight: 'rgba(255, 107, 0, 0.2)',
} as const;

// Types pour TypeScript
export type ColorTheme = typeof Colors;
export type ColorName = keyof typeof Colors;
