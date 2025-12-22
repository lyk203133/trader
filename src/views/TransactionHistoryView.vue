<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-20">
      <div class="flex items-center">
        <button @click="$router.push('/profile')" class="p-2 mr-2 hover:bg-slate-700 rounded-full">
          <ArrowLeft class="text-white" :size="20" />
        </button>
        <div>
          <h2 class="text-white font-bold text-lg">{{ t.history.title }}</h2>
        </div>
      </div>
      <button class="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white border border-slate-600">
        <Download :size="14" />
        <span>{{ t.history.export }}</span>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto no-scrollbar">
      <div class="bg-slate-800/50 p-4 grid grid-cols-4 gap-4 border-b border-slate-700">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.count }}</span>
          <span class="text-lg font-mono font-bold text-blue-400">{{ mockTransactions.length }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.points }}</span>
          <span class="text-lg font-mono font-bold text-white">68,000</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.fees }}</span>
          <span class="text-lg font-mono font-bold text-rose-400">260</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.bonus }}</span>
          <span class="text-lg font-mono font-bold text-emerald-400">250</span>
        </div>
      </div>
      
      <div class="p-4">
        <div v-for="tx in mockTransactions" :key="tx.id" class="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700/50">
          <div class="flex justify-between items-start mb-3">
            <div>
              <span class="text-xs font-mono text-emerald-400">{{ tx.id }}</span>
              <p class="text-xs text-slate-500 mt-1">{{ tx.date }}</p>
            </div>
            <span :class="`px-2 py-1 rounded text-xs font-bold ${getStatusColor(tx.status)}`">
              {{ t.history.statuses[tx.status] }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-500">{{ t.common.type }}:</span>
              <span :class="`ml-2 font-bold ${tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`">
                {{ tx.type === 'buy' ? t.history.types.buy : t.history.types.sell }}
              </span>
            </div>
            <div>
              <span class="text-slate-500">{{ t.common.amount }}:</span>
              <span class="ml-2 font-mono font-bold text-white">{{ tx.amount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Download } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const mockTransactions = [
  { id: 'TX-8821', orderNo: 'ORD-20231129-001', type: 'buy', target: 'merchant', amount: 5000, fee: 0, bonus: 0, status: 'success', date: '2023-11-29 14:30' },
  { id: 'TX-8820', orderNo: 'ORD-20231129-002', type: 'sell', target: 'member', amount: 2000, fee: 10, bonus: 0, status: 'pending', date: '2023-11-29 13:15' },
  { id: 'TX-8819', orderNo: 'ORD-20231128-005', type: 'buy', target: 'platform', amount: 10000, fee: 0, bonus: 50, status: 'cancelled', date: '2023-11-28 09:15' },
]

function getStatusColor(status) {
  const colors = {
    success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30',
    pending: 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30',
    cancelled: 'bg-slate-700 text-slate-400 border border-slate-500/30',
    abnormal: 'bg-rose-900/50 text-rose-400 border border-rose-500/30'
  }
  return colors[status] || colors.success
}
</script>

