import { red, amber, grey } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import {
  MetropolisRegular,
  MetropolisBold,
  RobotoRegular,
  RobotoMedium,
  RobotoBold,
} from './fonts';

const fontFamilyRoboto = {
  fontFamily: [
    'Roboto',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
};

const fontFamilyMetropolis = {
  fontFamily: [
    'Metropolis',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  letterSpacing: '0.015rem',
};

// A custom theme for this app
const lightMuiTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#18191a',
    },
    secondary: {
      main: amber[400],
      light: amber[100],
      // light: '#feefc3',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f7f8fa',
      // highlight: '#F1F3F4',
    },
  },
  typography: {
    ...fontFamilyRoboto,
    overline: {
      fontWeight: 500,
      fontSize: '0.7rem',
    },
  },
  // shape: {
  //   borderRadius: '0.5rem',
  // },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
  // mixins: {
  //   drawer: {
  //     minWidth: 280,
  //   },
  // },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          MetropolisRegular,
          MetropolisBold,
          RobotoRegular,
          RobotoMedium,
          RobotoBold,
        ],
        '::selection': {
          background: amber[100],
        },
        // @ts-ignore
        '.MuiPopover-root': {
          zIndex: '1700 !important',
        },
      },
    },
    MuiListItemText: {
      primary: {
        ...fontFamilyMetropolis,
        fontWeight: 500,
        fontSize: '0.87rem',
      },
    },
  },
  custom: {
    fontFamily: {
      roboto: fontFamilyRoboto,
      metropolis: fontFamilyMetropolis,
    },
    palette: {
      color: {
        icon: '#5f6368',
        iconHighlight: grey[900],
        check: '#0007',
      },
      tag: {
        default: '#FFF',
        red: '#F28B82',
        orange: '#FBBC04',
        yellow: '#FFF475',
        green: '#CCFF90',
        cyan: '#A7FFEB',
        lightblue: '#CBF0F8',
        darkblue: '#AECBFA',
        purple: '#D7AEFB',
        pink: '#FDCFE8',
        brown: '#E6C9A8',
        grey: '#E8EAED',
      },
      background: {
        light: '#FAFAFA',
        highlight: '#F1F3F4',
        grey: '#f6f8fa',
        appbar: 'rgba(30,55,90,.97)',
      },
      border: {
        light: grey[300],
      },
    },
  },
});

const light = responsiveFontSizes(lightMuiTheme);

export default light;
