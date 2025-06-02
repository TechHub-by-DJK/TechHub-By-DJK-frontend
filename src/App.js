import { ThemeProvider } from '@emotion/react';
import './App.css';
import Navbar from './component/Navbar/Navbar';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar/>
      </ThemeProvider>
    </div>
  );
}

export default App;