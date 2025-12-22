<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/dashboard')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.wallet.title }}</h2>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <p class="text-slate-400 text-xs font-bold mb-1">{{ t.dashboard.avail }}</p>
          <h3 class="text-2xl font-mono font-bold text-blue-400 mb-2">{{ store.assetBalance.toLocaleString() }}</h3>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <p class="text-slate-400 text-xs font-bold mb-1">{{ t.dashboard.frozen }}</p>
          <h3 class="text-2xl font-mono font-bold text-white mb-2">{{ store.frozenBalance.toLocaleString() }}</h3>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <p class="text-slate-400 text-xs font-bold mb-1">{{ t.dashboard.assets }}</p>
          <h3 class="text-2xl font-mono font-bold text-white mb-2">{{ store.totalAssets.toLocaleString() }}</h3>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <span class="text-xs text-slate-400">{{ t.wallet.totalDeposit }}</span><br/>
          <span class="text-lg font-mono font-bold text-emerald-400">+{{ store.walletStats.totalDeposit.toLocaleString() }}</span>
        </div>
        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <span class="text-xs text-slate-400">{{ t.wallet.totalWithdraw }}</span><br/>
          <span class="text-lg font-mono font-bold text-rose-400">{{ store.walletStats.totalWithdraw }}</span>
        </div>
        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700 col-span-2 flex justify-between items-center">
          <span class="text-xs text-slate-400">{{ t.wallet.totalFees }}</span>
          <span class="text-lg font-mono font-bold text-white">{{ store.walletStats.totalFees }}</span>
        </div>
      </div>
      <div class="space-y-3">
        <button @click="$router.push('/withdraw')" class="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 transition-all">
          <ArrowUpRight :size="20" /> {{ t.wallet.withdraw }}
        </button>
        <button @click="$router.push('/points-mall')" class="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 font-bold flex items-center justify-center gap-2 transition-all">
          <ArrowDownLeft :size="20" class="text-emerald-400" /> {{ t.wallet.deposit }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'
import { useAppStore } from '@/stores/app'

const { t } = useTranslation()
const store = useAppStore()
</script>

