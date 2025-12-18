import { useState } from 'react';
import { TRANSLATIONS } from './constants/translations';
import { ViewName, UserInfo, Language } from './types';

// Import all views
import {
  LoginView,
  ForgotPasswordView,
  RegisterView,
  DashboardView,
  ProfileView,
  TradeBuyView,
  TradeSellView,
  TransactionHistoryView,
  NotificationsView,
  PointsMallView,
  MyWalletView,
  WithdrawView,
  SystemAnnouncementsView,
  PaymentAccountView,
  CustomerServiceView,
  ReferralView,
  MembershipView,
  SecurityCenterView,
  ChangePasswordView,
  ChangePinView,
} from './views';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>('login'); 
  const [navData, setNavData] = useState<any>(null); 
  const [lang, setLang] = useState<Language>('zh-TW');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: 'Player_99',
    avatar: null
  });

  const navigate = (view: ViewName, data: any = null) => {
    setNavData(data);
    setCurrentView(view);
  };

  const t = TRANSLATIONS[lang];
  const viewProps = { navigate, t, lang, setLang, userInfo, setUserInfo, data: navData };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginView {...viewProps} />;
      case 'forgot-password':
        return <ForgotPasswordView {...viewProps} />;
      case 'register':
        return <RegisterView {...viewProps} />;
      case 'dashboard':
        return <DashboardView {...viewProps} />;
      case 'profile':
        return <ProfileView {...viewProps} />;
      case 'trade-buy':
        return <TradeBuyView {...viewProps} />;
      case 'trade-sell':
        return <TradeSellView {...viewProps} />;
      case 'transaction-history':
        return <TransactionHistoryView {...viewProps} />;
      case 'notifications':
        return <NotificationsView {...viewProps} />;
      case 'points-mall':
        return <PointsMallView {...viewProps} />;
      case 'my-wallet':
        return <MyWalletView {...viewProps} />;
      case 'withdraw':
        return <WithdrawView {...viewProps} />;
      case 'system-announcements':
        return <SystemAnnouncementsView {...viewProps} />;
      case 'payment-account':
        return <PaymentAccountView {...viewProps} />;
      case 'customer-service':
        return <CustomerServiceView {...viewProps} />;
      case 'referral-center':
        return <ReferralView {...viewProps} />;
      case 'membership':
        return <MembershipView {...viewProps} />;
      case 'security-center':
        return <SecurityCenterView {...viewProps} />;
      case 'change-password':
        return <ChangePasswordView {...viewProps} />;
      case 'change-pin':
        return <ChangePinView {...viewProps} />;
      default:
        return <LoginView {...viewProps} />;
    }
  };

  return (
    <div 
      className="w-full h-[100dvh] bg-black text-slate-200 font-sans flex items-center justify-center bg-fixed overflow-hidden"
      style={{ backgroundImage: `radial-gradient(circle at 50% 120%, #1e293b 10%, #000000 80%)` }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="w-full h-full md:w-[400px] md:h-[92vh] md:max-h-[920px] md:rounded-[3rem] md:border-[8px] md:border-slate-800 bg-slate-900 overflow-hidden relative shadow-2xl flex flex-col transition-all duration-300">
        {renderView()}
      </div>
    </div>
  );
}
