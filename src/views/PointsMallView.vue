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
    
    <!-- Loading State -->
    <div v-if="loading && step === 1" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <!-- Step 1: Input Amount -->
      <div v-if="step === 1" class="space-y-6 animate-in fade-in slide-in-from-right">
        <!-- Current Balance -->
        <Card class="p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-slate-400 mb-1">{{ t.mall.currentBalance }}</p>
              <p class="text-2xl font-mono font-bold text-emerald-400">
                {{ userBalance?.toLocaleString() || '0' }} VND
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-400 mb-1">{{ t.mall.exchangeRate }}</p>
              <p class="text-lg font-mono font-bold text-white">1:{{ exchangeRate }}</p>
            </div>
          </div>
        </Card>

        <!-- Amount Input -->
        <Card class="p-6 space-y-4">
          <label class="block text-sm font-bold text-slate-300 mb-1">{{ t.mall.inputLabel }}</label>
          <input 
            type="number" 
            class="bg-slate-900 border border-slate-700 text-white text-lg font-mono rounded-lg block w-full p-3" 
            :placeholder="t.mall.placeholder" 
            v-model="amount"
            :min="minAmount"
            :max="maxAmount"
            @input="validateAmount"
          />
          <div v-if="amountError" class="text-rose-500 text-sm mt-1">{{ amountError }}</div>
          
          <div class="grid grid-cols-3 gap-3 pt-2">
            <button 
              v-for="val in quickAmounts" 
              :key="val" 
              @click="setQuickAmount(val)" 
              :class="`py-2 px-1 text-xs font-bold rounded border transition-colors ${
                amount == val ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-emerald-500'
              }`"
            >
              {{ formatAmount(val) }}
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
            maxlength="100"
          ></textarea>
          <div class="text-right text-xs text-slate-500">{{ memo.length }}/100</div>
        </div>

        <!-- Summary -->
        <div class="space-y-3 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-400">{{ t.mall.rechargeAmount }}</span>
            <span class="text-xl font-mono font-bold text-white">{{ amount || 0 }} </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-400">{{ t.mall.estPay }} (VND)</span>
            <span class="text-xl font-mono font-bold text-emerald-400">$ {{ calculatedAmount.toLocaleString() }}</span>
          </div>
          <div class="pt-3 border-t border-slate-700/50">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">{{ t.mall.total }}</span>
              <span class="text-2xl font-mono font-bold text-white">$ {{ calculatedAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Button -->
        <NeonButton 
          fullWidth 
          @click="handleApply" 
          :loading="creatingOrder"
          :disabled="!isAmountValid || creatingOrder"
        >
          {{ t.mall.genQR }}
        </NeonButton>
      </div>

      <!-- Step 2: Payment QR Code -->
      <div v-else class="animate-in fade-in slide-in-from-right">
        <!-- Order Info -->
        <div class="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
          <div class="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
            <span class="text-xs text-slate-400">{{ t.mall.orderId }}</span>
            <span class="text-xs font-mono text-white">{{ orderData.order_no }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-slate-400">{{ t.mall.createTime }}</span>
            <span class="text-xs font-bold text-slate-300">{{ formatTime(orderData.created_at) }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-slate-400">{{ t.mall.statusName }}</span>
            <span :class="`text-xs font-bold ${getStatusClass(orderData.status)}`">
              {{ getStatusText(orderData.status) }}
            </span>
          </div>
          <div v-if="memo" class="flex justify-between items-start pt-2 border-t border-slate-700/50">
            <span class="text-xs text-slate-400 shrink-0">{{ t.mall.memoLabel }}</span>
            <span class="text-xs text-slate-300 text-right italic ml-4 break-all">"{{ memo }}"</span>
          </div>
        </div>
        
        <!-- Timer -->
        <div class="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
          <div class="flex items-center text-rose-400">
            <Clock :size="18" class="mr-2" />
            <span class="text-sm font-bold">{{ t.trade.timeLeft }}</span>
          </div>
          <div class="font-mono text-xl font-bold text-rose-500">{{ formatTimeLeft(timeLeft) }}</div>
        </div>
        
        <!-- QR Code -->
        <Card class="flex flex-col items-center mb-6">
          <div class="w-48 h-48 bg-white p-2 rounded-lg mb-4">
            <div v-if="orderData.qrCode" class="w-full h-full flex items-center justify-center">
              <img 
                :src="'data:image/png;base64,'+orderData.qrCode" 
                alt="Payment QR Code" 
                class="w-full h-full object-contain"
              />
            </div>
            <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <div class="animate-pulse w-full h-full bg-slate-800">

              </div>
            </div>
          </div>
          
          <div class="w-full space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">{{ t.trade.paymentMethod }}</span>
              <span class="text-white font-bold">{{ orderData.paymentMethod || '銀行轉帳' }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="orderData.bankCode">
              <span class="text-slate-400">{{ t.trade.bankCode }}</span>
              <span class="text-white font-mono">{{ orderData.bankCode }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="orderData.bankAccount">
              <span class="text-slate-400">{{ t.trade.bankAcc }}</span>
              <span class="text-white font-mono">{{ orderData.bankAccount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">{{ t.trade.amount }}</span>
              <span class="text-emerald-400 font-mono font-bold">$ {{ orderData.amount_points?.toLocaleString() }}</span>
            </div>
            
            <!-- Payment Reference -->
            <div class="bg-slate-900 p-2 rounded text-center border border-rose-900/30">
              <span class="text-slate-500 text-[10px] block mb-1">{{ t.trade.paymentNote }}</span>
              <span class="text-rose-500 font-mono font-bold text-lg select-all">{{ orderData.referenceCode || 'TX9988' }}</span>
            </div>
          </div>
        </Card>
        
        <!-- Upload Receipt -->
        <div class="mb-8">
          <label class="block text-slate-300 text-sm font-bold mb-2">{{ t.trade.uploadReceipt }}</label>
          <div v-if="!receiptUrl">
            <input 
              type="file" 
              id="receiptUpload" 
              accept="image/*,.pdf" 
              @change="handleFileUpload" 
              class="hidden"
            />
            <label 
              for="receiptUpload" 
              :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer ${
                uploading ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600 hover:border-emerald-500'
              }`"
            >
              <div v-if="uploading" class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
              <Camera v-else class="mb-2" />
              <span class="text-xs">{{ uploading ? t.trade.uploading : t.trade.uploadHint }}</span>
            </label>
          </div>
          <div v-else class="bg-slate-800 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Check class="text-emerald-400 mr-2" />
                <span class="text-sm text-slate-300">{{ t.trade.uploadSuccess }}</span>
              </div>
              <button @click="removeReceipt" class="text-rose-500 hover:text-rose-400">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="space-y-3">
          <NeonButton 
            fullWidth 
            :disabled="!receiptUrl || submitting" 
            @click="confirmPayment"
            :loading="submitting"
          >
            {{ t.trade.confirmPaid }}
          </NeonButton>
          <button 
            @click="checkOrderStatus" 
            class="w-full py-3 text-center text-sm text-slate-400 hover:text-white transition-colors"
            :disabled="checkingStatus"
          >
            <span v-if="checkingStatus">{{ t.trade.checking }}</span>
            <span v-else>{{ t.trade.checkStatus }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Wallet, Camera, Check, X } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { api, post } from '@/utils/api'
