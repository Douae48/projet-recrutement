// 🎨 Système de Design Premium - JobMatch Morocco

export const COLORS = {
  // Thème Candidat (Bleu moderne)
  candidate: {
    primary: '#007AFF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0055B3',
    gradient: ['#007AFF', '#00C6FF'],
    background: '#F0F7FF',
  },
  
  // Thème Recruteur (Vert professionnel)
  recruiter: {
    primary: '#34C759',
    primaryLight: '#6EE090',
    primaryDark: '#248A3D',
    gradient: ['#34C759', '#30D158'],
    background: '#F0FFF4',
  },
  
  // Couleurs neutres
  neutral: {
    white: '#FFFFFF',
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    placeholder: '#CBD5E1',
    disabled: '#E2E8F0',
  },
  
  // États et feedback
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Match scores
  match: {
    excellent: '#22C55E',  // 80-100%
    good: '#84CC16',       // 60-79%
    medium: '#F59E0B',     // 40-59%
    low: '#EF4444',        // 0-39%
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
  },
};

// Helper pour obtenir les couleurs selon le rôle
export const getThemeColors = (role) => {
  return role === 'Recruiter' ? COLORS.recruiter : COLORS.candidate;
};

// Helper pour obtenir la couleur du match score
export const getMatchColor = (score) => {
  if (score >= 80) return COLORS.match.excellent;
  if (score >= 60) return COLORS.match.good;
  if (score >= 40) return COLORS.match.medium;
  return COLORS.match.low;
};
