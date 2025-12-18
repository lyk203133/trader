import React, { useState } from 'react';
import { 
  Bell, Coins, TrendingUp, TrendingDown, ArrowUpDown, Clock,
  ShoppingBag, Wallet, Settings, Megaphone
} from 'lucide-react';
import { ViewProps } from '../types';
import { Card, NeonButton, Badge } from '../components';
import { 
  ASSET_BALANCE, 
  TODAY_STATS, 
  MOCK_MERCHANT_LIST, 
  MOCK_PLATFORM_LIST, 
  MOCK_MEMBER_LIST 
} from '../constants/mockData';

const DashboardView: React.FC<ViewProps> = ({ navigate, t, lang, userInfo }) => {
  const [activeTab, setActiveTab] = useState<'platform' | 'merchant' | 'member'>('merchant'); 
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all'); 
  const [sortType, setSortType] = useState<'time' | 'amount'>('time'); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); 

  const handleSort = (type: 'time' | 'amount') => {
    if (sortType === type) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortDirection('desc');
    }
  };

  const getProcessedList = () => {
    let list = activeTab === 'platform' ? MOCK_PLATFORM_LIST : 
                activeTab === 'member' ? MOCK_MEMBER_LIST : 
                MOCK_MERCHANT_LIST;

    if (filterType === 'buy') {
      list = list.filter(item => item.type === 'sell');
    } else if (filterType === 'sell') {
      list = list.filter(item => item.type === 'buy');
    }

    list = [...list].sort((a, b) => {
      let diff = sortType === 'amount' ? a.amount - b.amount : a.time.localeCompare(b.time);
      return sortDirection === 'asc' ? diff : -diff;
    });

    return list;
  };

  const activeList = getProcessedList();

  const getBadgeText = (bonus: string | null) => {
    if (!bonus) return null;
    if (lang === 'zh-TW') return '⚡️限時回饋';
    if (lang === 'vi-VN') return '⚡️Khuyến mãi';
    return 'Flash Bonus';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="px-5 pt-5 pb-2 shrink-0 z-10 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3" onClick={() => navigate('profile')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-slate-800 border border-emerald-400 p-[2px]">
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="avatar" className="rounded-full bg-slate-900 w-full h-full object-cover" />
              ) : (
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="rounded-full bg-slate-900 w-full h-full" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{userInfo?.nickname || 'Player_99'}</h3>
              <div className="flex items-center text-[10px] text-emerald-400 bg-emerald-900/30 px-2 rounded-full w-fit mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                verified
              </div>
            </div>
          </div>
          <div onClick={() => navigate('notifications')} className="relative p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 scroll-smooth no-scrollbar">
        <div className="grid grid-cols-3 gap-3 mb-6 mt-2">
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.avail}</p>
            <h3 className="text-lg font-mono font-bold text-blue-400 mb-2 tracking-tight">{ASSET_BALANCE.toLocaleString()}</h3>
            <div className="flex items-center text-[10px] text-slate-500">
              <Coins size={10} className="mr-1 text-yellow-500" />
              {t.common.points}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.todayBuy}</p>
            <h3 className="text-lg font-mono font-bold text-emerald-500 mb-2 tracking-tight">+{TODAY_STATS.buy.toLocaleString()}</h3>
            <div className="flex items-center text-[10px] text-emerald-500/80">
              <TrendingUp size={10} className="mr-1" />
              {TODAY_STATS.buyRate}
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.todaySell}</p>
            <h3 className="text-lg font-mono font-bold text-rose-500 mb-2 tracking-tight">-{TODAY_STATS.sell.toLocaleString()}</h3>
            <div className="flex items-center text-[10px] text-rose-400/80">
              <TrendingDown size={10} className="mr-1" />
              {TODAY_STATS.sellStatus}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex p-1 bg-slate-800 rounded-lg">
            {(['platform', 'merchant', 'member'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setFilterType('all'); }} 
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t.dashboard.tabs[tab]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3 text-xs font-bold">
            {(['all', 'buy', 'sell'] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)} 
                className={`pb-1 border-b-2 transition-colors ${filterType === type ? 'text-emerald-400 border-emerald-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                {type === 'all' ? t.common.all : (type === 'buy' ? t.dashboard.filter.buy : t.dashboard.filter.sell)}
              </button>
            ))}
          </div>
          <div className="flex bg-slate-800 rounded-md p-0.5">
            <button onClick={() => handleSort('amount')} className={`p-1.5 rounded flex items-center gap-1 ${sortType === 'amount' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
              <ArrowUpDown size={14} />
              {sortType === 'amount' && <span className="text-[10px] font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </button>
            <button onClick={() => handleSort('time')} className={`p-1.5 rounded flex items-center gap-1 ${sortType === 'time' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
              <Clock size={14} />
              {sortType === 'time' && <span className="text-[10px] font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </button>
          </div>
        </div>

        <div className="space-y-3 min-h-[300px]">
          {activeList.map((item) => {
            const canAfford = item.type === 'buy' ? ASSET_BALANCE >= item.amount : true;
            
            return (
              <Card key={item.id} className="flex justify-between items-center p-3 relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.type === 'sell' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <div className="flex flex-col gap-1 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{item.name}</span>
                    <div className="flex text-yellow-500 text-[10px]">★ {item.rating}</div>
                    <span className="text-[10px] text-slate-500 font-mono ml-1">{item.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-mono font-bold text-white tracking-tighter">{item.amount.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 ml-1 mt-2">P</span>
                  </div>
                  {item.bonus && <div className="flex mt-1"><Badge type="red" text={getBadgeText(item.bonus) || ''} /></div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {item.type === 'sell' ? (
                    <NeonButton variant="primary" className="w-20 h-9 text-xs" onClick={() => navigate('trade-buy', { item })}>
                      {t.dashboard.actions.buy}
                    </NeonButton>
                  ) : (
                    <>
                      <NeonButton 
                        variant="danger" 
                        className="w-20 h-9 text-xs" 
                        onClick={() => navigate('trade-sell', { item })}
                        disabled={!canAfford}
                      >
                        {t.dashboard.actions.sell}
                      </NeonButton>
                      {!canAfford && (
                        <span className="text-[10px] text-rose-500">{t.dashboard.actions.need} {item.amount.toLocaleString()}</span>
                      )}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 mb-6 pt-6 border-t border-slate-800">
          <p className="text-white text-xs font-bold mb-3 flex items-center">
            <span className="w-1 h-3 bg-emerald-500 mr-2 rounded-full"></span>
            {t.dashboard.quickActions}
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => navigate('points-mall')} className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <ShoppingBag size={20} className="text-emerald-400 mb-1" />
              <span className="text-[10px] text-slate-300">{t.dashboard.qa.mall}</span>
            </button>
            <button onClick={() => navigate('my-wallet')} className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Wallet size={20} className="text-yellow-400 mb-1" />
              <span className="text-[10px] text-slate-300">{t.dashboard.qa.wallet}</span>
            </button>
            <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Settings size={20} className="text-blue-400 mb-1" />
              <span className="text-[10px] text-slate-300">{t.dashboard.qa.settings}</span>
            </button>
            <button onClick={() => navigate('system-announcements')} className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Megaphone size={20} className="text-rose-400 mb-1" />
              <span className="text-[10px] text-slate-300">{t.dashboard.qa.announce}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

