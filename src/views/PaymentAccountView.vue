<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/profile')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.account.title }}</h2>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div v-if="status === 'pending'" class="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Clock class="text-yellow-500 shrink-0" :size="20" />
        <div>
          <h3 class="text-yellow-500 font-bold text-sm mb-1">{{ t.account.status.pending }}</h3>
          <p class="text-xs text-yellow-500/80">{{ t.account.pendingDesc }}</p>
        </div>
      </div>
      <div class="space-y-6">
        <div v-if="status === 'verified'" class="bg-slate-800 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">{{ t.account.status.verified }}</div>
          <div class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.bankName }}</p>
            <p class="text-white font-bold">China Trust (822)</p>
          </div>
          <div>
            <p class="text-xs text-slate-400 mb-1">{{ t.account.accNo }}</p>
            <p class="text-white font-mono font-bold text-lg">**** **** **** 5610</p>
          </div>
        </div>
        <NeonButton v-if="status !== 'pending'" variant="outline" fullWidth @click="status = 'editing'">
          <Edit3 :size="16" class="mr-2"/> {{ t.account.edit }}
        </NeonButton>
        <div v-if="status === 'editing'" class="animate-in fade-in slide-in-from-bottom duration-300 space-y-4">
          <InputField :icon="FileText" :placeholder="t.account.bankName" v-model="formData.bankName" />
          <InputField :icon="User" :placeholder="t.account.accountName" v-model="formData.accountName" />
          <InputField :icon="FileText" :placeholder="t.account.accNo" v-model="formData.accNo" />
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleUpload('card_front')" 
              :class="`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-800 transition-all ${uploads.card_front ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <span class="text-xs">{{ t.account.cardFront }}</span>
            </button>
            <button 
              @click="handleUpload('card_back')" 
              :class="`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-800 transition-all ${uploads.card_back ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <span class="text-xs">{{ t.account.cardBack }}</span>
            </button>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p class="text-xs text-slate-400 mb-3">{{ t.account.qr }} <span class="text-rose-400">({{ t.account.qrHint }})</span></p>
            <button 
              @click="handleUpload('qr_code')" 
              :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-900 transition-all ${uploads.qr_code ? 'border-emerald-500 text-emerald-400' : 'border-slate-600'}`"
            >
              <Upload class="mb-2" />
              <span class="text-xs">{{ t.common.upload }}</span>
            </button>
          </div>
          <NeonButton fullWidth @click="handleSubmit">{{ t.account.submit }}</NeonButton>
          <button @click="status = 'verified'" class="w-full text-center text-slate-500 text-xs py-2 hover:text-white">{{ t.common.cancel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Clock, Edit3, FileText, Upload, User } from 'lucide-vue-next'
import InputField from '@/components/InputField.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const status = ref('verified')
const formData = ref({
  bankName: '',
  accountName: '',
  accNo: ''
})
const uploads = ref({
  card_front: false,
  card_back: false,
  qr_code: false
})

function handleUpload(id) {
  uploads.value[id] = true
}

function handleSubmit() {
  status.value = 'pending'
}
</script>