import { showToast } from '@/utils/notification'

const router = useRouter()
const { t } = useTranslation()
const authStore = useAuthStore()

// State
const step = ref(1)
const amount = ref('')
const amountError = ref('')
const memo = ref('')
const timeLeft = ref(1800) // 30 minutes
const uploaded = ref(false)
const loading = ref(false)
const creatingOrder = ref(false)
const submitting = ref(false)
const checkingStatus = ref(false)
const uploading = ref(false)

// Data
const userBalance = ref(0)
const exchangeRate = ref(1)
const minAmount = ref(100)
const maxAmount = ref(1000000)
const quickAmounts = ref([50000, 100000, 200000, 500000])
const orderData = ref({})
const receiptUrl = ref('')
const receiptFile = ref(null)

let timer = null
let orderCheckInterval = null

// Computed
const isAmountValid = computed(() => {
  const numAmount = parseFloat(amount.value)
  return !isNaN(numAmount) && 
         numAmount >= minAmount.value && 
         numAmount <= maxAmount.value && 
         !amountError.value
})

const calculatedAmount = computed(() => {
  const numAmount = parseFloat(amount.value) || 0
  return Math.round(numAmount * exchangeRate.value)
})

// Methods
function formatAmount(val) {
  if (val >= 10000) return `${val / 10000}W`
  return val.toString()
}

