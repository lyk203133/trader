<template>
  <div class="flex flex-col h-full bg-slate-900">
    <!-- Header -->
    <div class="px-5 pt-5 pb-2 shrink-0 z-10 bg-slate-900/95 backdrop-blur-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3 cursor-pointer" @click="$router.push('/profile')">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-slate-800 border border-emerald-400 p-[2px]">
            <img 
              v-if="userInfo.avatar"
              :src="userInfo.avatar" 
              alt="avatar" 
              class="rounded-full bg-slate-900 w-full h-full object-cover" 
            />
            <img 
              v-else
              :src="defaultAvatar" 
              alt="avatar" 
              class="rounded-full bg-slate-900 w-full h-full" 
            />
          </div>
          <div>
            <h3 class="text-white font-bold text-sm">{{ displayName }}</h3>
            <div class="flex items-center text-[10px] text-emerald-400 bg-emerald-900/30 px-2 rounded-full w-fit mt-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
              {{ userInfo.verified ? 'verified' : t.common.unverified }}
            </div>
          </div>
        </div>
        <div @click="$router.push('/notifications')" class="relative p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
          <Bell :size="20" class="text-slate-300" />
          <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto px-5 pb-5 scroll-smooth no-scrollbar">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-8 text-center">
        <div class="text-rose-500 mb-3">{{ error }}</div>
        <NeonButton variant="outline" @click="fetchDashboardData">
          <RefreshCw :size="14" class="mr-2" />
          {{ t.common.retry }}
        </NeonButton>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Balance Cards -->
        <div class="grid grid-cols-3 gap-3 mb-6 mt-2">
          <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.avail }}</p>
            <h3 class="text-lg font-mono font-bold text-blue-400 mb-2 tracking-tight">
              {{ dashboardData.assetBalance?.toLocaleString() || '0' }}
            </h3>
            <div class="flex items-center text-[10px] text-slate-500">
              <Coins :size="10" class="mr-1 text-yellow-500" />
              {{ t.common.points }}
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.todayBuy }}</p>
            <h3 class="text-lg font-mono font-bold text-emerald-500 mb-2 tracking-tight">
              +{{ dashboardData.todayStats?.buy?.toLocaleString() || '0' }}
            </h3>
            <div class="flex items-center text-[10px] text-emerald-500/80">
              <TrendingUp :size="10" class="mr-1" />
              {{ dashboardData.todayStats?.buyRate || '0%' }}
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
            <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.todaySell }}</p>
            <h3 class="text-lg font-mono font-bold text-rose-500 mb-2 tracking-tight">
              -{{ dashboardData.todayStats?.sell?.toLocaleString() || '0' }}
            </h3>
            <div class="flex items-center text-[10px] text-rose-400/80">
              <TrendingDown :size="10" class="mr-1" />
              {{ dashboardData.todayStats?.sellStatus || '正常' }}
            </div>
          </div>
        </div>

        <!-- Tabs: Platform / Merchant / Member -->
        <div class="mb-4">
          <div class="flex p-1 bg-slate-800 rounded-lg">
            <button 
              v-for="tab in ['platform', 'merchant', 'member']" 
              :key="tab"
              @click="handleTabChange(tab)"
              :class="`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`"
            >
              {{ t.dashboard.tabs[tab] }}
            </button>
          </div>
        </div>

        <!-- Filter & Sort -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex gap-3 text-xs font-bold">
            <button 
              v-for="type in ['all', 'buy', 'sell']" 
              :key="type"
              @click="filterType = type"
              :class="`pb-1 border-b-2 transition-colors ${filterType === type ? 'text-emerald-400 border-emerald-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`"
            >
              {{ type === 'all' ? t.common.all : (type === 'buy' ? t.dashboard.filter.buy : t.dashboard.filter.sell) }}
            </button>
          </div>
          <div class="flex bg-slate-800 rounded-md p-0.5">
            <button 
              @click="handleSort('amount')" 
              :class="`p-1.5 rounded flex items-center gap-1 ${sortType === 'amount' ? 'bg-slate-700 text-white' : 'text-slate-500'}`" 
              :title="t.dashboard.sort.amount"
            >
              <ArrowUpDown :size="14" />
              <span v-if="sortType === 'amount'" class="text-[10px] font-mono">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </button>
            <button 
              @click="handleSort('time')" 
              :class="`p-1.5 rounded flex items-center gap-1 ${sortType === 'time' ? 'bg-slate-700 text-white' : 'text-slate-500'}`" 
              :title="t.dashboard.sort.time"
            >
              <Clock :size="14" />
              <span v-if="sortType === 'time'" class="text-[10px] font-mono">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </button>
          </div>
        </div>

        <!-- Trading List -->
        <div class="space-y-3 min-h-[300px]">
          <!-- Loading for trading list -->
          <div v-if="tradingLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="bg-slate-800 rounded-lg p-3 animate-pulse">
              <div class="flex justify-between items-center">
                <div class="space-y-2">
                  <div class="h-4 bg-slate-700 rounded w-24"></div>
                  <div class="h-6 bg-slate-700 rounded w-16"></div>
                </div>
                <div class="h-9 w-20 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="processedList.length === 0" class="text-center py-12">
            <div class="text-slate-500 mb-2">{{ t.dashboard.noData }}</div>
            <NeonButton variant="outline" size="sm" @click="fetchTradingList">
              <RefreshCw :size="12" class="mr-1" />
              {{ t.common.refresh }}
            </NeonButton>
          </div>

          <!-- Trading Items -->
          <Card 
            v-for="item in processedList" 
            :key="item.id" 
            class="flex justify-between items-center p-3 relative overflow-hidden group"
          >
            <div :class="`absolute left-0 top-0 bottom-0 w-1 ${item.type === 'sell' ? 'bg-emerald-500' : 'bg-rose-500'}`"></div>
            <div class="flex flex-col gap-1 pl-2">
              <div class="flex items-center gap-2">
                <span class="text-white font-bold text-sm">{{ item.name }}</span>
                <div class="flex text-yellow-500 text-[10px]">★ {{ item.rating }}</div>
                <span class="text-[10px] text-slate-500 font-mono ml-1">{{ item.time }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-xl font-mono font-bold text-white tracking-tighter">{{ item.amount.toLocaleString() }}</span>
                <span class="text-xs text-slate-500 ml-1 mt-2">P</span>
              </div>
              <div v-if="item.bonus" class="flex mt-1">
                <span class="text-[10px] px-2 py-0.5 rounded border bg-rose-900/50 text-rose-400 border-rose-500/30 ml-2 animate-pulse">
                  ⚡️{{ getBadgeText(item.bonus) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <NeonButton 
                v-if="item.type === 'sell'"
                variant="primary" 
                class="w-20 h-9 text-xs" 
                @click="handleBuy(item)"
                :loading="buyLoading && selectedItemId === item.id"
              >
                {{ t.dashboard.actions.buy }}
              </NeonButton>
              <template v-else>
                <NeonButton 
                  variant="danger" 
                  class="w-20 h-9 text-xs" 
                  @click="handleSell(item)"
                  :disabled="!canAfford(item)"
                  :loading="sellLoading && selectedItemId === item.id"
                >
                  {{ t.dashboard.actions.sell }}
                </NeonButton>
                <span v-if="!canAfford(item)" class="text-[10px] text-rose-500">
                  {{ t.dashboard.actions.need }} {{ item.amount.toLocaleString() }}
                </span>
              </template>
            </div>
          </Card>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 mb-6 pt-6 border-t border-slate-800">
          <p class="text-white text-xs font-bold mb-3 flex items-center">
            <span class="w-1 h-3 bg-emerald-500 mr-2 rounded-full"></span>
            {{ t.dashboard.quickActions }}
          </p>
          <div class="grid grid-cols-4 gap-2">
            <button @click="$router.push('/points-mall')" class="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <ShoppingBag :size="20" class="text-emerald-400 mb-1" />
              <span class="text-[10px] text-slate-300">{{ t.dashboard.qa.mall }}</span>
            </button>
            <button @click="$router.push('/my-wallet')" class="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Wallet :size="20" class="text-yellow-400 mb-1" />
              <span class="text-[10px] text-slate-300">{{ t.dashboard.qa.wallet }}</span>
            </button>
            <button @click="$router.push('/profile')" class="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Settings :size="20" class="text-blue-400 mb-1" />
              <span class="text-[10px] text-slate-300">{{ t.dashboard.qa.settings }}</span>
            </button>
            <button @click="$router.push('/system-announcements')" class="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg">
              <Megaphone :size="20" class="text-rose-400 mb-1" />
              <span class="text-[10px] text-slate-300">{{ t.dashboard.qa.announce }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Bell, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Wallet, 
  Settings, 
  Megaphone, 
  ArrowUpDown, 
  Clock,
  RefreshCw
} from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { api, post } from '@/utils/api'
import { showToast } from '@/utils/notification'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useTranslation()

// State
const activeTab = ref('merchant')
const filterType = ref('all')
const sortType = ref('time')
const sortDirection = ref('desc')
const loading = ref(false)
const error = ref('')
const dashboardData = ref({})
const tradingList = ref([])
const tradingLoading = ref(false)
const buyLoading = ref(false)
const sellLoading = ref(false)
const selectedItemId = ref(null)
const unreadNotifications = ref(0)

// Computed
const userInfo = computed(() => {
  return authStore.user || {}
})

const displayName = computed(() => {
  return userInfo.value.nickname || 
         userInfo.value.username || 
         userInfo.value.name || 
         t.profile.defaultName
})

const defaultAvatar = computed(() => {
  const seed = userInfo.value.username || 
              userInfo.value.nickname || 
              userInfo.value.userId || 
              'User'
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
})

const processedList = computed(() => {
  let list = tradingList.value

  // Filter by type
  if (filterType.value === 'buy') {
    list = list.filter(item => item.type === 'sell')
  } else if (filterType.value === 'sell') {
    list = list.filter(item => item.type === 'buy')
  }

  // Sort
  list.sort((a, b) => {
    let diff = 0
    if (sortType.value === 'amount') {
      diff = a.amount - b.amount
    } else {
      diff = a.time.localeCompare(b.time)
    }
    return sortDirection.value === 'asc' ? diff : -diff
  })

  return list
})

// Methods
function canAfford(item) {
  return item.type === 'buy' ? dashboardData.value.assetBalance >= item.amount : true
}

function getBadgeText(bonus) {
  if (!bonus) return null
  if (bonus === 'flash') return t.dashboard.badges.flash
  if (bonus === 'bonus') return t.dashboard.badges.bonus
  if (bonus === 'fast') return t.dashboard.badges.fast
  if (bonus === 'official') return t.dashboard.badges.official
  if (bonus === 'fee-free') return t.dashboard.badges.feeFree
  if (bonus === 'urgent') return t.dashboard.badges.urgent
  if (bonus === 'fast-pay') return t.dashboard.badges.fastPay
  return bonus
}

async function fetchDashboardData() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/dashboard')
    
    if (response.data.success) {
      dashboardData.value = response.data.data
      unreadNotifications.value = response.data.data.unreadNotifications || 0
    } else {
      error.value = response.data.message || t.common.requestFailed
    }
  } catch (err) {
    console.error('Dashboard data fetch error:', err)
    error.value = err.response?.data?.message || err.message || t.common.networkError
    
    // 如果 token 失效，清除登录状态
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

async function fetchTradingList() {
  tradingLoading.value = true

  try {
    const response = await api.get('/trading/list', {
      params: {
        type: activeTab.value
      }
    })
    
    if (response.data.success) {
      tradingList.value = response.data.data
    } else {
      showToast({
        type: 'error',
        title: t.dashboard.fetchFailed,
        message: response.data.message || t.common.requestFailed
      })
    }
  } catch (err) {
    console.error('Trading list fetch error:', err)
    showToast({
      type: 'error',
      title: t.dashboard.fetchFailed,
      message: err.message || t.common.networkError
    })
  } finally {
    tradingLoading.value = false
  }
}

async function handleBuy(item) {
  if (buyLoading.value) return
  
  selectedItemId.value = item.id
  buyLoading.value = true

  try {
    const response = await post('/trading/buy', {
      itemId: item.id,
      amount: item.amount
    })
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.dashboard.buySuccess,
        message: t.dashboard.buySuccessMessage
      })
      
      // 刷新数据
      fetchDashboardData()
      fetchTradingList()
      
      // 跳转到交易页面
      router.push({
        name: 'trade-buy',
        params: { item: JSON.stringify(item) }
      })
    } else {
      showToast({
        type: 'error',
        title: t.dashboard.buyFailed,
        message: response.data.message || t.common.requestFailed
      })
    }
  } catch (err) {
    console.error('Buy error:', err)
    showToast({
      type: 'error',
      title: t.dashboard.buyFailed,
      message: err.message || t.common.networkError
    })
  } finally {
    buyLoading.value = false
    selectedItemId.value = null
  }
}

