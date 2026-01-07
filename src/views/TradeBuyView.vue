<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/dashboard')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <h2 class="text-white font-bold text-lg">{{ t.trade.buyTitle }}</h2>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center p-5">
      <div class="text-rose-500 mb-3 text-center">{{ error }}</div>
      <button 
        @click="fetchOrder"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
      >
        {{ t.common.retry }}
      </button>
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <!-- Time Counter -->
      <div class="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between mb-6">
        <div class="flex items-center text-rose-400">
          <Clock :size="18" class="mr-2" />
          <span class="text-sm font-bold">{{ t.trade.timeLeft }}</span>
        </div>
        <div class="font-mono text-xl font-bold text-rose-500">{{ formatTime(timeLeft) }}</div>
      </div>
      
      <p class="text-xs text-center text-slate-500 mb-6">{{ t.trade.tips }}</p>
      
      <!-- Order Info Card -->
      <Card class="flex flex-col items-center mb-6">
        <!-- QR Code Section -->
        <div class="w-48 h-48 bg-white p-2 rounded-lg mb-4">
          <div class="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <!-- QR Code Placeholder -->
            <div v-if="order.qr_code_url" class="w-full h-full">
              <img :src="order.qr_code_url" alt="QR Code" class="w-full h-full object-contain" />
            </div>
            <div v-else class="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-80">
              <div 
                v-for="i in 36" 
                :key="i" 
                :class="`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`"
              />
            </div>
            <div v-if="!order.qr_code_url" class="z-10 bg-white p-1 rounded">
              <Wallet class="text-black" />
            </div>
          </div>
        </div>
        
        <!-- Order Details -->
        <div class="w-full space-y-3">
          <!-- Bank Information -->
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.bankName }}</span>
            <span class="text-white font-mono">{{ order.payment.bank_name || '--' }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.bankCode }}</span>
            <span class="text-white font-mono">{{ order.payment.bank_code || '--' }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.bankAcc }}</span>
            <span class="text-white font-mono">{{ order.payment.bank_account || order.payment.account_number || '--' }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.accountName }}</span>
            <span class="text-white font-mono">{{ order.payment.account_name || '--' }}</span>
          </div>
          
          <!-- Amount -->
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">{{ t.trade.amount }}</span>
            <span class="text-emerald-400 font-mono font-bold">$ {{ formatAmount(order.amount_points) }}</span>
          </div>
          
          <!-- Order Reference/Memo -->
          <div class="bg-slate-900 p-2 rounded text-center">
            <span class="text-slate-500 text-xs block mb-1">{{ t.trade.memo }}</span>
            <span class="text-rose-500 font-mono font-bold text-lg select-all">{{ order.reference_code || order.memo || 'TX9988' }}</span>
          </div>
          
          <!-- Order Status & Info -->
          <div v-if="order.status" class="mt-4 pt-4 border-t border-slate-700 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">{{ t.common.status }}</span>
              <span :class="`font-bold ${getStatusColor(order.status)}`">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div v-if="order.created_at" class="flex justify-between text-sm">
              <span class="text-slate-400">{{ t.history.createTime }}</span>
              <span class="text-slate-300">{{ formatDateTime(order.created_at) }}</span>
            </div>
            
            <div v-if="order.expires_at" class="flex justify-between text-sm">
              <span class="text-slate-400">{{ t.trade.expiresAt }}</span>
              <span class="text-rose-400">{{ formatDateTime(order.expires_at) }}</span>
            </div>
          </div>
        </div>
      </Card>
      
      <!-- Upload Receipt Section -->
      <div class="mb-4">
        <label class="block text-slate-300 text-sm font-bold mb-2">{{ t.trade.uploadReceipt }}</label>
        
        <!-- Preview Uploaded Image -->
        <div v-if="receiptImage" class="mb-3">
          <img :src="receiptImage" alt="Receipt" class="w-full h-48 object-cover rounded-lg" />
          <button 
            @click="removeReceipt"
            class="mt-2 text-rose-500 text-sm hover:text-rose-400"
          >
            {{ t.common.remove }}
          </button>
        </div>
        
        <!-- Upload Button -->
        <button 
          @click="triggerFileInput"
          class="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-colors"
        >
          <Camera class="mb-2" />
          <span class="text-xs">{{ t.trade.uploadHint }}</span>
        </button>
        
        <!-- Hidden File Input -->
        <input 
          type="file" 
          ref="fileInput"
          accept="image/*"
          @change="handleFileUpload"
          class="hidden"
        />
      </div>
      
      <!-- Confirm Button -->
      <NeonButton 
        fullWidth 
        @click="handleComplete"
        :disabled=" order.status !== 0"
      >
        {{ t.trade.confirmPaid }}{{ order.status }}
      </NeonButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, Wallet, Camera } from 'lucide-vue-next'
