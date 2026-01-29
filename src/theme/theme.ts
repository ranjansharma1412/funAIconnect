export const lightTheme = {
  mode: 'light',
  colors: {
    background: '#F5F5F7',
    text: '#111111',
    textSecondary: '#8E8E93',
    card: '#FFFFFF',
    primary: '#6200EE',
    secondary: '#03DAC6',
    border: '#E0E0E0',
    error: '#B00020',
    accentRed: '#FF3B30',
    accentBlue: '#007AFF',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    card: '#1E1E1E',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    border: '#333333',
    error: '#CF6679',
    accentRed: '#FF3B30',
    accentBlue: '#0A84FF',
  },
};

export type Theme = typeof lightTheme;
