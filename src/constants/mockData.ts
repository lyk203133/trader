import { TransactionItem, ListItem, Notification, Announcement, Referral, MembershipLevel } from '../types';

export const APP_NAME = "NEXUS TRADER";
export const ASSET_BALANCE = 15000; 
export const FROZEN_BALANCE = 20000;
export const TOTAL_ASSETS = ASSET_BALANCE + FROZEN_BALANCE;

export const TODAY_STATS = {
    buy: 2500,
    sell: 1800,
    buyRate: "+15.5%",
    sellStatus: "Trading"
};

export const WALLET_STATS = {
    totalDeposit: 150000,
    totalWithdraw: 0,
    totalFees: 250
};

export const MOCK_REFERRALS: Referral[] = [
    { id: 1, name: "User_9982", date: "2023-11-28", reward: 100 },
    { id: 2, name: "Crypto_Fan", date: "2023-11-25", reward: 100 },
    { id: 3, name: "Trader_X", date: "2023-11-20", reward: 100 },
];

export const MEMBERSHIP_LEVELS: MembershipLevel[] = [
    { level: 'bronze', name: 'bronze', fee: '0.5%', limit: '500,000', bonus: '0%', color: 'text-amber-600', border: 'border-amber-600/50', exp: '0' },
    { level: 'silver', name: 'silver', fee: '0.3%', limit: '1,000,000', bonus: '0.1%', color: 'text-slate-300', border: 'border-slate-400/50', exp: '5,000' },
    { level: 'gold', name: 'gold', fee: '0.1%', limit: '5,000,000', bonus: '0.2%', color: 'text-yellow-400', border: 'border-yellow-400/50', exp: '15,000' },
    { level: 'platinum', name: 'platinum', fee: '0%', limit: 'Unlimited', bonus: '0.5%', color: 'text-cyan-400', border: 'border-cyan-400/50', exp: '50,000' },
];

export const MOCK_MERCHANT_LIST: ListItem[] = [
  { id: 1, name: "Thunder Corp", rating: 4.9, amount: 5000, type: 'sell', bonus: 'flash', time: '14:30' },
  { id: 2, name: "SpeedyEx", rating: 4.8, amount: 50000, type: 'buy', bonus: 'bonus', time: '14:28' },
  { id: 3, name: "Alpha Team", rating: 5.0, amount: 2000, type: 'sell', bonus: null, time: '14:25' },
  { id: 4, name: "GoldRush", rating: 4.7, amount: 15000, type: 'sell', bonus: null, time: '14:10' },
  { id: 5, name: "SafeHaven", rating: 4.9, amount: 8000, type: 'buy', bonus: null, time: '13:55' },
  { id: 6, name: "QuickPay", rating: 4.6, amount: 3000, type: 'buy', bonus: 'fast', time: '13:40' },
];

export const MOCK_PLATFORM_LIST: ListItem[] = [
  { id: 101, name: "Official", rating: 5.0, amount: 10000, type: 'sell', bonus: 'official', time: '09:00' },
  { id: 102, name: "System A", rating: 5.0, amount: 5000, type: 'sell', bonus: null, time: '09:05' },
  { id: 103, name: "FastLane", rating: 5.0, amount: 1000, type: 'sell', bonus: null, time: '09:10' },
  { id: 104, name: "BuyBack", rating: 5.0, amount: 20000, type: 'buy', bonus: 'fee-free', time: '10:00' },
  { id: 105, name: "Settlement", rating: 5.0, amount: 100000, type: 'buy', bonus: null, time: '10:30' },
  { id: 106, name: "AutoBuy", rating: 5.0, amount: 5000, type: 'buy', bonus: null, time: '11:00' },
];

