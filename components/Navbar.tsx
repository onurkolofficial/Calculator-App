
import React from 'react';
import Logo from './Logo';
import { translations, Language } from '../translations';

interface NavbarProps {
  onMenuClick: () => void;
  theme: 'dark' | 'light';
  language: Language;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, theme, language }) => {
  const t = translations[language];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center px-4 justify-between transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2.5 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl text-slate-700 dark:text-white active:scale-95 transition-all"
          aria-label={t.openMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/5">
        <Logo size="sm" />
        <span className="font-bold text-xs tracking-widest text-slate-800 dark:text-white uppercase opacity-80">{t.appName}</span>
      </div>
    </nav>
  );
};

export default Navbar;
