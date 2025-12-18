import React, { useState } from 'react';
import { ArrowLeft, CheckCheck, Clock, Info, Check } from 'lucide-react';
import { ViewProps } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants/mockData';
import { Announcement } from '../types';

const SystemAnnouncementsView: React.FC<ViewProps> = ({ navigate, t, lang }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const markAllRead = () => setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));
  const markOneRead = (id: number, e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a)); 
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('dashboard')} className="p-2 mr-2 hover:bg-slate-700 rounded-full">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h2 className="text-white font-bold text-lg">{t.announce.title}</h2>
        </div>
        <button onClick={markAllRead} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-full">
          <CheckCheck size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {announcements.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} 
            className={`relative bg-slate-800 border ${item.isRead ? 'border-slate-800' : 'border-emerald-500/50'} rounded-xl p-4 transition-all cursor-pointer hover:bg-slate-700/50`}
          >
            {!item.isRead && <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
            <div className="pr-6">
              <h3 className={`font-bold text-sm mb-1 ${item.isRead ? 'text-slate-300' : 'text-white'}`}>
                {lang === 'zh-TW' ? item.title.zh : (lang === 'vi-VN' ? item.title.vi : item.title.en)}
              </h3>
              <div className="flex items-center text-[10px] text-slate-500 mb-2">
                <Clock size={10} className="mr-1" />
                {item.time}
              </div>
              <p className={`text-xs text-slate-400 leading-relaxed ${expandedId === item.id ? '' : 'line-clamp-2'}`}>
                {lang === 'zh-TW' ? item.content.zh : (lang === 'vi-VN' ? item.content.vi : item.content.en)}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
              <span className="text-[10px] text-emerald-500/70 flex items-center">
                <Info size={10} className="mr-1" />
                {expandedId === item.id ? t.announce.clickCollapse : t.announce.clickExpand}
              </span>
              {!item.isRead && (
                <button 
                  onClick={(e) => markOneRead(item.id, e)} 
                  className="flex items-center text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-900/50 border border-emerald-500/20"
                >
                  <Check size={10} className="mr-1" />
                  {t.announce.markRead}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAnnouncementsView;

