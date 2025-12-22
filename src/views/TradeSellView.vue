<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg">
      <button @click="$router.push('/dashboard')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <h2 class="text-rose-400 font-bold text-lg">{{ t.trade.sellTitle }}</h2>
    </div>
    <div class="flex-1 p-6 flex flex-col items-center justify-center">
      <div class="text-center w-full max-w-xs">
        <div class="w-24 h-24 mx-auto mb-6 relative">
          <div class="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
        <h3 class="text-white font-bold text-xl mb-2">{{ t.trade.waitingMerchant }}</h3>
        <p class="text-slate-400 text-sm mb-6">{{ t.trade.lockSuccess }}</p>
        <NeonButton fullWidth @click="$router.push('/dashboard')">{{ t.trade.backHome }}</NeonButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script>

