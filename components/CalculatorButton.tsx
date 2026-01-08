
import React from 'react';
import { ButtonColor } from '../translations';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'special' | 'equal';
  className?: string;
  buttonColor?: ButtonColor;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  className = '',
  buttonColor = 'default'
}) => {
  
  const getStyles = () => {
    // Base styles for default layout
    const lightBase = "bg-white text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px]";
    const darkBase = "dark:bg-zinc-900 dark:text-white dark:active:bg-zinc-800";

    if (variant === 'number') {
      // If default, return standard white/dark-gray look
      if (buttonColor === 'default') {
        return `${lightBase} ${darkBase} font-normal text-2xl`;
      }

      // If a specific color is selected, change the BACKGROUND color
      // We need specific shadows for the 3D effect on colored buttons
      const colorStyles = {
        violet: "bg-violet-500 text-white shadow-[0_4px_0_0_#7c3aed] active:shadow-none active:translate-y-[4px] dark:bg-violet-600 dark:text-white dark:shadow-[0_4px_0_0_#6d28d9] dark:active:bg-violet-700",
        emerald: "bg-emerald-500 text-white shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-[4px] dark:bg-emerald-600 dark:text-white dark:shadow-[0_4px_0_0_#047857] dark:active:bg-emerald-700",
        rose: "bg-rose-500 text-white shadow-[0_4px_0_0_#e11d48] active:shadow-none active:translate-y-[4px] dark:bg-rose-600 dark:text-white dark:shadow-[0_4px_0_0_#be123c] dark:active:bg-rose-700",
        amber: "bg-amber-500 text-white shadow-[0_4px_0_0_#d97706] active:shadow-none active:translate-y-[4px] dark:bg-amber-600 dark:text-white dark:shadow-[0_4px_0_0_#b45309] dark:active:bg-amber-700",
        slate: "bg-slate-600 text-white shadow-[0_4px_0_0_#475569] active:shadow-none active:translate-y-[4px] dark:bg-slate-700 dark:text-white dark:shadow-[0_4px_0_0_#334155] dark:active:bg-slate-800",
      };

      // @ts-ignore
      const selectedStyle = colorStyles[buttonColor];

      if (selectedStyle) {
        return `${selectedStyle} font-normal text-2xl`;
      }

      return `${lightBase} ${darkBase} font-normal text-2xl`;
    }

    if (variant === 'action') {
      // AC, Delete, etc.
      return "bg-slate-200 text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] dark:bg-zinc-800 dark:text-rose-400 dark:active:bg-zinc-700 font-medium text-xl";
    }

    if (variant === 'operator') {
      // +, -, *, /
      return "bg-violet-100 text-violet-700 shadow-[0_4px_0_0_rgba(139,92,246,0.2)] active:shadow-none active:translate-y-[4px] dark:bg-zinc-900 dark:text-violet-400 dark:active:bg-zinc-800 font-medium text-2xl";
    }

    if (variant === 'equal') {
      // = Button (Prominent)
      return "bg-violet-600 text-white shadow-[0_4px_0_0_rgba(109,40,217,1)] active:shadow-none active:translate-y-[4px] dark:bg-violet-600 dark:text-white dark:active:bg-violet-700 font-semibold text-2xl";
    }

    if (variant === 'special') {
      // Scientific buttons
      return "bg-slate-100 text-slate-700 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[2px] dark:bg-black dark:text-slate-400 dark:border dark:border-zinc-800 dark:active:bg-zinc-900 text-lg";
    }

    return `${lightBase} ${darkBase}`;
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative 
        h-16 md:h-20
        w-full
        flex items-center justify-center 
        rounded-[1.25rem] md:rounded-[1.5rem]
        transition-all duration-100 ease-out
        select-none touch-manipulation
        ${getStyles()} 
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
