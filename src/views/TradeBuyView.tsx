import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Wallet } from 'lucide-react';
import { ViewProps } from '../types';
import { Card, NeonButton } from '../components';

const TradeBuyView: React.FC<ViewProps> = ({ navigate, data, t }) => {
  const [timeLeft, setTimeLeft] = useState(180); 
  
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('dashboard')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-white font-bold text-lg">{t.trade.buyTitle}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
          <div className="flex items-center text-rose-400">
            <Clock size={18} className="mr-2" />
            <span className="text-sm font-bold">{t.trade.timeLeft}</span>
          </div>
          <div className="font-mono text-xl font-bold text-rose-500">{formatTime(timeLeft)}</div>
        </div>
        <p className="text-xs text-center text-slate-500 mb-6">{t.trade.tips}</p>
        <Card className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4">
            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-80">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                ))}
              </div>
              <div className="z-10 bg-white p-1 rounded">
                <Wallet className="text-black" />
              </div>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t.trade.bankCode}</span>
              <span className="text-white font-mono">822</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t.trade.bankAcc}</span>
              <span className="text-white font-mono">1029 3847 5610</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t.trade.amount}</span>
              <span className="text-emerald-400 font-mono font-bold">$ {data?.item?.amount?.toLocaleString() || 5000}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <span className="text-slate-500 text-xs block mb-1">{t.trade.memo}</span>
              <span className="text-rose-500 font-mono font-bold text-lg select-all">TX9988</span>
            </div>
          </div>
        </Card>
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-bold mb-2">{t.trade.uploadReceipt}</label>
          <button className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500">
            <Camera className="mb-2" />
            <span className="text-xs">{t.trade.uploadHint}</span>
          </button>
        </div>
        <NeonButton fullWidth onClick={() => alert(t.common.success)}>
          {t.trade.confirmPaid}
        </NeonButton>
      </div>
    </div>
  );
};

export default TradeBuyView;

