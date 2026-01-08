
import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import Calculator from './components/Calculator';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import History from './components/History';
import Settings from './components/Settings';
import { CalculationHistory } from './types';
import { translations, Language, ButtonColor } from './translations';

type ViewState = 'calculator' | 'history' | 'settings';
type ThemeMode = 'dark' | 'light';

const STORAGE_KEYS = {
  HISTORY: 'mathpro_history_v2',
  THEME: 'mathpro_theme',
  LANG: 'mathpro_lang',
  BTN_COLOR: 'mathpro_btn_color'
};

const App: React.FC = () => {
  const [history, setHistory] = useState<CalculationHistory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Theme initialization with System Preference Detection
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 1. Check Local Storage first
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (saved) return saved;

    // 2. If no save found, check System Preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Fallback
    return 'light';
  });

  // Language initialization with System Language Detection
  const [language, setLanguage] = useState<Language>(() => {
    // 1. Check Local Storage first
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
    if (savedLang) return savedLang;

    // 2. Check System Language
    // navigator.language returns 'tr-TR', 'en-US', etc.
    return navigator.language.startsWith('tr') ? 'tr' : 'en';
  });

  const [btnColor, setBtnColor] = useState<ButtonColor>(() => {
    return (localStorage.getItem(STORAGE_KEYS.BTN_COLOR) as ButtonColor) || 'default';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<ViewState>('calculator');
  const [selectedCalc, setSelectedCalc] = useState<CalculationHistory | null>(null);

  // Refs to track state inside the event listener closure
  const isSidebarOpenRef = useRef(isSidebarOpen);
  const activeOverlayRef = useRef(activeOverlay);

  // Update refs when state changes
  useEffect(() => { isSidebarOpenRef.current = isSidebarOpen; }, [isSidebarOpen]);
  useEffect(() => { activeOverlayRef.current = activeOverlay; }, [activeOverlay]);

  const t = translations[language];

  // Hardware Back Button Handling for Android
  useEffect(() => {
    const setupBackButton = async () => {
      // Clean up any existing listeners first to avoid duplicates
      await CapacitorApp.removeAllListeners();
      
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (isSidebarOpenRef.current) {
          // If sidebar is open, close it
          setIsSidebarOpen(false);
        } else if (activeOverlayRef.current !== 'calculator') {
          // If an overlay (History/Settings) is open, go back to calculator
          setActiveOverlay('calculator');
          setSelectedCalc(null);
        } else {
          // If on main screen, exit app
          CapacitorApp.exitApp();
        }
      });
    };

    setupBackButton();
  }, []);

  // Gesture handling for sidebar
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const xDiff = touchEndX - touchStartX;
      const yDiff = Math.abs(touchEndY - touchStartY);

      // Logic:
      // 1. Start within the left 40px (Edge swipe)
      // 2. Swipe right at least 50px
      // 3. Horizontal movement is significantly larger than vertical movement (to avoid scrolling triggering it)
      if (touchStartX < 40 && xDiff > 50 && xDiff > yDiff * 2) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)); }, [history]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);
  
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LANG, language); }, [language]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BTN_COLOR, btnColor); }, [btnColor]);

  const handleNewCalculation = (calc: CalculationHistory) => {
    setHistory(prev => [calc, ...prev].slice(0, 50));
  };

  const handleSelectHistoryItem = (calc: CalculationHistory) => {
    setSelectedCalc(calc);
    setActiveOverlay('calculator');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const closeOverlay = () => setActiveOverlay('calculator');

  return (
    <div className={`${theme} min-h-screen transition-colors duration-300`}>
      <div className="min-h-screen bg-bg-light dark:bg-bg-deep text-slate-900 dark:text-slate-100 flex flex-col items-center overflow-hidden relative selection:bg-violet-500/30">
        
        {/* Subtle Ambient Light for Dark Mode */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none z-0 dark:block hidden"></div>
        
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} theme={theme} language={language} />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          theme={theme}
          language={language}
          onNavigate={(view) => {
            setActiveOverlay(view as ViewState);
            setIsSidebarOpen(false);
            if (view === 'calculator') setSelectedCalc(null);
          }}
        />

        <main className={`
          flex-1 w-full flex flex-col items-center justify-end sm:justify-center 
          transition-all duration-300 z-10 
          pb-8 pt-20 px-4
          ${activeOverlay !== 'calculator' ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
        `}>
          <div className="w-full flex justify-center">
            <Calculator 
              onCalculate={handleNewCalculation} 
              selectedCalculation={selectedCalc}
              theme={theme}
              language={language}
              buttonColor={btnColor}
            />
          </div>
        </main>

        {/* Full Screen Overlay for History & Settings */}
        {activeOverlay !== 'calculator' && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-bg-light dark:bg-bg-deep animate-in slide-in-from-bottom duration-300 pt-[env(safe-area-inset-top)]">
            
            {/* Header Area - Updated with Back Button */}
            <div className="px-6 py-6 pt-8 flex items-center gap-4 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-20 border-b border-black/5 dark:border-white/5">
              <button 
                onClick={closeOverlay}
                className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full active:scale-90 transition-transform hover:bg-black/10 dark:hover:bg-white/20 shrink-0"
                aria-label={t.close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                 {activeOverlay === 'history' ? t.history : t.settings}
              </h2>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar max-w-3xl mx-auto w-full pb-[env(safe-area-inset-bottom)]">
              {activeOverlay === 'history' ? (
                <History 
                  history={history} 
                  onClear={clearHistory} 
                  onSelect={handleSelectHistoryItem}
                  theme={theme}
                  language={language}
                  buttonColor={btnColor}
                />
              ) : (
                <Settings 
                  theme={theme} 
                  onToggleTheme={toggleTheme} 
                  language={language}
                  onSetLanguage={(l) => setLanguage(l)}
                  buttonColor={btnColor}
                  onSetButtonColor={setBtnColor}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