export const MOCK_MEMBER_LIST: ListItem[] = [
  { id: 201, name: "ShadowHunter", rating: 4.7, amount: 3000, type: 'sell', bonus: null, time: '15:10' },
  { id: 202, name: "NightOwl", rating: 4.5, amount: 1500, type: 'sell', bonus: null, time: '15:05' },
  { id: 203, name: "CryptoKing", rating: 4.9, amount: 8000, type: 'sell', bonus: 'urgent', time: '14:55' },
  { id: 204, name: "CoinMaster", rating: 4.8, amount: 10000, type: 'buy', bonus: null, time: '14:40' },
  { id: 205, name: "SafeTrade01", rating: 4.6, amount: 2000, type: 'buy', bonus: null, time: '14:20' },
  { id: 206, name: "WhaleWatcher", rating: 5.0, amount: 50000, type: 'buy', bonus: 'fast-pay', time: '14:00' },
];

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: 'TX-8821', orderNo: 'ORD-20231129-001', type: 'buy', target: 'merchant', amount: 5000, fee: 0, bonus: 0, status: 'success', date: '2023-11-29 14:30' },
  { id: 'TX-8820', orderNo: 'ORD-20231129-002', type: 'sell', target: 'member', amount: 2000, fee: 10, bonus: 0, status: 'pending', date: '2023-11-29 13:15' },
  { id: 'TX-8819', orderNo: 'ORD-20231128-005', type: 'buy', target: 'platform', amount: 10000, fee: 0, bonus: 50, status: 'cancelled', date: '2023-11-28 09:15' },
  { id: 'TX-8818', orderNo: 'ORD-20231127-012', type: 'sell', target: 'merchant', amount: 50000, fee: 250, bonus: 200, status: 'abnormal', date: '2023-11-27 18:20' },
  { id: 'TX-8817', orderNo: 'ORD-20231126-003', type: 'buy', target: 'member', amount: 3000, fee: 0, bonus: 0, status: 'success', date: '2023-11-26 11:10' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'success', title: { zh: '訂單狀態更新', en: 'Order Updated', vi: 'Cập nhật đơn hàng' }, content: { zh: '您的訂單 #ORD20241119001 已確認付款', en: 'Order #ORD20241119001 payment confirmed.', vi: 'Đơn hàng #ORD20241119001 đã xác nhận thanh toán.' }, time: '1m ago', isRead: false },
  { id: 2, type: 'pending', title: { zh: '匹配成功', en: 'Match Found', vi: 'Khớp lệnh thành công' }, content: { zh: '成功匹配商戶訂單，請準備轉帳', en: 'Merchant matched, please prepare transfer.', vi: 'Đã khớp lệnh với thương nhân, vui lòng chuẩn bị chuyển khoản.' }, time: '4m ago', isRead: false },
  { id: 3, type: 'cancelled', title: { zh: '訂單已取消', en: 'Order Cancelled', vi: 'Đơn hàng đã hủy' }, content: { zh: '您的賣單 #ORD20241118005 因超時已自動取消', en: 'Sell order #ORD20241118005 cancelled due to timeout.', vi: 'Lệnh bán #ORD20241118005 đã bị hủy do quá giờ.' }, time: '2h ago', isRead: true },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: { zh: '系統維護公告', en: 'System Maintenance', vi: 'Thông báo bảo trì' }, time: '2023-11-28', content: { zh: '我們將於 2023-11-30 凌晨 02:00 進行系統升級維護，預計耗時 2 小時。維護期間暫停所有交易服務，請提前做好資金安排。', en: 'System maintenance scheduled for 2023-11-30 02:00 AM.', vi: 'Hệ thống sẽ bảo trì nâng cấp vào 02:00 sáng ngày 30/11/2023.' }, isRead: false },
    { id: 2, title: { zh: '反詐騙提醒', en: 'Security Alert', vi: 'Cảnh báo lừa đảo' }, time: '2023-11-25', content: { zh: '近期詐騙猖獗，請勿相信任何非官方管道的投資訊息。本平台不會要求用戶私下轉帳或提供密碼，請提高警覺。', en: 'Please be aware of phishing scams. Do not trust unofficial channels.', vi: 'Gần đây có nhiều lừa đảo, vui lòng không tin vào các kênh không chính thức.' }, isRead: false },
];

