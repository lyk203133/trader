import React from 'react';
import { ArrowLeft, Share2, Users, Info } from 'lucide-react';
import { ViewProps } from '../types';
import { MOCK_REFERRALS } from '../constants/mockData';

const ReferralView: React.FC<ViewProps> = ({ navigate, t }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('profile')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.referral.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <div className="bg-gradient-to-br from-emerald-600 to-slate-800 rounded-2xl p-6 text-center shadow-lg mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-xs font-bold mb-2">{t.referral.myCode}</p>
            <h1 className="text-4xl font-mono font-bold text-white mb-4 tracking-widest">NEX888</h1>
            <button 
              onClick={() => alert(t.referral.copySuccess)} 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition-all flex items-center justify-center mx-auto"
            >
              <Share2 size={14} className="mr-2"/> {t.referral.shareLink}
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs mb-1">{t.referral.invitedCount}</p>
            <h3 className="text-2xl font-bold text-white">12</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs mb-1">{t.referral.totalEarned}</p>
            <h3 className="text-2xl font-bold text-emerald-400">1,200</h3>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/20 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
              <Info size={20} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{t.referral.tips}</p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center">
            <Users size={16} className="mr-2 text-slate-400"/> {t.referral.history}
          </h3>
          <div className="space-y-2">
            {MOCK_REFERRALS.map((ref) => (
              <div key={ref.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <div>
                  <p className="text-white font-bold text-sm">{ref.name}</p>
                  <p className="text-[10px] text-slate-500">{ref.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">+{ref.reward}</p>
                  <p className="text-[10px] text-slate-500">{t.referral.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralView;

