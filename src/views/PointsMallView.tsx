import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Camera, Wallet } from 'lucide-react';
import { ViewProps } from '../types';
import { Card, NeonButton } from '../components';

const PointsMallView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [uploaded, setUploaded] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2) timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [step]);

  const handleApply = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return alert('Invalid Amount');
    setOrderId(`ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`);
    setStep(2);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => step === 1 ? navigate('dashboard') : setStep(1)} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.mall.title}</h2>
          <p className="text-xs text-slate-400">{t.mall.desc}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right">
            <Card className="p-6 space-y-4">
              <label className="block text-sm font-bold text-slate-300 mb-1">{t.mall.inputLabel}</label>
              <input 
                type="number" 
                className="bg-slate-900 border border-slate-700 text-white text-lg font-mono rounded-lg block w-full p-3" 
                placeholder="10000" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[50000, 100000, 200000].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(String(val))} 
                    className="py-2 px-1 text-xs font-bold rounded border bg-slate-800 text-slate-400 border-slate-600 hover:border-emerald-500"
                  >
                    {(val / 10000)}W
                  </button>
                ))}
              </div>
            </Card>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 mb-1">{t.mall.memoLabel}</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white outline-none focus:border-emerald-500 h-24 resize-none transition-all" 
                placeholder={t.mall.memoPlaceholder} 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <span className="text-sm text-slate-400">{t.mall.estPay} (TWD)</span>
              <span className="text-xl font-mono font-bold text-white">$ {amount ? parseInt(amount).toLocaleString() : 0}</span>
            </div>
            <NeonButton fullWidth onClick={handleApply}>{t.mall.genQR}</NeonButton>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
              <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                <span className="text-xs text-slate-400">訂單編號</span>
                <span className="text-xs font-mono text-white">{orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">購買對象</span>
                <span className="text-xs font-bold text-emerald-400">官方平台</span>
              </div>
              {memo && (
                <div className="flex justify-between items-start pt-2 border-t border-slate-700/50">
                  <span className="text-xs text-slate-400 shrink-0">{t.mall.memoLabel}</span>
                  <span className="text-xs text-slate-300 text-right italic ml-4 break-all">"{memo}"</span>
                </div>
              )}
            </div>
            <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
              <div className="flex items-center text-rose-400">
                <Clock size={18} className="mr-2" />
                <span className="text-sm font-bold">{t.trade.timeLeft}</span>
              </div>
              <div className="font-mono text-xl font-bold text-rose-500">{formatTime(timeLeft)}</div>
            </div>
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
                  <span className="text-emerald-400 font-mono font-bold">$ {parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded text-center border border-rose-900/30">
                  <span className="text-slate-500 text-[10px] block mb-1">付款備註/附言 (請務必填寫)</span>
                  <span className="text-rose-500 font-mono font-bold text-lg select-all">TX9988</span>
                </div>
              </div>
            </Card>
            <div className="mb-8">
              <label className="block text-slate-300 text-sm font-bold mb-2">{t.trade.uploadReceipt}</label>
              <button 
                onClick={() => setUploaded(true)} 
                className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 ${uploaded ? 'border-emerald-500' : 'border-slate-600'}`}
              >
                <Camera className="mb-2" />
                <span className="text-xs">{t.trade.uploadHint}</span>
              </button>
            </div>
            <NeonButton fullWidth disabled={!uploaded} onClick={() => navigate('dashboard')}>
              {t.trade.confirmPaid}
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsMallView;