import Card from '@/components/Card.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { api } from '@/utils/api'
import { showToast } from '@/utils/notification'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()

// State
const loading = ref(true)
const error = ref('')
const order = ref(null)
const timeLeft = ref(180)
const receiptImage = ref(null)
const fileInput = ref(null)

let timer = null

// Get order ID from route
const orderId = route.query.id

// Methods
async function fetchOrder() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.get(`/orders?id=${orderId}`)
    
    if (response.data.success) {
      order.value = response.data.data
      
      // Calculate time left if expires_at is available
      if (order.value.expires_at) {
        const expires = new Date(order.value.expires_at)
        const now = new Date()
        timeLeft.value = Math.max(0, Math.floor((expires - now) / 1000))
      }
    } else {
      error.value = response.data.message || t.value.common.requestFailed
    }
  } catch (err) {
    console.error('Fetch order error:', err)
    error.value = err.response?.data?.message || err.message || t.value.common.networkError
  } finally {
    loading.value = false
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatAmount(amount) {
  if (!amount) return '0'
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatDateTime(dateString) {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status) {
  const colors = {
    pending: 'text-yellow-400',
    paid: 'text-emerald-400',
    completed: 'text-emerald-400',
    expired: 'text-rose-400',
    cancelled: 'text-slate-400',
    failed: 'text-rose-500'
  }
  return colors[status] || 'text-white'
}

function getStatusText(status) {
  const statusMap = {
    pending: t.value.mall.status.pending,
    paid: t.value.mall.status.paid,
    completed: t.value.mall.status.completed,
    expired: t.value.mall.status.expired,
    cancelled: t.value.mall.status.cancelled,
    failed: t.value.mall.status.failed
  }
  return statusMap[status] || status
}

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    showToast({
      type: 'error',
      title: t.value.common.error,
      message: t.value.trade.invalidImageType
    })
    return
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast({
      type: 'error',
      title: t.value.common.error,
      message: t.value.trade.fileTooLarge
    })
    return
  }
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    receiptImage.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  // Reset file input
  event.target.value = ''
}

function removeReceipt() {
  receiptImage.value = null
}

async function handleComplete() {
  if (!receiptImage.value) {
    showToast({
      type: 'error',
      title: t.value.common.error,
      message: t.value.trade.uploadReceiptFirst
    })
    return
  }
  
  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('receipt', dataURLtoBlob(receiptImage.value), 'receipt.jpg')
    formData.append('orderId', orderId)
    
    const response = await api.post('/orders/confirm-payment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.value.common.success,
        message: t.value.trade.paymentConfirmed
      })
       router.push('/dashboard')
      // Refresh order data
      fetchOrder()
    } else {
      showToast({
        type: 'error',
        title: t.value.common.requestFailed,
        message: response.data.message || t.value.trade.paymentFailed
      })
    }
  } catch (err) {
    console.error('Confirm payment error:', err)
    showToast({
      type: 'error',
      title: t.value.common.requestFailed,
      message: err.response?.data?.message || t.value.common.networkError
    })
  }
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

// Lifecycle
onMounted(() => {
  fetchOrder()
  
  // Start timer
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      // Time's up - refresh order status
      //fetchOrder()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
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

.select-all {
  user-select: all;
  -webkit-user-select: all;
  -moz-user-select: all;
  -ms-user-select: all;
}
</style>