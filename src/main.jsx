import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for PWA & Web Push Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('ServiceWorker registered successfully with scope:', reg.scope);
      // Force update check on every page load to guarantee fresh assets on mobile
      reg.update();
    }).catch(err => {
      console.warn('ServiceWorker registration failed:', err);
    });
  });
}

// SiTemu App Entry Point for Vercel
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
