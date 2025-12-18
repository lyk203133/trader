import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewProps } from '../types';
import { NeonButton } from '../components';

const TradeSellView: React.FC<ViewProps> = ({ navigate, t }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg">
        <button onClick={() => navigate('dashboard')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-rose-400 font-bold text-lg">{t.trade.sellTitle}</h2>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="text-center w-full max-w-xs">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">{t.trade.waitingMerchant}</h3>
          <p className="text-slate-400 text-sm mb-6">{t.trade.lockSuccess}</p>
          <NeonButton fullWidth onClick={() => navigate('dashboard')}>
            {t.trade.backHome}
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default TradeSellView;

