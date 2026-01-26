export const lightTheme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#6200EE',
    secondary: '#03DAC6',
    border: '#E0E0E0',
    error: '#B00020',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    border: '#333333',
    error: '#CF6679',
  },
};

export type Theme = typeof lightTheme;
