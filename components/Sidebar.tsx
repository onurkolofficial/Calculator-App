
import React from 'react';
import Logo from './Logo';
import { translations, Language } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  theme: 'dark' | 'light';
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, theme, language }) => {
  const t = translations[language];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-[#09090b] z-[60] shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-widest uppercase">{t.menu}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 px-4 space-y-2 overflow-y-auto">
            <button 
              onClick={() => onNavigate('history')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t.history}</span>
              </div>
            </button>
          </div>

          {/* Bottom section for Settings */}
          <div className="p-4 border-t border-slate-100 dark:border-white/5">
            <button 
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t.settings}</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
