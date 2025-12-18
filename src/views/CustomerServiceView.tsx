import React, { useState } from 'react';
import { ArrowLeft, FileImage, XCircle, Upload, Facebook, Send, MessageCircle, MessageSquare } from 'lucide-react';
import { ViewProps } from '../types';
import { NeonButton } from '../components';

const CustomerServiceView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSend = () => {
    if (!subject || !content) return alert('Please fill all fields');
    alert(`${t.common.success}\nAttachments: ${attachments.length}`);
    setSubject('');
    setContent('');
    setAttachments([]);
  };

  const handleAddAttachment = () => {
    const newFile = `Screenshot_${attachments.length + 1}.jpg`;
    setAttachments([...attachments, newFile]);
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center bg-slate-800 shadow-lg z-10">
        <button onClick={() => navigate('profile')} className="p-2 mr-2">
          <ArrowLeft className="text-white" />
        </button>
        <div>
          <h2 className="text-white font-bold text-lg">{t.service.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar flex flex-col">
        <div className="flex-1 space-y-6">
          <p className="text-slate-400 text-xs">{t.service.desc}</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t.service.subject}</label>
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500" 
                placeholder={t.service.placeholderSub} 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t.service.content}</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500 h-32 resize-none" 
                placeholder={t.service.placeholderContent} 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t.service.attachment}</label>
              <div className="space-y-2 mb-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded p-2 px-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileImage size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate">{file}</span>
                    </div>
                    <button onClick={() => handleRemoveAttachment(idx)} className="text-slate-500 hover:text-rose-400">
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleAddAttachment} 
                className="w-full h-12 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                <Upload size={14} className="mr-2" />
                {t.common.addFile}
              </button>
            </div>
            <NeonButton fullWidth onClick={handleSend}>{t.service.send}</NeonButton>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-center text-xs text-slate-500 mb-4">{t.service.social}</p>
          <div className="flex justify-center gap-6">
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2] transition-colors">
                <Facebook size={20} className="text-[#1877F2] group-hover:text-white" />
              </div>
              <span className="text-[10px] text-slate-400">Facebook</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc] transition-colors">
                <Send size={20} className="text-[#0088cc] group-hover:text-white" />
              </div>
              <span className="text-[10px] text-slate-400">Telegram</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-[#00B900]/20 flex items-center justify-center group-hover:bg-[#00B900] transition-colors">
                <MessageCircle size={20} className="text-[#00B900] group-hover:text-white" />
              </div>
              <span className="text-[10px] text-slate-400">Line</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-[#0068FF]/20 flex items-center justify-center group-hover:bg-[#0068FF] transition-colors">
                <MessageSquare size={20} className="text-[#0068FF] group-hover:text-white" />
              </div>
              <span className="text-[10px] text-slate-400">Zalo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceView;

