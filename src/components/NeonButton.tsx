import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'blue' | 'outline' | 'disabled';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  fullWidth = false, 
  className = '' 
}) => {
  const baseStyle = "font-bold py-3 px-6 rounded relative transition-all duration-200 flex items-center justify-center uppercase tracking-wider";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400",
    blue: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-400",
    disabled: "bg-slate-700 text-slate-500 border border-slate-600 cursor-not-allowed shadow-none"
  };
  
  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      className={`${baseStyle} ${variants[disabled ? 'disabled' : variant]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NeonButton;

