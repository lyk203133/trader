<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/my-wallet')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.wallet.withdrawTitle }}</h2>
        <p class="text-xs text-slate-400">{{ t.wallet.withdrawDesc }}</p>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-slate-400 text-xs font-bold">{{ t.wallet.inputAmount }}</label>
          <input 
            type="number" 
            :placeholder="t.wallet.inputAmount" 
            class="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 text-white text-lg font-mono" 
            v-model="amount"
          />
          <p class="text-xs text-slate-500 px-1">
            {{ t.dashboard.avail }}：<span class="text-blue-400 font-mono">{{ store.assetBalance.toLocaleString() }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button 
            v-for="(val, idx) in quickAmounts" 
            :key="idx" 
            @click="amount = val" 
            class="flex-1 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 text-xs font-bold hover:border-blue-500"
          >
            {{ idx === 2 ? 'All' : val }}
          </button>
        </div>
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <p class="font-bold text-slate-300 mb-2">說明：</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>{{ t.wallet.minWithdraw }}</li>
            <li>{{ t.wallet.withdrawRate }}</li>
            <li>{{ t.wallet.withdrawTime }}</li>
            <li>{{ t.wallet.withdrawFee }}</li>
          </ul>
        </div>
        <div class="pt-4">
          <NeonButton variant="blue" fullWidth @click="handleWithdraw">{{ t.wallet.confirmWithdraw }}</NeonButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const { t } = useTranslation()
const store = useAppStore()

const amount = ref('')

const quickAmounts = computed(() => [10000, 50000, store.assetBalance])

function handleWithdraw() {
  alert(t.value.common.success)
  router.push('/my-wallet')
}
</script>

