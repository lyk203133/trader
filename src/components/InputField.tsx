import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputFieldProps {
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  subLabel?: string;
  isSecure?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  label, 
  subLabel, 
  isSecure = false 
}) => {
  const [showContent, setShowContent] = useState(!isSecure);
  
  // Determine final input type
  const finalType = isSecure ? (showContent ? "text" : "password") : type;

  return (
    <div className="mb-4">
      {label && <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-emerald-500" />
        </div>
        <input 
          type={finalType} 
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-10 p-3 placeholder-slate-500 transition-colors" 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
        />
        {isSecure && (
          <button 
            type="button"
            onClick={() => setShowContent(!showContent)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-emerald-400 transition-colors"
          >
            {showContent ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {subLabel && <p className="mt-1 text-xs text-slate-500">{subLabel}</p>}
    </div>
  );
};

export default InputField;

