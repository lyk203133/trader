import React, { useState } from 'react';
import { ArrowLeft, Clock, FileText, Upload, Edit3 } from 'lucide-react';
import { ViewProps } from '../types';
import { InputField, NeonButton } from '../components';

const PaymentAccountView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [status, setStatus] = useState<'verified' | 'pending' | 'editing'>('verified'); 
  
  const handleUpload = (id: string) => {
    const btn = document.getElementById(id);
    if(btn) {
      btn.classList.add("border-emerald-500", "text-emerald-400");
      btn.classList.remove("border-slate-700", "text-slate-400", "border-dashed");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('profile')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.account.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        {status === 'pending' && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Clock className="text-yellow-500 shrink-0" size={20} />
            <div>
              <h3 className="text-yellow-500 font-bold text-sm mb-1">{t.account.status.pending}</h3>
              <p className="text-xs text-yellow-500/80">{t.account.pendingDesc}</p>
            </div>
          </div>
        )}
        <div className="space-y-6">
          {status === 'verified' && (
            <div className="bg-slate-800 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                {t.account.status.verified}
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">{t.account.bankName}</p>
                <p className="text-white font-bold">China Trust (822)</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t.account.accNo}</p>
                <p className="text-white font-mono font-bold text-lg">**** **** **** 5610</p>
              </div>
            </div>
          )}
          {status !== 'pending' && (
            <NeonButton variant="outline" fullWidth onClick={() => setStatus('editing')}>
              <Edit3 size={16} className="mr-2"/> {t.account.edit}
            </NeonButton>
          )}
          {status === 'editing' && (
            <div className="animate-in fade-in slide-in-from-bottom duration-300 space-y-4">
              <InputField icon={FileText} placeholder={t.account.bankName} />
              <InputField icon={FileText} placeholder={t.account.branch} />
              <InputField icon={FileText} placeholder={t.account.accNo} />
              <div className="grid grid-cols-2 gap-4">
                <button 
                  id="card_front" 
                  onClick={() => handleUpload('card_front')} 
                  className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-800 transition-all"
                >
                  <span className="text-xs">{t.account.cardFront}</span>
                </button>
                <button 
                  id="card_back" 
                  onClick={() => handleUpload('card_back')} 
                  className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-800 transition-all"
                >
                  <span className="text-xs">{t.account.cardBack}</span>
                </button>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-3">
                  {t.account.qr} <span className="text-rose-400">({t.account.qrHint})</span>
                </p>
                <button 
                  id="qr_code" 
                  onClick={() => handleUpload('qr_code')} 
                  className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-900 transition-all"
                >
                  <Upload className="mb-2" />
                  <span className="text-xs">{t.common.upload}</span>
                </button>
              </div>
              <NeonButton fullWidth onClick={() => setStatus('pending')}>{t.account.submit}</NeonButton>
              <button 
                onClick={() => setStatus('verified')} 
                className="w-full text-center text-slate-500 text-xs py-2 hover:text-white"
              >
                {t.common.cancel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAccountView;

