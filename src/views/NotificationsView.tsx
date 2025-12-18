import React, { useState } from 'react';
import { ArrowLeft, CheckCheck, Trash2, Bell, CheckCircle, Clock, Check } from 'lucide-react';
import { ViewProps } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants/mockData';
import { Notification } from '../types';

const NotificationsView: React.FC<ViewProps> = ({ navigate, t, lang }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const clearAll = () => setNotifications([]);
  const deleteOne = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markOneRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  
  const getIcon = (type: string) => {
    if(type==='success') return <CheckCircle className="text-emerald-400" size={20} />;
    if(type==='pending') return <Clock className="text-yellow-400" size={20} />;
    return <Bell className="text-slate-400" size={20} />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-10">
        <div className="flex items-center">
          <button onClick={() => navigate('dashboard')} className="p-2 mr-2 hover:bg-slate-700 rounded-full">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h2 className="text-white font-bold text-lg">{t.notification.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-full" title={t.notification.markAll}>
            <CheckCheck size={18} />
          </button>
          <button onClick={clearAll} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-full" title={t.notification.clearAll}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <Bell size={40} className="mb-2 opacity-50" />
            <p>{t.notification.empty}</p>
          </div>
        ) : (
          notifications.map((note) => (
            <div 
              key={note.id} 
              className={`bg-slate-800/50 border ${note.isRead ? 'border-slate-800' : 'border-slate-700'} rounded-xl p-4 relative group hover:bg-slate-800 transition-all`}
            >
              {!note.isRead && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
              <div className="flex gap-4">
                <div className="mt-1">{getIcon(note.type)}</div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-1 ${note.isRead ? 'text-slate-400' : 'text-white'}`}>
                    {lang === 'zh-TW' ? note.title.zh : (lang === 'vi-VN' ? note.title.vi : note.title.en)}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {lang === 'zh-TW' ? note.content.zh : (lang === 'vi-VN' ? note.content.vi : note.content.en)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{note.time}</span>
                    <div className="flex gap-3">
                      {!note.isRead && (
                        <button 
                          onClick={() => markOneRead(note.id)} 
                          className="flex items-center text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Check size={12} className="mr-1" />
                          {t.notification.markRead}
                        </button>
                      )}
                      <button 
                        onClick={() => deleteOne(note.id)} 
                        className="flex items-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsView;

