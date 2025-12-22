<template>
  <div class="flex flex-col h-full bg-slate-900">
    <!-- Header -->
    <div class="px-5 pt-5 pb-2 shrink-0 z-10 bg-slate-900/95 backdrop-blur-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3" @click="$router.push('/profile')">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-slate-800 border border-emerald-400 p-[2px]">
            <img 
              v-if="store.userInfo.avatar"
              :src="store.userInfo.avatar" 
              alt="avatar" 
              class="rounded-full bg-slate-900 w-full h-full object-cover" 
            />
            <img 
              v-else
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="avatar" 
              class="rounded-full bg-slate-900 w-full h-full" 
            />
          </div>
          <div>
            <h3 class="text-white font-bold text-sm">{{ store.userInfo.nickname }}</h3>
            <div class="flex items-center text-[10px] text-emerald-400 bg-emerald-900/30 px-2 rounded-full w-fit mt-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>verified
            </div>
          </div>
        </div>
        <div @click="$router.push('/notifications')" class="relative p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
          <Bell :size="20" class="text-slate-300" />
          <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto px-5 pb-5 scroll-smooth no-scrollbar">
      <!-- Balance Cards -->
      <div class="grid grid-cols-3 gap-3 mb-6 mt-2">
        <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
          <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.avail }}</p>
          <h3 class="text-lg font-mono font-bold text-blue-400 mb-2 tracking-tight">{{ store.assetBalance.toLocaleString() }}</h3>
          <div class="flex items-center text-[10px] text-slate-500">
            <Coins :size="10" class="mr-1 text-yellow-500" />{{ t.common.points }}
          </div>
        </div>
        <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
          <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.todayBuy }}</p>
          <h3 class="text-lg font-mono font-bold text-emerald-500 mb-2 tracking-tight">+{{ store.todayStats.buy.toLocaleString() }}</h3>
          <div class="flex items-center text-[10px] text-emerald-500/80">
            <TrendingUp :size="10" class="mr-1" />{{ store.todayStats.buyRate }}
          </div>
        </div>
        <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-lg relative overflow-hidden group">
          <p class="text-slate-400 text-[10px] font-bold mb-1">{{ t.dashboard.todaySell }}</p>
          <h3 class="text-lg font-mono font-bold text-rose-500 mb-2 tracking-tight">-{{ store.todayStats.sell.toLocaleString() }}</h3>
          <div class="flex items-center text-[10px] text-rose-400/80">
            <TrendingDown :size="10" class="mr-1" />{{ store.todayStats.sellStatus }}
          </div>
        </div>
      </div>

      <!-- Tabs: Platform / Merchant / Member -->
      <div class="mb-4">
        <div class="flex p-1 bg-slate-800 rounded-lg">
          <button 
            v-for="tab in ['platform', 'merchant', 'member']" 
            :key="tab"
            @click="activeTab = tab; filterType = 'all'"
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
            title="按金額排序"
          >
            <ArrowUpDown :size="14" />
            <span v-if="sortType === 'amount'" class="text-[10px] font-mono">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </button>
          <button 
            @click="handleSort('time')" 
            :class="`p-1.5 rounded flex items-center gap-1 ${sortType === 'time' ? 'bg-slate-700 text-white' : 'text-slate-500'}`" 
            title="按時間排序"
          >
            <Clock :size="14" />
            <span v-if="sortType === 'time'" class="text-[10px] font-mono">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </button>
        </div>
      </div>

      <!-- Trading List -->
      <div class="space-y-3 min-h-[300px]">
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
              <span class="text-[10px] px-2 py-0.5 rounded border bg-rose-900/50 text-rose-400 border-rose-500/30 ml-2 animate-pulse">⚡️{{ getBadgeText(item.bonus) }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <NeonButton 
              v-if="item.type === 'sell'"
              variant="primary" 
              class="w-20 h-9 text-xs" 
              @click="$router.push({ name: 'trade-buy', params: { item } })"
            >
              {{ t.dashboard.actions.buy }}
            </NeonButton>
            <template v-else>
              <NeonButton 
                variant="danger" 
                class="w-20 h-9 text-xs" 
                @click="$router.push({ name: 'trade-sell', params: { item } })"
                :disabled="!canAfford(item)"
              >
                {{ t.dashboard.actions.sell }}
              </NeonButton>
              <span v-if="!canAfford(item)" class="text-[10px] text-rose-500">{{ t.dashboard.actions.need }} {{ item.amount.toLocaleString() }}</span>
            </template>
          </div>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 mb-6 pt-6 border-t border-slate-800">
        <p class="text-white text-xs font-bold mb-3 flex items-center">
          <span class="w-1 h-3 bg-emerald-500 mr-2 rounded-full"></span>{{ t.dashboard.quickActions }}
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell, Coins, TrendingUp, TrendingDown, ShoppingBag, Wallet, Settings, Megaphone, ArrowUpDown, Clock } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAppStore } from '@/stores/app'

