
import React, { useState } from 'react';
import { CalculationHistory } from '../types';
import { translations, Language, ButtonColor } from '../translations';

interface HistoryProps {
  history: CalculationHistory[];
  onClear: () => void;
  onSelect: (item: CalculationHistory) => void;
  theme: 'dark' | 'light';
  language: Language;
  buttonColor?: ButtonColor;
}

const History: React.FC<HistoryProps> = ({ 
  history, 
  onClear, 
  onSelect, 
  theme, 
  language,
  buttonColor = 'default' 
}) => {
  const t = translations[language];
  const [isConfirming, setIsConfirming] = useState(false);

  const getAccentStyles = () => {
    switch (buttonColor) {
      case 'violet': 
        return { border: 'border-violet-500/60', text: 'text-violet-500', bg: 'hover:bg-violet-500/10', dot: 'bg-violet-500/40' };
      case 'emerald': 
        return { border: 'border-emerald-500/60', text: 'text-emerald-500', bg: 'hover:bg-emerald-500/10', dot: 'bg-emerald-500/40' };
      case 'rose': 
        return { border: 'border-rose-500/60', text: 'text-rose-500', bg: 'hover:bg-rose-500/10', dot: 'bg-rose-500/40' };
      case 'amber': 
        return { border: 'border-amber-500/60', text: 'text-amber-500', bg: 'hover:bg-amber-500/10', dot: 'bg-amber-500/40' };
      case 'slate': 
        return { border: 'border-slate-500/60', text: 'text-slate-500 dark:text-slate-400', bg: 'hover:bg-slate-500/10', dot: 'bg-slate-500/40' };
      default: 
        return { border: 'border-violet-500/60', text: 'text-violet-500', bg: 'hover:bg-violet-500/10', dot: 'bg-violet-500/40' };
    }
  };

  const accents = getAccentStyles();

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-400 mb-2">{t.noRecords}</h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest max-w-[180px] leading-relaxed">
          {t.noRecordsDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
      <div className="flex justify-between items-center mb-6 h-10 relative z-20">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t.historyTitle}</h3>
        
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsConfirming(!isConfirming);
            }}
            className={`
              relative z-10 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border cursor-pointer
              ${isConfirming 
                ? 'bg-rose-500 text-white border-rose-600' 
                : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20'}
            `}
          >
            {t.clearAll}
          </button>

          {/* Popup Confirmation Box */}
          {isConfirming && (
            <>
              {/* Invisible Backdrop to close on click outside */}
              <div 
                className="fixed inset-0 z-0 cursor-default" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirming(false);
                }}
              />
              
              {/* The Popup */}
              <div className="absolute right-0 top-full mt-3 w-56 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">
                        {t.confirmDeleteTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {t.confirmDeleteDesc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirming(false);
                      }}
                      className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                        setIsConfirming(false);
                      }}
                      className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-colors"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
                
                {/* Arrow pointing up */}
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-slate-700 rotate-45"></div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className={`
              group border-l-4 ${accents.border} pl-4 py-3.5 pr-4 transition-all duration-300 cursor-pointer 
              bg-black/[0.03] dark:bg-white/[0.02] ${accents.bg} rounded-r-3xl rounded-l-md
              border border-black/5 dark:border-white/5
              hover:shadow-md active:scale-[0.98]
            `}
          >
            <div className="flex flex-col">
              <span className={`text-[10px] font-mono mb-1 tracking-tight transition-colors uppercase opacity-70 ${accents.text}`}>
                {item.expression} =
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold font-mono text-2xl tracking-tighter group-hover:translate-x-0.5 transition-transform">
                {item.result}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-all">
              <div className="flex items-center gap-1.5">
                <span className={`h-1 w-1 rounded-full ${accents.dot}`}></span>
                <span className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-600 font-mono">
                {new Date(item.timestamp).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
