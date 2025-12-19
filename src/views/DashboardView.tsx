import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, Coins, TrendingUp, TrendingDown, ArrowUpDown, Clock,
  ShoppingBag, Wallet, Settings, Megaphone, RefreshCw, AlertCircle
} from 'lucide-react';
import { ViewProps } from '../types';
import { Card, NeonButton, Badge, LoadingSpinner } from '../components';
import { 
  dashboardApi, 
  tradeApi,
  type TradeItem,
  type PlatformItem,
  type MerchantItem,
  type MemberItem,
  type TodayStats,
  type QuickAction
} from '../services/dashboardApi';

// 默认数据（用于API失败时的回退）
const DEFAULT_ASSET_BALANCE = 15000;
const DEFAULT_TODAY_STATS = {
  buy: 3200,
  sell: 1200,
  buyRate: '+5.2%',
  sellStatus: 'Active'
};

const DashboardView: React.FC<ViewProps> = ({ navigate, t, lang, userInfo }) => {
  const [activeTab, setActiveTab] = useState<'platform' | 'merchant' | 'member'>('merchant'); 
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all'); 
  const [sortType, setSortType] = useState<'time' | 'amount'>('time'); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // 状态管理
  const [loading, setLoading] = useState({
    dashboard: true,
    list: true,
    assets: true
  });
  const [error, setError] = useState<string | null>(null);
  
  // 数据状态
  const [assetBalance, setAssetBalance] = useState<number>(DEFAULT_ASSET_BALANCE);
  const [todayStats, setTodayStats] = useState<TodayStats>(DEFAULT_TODAY_STATS);
  const [platformList, setPlatformList] = useState<PlatformItem[]>([]);
  const [merchantList, setMerchantList] = useState<MerchantItem[]>([]);
  const [memberList, setMemberList] = useState<MemberItem[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 获取仪表板数据
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      setError(null);
      
      // 并行请求关键数据
      const [assetsRes, statsRes, actionsRes] = await Promise.allSettled([
        dashboardApi.getUserAssets(),
        dashboardApi.getTodayStats(),
        dashboardApi.getQuickActions()
      ]);
      
      // 处理资产数据
      if (assetsRes.status === 'fulfilled' && assetsRes.value.data) {
        console.log(assetsRes.value.data.points.available ,assetsRes.value.data)
        setAssetBalance(assetsRes.value.data.points.available || DEFAULT_ASSET_BALANCE);
      } else {
        console.warn('Failed to load assets, using default');
      }
      
      // 处理今日统计
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setTodayStats(statsRes.value.data);
      } else {
        console.warn('Failed to load today stats, using default');
      }
      
      // 处理快速操作
      if (actionsRes.status === 'fulfilled' && actionsRes.value.data) {
        setQuickActions(actionsRes.value.data);
      }
      
      // 更新最后刷新时间
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(t.dashboard.errors?.loadFailed || 'Failed to load dashboard data');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, [t]);

  // 获取列表数据
  const fetchListData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      
      const params = {
        filterType: filterType === 'all' ? undefined : filterType,
        sortType,
        sortDirection
      };
      
      let response;
      switch (activeTab) {
        case 'platform':
          response = await dashboardApi.getPlatformList(params);
          if (response.data) setPlatformList(response.data);
          break;
        case 'merchant':
          response = await dashboardApi.getMerchantList(params);
          if (response.data) setMerchantList(response.data);
          break;
        case 'member':
          response = await dashboardApi.getMemberList(params);
          if (response.data) setMemberList(response.data);
          break;
      }
      
    } catch (err: any) {
      console.error(`Failed to load ${activeTab} list:`, err);
      // 保持现有数据，不重置为错误
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  }, [activeTab, filterType, sortType, sortDirection]);

  // 初始加载
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 监听标签和筛选条件变化
  useEffect(() => {
    fetchListData();
  }, [fetchListData]);

  // 手动刷新
  const handleRefresh = () => {
    fetchDashboardData();
    fetchListData();
  };

  // 处理排序
  const handleSort = (type: 'time' | 'amount') => {
    if (sortType === type) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortDirection('desc');
    }
  };

  // 处理交易操作
  const handleTradeAction = async (item: TradeItem, action: 'buy' | 'sell') => {
    try {
      // 检查余额
      if (action === 'sell' && assetBalance < item.amount) {
        alert(t.dashboard.actions.insufficientBalance || 'Insufficient balance');
        return;
      }
      
      // 确认交易
      const confirmMessage = action === 'buy' 
        ? t.dashboard.confirm.buy.replace('{amount}', item.amount.toString()).replace('{name}', item.name)
        : t.dashboard.confirm.sell.replace('{amount}', item.amount.toString()).replace('{name}', item.name);
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
      
      // 执行交易API
      if (action === 'buy') {
        await tradeApi.createBuyOrder({
          itemId: item.id,
          amount: item.amount,
          paymentMethod: 'balance' // 默认使用余额支付
        });
        
        // 显示成功消息
        alert(t.dashboard.success.buy || 'Purchase successful!');
        
        // 刷新数据
        fetchDashboardData();
        
      } else {
        await tradeApi.createSellOrder({
          itemId: item.id,
          amount: item.amount,
          receiveMethod: 'balance'
        });
        
        alert(t.dashboard.success.sell || 'Sale successful!');
        fetchDashboardData();
      }
      
    } catch (err: any) {
      console.error('Trade error:', err);
      
      // 显示错误消息
      let errorMessage = t.dashboard.errors?.tradeFailed || 'Trade failed';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  // 获取当前显示的列表
  const getActiveList = () => {
    switch (activeTab) {
      case 'platform': return platformList;
      case 'merchant': return merchantList;
      case 'member': return memberList;
      default: return [];
    }
  };

  const activeList = getActiveList();

  // 徽章文本
  const getBadgeText = (bonus: string | null) => {
    if (!bonus) return null;
    if (lang === 'zh-TW') return '⚡️限時回饋';
    if (lang === 'vi-VN') return '⚡️Khuyến mãi';
    return 'Flash Bonus';
  };

  // 加载状态显示
  if (loading.dashboard && loading.list && loading.assets) {
    return (
      <div className="flex flex-col h-full bg-slate-900 items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 mt-4">{t.dashboard.loading || 'Loading dashboard...'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* 顶部栏 */}
      <div className="px-5 pt-5 pb-2 shrink-0 z-10 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('profile')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-slate-800 border border-emerald-400 p-[2px]">
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="avatar" className="rounded-full bg-slate-900 w-full h-full object-cover" />
              ) : (
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo?.id || 'default'}`} 
                  alt="avatar" 
                  className="rounded-full bg-slate-900 w-full h-full" 
                />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{userInfo?.nickname || 'Player_99'}</h3>
              <div className="flex items-center text-[10px] text-emerald-400 bg-emerald-900/30 px-2 rounded-full w-fit mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                {userInfo?.verified ? t.common.verified : t.common.unverified}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 刷新按钮 */}
            <button 
              onClick={handleRefresh}
              disabled={loading.dashboard || loading.list}
              className="p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors disabled:opacity-50"
              title={t.dashboard.refresh || 'Refresh'}
            >
              <RefreshCw 
                size={20} 
                className={`text-slate-300 ${loading.dashboard || loading.list ? 'animate-spin' : ''}`} 
              />
            </button>
            
            {/* 通知按钮 */}
            <div 
              onClick={() => navigate('notifications')} 
              className="relative p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <Bell size={20} className="text-slate-300" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
            </div>
          </div>
        </div>
        
        {/* 最后更新时间 */}
        {lastUpdated && (
          <div className="text-right text-[10px] text-slate-500 mt-2">
            {t.dashboard.lastUpdated || 'Last updated'}: {lastUpdated}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-5 mt-2 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-xs text-slate-400 hover:text-white"
            >
              {t.common.dismiss}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 pb-5 scroll-smooth no-scrollbar">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6 mt-2">
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.avail}</p>
            <h3 className="text-lg font-mono font-bold text-blue-400 mb-2 tracking-tight">
              {loading.assets ? (
                <div className="h-6 w-20 bg-slate-700 rounded animate-pulse">{assetBalance.toLocaleString()}</div>
              ) : (
                assetBalance.toLocaleString()
              )}
            </h3>
            <div className="flex items-center text-[10px] text-slate-500">
              <Coins size={10} className="mr-1 text-yellow-500" />
              {t.common.points}
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.todayBuy}</p>
            <h3 className="text-lg font-mono font-bold text-emerald-500 mb-2 tracking-tight">
              {loading.dashboard ? (
                <div className="h-6 w-20 bg-slate-700 rounded animate-pulse"></div>
              ) : (
                `+${todayStats.buy.amount.toLocaleString()}`
              )}
            </h3>
            <div className="flex items-center text-[10px] text-emerald-500/80">
              <TrendingUp size={10} className="mr-1" />
              {todayStats.buyRate}
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-bold mb-1">{t.dashboard.todaySell}</p>
            <h3 className="text-lg font-mono font-bold text-rose-500 mb-2 tracking-tight">
              {loading.dashboard ? (
                <div className="h-6 w-20 bg-slate-700 rounded animate-pulse"></div>
              ) : (
                `-${todayStats.sell.amount.toLocaleString()}`
              )}
            </h3>
            <div className="flex items-center text-[10px] text-rose-400/80">
              <TrendingDown size={10} className="mr-1" />
              {todayStats.sellStatus}
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="mb-4">
          <div className="flex p-1 bg-slate-800 rounded-lg">
            {(['platform', 'merchant', 'member'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setFilterType('all'); }} 
                disabled={loading.list}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'} disabled:opacity-50`}
              >
                {t.dashboard.tabs[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* 筛选和排序 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3 text-xs font-bold">
            {(['all', 'buy', 'sell'] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)} 
                disabled={loading.list}
                className={`pb-1 border-b-2 transition-colors ${filterType === type ? 'text-emerald-400 border-emerald-400' : 'text-slate-500 border-transparent hover:text-slate-300'} disabled:opacity-50`}
              >
                {type === 'all' ? t.common.all : (type === 'buy' ? t.dashboard.filter.buy : t.dashboard.filter.sell)}
              </button>
            ))}
          </div>
          
          <div className="flex bg-slate-800 rounded-md p-0.5">
            <button 
              onClick={() => handleSort('amount')} 
              disabled={loading.list}
              className={`p-1.5 rounded flex items-center gap-1 ${sortType === 'amount' ? 'bg-slate-700 text-white' : 'text-slate-500'} disabled:opacity-50`}
            >
              <ArrowUpDown size={14} />
              {sortType === 'amount' && <span className="text-[10px] font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </button>
            <button 
              onClick={() => handleSort('time')} 
              disabled={loading.list}
              className={`p-1.5 rounded flex items-center gap-1 ${sortType === 'time' ? 'bg-slate-700 text-white' : 'text-slate-500'} disabled:opacity-50`}
            >
              <Clock size={14} />
              {sortType === 'time' && <span className="text-[10px] font-mono">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </button>
          </div>
        </div>

        {/* 列表内容 */}
        <div className="space-y-3 min-h-[300px]">
          {loading.list ? (
            // 加载状态
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner />
              <p className="text-slate-400 mt-2 text-sm">{t.dashboard.loadingList || 'Loading list...'}</p>
            </div>
          ) : activeList.length === 0 ? (
            // 空状态
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">{t.dashboard.emptyList || 'No items found'}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 text-emerald-400 text-sm hover:underline"
              >
                {t.dashboard.refreshList || 'Refresh list'}
              </button>
            </div>
          ) : (
            // 正常列表
            activeList.map((item) => {
              const canAfford = item.type === 'buy' ? assetBalance >= item.amount : true;
              
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
                    {item.bonus && (
                      <div className="flex mt-1">
                        <Badge type="red" text={getBadgeText(item.bonus) || ''} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {item.type === 'sell' ? (
                      <NeonButton 
                        variant="primary" 
                        className="w-20 h-9 text-xs" 
                        onClick={() => handleTradeAction(item, 'buy')}
                        disabled={loading.dashboard}
                      >
                        {loading.dashboard ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          t.dashboard.actions.buy
                        )}
                      </NeonButton>
                    ) : (
                      <>
                        <NeonButton 
                          variant="danger" 
                          className="w-20 h-9 text-xs" 
                          onClick={() => handleTradeAction(item, 'sell')}
                          disabled={!canAfford || loading.dashboard}
                        >
                          {loading.dashboard ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            t.dashboard.actions.sell
                          )}
                        </NeonButton>
                        {!canAfford && (
                          <span className="text-[10px] text-rose-500">
                            {t.dashboard.actions.need} {item.amount.toLocaleString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* 快速操作 */}
        <div className="mt-8 mb-6 pt-6 border-t border-slate-800">
          <p className="text-white text-xs font-bold mb-3 flex items-center">
            <span className="w-1 h-3 bg-emerald-500 mr-2 rounded-full"></span>
            {t.dashboard.quickActions}
          </p>
          
          <div className="grid grid-cols-4 gap-2">
            {quickActions.length > 0 ? (
              quickActions.map(action => (
                <button 
                  key={action.id}
                  onClick={() => navigate(action.route)}
                  disabled={!action.enabled}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors border shadow-lg ${
                    action.enabled 
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                      : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* 这里可以根据action.icon动态渲染图标 */}
                  <ShoppingBag size={20} className="text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-300">{action.title}</span>
                  {action.badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[8px] text-white rounded-full flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </button>
              ))
            ) : (
              // 默认快速操作
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;