
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Rocket, X, Download } from 'lucide-react';

/**
 * PWAInstaller Component
 * Manages the "beforeinstallprompt" lifecycle with strict readiness checks.
 * This component is visually hidden until the Service Worker is confirmed active 
 * and the browser has emitted the installable signal.
 */
const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [swReady, setSwReady] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);

  useEffect(() => {
    // 1. Detect if already running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    };
    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // 2. Capture the PWA installation event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('[Architect] PWA Installation protocol captured.');
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Monitor Service Worker activation lifecycle
    if ('serviceWorker' in navigator) {
      // Check for an existing active registration
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) setSwReady(true);
      });

      // Register or update the worker
      navigator.serviceWorker.register('sw.js').then(registration => {
        const sw = registration.installing || registration.waiting || registration.active;
        if (sw) {
          if (sw.state === 'activated') {
            setSwReady(true);
          } else {
            sw.addEventListener('statechange', (e: any) => {
              if (e.target.state === 'activated') setSwReady(true);
            });
          }
        }
      }).catch(err => {
        console.warn('[Architect] SW Layer Error:', err.message);
      });
    }

    // 4. Handle successful installation cleanup
    const handleAppInstalled = () => {
      console.log('[Architect] Application promoted to native environment.');
      setDeferredPrompt(null);
      setIsStandalone(true);
      setIsVisible(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Display logic: Requires SW activation + Captured Event + Not already native + Not dismissed
  useEffect(() => {
    const isOnline = navigator.onLine;
    const isReadyForPrompt = swReady && deferredPrompt && !isStandalone && isOnline && !userDismissed;

    let timer: number;
    if (isReadyForPrompt) {
      // Intentional delay to avoid jarring the user immediately upon load
      timer = window.setTimeout(() => setIsVisible(true), 3500);
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timer);
  }, [swReady, deferredPrompt, isStandalone, userDismissed]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[Architect] User choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  }, [deferredPrompt]);

  const dismiss = () => {
    setIsVisible(false);
    setUserDismissed(true);
  };

  // Strictly follow requirement: Only render when swReady and deferredPrompt are present
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] w-[calc(100%-2.5rem)] max-w-lg animate-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="bg-[#0f111a] border border-indigo-500/20 rounded-[3rem] p-7 shadow-2xl flex flex-col sm:flex-row items-center gap-7 relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
          <Rocket size={32} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 text-center sm:text-left relative z-10">
          <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em] mb-1.5">Go Native</h4>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-70">
            Elevate AutoArchitect to your workspace for high-fidelity offline logic exploration.
          </p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={dismiss} 
            className="p-3 text-gray-500 hover:text-white transition-colors"
            aria-label="Ignore installation prompt"
          >
            <X size={20} />
          </button>
          <button 
            onClick={handleInstall} 
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 whitespace-nowrap flex items-center gap-2"
          >
            <Download size={16} strokeWidth={3} /> Install Suite
          </button>
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
      <PWAInstaller />
    </React.StrictMode>
  );
}