function setQuickAmount(val) {
  amount.value = val
  validateAmount()
}

function validateAmount() {
  const numAmount = parseFloat(amount.value)
  
  if (!amount.value) {
    amountError.value = ''
    return
  }
  
  if (isNaN(numAmount)) {
    amountError.value = t.value.mall.errors.invalidNumber
  } else if (numAmount < minAmount.value) {
    amountError.value = t.value.mall.errors.minAmount.replace('{min}', minAmount.value)
  } else if (numAmount > maxAmount.value) {
    amountError.value = t.value.mall.errors.maxAmount.replace('{max}', maxAmount.value)
  } else if (numAmount > userBalance.value) {
    //amountError.value = t.value.mall.errors.insufficientBalance
  } else {
    amountError.value = ''
  }
}

async function fetchUserBalance() {
  loading.value = true
  try {
    const response = await api.get('/wallet')
    if (response.data.success) {
      userBalance.value = response.data.data.wallet.balance || 0
      exchangeRate.value = response.data.data.exchangeRate || 1
      minAmount.value = response.data.data.minRecharge || 100
      maxAmount.value = response.data.data.maxRecharge || 1000000
    }
  } catch (error) {
    console.error('Failed to fetch user balance:', error)
    showToast({
      type: 'error',
      title: t.value.common.requestFailed,
      message: t.value.mall.errors.fetchBalanceFailed
    })
  } finally {
    loading.value = false
  }
}

async function handleApply() {
  if (!isAmountValid.value) {
    showToast({
      type: 'error',
      title: t.value.mall.errors.invalidAmount,
      message: amountError.value || t.value.mall.errors.pleaseCheckAmount
    })
    return
  }
  
  creatingOrder.value = true
  
  try {
    const response = await post('/trading/create-order', {
      type:'BUY',
      amount: parseFloat(amount.value),
      remark: memo.value.trim(),
      currency: 'VND',
    })
    
    if (response.data.success) {
      orderData.value = response.data.data
      step.value = 2
      startTimer()
      startOrderCheck()
      
      /*showToast({
        type: 'success',
        title: t.value.mall.orderCreated,
        message: t.value.mall.scanQRToPay
      })*/
    } else {
      showToast({
        type: 'error',
        title: t.value.mall.orderFailed,
        message: response.data.message || t.common.requestFailed
      })
    }
  } catch (error) {
    console.error('Create order error:', error)
    showToast({
      type: 'error',
      title: t.value.mall.orderFailed,
      message: error.response?.data?.message || error.message || t.value.common.networkError
    })
  } finally {
    creatingOrder.value = false
  }
}

function startTimer() {
  if (timer) clearInterval(timer)
  
  // Set timeout from order data or default 30 minutes
  timeLeft.value = orderData.value.expireMinutes ? orderData.value.expireMinutes * 60 : 1800
  
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      showToast({
        type: 'warning',
        title: t.mall.orderExpired,
        message: t.mall.orderExpiredMessage
      })
    }
  }, 1000)
}

