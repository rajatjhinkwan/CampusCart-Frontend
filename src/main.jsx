import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

// Remove any legacy PWA service workers so old install prompts cannot persist
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (/workbox|pwa|precache/i.test(key)) {
          caches.delete(key);
        }
      });
    });
  }
}

// Auto-reload the page when a dynamic import (chunk load) fails
window.addEventListener('vite:preloadError', (event) => {
  const lastReload = sessionStorage.getItem('last-preload-error-reload');
  const now = Date.now();
  // Only reload if we haven't reloaded due to a preload error in the last 10 seconds to avoid infinite loops
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem('last-preload-error-reload', now.toString());
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
      <Toaster />
    </GoogleOAuthProvider>
  </StrictMode>,
)
