import React, { useState } from 'react';
import { ArrowLeft, Download, Search, ChevronDown, Calendar } from 'lucide-react';
import { ViewProps } from '../types';
import { MOCK_TRANSACTIONS } from '../constants/mockData';

const TransactionHistoryView: React.FC<ViewProps> = ({ navigate, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [filterTarget, setFilterTarget] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [startDate, setStartDate] = useState('');

  const getFilteredTransactions = () => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.orderNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      const matchTarget = filterTarget === 'all' || tx.target === filterTarget;
      const matchStatus = filterStatus === 'all' || tx.status === filterStatus;
      const txDate = tx.date.split(' ')[0];
      const matchStart = !startDate || txDate >= startDate;

      return matchSearch && matchType && matchTarget && matchStatus && matchStart;
    });
  };

  const filteredList = getFilteredTransactions();
  const stats = { 
    count: filteredList.length, 
    points: filteredList.reduce((s, t) => s + t.amount, 0), 
    fees: filteredList.reduce((s, t) => s + (t.fee || 0), 0), 
    bonus: filteredList.reduce((s, t) => s + (t.bonus || 0), 0) 
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-20">
        <div className="flex items-center">
          <button onClick={() => navigate('profile')} className="p-2 mr-2 hover:bg-slate-700 rounded-full">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg">{t.history.title}</h2>
          </div>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white border border-slate-600">
          <Download size={14} />
          <span>{t.history.export}</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="bg-slate-800/50 p-4 grid grid-cols-4 gap-4 border-b border-slate-700">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">{t.history.stats.count}</span>
            <span className="text-lg font-mono font-bold text-blue-400">{stats.count}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">{t.history.stats.points}</span>
            <span className="text-lg font-mono font-bold text-white">{stats.points.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">{t.history.stats.fees}</span>
            <span className="text-lg font-mono font-bold text-rose-400">{stats.fees}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 mb-1">{t.history.stats.bonus}</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{stats.bonus}</span>
          </div>
        </div>
        <div className="p-4 space-y-3 bg-slate-900 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder={t.history.searchPlaceholder} 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:border-emerald-500 outline-none" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white appearance-none outline-none" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">{t.history.types.all}</option>
                <option value="buy">{t.history.types.buy}</option>
                <option value="sell">{t.history.types.sell}</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={14} />
            </div>
            <div className="relative">
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white appearance-none outline-none" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">{t.history.statuses.all}</option>
                <option value="success">{t.history.statuses.success}</option>
                <option value="pending">{t.history.statuses.pending}</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white appearance-none outline-none" 
                value={filterTarget} 
                onChange={(e) => setFilterTarget(e.target.value)}
              >
                <option value="all">{t.history.targets.all}</option>
                <option value="platform">{t.history.targets.platform}</option>
                <option value="merchant">{t.history.targets.merchant}</option>
                <option value="member">{t.history.targets.member}</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" size={14} />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-2 text-xs text-white outline-none" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar"> 
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[1.2fr_1.5fr_0.6fr_0.6fr_0.8fr_0.6fr_0.6fr_0.8fr_1.2fr] gap-2 px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900 border-b border-slate-800">
              <div>{t.common.txId}</div>
              <div>{t.common.orderNo}</div>
              <div>{t.common.type}</div>
              <div>{t.common.target}</div>
              <div className="text-right">{t.common.amount}</div>
              <div className="text-right">{t.common.fee}</div>
              <div className="text-right">{t.common.bonus}</div>
              <div className="text-center">{t.common.status}</div>
              <div className="text-right">{t.common.time}</div>
            </div>
            <div>
              {filteredList.map((tx, idx) => (
                <div 
                  key={tx.id} 
                  className={`grid grid-cols-[1.2fr_1.5fr_0.6fr_0.6fr_0.8fr_0.6fr_0.6fr_0.8fr_1.2fr] gap-2 px-4 py-3 border-b border-slate-800/50 text-xs items-center hover:bg-slate-800/30 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/10'}`}
                >
                  <div className="font-mono text-slate-300">{tx.id}</div>
                  <div className="font-mono text-slate-400 scale-90 origin-left">{tx.orderNo}</div>
                  <div className={tx.type === 'buy' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {tx.type === 'buy' ? t.history.types.buy : t.history.types.sell}
                  </div>
                  <div className="text-slate-300">{t.history.targets[tx.target] || tx.target}</div>
                  <div className="text-right font-mono font-bold text-white">{tx.amount.toLocaleString()}</div>
                  <div className="text-right font-mono text-rose-400">{tx.fee > 0 ? `-${tx.fee}` : '-'}</div>
                  <div className="text-right font-mono text-emerald-400">{tx.bonus > 0 ? `+${tx.bonus}` : '-'}</div>
                  <div className="text-center text-white">{t.history.statuses[tx.status] || tx.status}</div>
                  <div className="text-right font-mono text-slate-500 scale-90 origin-right">{tx.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryView;