async function handleSell(item) {
  if (sellLoading.value || !canAfford(item)) return
  
  selectedItemId.value = item.id
  sellLoading.value = true

  try {
    const response = await post('/trading/sell', {
      itemId: item.id,
      amount: item.amount
    })
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.dashboard.sellSuccess,
        message: t.dashboard.sellSuccessMessage
      })
      
      // 刷新数据
      fetchDashboardData()
      fetchTradingList()
      
      // 跳转到交易页面
      router.push({
        name: 'trade-sell',
        params: { item: JSON.stringify(item) }
      })
    } else {
      showToast({
        type: 'error',
        title: t.dashboard.sellFailed,
        message: response.data.message || t.common.requestFailed
      })
    }
  } catch (err) {
    console.error('Sell error:', err)
    showToast({
      type: 'error',
      title: t.dashboard.sellFailed,
      message: err.message || t.common.networkError
    })
  } finally {
    sellLoading.value = false
    selectedItemId.value = null
  }
}

function handleTabChange(tab) {
  activeTab.value = tab
  filterType.value = 'all'
  fetchTradingList()
}

function handleSort(type) {
  if (sortType.value === type) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortType.value = type
    sortDirection.value = 'desc'
  }
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  fetchDashboardData()
  fetchTradingList()
})

// Watch for tab changes
watch(activeTab, () => {
  fetchTradingList()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>