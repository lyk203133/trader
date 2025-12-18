<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/dashboard')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <h2 class="text-white font-bold text-lg">{{ t.trade.buyTitle }}</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div class="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
        <div class="flex items-center text-rose-400">
          <Clock :size="18" class="mr-2" />
          <span class="text-sm font-bold">{{ t.trade.timeLeft }}</span>
        </div>
        <div class="font-mono text-xl font-bold text-rose-500">{{ formatTime(timeLeft) }}</div>
      </div>
      <p class="text-xs text-center text-slate-500 mb-6">{{ t.trade.tips }}</p>
      <Card class="flex flex-col items-center mb-6">
        <!-- QR Code Section -->
        <div class="w-48 h-48 bg-white p-2 rounded-lg mb-4">
          <div class="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-80">
              <div 
                v-for="i in 36" 
                :key="i" 
                :class="`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`"
              />
            </div>
            <div class="z-10 bg-white p-1 rounded">
              <Wallet class="text-black" />
            </div>
          </div>
        </div>
        
        <div class="w-full space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.bankCode }}</span>
            <span class="text-white font-mono">822</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.bankAcc }}</span>
            <span class="text-white font-mono">1029 3847 5610</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.amount }}</span>
            <span class="text-emerald-400 font-mono font-bold">$ 5,000</span>
          </div>
          <div class="bg-slate-900 p-2 rounded text-center">
            <span class="text-slate-500 text-xs block mb-1">{{ t.trade.memo }}</span>
            <span class="text-rose-500 font-mono font-bold text-lg select-all">TX9988</span>
          </div>
        </div>
      </Card>
      <div class="mb-4">
        <label class="block text-slate-300 text-sm font-bold mb-2">{{ t.trade.uploadReceipt }}</label>
        <button class="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500">
          <Camera class="mb-2" />
          <span class="text-xs">{{ t.trade.uploadHint }}</span>
        </button>
      </div>
      <NeonButton fullWidth @click="handleComplete">{{ t.trade.confirmPaid }}</NeonButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Wallet, Camera } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()

const timeLeft = ref(180)

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function handleComplete() {
  alert(t.value.common.success)
  router.push('/dashboard')
}
</script>

