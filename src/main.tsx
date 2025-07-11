import { initToolbar } from '@stagewise/toolbar';
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const stagewiseConfig = {
  plugins: [],
};

if (import.meta.env.DEV) {
  initToolbar(stagewiseConfig);
}

createRoot(document.getElementById('root')!).render(
    <App />
)
