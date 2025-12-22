<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/profile')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.referral.title }}</h2>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div class="bg-gradient-to-br from-emerald-600 to-slate-800 rounded-2xl p-6 text-center shadow-lg mb-6 relative overflow-hidden">
        <div class="relative z-10">
          <p class="text-emerald-100 text-xs font-bold mb-2">{{ t.referral.myCode }}</p>
          <h1 class="text-4xl font-mono font-bold text-white mb-4 tracking-widest">NEX888</h1>
          <button @click="handleCopy" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm transition-all flex items-center justify-center mx-auto">
            <Share2 :size="14" class="mr-2"/> {{ t.referral.shareLink }}
          </button>
        </div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
          <p class="text-slate-400 text-xs mb-1">{{ t.referral.invitedCount }}</p>
          <h3 class="text-2xl font-bold text-white">12</h3>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
          <p class="text-slate-400 text-xs mb-1">{{ t.referral.totalEarned }}</p>
          <h3 class="text-2xl font-bold text-emerald-400">1,200</h3>
        </div>
      </div>

      <div class="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/20 mb-6">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
            <Info :size="20" />
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">{{ t.referral.tips }}</p>
        </div>
      </div>

      <div>
        <h3 class="text-white font-bold text-sm mb-3 flex items-center">
          <Users :size="16" class="mr-2 text-slate-400"/> {{ t.referral.history }}
        </h3>
        <div class="space-y-2">
          <div 
            v-for="ref in mockReferrals" 
            :key="ref.id" 
            class="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700/50"
          >
            <div>
              <p class="text-white font-bold text-sm">{{ ref.name }}</p>
              <p class="text-[10px] text-slate-500">{{ ref.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-emerald-400 font-bold text-sm">+{{ ref.reward }}</p>
              <p class="text-[10px] text-slate-500">{{ t.referral.reward }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Share2, Info, Users } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const mockReferrals = [
  { id: 1, name: "User_9982", date: "2023-11-28", reward: 100 },
  { id: 2, name: "Crypto_Fan", date: "2023-11-25", reward: 100 },
  { id: 3, name: "Trader_X", date: "2023-11-20", reward: 100 },
]

function handleCopy() {
  alert(t.value.referral.copySuccess)
}
</script>

