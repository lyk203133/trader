import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/trade-buy',
      name: 'trade-buy',
      component: () => import('@/views/TradeBuyView.vue')
    },
    {
      path: '/trade-sell',
      name: 'trade-sell',
      component: () => import('@/views/TradeSellView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue')
    },
    {
      path: '/transaction-history',
      name: 'transaction-history',
      component: () => import('@/views/TransactionHistoryView.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/NotificationsView.vue')
    },
    {
      path: '/points-mall',
      name: 'points-mall',
      component: () => import('@/views/PointsMallView.vue')
    },
    {
      path: '/my-wallet',
      name: 'my-wallet',
      component: () => import('@/views/MyWalletView.vue')
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import('@/views/WithdrawView.vue')
    },
    {
      path: '/system-announcements',
      name: 'system-announcements',
      component: () => import('@/views/SystemAnnouncementsView.vue')
    },
    {
      path: '/payment-account',
      name: 'payment-account',
      component: () => import('@/views/PaymentAccountView.vue')
    },
    {
      path: '/customer-service',
      name: 'customer-service',
      component: () => import('@/views/CustomerServiceView.vue')
    },
    {
      path: '/referral-center',
      name: 'referral-center',
      component: () => import('@/views/ReferralView.vue')
    },
    {
      path: '/membership',
      name: 'membership',
      component: () => import('@/views/MembershipView.vue')
    },
    {
      path: '/security-center',
      name: 'security-center',
      component: () => import('@/views/SecurityCenterView.vue')
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/ChangePasswordView.vue')
    },
    {
      path: '/change-pin',
      name: 'change-pin',
      component: () => import('@/views/ChangePinView.vue')
    }
  ]
})

export default router

