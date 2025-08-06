// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/400.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
