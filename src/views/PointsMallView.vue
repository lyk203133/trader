<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="handleBack" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.mall.title }}</h2>
        <p class="text-xs text-slate-400">{{ t.mall.desc }}</p>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div v-if="step === 1" class="space-y-6 animate-in fade-in slide-in-from-right">
        <Card class="p-6 space-y-4">
          <label class="block text-sm font-bold text-slate-300 mb-1">{{ t.mall.inputLabel }}</label>
          <input 
            type="number" 
            class="bg-slate-900 border border-slate-700 text-white text-lg font-mono rounded-lg block w-full p-3" 
            placeholder="10000" 
            v-model="amount"
          />
          <div class="grid grid-cols-3 gap-3 pt-2">
            <button 
              v-for="val in quickAmounts" 
              :key="val" 
              @click="amount = val" 
              class="py-2 px-1 text-xs font-bold rounded border bg-slate-800 text-slate-400 border-slate-600 hover:border-emerald-500"
            >
              {{ (val / 10000) }}W
            </button>
          </div>
        </Card>
        
        <!-- Optional Memo Field -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-slate-300 mb-1">{{ t.mall.memoLabel }}</label>
          <textarea 
            class="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white outline-none focus:border-emerald-500 h-24 resize-none transition-all" 
            :placeholder="t.mall.memoPlaceholder" 
            v-model="memo"
          ></textarea>
        </div>

        <div class="flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span class="text-sm text-slate-400">{{ t.mall.estPay }} (TWD)</span>
          <span class="text-xl font-mono font-bold text-white">$ {{ amount ? parseInt(amount).toLocaleString() : 0 }}</span>
        </div>
        <NeonButton fullWidth @click="handleApply">{{ t.mall.genQR }}</NeonButton>
      </div>

      <div v-else class="animate-in fade-in slide-in-from-right">
        <div class="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
          <div class="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
            <span class="text-xs text-slate-400">訂單編號</span>
            <span class="text-xs font-mono text-white">{{ orderId }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-slate-400">購買對象</span>
            <span class="text-xs font-bold text-emerald-400">官方平台</span>
          </div>
          <div v-if="memo" class="flex justify-between items-start pt-2 border-t border-slate-700/50">
            <span class="text-xs text-slate-400 shrink-0">{{ t.mall.memoLabel }}</span>
            <span class="text-xs text-slate-300 text-right italic ml-4 break-all">"{{ memo }}"</span>
          </div>
        </div>
        <div class="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
          <div class="flex items-center text-rose-400">
            <Clock :size="18" class="mr-2" />
            <span class="text-sm font-bold">{{ t.trade.timeLeft }}</span>
          </div>
          <div class="font-mono text-xl font-bold text-rose-500">{{ formatTime(timeLeft) }}</div>
        </div>
        <Card class="flex flex-col items-center mb-6">
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
              <span class="text-emerald-400 font-mono font-bold">$ {{ parseInt(amount).toLocaleString() }}</span>
            </div>
            <div class="bg-slate-900 p-2 rounded text-center border border-rose-900/30">
              <span class="text-slate-500 text-[10px] block mb-1">付款備註/附言 (請務必填寫)</span>
              <span class="text-rose-500 font-mono font-bold text-lg select-all">TX9988</span>
            </div>
          </div>
        </Card>
        <div class="mb-8">
          <label class="block text-slate-300 text-sm font-bold mb-2">{{ t.trade.uploadReceipt }}</label>
          <button 
            @click="uploaded = true" 
            :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 ${uploaded ? 'border-emerald-500' : 'border-slate-600'}`"
          >
            <Camera class="mb-2" />
            <span class="text-xs">{{ t.trade.uploadHint }}</span>
          </button>
        </div>
        <NeonButton fullWidth :disabled="!uploaded" @click="$router.push('/dashboard')">{{ t.trade.confirmPaid }}</NeonButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Wallet, Camera } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()

const step = ref(1)
const amount = ref('')
const memo = ref('')
const timeLeft = ref(180)
const uploaded = ref(false)
const orderId = ref('')

const quickAmounts = [50000, 100000, 200000]

let timer = null

onMounted(() => {
  // Timer will start when step 2 begins
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function handleApply() {
  if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
    return alert('Invalid Amount')
  }
  const now = new Date()
  orderId.value = `ORD-${now.toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`
  step.value = 2
  
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

function handleBack() {
  if (step.value === 1) {
    router.push('/dashboard')
  } else {
    step.value = 1
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

