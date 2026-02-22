export const lightTheme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    text: '#111111',
    textSecondary: '#666666',
    card: '#F5F5F5',
    primary: '#FF8A65', // Coral/Orange
    primaryGradient: ['#FF8A65', '#FF7043'], // Coral to Deep Orange
    secondaryGradient: ['#007AFF', '#0056D2'], // Blue Gradient
    secondary: '#FFAB91',
    border: '#E0E0E0',
    error: '#B00020',
    accentRed: '#FF8A65',
    accentBlue: '#007AFF',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
    overlayDark: 'rgba(0,0,0,0.8)',
    overlayLight: 'rgba(0,0,0,0.2)',
    overlayLighter: 'rgba(0,0,0,0.1)',
    glassBackground: 'rgba(255,255,255,0.15)',
    glassBorder: 'rgba(255,255,255,0.2)',
    glassOverlay: 'rgba(255,255,255,0.1)',
    textOnImage: '#FFFFFF',
    textOnImageSecondary: 'rgba(255, 255, 255, 0.9)',
    textShadow: 'rgba(0, 0, 0, 0.3)',
    buttonTextPrimary: '#FFFFFF',
    disabled: '#E1E1E1',
    divider: '#EEEEEE',
    skeletonBackground: '#DDDDDD',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    extraBold: 'System',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#000000', // Pure Black
    text: '#FFFFFF',
    textSecondary: '#A0A0A0', // Light Gray
    card: '#1C1C1C', // Dark Charcoal
    primary: '#FF8A65', // Coral/Orange
    primaryGradient: ['#FF8A65', '#F4511E'], // Coral to Darker Orange
    secondaryGradient: ['#0A84FF', '#007AFF'], // Blue Gradient
    secondary: '#333333', // Dark Gray for secondary elements
    border: '#333333',
    error: '#CF6679',
    accentRed: '#FF8A65',
    accentBlue: '#0A84FF',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
    overlayDark: 'rgba(0,0,0,0.8)',
    overlayLight: 'rgba(0,0,0,0.2)',
    overlayLighter: 'rgba(0,0,0,0.1)',
    glassBackground: 'rgba(255,255,255,0.15)',
    glassBorder: 'rgba(255,255,255,0.2)',
    glassOverlay: 'rgba(255,255,255,0.1)',
    textOnImage: '#FFFFFF',
    textOnImageSecondary: 'rgba(255, 255, 255, 0.9)',
    textShadow: 'rgba(0, 0, 0, 0.3)',
    buttonTextPrimary: '#FFFFFF',
    disabled: '#333333',
    divider: '#333333',
    skeletonBackground: '#2A2A2A',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    extraBold: 'System',
  },
};

export type Theme = typeof lightTheme;
