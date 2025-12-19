import api from './api';

// 仪表板相关API
export const dashboardApi = {
  /**
   * 获取仪表板统计数据
   */
  getDashboardStats: async () => {
    return api.get('/dashboard/stats.php');
  },

  /**
   * 获取平台列表
   */
  getPlatformList: async (params?: {
    filterType?: 'all' | 'buy' | 'sell';
    sortType?: 'time' | 'amount';
    sortDirection?: 'asc' | 'desc';
  }) => {
    return api.get('/dashboard/platforms.php', { params });
  },

  /**
   * 获取商户列表
   */
  getMerchantList: async (params?: {
    filterType?: 'all' | 'buy' | 'sell';
    sortType?: 'time' | 'amount';
    sortDirection?: 'asc' | 'desc';
  }) => {
    return api.get('/dashboard/merchants.php', { params });
  },

  /**
   * 获取会员列表
   */
  getMemberList: async (params?: {
    filterType?: 'all' | 'buy' | 'sell';
    sortType?: 'time' | 'amount';
    sortDirection?: 'asc' | 'desc';
  }) => {
    return api.get('/dashboard/members.php', { params });
  },

  /**
   * 获取用户资产信息
   */
  getUserAssets: async () => {
    return api.get('/dashboard/assets.php');
  },

  /**
   * 获取今日交易统计
   */
  getTodayStats: async () => {
    return api.get('/dashboard/today-stats.php');
  },

  /**
   * 获取交易记录
   */
  getTradeHistory: async (params?: {
    type?: 'all' | 'buy' | 'sell';
    page?: number;
    limit?: number;
  }) => {
    return api.get('/dashboard/trade-history.php', { params });
  },

  /**
   * 获取快速操作数据
   */
  getQuickActions: async () => {
    return api.get('/dashboard/quick-actions.php');
  },
};

// 交易相关API
export const tradeApi = {
  /**
   * 创建购买订单
   */
  createBuyOrder: async (data: {
    itemId: string;
    amount: number;
    paymentMethod?: string;
    captcha?: string;
  }) => {
    return api.post('/trade/buy', data);
  },

  /**
   * 创建出售订单
   */
  createSellOrder: async (data: {
    itemId: string;
    amount: number;
    receiveMethod?: string;
    captcha?: string;
  }) => {
    return api.post('/trade/sell', data);
  },

  /**
   * 取消订单
   */
  cancelOrder: async (orderId: string) => {
    return api.put(`/trade/order/${orderId}/cancel`);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: async (orderId: string) => {
    return api.get(`/trade/order/${orderId}`);
  },
};

// 定义类型
export interface DashboardStats {
  totalPoints: number;
  availableBalance: number;
  frozenBalance: number;
  totalProfit: number;
  todayProfit: number;
  monthlyProfit: number;
}

export interface TodayStats {
  buy: number;
  sell: number;
  buyRate: string;
  sellStatus: string;
  transactionCount: number;
  successRate: number;
}

export interface TradeItem {
  id: string;
  name: string;
  type: 'buy' | 'sell';
  amount: number;
  rating: number;
  time: string;
  bonus?: string;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
  userId?: string;
  avatar?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethods?: string[];
  description?: string;
}

export interface PlatformItem extends TradeItem {
  platformId: string;
  platformName: string;
  trustScore: number;
  transactionCount: number;
  online: boolean;
}

export interface MerchantItem extends TradeItem {
  merchantId: string;
  merchantName: string;
  verificationLevel: number;
  avgResponseTime: number;
  completedTrades: number;
}

export interface MemberItem extends TradeItem {
  memberId: string;
  memberName: string;
  level: number;
  reputation: number;
  joinDate: string;
}

export interface UserAssets {
  points: number;
  usdt: number;
  btc: number;
  eth: number;
  totalValue: number;
  lastUpdated: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
  badge?: number;
  enabled: boolean;
}