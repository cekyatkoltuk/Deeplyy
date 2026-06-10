export const Colors = {
  primary: '#EB3223', // Chili Red
  primaryGradientStart: '#EB3223',
  primaryGradientEnd: '#EF615A', 
  accent: '#B968CC',
  accentGradientStart: '#B968CC',
  accentGradientEnd: '#0E1D3D',
  like: '#EF615A', 
  pass: '#EB3223',
  superLike: '#B968CC',
  gold: '#FBBF24',

  // Backgrounds
  background: '#0E1D3D', // Dark Navy
  surface: '#0E1D3D', // Dark Navy
  surfaceLight: '#B968CC',
  card: '#0E1D3D',
  cardHover: '#0E1D3D',

  // Text
  textPrimary: '#FFFFFF', // White
  textSecondary: '#FFFFFF',
  textMuted: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Borders & misc
  border: '#0E1D3D',
  divider: '#0E1D3D',
  overlay: 'rgba(14,29,61,0.8)',
  premiumGold: '#FFD700',
  premiumGradientStart: '#FFD700',
  premiumGradientEnd: '#FFA500',

  // Status
  online: '#35FD5A', // User Online
  offline: '#EB5F23', // User Away
  error: '#EB3223',
  success: '#35FD5A',
  warning: '#EB5F23',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  body: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  hero: 48,
};

export const FontFamily = {
  small: 'MuseoModerno_300Light_Italic',
  body: 'Karla_700Bold_Italic',
  heading: 'Archivo_700Bold',
  
  // Aliases for compatibility
  regular: 'MuseoModerno_300Light_Italic',
  medium: 'Karla_700Bold_Italic',
  semiBold: 'Karla_700Bold_Italic',
  bold: 'Archivo_700Bold',
};

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};