function startOrderCheck() {
  if (orderCheckInterval) clearInterval(orderCheckInterval)
  
  orderCheckInterval = setInterval(async () => {
    if (!orderData.value.orderId) return
    
    try {
      const response = await api.get(`/mall/order-status/${orderData.value.orderId}`)
      if (response.data.success) {
        const newStatus = response.data.data.status
        
        // Update order data
        orderData.value = { ...orderData.value, ...response.data.data }
        
        // If order is completed or expired, stop checking
        if (['completed', 'expired', 'cancelled'].includes(newStatus)) {
          clearInterval(orderCheckInterval)
          
          if (newStatus === 'completed') {
            showToast({
              type: 'success',
              title: t.mall.paymentCompleted,
              message: t.mall.pointsAdded
            })
            // Refresh user balance
            fetchUserBalance()
          }
        }
      }
    } catch (error) {
      console.error('Order status check error:', error)
    }
  }, 10000) // Check every 10 seconds
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!validTypes.includes(file.type)) {
    showToast({
      type: 'error',
      title: t.trade.uploadError,
      message: t.trade.invalidFileType
    })
    return
  }
  
  if (file.size > maxSize) {
    showToast({
      type: 'error',
      title: t.trade.uploadError,
      message: t.trade.fileTooLarge
    })
    return
  }
  
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('receipt', file)
    formData.append('orderId', orderData.value.id)
    
    const response = await api.post('/trading/upload-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      receiptUrl.value = response.data.data.receiptUrl
      receiptFile.value = file
      showToast({
        type: 'success',
        title: t.trade.uploadSuccess,
        message: t.trade.receiptUploaded
      })
    }
  } catch (error) {
    console.error('Upload receipt error:', error)
    showToast({
      type: 'error',
      title: t.trade.uploadError,
      message: error.response?.data?.message || t.common.networkError
    })
  } finally {
    uploading.value = false
    event.target.value = '' // Reset file input
  }
}

function removeReceipt() {
  receiptUrl.value = ''
  receiptFile.value = null
}

async function confirmPayment() {
  if (!receiptUrl.value) {
    showToast({
      type: 'error',
      title: t.trade.missingReceipt,
      message: t.trade.pleaseUploadReceipt
    })
    return
  }
  
  submitting.value = true
  
  try {
    const response = await post('/trading/confirm-payment', {
      orderId: orderData.value.id,
      receiptUrl: receiptUrl.value
    })
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.value.trade.paymentConfirmed,
        message: t.value.trade.waitingVerification
      })
      
      // Wait a moment then check status
      setTimeout(() => {
        checkOrderStatus()
      }, 2000)
    } else {
      showToast({
        type: 'error',
        title: t.trade.confirmFailed,
        message: response.data.message || t.common.requestFailed
      })
    }
  } catch (error) {
    console.error('Confirm payment error:', error)
    showToast({
      type: 'error',
      title: t.value.trade.confirmFailed,
      message: error.response?.data?.message || error.message || t.common.networkError
    })
  } finally {
    submitting.value = false
  }
}

async function checkOrderStatus() {
  if (!orderData.value.orderId) return
  
  checkingStatus.value = true
  
  try {
    const response = await api.get(`/mall/order-status/${orderData.value.orderId}`)
    
    if (response.data.success) {
      const newData = response.data.data
      orderData.value = { ...orderData.value, ...newData }
      
      if (newData.status === 'completed') {
        showToast({
          type: 'success',
          title: t.mall.paymentCompleted,
          message: t.mall.pointsAdded
        })
        fetchUserBalance()
      } else if (newData.status === 'processing') {
        showToast({
          type: 'info',
          title: t.mall.paymentProcessing,
          message: t.mall.waitingConfirmation
        })
      }
    }
  } catch (error) {
    console.error('Check order status error:', error)
    showToast({
      type: 'error',
      title: t.common.requestFailed,
      message: t.common.networkError
    })
  } finally {
    checkingStatus.value = false
  }
}

function handleBack() {
  if (step.value === 1) {
    router.push('/dashboard')
  } else {
    // Confirm before leaving payment page
    if (confirm(t.value.mall.confirmLeave)) {
      step.value = 1
      if (timer) clearInterval(timer)
      if (orderCheckInterval) clearInterval(orderCheckInterval)
    }
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatTimeLeft(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getStatusClass(status) {
  switch (status) {
    case '0': return 'text-yellow-500'
    case '1': return 'text-blue-500'
    case '2': return 'text-emerald-500'
    case '4': return 'text-rose-500'
    case '3': return 'text-slate-500'
    default: return 'text-slate-400'
  }
}

function getStatusText(status) {
  return t.value.mall.status[status]
  
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  fetchUserBalance()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (orderCheckInterval) clearInterval(orderCheckInterval)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-in {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-right {
  animation-name: slideInFromRight;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>