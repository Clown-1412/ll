const palette = {
  primary: '#d9534f',
  white: '#ffffff',
  black: '#000000',
  gray_100: '#f8f9fa',
  gray_200: '#e9ecef',
  gray_300: '#dee2e6',
  gray_400: '#ced4da',
  gray_500: '#adb5bd',
  gray_600: '#6c757d',
  gray_700: '#495057',
  gray_800: '#343a40',
  gray_900: '#212529',
};

export const lightTheme = {
  colors: {
    background: palette.gray_100,
    card: palette.white,
    text: palette.gray_900,
    textSecondary: palette.gray_600,
    primary: palette.primary,
    border: palette.gray_300,
    notification: palette.primary,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.gray_900,
    card: palette.gray_800,
    text: palette.white,
    textSecondary: palette.gray_400,
    border: palette.gray_700,
  },
};
