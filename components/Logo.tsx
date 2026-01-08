
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 rounded-lg text-[8px]',
    md: 'w-10 h-10 rounded-xl text-[12px]',
    lg: 'w-16 h-16 rounded-2xl text-[18px]'
  };

  return (
    <div className={`
      relative bg-gradient-to-br from-slate-900 to-violet-950 
      border border-white/10 flex items-center justify-center 
      shadow-lg overflow-hidden shrink-0 ${sizeClasses[size]} ${className}
    `}>
      {/* Grid line pattern background inside logo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-black text-white leading-none text-center select-none">
        <span>+</span>
        <span className="rotate-12">/</span>
        <span className="mt-[-2px]">-</span>
        <span>X</span>
      </div>
    </div>
  );
};

export default Logo;
