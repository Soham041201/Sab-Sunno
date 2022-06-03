import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material';

const sunoColor = '#FF8413'

const baseThemeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  palette: {
    mode: 'light',
    primary: {
      main: sunoColor,
    },
  },
  typography: {
    h1: {
      fontSize: 60,
      fontWeight: 'bold',
      fontFamily: 'Raleway',
      color: "white",
    },
    h2: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Raleway',
        color: "white",
    },
    h3: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Raleway',
      color: "white",
  },
  body1:{
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    color: "white",
  }
  },
};

const theme = responsiveFontSizes(createTheme(baseThemeOptions));

export default theme