const { t, lang } = useTranslation()
const store = useAppStore()

// State
const activeTab = ref('merchant')
const filterType = ref('all')
const sortType = ref('time')
const sortDirection = ref('desc')

// Mock data
const MOCK_MERCHANT_LIST = [
  { id: 1, name: "Thunder Corp", rating: 4.9, amount: 5000, type: 'sell', bonus: 'flash', time: '14:30' },
  { id: 2, name: "SpeedyEx", rating: 4.8, amount: 50000, type: 'buy', bonus: 'bonus', time: '14:28' },
  { id: 3, name: "Alpha Team", rating: 5.0, amount: 2000, type: 'sell', bonus: null, time: '14:25' },
  { id: 4, name: "GoldRush", rating: 4.7, amount: 15000, type: 'sell', bonus: null, time: '14:10' },
  { id: 5, name: "SafeHaven", rating: 4.9, amount: 8000, type: 'buy', bonus: null, time: '13:55' },
  { id: 6, name: "QuickPay", rating: 4.6, amount: 3000, type: 'buy', bonus: 'fast', time: '13:40' },
]

const MOCK_PLATFORM_LIST = [
  { id: 101, name: "Official", rating: 5.0, amount: 10000, type: 'sell', bonus: 'official', time: '09:00' },
  { id: 102, name: "System A", rating: 5.0, amount: 5000, type: 'sell', bonus: null, time: '09:05' },
  { id: 103, name: "FastLane", rating: 5.0, amount: 1000, type: 'sell', bonus: null, time: '09:10' },
  { id: 104, name: "BuyBack", rating: 5.0, amount: 20000, type: 'buy', bonus: 'fee-free', time: '10:00' },
  { id: 105, name: "Settlement", rating: 5.0, amount: 100000, type: 'buy', bonus: null, time: '10:30' },
  { id: 106, name: "AutoBuy", rating: 5.0, amount: 5000, type: 'buy', bonus: null, time: '11:00' },
]

const MOCK_MEMBER_LIST = [
  { id: 201, name: "ShadowHunter", rating: 4.7, amount: 3000, type: 'sell', bonus: null, time: '15:10' },
  { id: 202, name: "NightOwl", rating: 4.5, amount: 1500, type: 'sell', bonus: null, time: '15:05' },
  { id: 203, name: "CryptoKing", rating: 4.9, amount: 8000, type: 'sell', bonus: 'urgent', time: '14:55' },
  { id: 204, name: "CoinMaster", rating: 4.8, amount: 10000, type: 'buy', bonus: null, time: '14:40' },
  { id: 205, name: "SafeTrade01", rating: 4.6, amount: 2000, type: 'buy', bonus: null, time: '14:20' },
  { id: 206, name: "WhaleWatcher", rating: 5.0, amount: 50000, type: 'buy', bonus: 'fast-pay', time: '14:00' },
]

// Computed
const processedList = computed(() => {
  let list = []
  switch(activeTab.value) {
    case 'platform': list = [...MOCK_PLATFORM_LIST]; break;
    case 'member': list = [...MOCK_MEMBER_LIST]; break;
    default: list = [...MOCK_MERCHANT_LIST]; break;
  }

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
function handleSort(type) {
  if (sortType.value === type) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortType.value = type
    sortDirection.value = 'desc'
  }
}

function canAfford(item) {
  return item.type === 'buy' ? store.assetBalance >= item.amount : true
}

function getBadgeText(bonus) {
  if (!bonus) return null
  if (lang.value === 'zh-TW') return '限時回饋'
  if (lang.value === 'vi-VN') return 'Khuyến mãi'
  return 'Flash Bonus'
}
</script>

