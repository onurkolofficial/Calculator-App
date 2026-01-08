
import React, { useState, useRef, useEffect } from 'react';
import { translations, Language, ButtonColor } from '../translations';
import { version } from '../version';

interface SettingsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  buttonColor: ButtonColor;
  onSetButtonColor: (color: ButtonColor) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  theme, 
  onToggleTheme, 
  language, 
  onSetLanguage,
  buttonColor,
  onSetButtonColor
}) => {
  const t = translations[language];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  const colorOptions: { id: ButtonColor; class: string }[] = [
    { id: 'default', class: 'bg-white dark:bg-slate-800' },
    { id: 'violet', class: 'bg-violet-600' },
    { id: 'emerald', class: 'bg-emerald-600' },
    { id: 'rose', class: 'bg-rose-600' },
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'slate', class: 'bg-slate-900' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.appearance}</h3>
        <div className="grid gap-4">
          {/* Theme Toggle */}
          <div 
            onClick={onToggleTheme}
            className="flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 hover:border-violet-500/30 transition-all cursor-pointer group"
          >
            <div>
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t.darkMode}</span>
              <span className="text-[10px] text-slate-500">{t.darkModeDesc}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner ${theme === 'dark' ? 'bg-violet-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>

          {/* Number Button Color Picker */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5">
            <div className="mb-4">
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t.numBtnColor}</span>
              <span className="text-[10px] text-slate-500">{t.numBtnColorDesc}</span>
            </div>
            <div className="flex items-center gap-3">
              {colorOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSetButtonColor(opt.id)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all active:scale-90
                    ${opt.class}
                    ${buttonColor === opt.id ? 'border-violet-500 scale-125 shadow-lg' : 'border-black/10 dark:border-white/10 hover:border-violet-400'}
                  `}
                  title={opt.id}
                />
              ))}
            </div>
          </div>

          {/* Language Selector (Dropdown) */}
          <div className="relative" ref={langMenuRef}>
            <div 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-3xl border transition-all cursor-pointer group ${isLangOpen ? 'border-violet-500/50 ring-2 ring-violet-500/10' : 'border-black/5 dark:border-white/5 hover:border-violet-500/30'}`}
            >
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t.language}</span>
                <span className="text-[10px] text-slate-500">{t.selectLanguage}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-sm">{currentLang?.flag}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">{currentLang?.code}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isLangOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSetLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${language === lang.code ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg">{lang.flag}</span>
                        <div className="text-left">
                          <span className={`block text-sm font-bold ${language === lang.code ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{lang.label}</span>
                          <span className={`text-[10px] uppercase tracking-widest ${language === lang.code ? 'text-violet-100' : 'text-slate-500'}`}>{lang.code === 'tr' ? 'Türkçe' : 'English'}</span>
                        </div>
                      </div>
                      {language === lang.code && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.aboutApp}</h3>
        <div className="grid gap-4">
          {/* App Version */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5">
            <div>
              <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{t.appVersion}</span>
              <span className="text-[10px] text-slate-500 font-mono">v{version.APP_VERSION}.{version.APP_VERSION_CODE}</span>
            </div>
          </div>
        </div>

      </section>

      <section className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5 text-center">
        <p className="text-[10px] text-slate-500 dark:text-slate-700">{t.copyright}</p>
      </section>
    </div>
  );
};

export default Settings;
