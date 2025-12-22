<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 border-b border-slate-800 flex items-center">
      <button @click="handleBack" class="p-2">
        <ArrowLeft class="text-slate-300" />
      </button>
      <span class="ml-2 font-bold text-white">{{ step === 1 ? t.register.title : t.register.kycTitle }}</span>
    </div>
    <div class="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
      <div v-if="step === 1" class="space-y-4 animate-in fade-in slide-in-from-right duration-300">
        <InputField :icon="User" :label="t.register.accLabel" v-model="formData.account" />
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :label="t.register.passLabel" 
          v-model="formData.password"
        />
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :label="t.register.passConfirmLabel" 
          v-model="formData.confirmPassword"
        />
        
        <!-- Phone & SMS Section -->
        <div>
          <label class="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{{ t.register.phoneLabel }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smartphone class="h-5 w-5 text-emerald-500" />
            </div>
            <input 
              type="tel" 
              v-model="formData.phone" 
              class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
            />
          </div>
        </div>

        <div>
          <label class="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{{ t.register.smsLabel }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-emerald-500" />
              </div>
              <input 
                type="text" 
                v-model="formData.smsCode" 
                class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
              />
            </div>
            <button 
              @click="handleGetSms" 
              :disabled="countdown > 0" 
              :class="`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${countdown > 0 ? 'bg-slate-700 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`"
            >
              {{ countdown > 0 ? `${countdown} ${t.register.resendSms}` : t.register.getSms }}
            </button>
          </div>
        </div>

        <!-- Captcha Section -->
        <div>
          <label class="block text-slate-400 text-xs mb-1 uppercase tracking-wider">{{ t.register.captchaLabel }}</label>
          <div class="flex gap-2 items-center">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield class="h-5 w-5 text-emerald-500" />
              </div>
              <input 
                type="text" 
                v-model="captchaInput" 
                :placeholder="t.register.captchaPlaceholder" 
                class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 placeholder-slate-500 transition-colors" 
              />
            </div>
            <div 
              @click="refreshCaptcha" 
              class="bg-slate-700 px-4 py-3 rounded-lg text-white font-mono font-bold tracking-widest cursor-pointer hover:bg-slate-600 select-none flex items-center gap-2" 
              title="點擊刷新"
            >
              {{ generatedCaptcha }} <RefreshCcw :size="14" />
            </div>
          </div>
        </div>

        <!-- Invitation Code Section -->
        <InputField 
          :icon="Ticket" 
          :label="t.register.inviteLabel" 
          :placeholder="t.register.invitePlaceholder" 
          v-model="formData.inviteCode"
        />

        <InputField 
          :icon="Shield" 
          :isSecure="true" 
          :label="t.register.txPassLabel" 
          :subLabel="t.register.txPassSub" 
          v-model="formData.txPass"
        />
        <NeonButton fullWidth class="mt-8" @click="handleNextStep">{{ t.register.next }}</NeonButton>
      </div>

      <!-- Step 2: KYC -->
      <div v-else class="space-y-6 animate-in fade-in slide-in-from-right duration-300">
        <section>
          <h3 class="text-emerald-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
            <User :size="16" class="mr-2"/> {{ t.register.idCard }}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="handleUpload('id_front')" 
              :class="`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-all ${uploads.id_front ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <Camera class="mb-2 opacity-50" />
              <span class="text-xs">{{ t.register.uploadFront }}</span>
            </button>
            <button 
              @click="handleUpload('id_back')" 
              :class="`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-all ${uploads.id_back ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <Camera class="mb-2 opacity-50" />
              <span class="text-xs">{{ t.register.uploadBack }}</span>
            </button>
          </div>
        </section>

        <section>
          <h3 class="text-emerald-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
            <CreditCard :size="16" class="mr-2"/> {{ t.register.bankCard }}
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <button 
              @click="handleUpload('bank_front')" 
              :class="`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:bg-slate-800 transition-all ${uploads.bank_front ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <span class="text-xs">{{ t.register.bankCardFront }}</span>
            </button>
            <button 
              @click="handleUpload('bank_back')" 
              :class="`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:bg-slate-800 transition-all ${uploads.bank_back ? 'border-emerald-500 text-emerald-400' : 'border-slate-700'}`"
            >
              <span class="text-xs">{{ t.register.bankCardBack }}</span>
            </button>
          </div>
          <InputField :icon="FileText" :placeholder="t.register.bankName" v-model="formData.bankName" />
          <InputField :icon="User" :placeholder="t.register.accountName" v-model="formData.accountName" />
          <InputField :icon="FileText" :placeholder="t.register.bankAcc" v-model="formData.bankAcc" />
        </section>

        <section class="bg-slate-800 p-4 rounded-xl border border-rose-900/50">
          <h3 class="text-rose-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center">
            <AlertTriangle :size="16" class="mr-2"/> {{ t.register.qrCode }}
          </h3>
          <p class="text-xs text-slate-400 mb-4">{{ t.register.qrDesc }}</p>
          <button 
            @click="handleUpload('qr_upload')" 
            :class="`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-rose-500 hover:bg-slate-800 transition-all bg-slate-900 ${uploads.qr_upload ? 'border-rose-500 text-rose-400' : 'border-slate-600'}`"
          >
            <Upload class="mb-2" />
            <span class="text-xs font-bold">{{ t.register.uploadQR }}</span>
          </button>
        </section>

        <NeonButton fullWidth class="mt-8" @click="$router.push('/login')">{{ t.register.submitAudit }}</NeonButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Smartphone, Mail, Shield, RefreshCcw, Ticket, Camera, CreditCard, FileText, AlertTriangle, Upload, ArrowLeft } from 'lucide-vue-next'
import InputField from '@/components/InputField.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()

const step = ref(1)
const countdown = ref(0)
const captchaInput = ref('')
const generatedCaptcha = ref('')

const formData = ref({
  account: '',
  password: '',
  confirmPassword: '',
  phone: '',
  smsCode: '',
  inviteCode: '',
  txPass: '',
  bankName: '',
  accountName: '',
  bankAcc: ''
})

const uploads = ref({
  id_front: false,
  id_back: false,
  bank_front: false,
  bank_back: false,
  qr_upload: false
})

let timer = null

onMounted(() => {
  refreshCaptcha()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function refreshCaptcha() {
  generatedCaptcha.value = Math.random().toString(36).substring(2, 6).toUpperCase()
}

function handleGetSms() {
  if (!formData.value.phone) return alert('請輸入手機號碼')
  if (countdown.value === 0) {
    countdown.value = 60
    alert('驗證碼已發送 (模擬: 123456)')
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(timer)
      }
    }, 1000)
  }
}

function handleNextStep() {
  if (captchaInput.value.toUpperCase() !== generatedCaptcha.value) {
    return alert(t.value.register.errCaptcha)
  }
  if (!formData.value.smsCode) {
    return alert(t.value.register.errSms)
  }
  step.value = 2
}

function handleUpload(id) {
  uploads.value[id] = true
}

function handleBack() {
  if (step.value === 1) {
    router.push('/login')
  } else {
    step.value = 1
  }
}
</script>

