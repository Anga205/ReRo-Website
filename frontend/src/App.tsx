import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SlotBooking from './pages/SlotBooking';
import Arduino from './pages/Arduino';
import GettingStarted from './pages/blog/GettingStarted';
import ArduinoBasics from './pages/blog/ArduinoBasics';
import SafetyGuidelines from './pages/blog/SafetyGuidelines';
import ProjectGallery from './pages/blog/ProjectGallery';
import IoTRemoteControl from './pages/blog/IoTRemoteControl';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Light blue for dark mode
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#34d399', // Light green for dark mode
      light: '#6ee7b7',
      dark: '#10b981',
    },
    background: {
      default: '#030712', // bg-gray-950 equivalent
      paper: '#111827', // bg-gray-900 for cards
    },
    text: {
      primary: '#f1f5f9', // Light text
      secondary: '#cbd5e1', // Muted light text
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          borderRadius: 12,
          border: '1px solid #374151',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<SlotBooking />} />
            <Route path="/arduino" element={<Arduino />} />
            <Route path="/blog/getting-started" element={<GettingStarted />} />
            <Route path="/blog/arduino-basics" element={<ArduinoBasics />} />
            <Route path="/blog/safety-guidelines" element={<SafetyGuidelines />} />
            <Route path="/blog/project-gallery" element={<ProjectGallery />} />
            <Route path="/blog/iot-remote-control" element={<IoTRemoteControl />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
