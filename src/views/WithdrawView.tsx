import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewProps } from '../types';
import { NeonButton } from '../components';
import { ASSET_BALANCE } from '../constants/mockData';

const WithdrawView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [amount, setAmount] = useState('');
  
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('my-wallet')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.wallet.withdrawTitle}</h2>
          <p className="text-xs text-slate-400">{t.wallet.withdrawDesc}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold">{t.wallet.inputAmount}</label>
            <input 
              type="number" 
              placeholder={t.wallet.inputAmount} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 text-white text-lg font-mono" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
            <p className="text-xs text-slate-500 px-1">
              {t.dashboard.avail}：<span className="text-blue-400 font-mono">{ASSET_BALANCE.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {[10000, 50000, ASSET_BALANCE].map((val, idx) => (
              <button 
                key={idx} 
                onClick={() => setAmount(String(val))} 
                className="flex-1 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 text-xs font-bold hover:border-blue-500"
              >
                {idx === 2 ? 'All' : val}
              </button>
            ))}
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-300 mb-2">說明：</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t.wallet.minWithdraw}</li>
              <li>{t.wallet.withdrawRate}</li>
              <li>{t.wallet.withdrawTime}</li>
              <li>{t.wallet.withdrawFee}</li>
            </ul>
          </div>
          <div className="pt-4">
            <NeonButton 
              variant="blue" 
              fullWidth 
              onClick={() => { 
                alert(t.common.success); 
                navigate('my-wallet'); 
              }}
            >
              {t.wallet.confirmWithdraw}
            </NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawView;

