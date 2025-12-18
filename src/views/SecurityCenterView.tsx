import React from 'react';
import { ArrowLeft, ChevronRight, Lock, Shield } from 'lucide-react';
import { ViewProps } from '../types';

const SecurityCenterView: React.FC<ViewProps> = ({ navigate, t }) => {
  interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }

  const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer">
      <div className="flex items-center">
        <div className="p-2 bg-slate-800 rounded-lg mr-3 text-emerald-500">
          <Icon size={20} />
        </div>
        <div className="text-white text-sm font-bold">{label}</div>
      </div>
      <ChevronRight size={16} className="text-slate-600" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('profile')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.security.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 border border-slate-800">
          <MenuItem icon={Lock} label={t.security.changePass} onClick={() => navigate('change-password')} />
          <MenuItem icon={Shield} label={t.security.changePin} onClick={() => navigate('change-pin')} />
        </div>
      </div>
    </div>
  );
};

export default SecurityCenterView;

