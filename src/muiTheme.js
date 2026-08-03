import { alpha, createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#ad8337', dark: '#7d5d22', light: '#d3ad5f', contrastText: '#fff' },
    secondary: { main: '#247a57' },
    background: { default: '#f7f7f9', paper: '#fff' },
    text: { primary: '#1a1e26', secondary: '#5b6470' },
    divider: '#e5e7eb',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#f7f7f9' } } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 40 } } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid #e5e7eb', boxShadow: '0 2px 10px rgba(16,24,40,.05)' } } },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiTableHead: { styleOverrides: { root: { backgroundColor: '#f8f5ee' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, color: '#394452' } } },
    MuiOutlinedInput: { styleOverrides: { root: ({ theme }) => ({ backgroundColor: '#fff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 2 }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.primary.main, .7) } }) } },
  },
})

export default muiTheme
