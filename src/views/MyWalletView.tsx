import React from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ViewProps } from '../types';
import { ASSET_BALANCE, FROZEN_BALANCE, TOTAL_ASSETS, WALLET_STATS } from '../constants/mockData';

const MyWalletView: React.FC<ViewProps> = ({ navigate, t }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('dashboard')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.wallet.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-xs font-bold mb-1">{t.dashboard.avail}</p>
            <h3 className="text-2xl font-mono font-bold text-blue-400 mb-2">{ASSET_BALANCE.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-xs font-bold mb-1">{t.dashboard.frozen}</p>
            <h3 className="text-2xl font-mono font-bold text-white mb-2">{FROZEN_BALANCE.toLocaleString()}</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-xs font-bold mb-1">{t.dashboard.assets}</p>
            <h3 className="text-2xl font-mono font-bold text-white mb-2">{TOTAL_ASSETS.toLocaleString()}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400">{t.wallet.totalDeposit}</span><br/>
            <span className="text-lg font-mono font-bold text-emerald-400">+{WALLET_STATS.totalDeposit.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400">{t.wallet.totalWithdraw}</span><br/>
            <span className="text-lg font-mono font-bold text-rose-400">{WALLET_STATS.totalWithdraw}</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 col-span-2 flex justify-between items-center">
            <span className="text-xs text-slate-400">{t.wallet.totalFees}</span>
            <span className="text-lg font-mono font-bold text-white">{WALLET_STATS.totalFees}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('withdraw')} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <ArrowUpRight size={20} /> {t.wallet.withdraw}
          </button>
          <button 
            onClick={() => navigate('points-mall')} 
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ArrowDownLeft size={20} className="text-emerald-400" /> {t.wallet.deposit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWalletView;

