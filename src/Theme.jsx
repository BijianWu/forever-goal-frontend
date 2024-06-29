import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 800,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: ['Plus Jakarta Sans', 'sans-serif'].join(','),
    body1: {

      lineHeight: "28px"
    },
    body2: {

      lineHeight: "28px"
    },
    // button: {
    //   fontFamily: ['Plus Jakarta Sans', 'sans-serif'].join(','),

    // },
  }
});