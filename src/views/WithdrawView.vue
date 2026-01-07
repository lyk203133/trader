<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="handleBack" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.wallet.withdrawTitle }}</h2>
        <p class="text-xs text-slate-400">{{ t.wallet.withdrawDesc }}</p>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
    </div>
    
    <div v-else class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <div class="space-y-6">
        <!-- Current Balance -->
        <div class="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-slate-400 mb-1">{{ t.dashboard.avail }}</p>
              <p class="text-2xl font-mono font-bold text-blue-400">
                {{ userBalance.toLocaleString() }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-400 mb-1">{{ t.wallet.minWithdrawAmount }}</p>
              <p class="text-lg font-mono font-bold text-emerald-400">{{ minWithdraw.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Amount Input -->
        <div class="space-y-2">
          <label class="text-slate-400 text-xs font-bold">{{ t.wallet.inputAmount }}</label>
          <input 
            type="number" 
            :placeholder="t.wallet.placeholder" 
            class="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 text-white text-lg font-mono focus:border-blue-500 focus:outline-none transition-colors" 
            v-model="amount"
            :min="minWithdraw"
            :max="userBalance"
            @input="validateAmount"
          />
          
          <!-- Error Message -->
          <div v-if="amountError" class="text-rose-500 text-sm px-1">
            {{ amountError }}
          </div>
          
          <!-- Available Balance -->
          <p class="text-xs text-slate-500 px-1">
            {{ t.dashboard.avail }}：<span class="text-blue-400 font-mono">{{ userBalance.toLocaleString() }}</span>
          </p>
        </div>
        
        <!-- Quick Amounts -->
        <div class="flex gap-3">
          <button 
            v-for="(val, idx) in quickAmounts" 
            :key="idx" 
            @click="setQuickAmount(val)" 
            :class="`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              amount == val ? 'bg-blue-500/20 border border-blue-500 text-blue-400' : 'bg-slate-800 border border-slate-600 text-slate-300 hover:border-blue-500'
            }`"
          >
            {{ formatQuickAmount(val) }}
          </button>
        </div>
        
        <!-- Calculation Summary -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-400">{{ t.wallet.withdrawAmount }}</span>
            <span class="text-lg font-mono font-bold text-white">
              {{ (parseFloat(amount) || 0).toLocaleString() }}
            </span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-400">{{ t.wallet.withdrawFee }} ({{ feeRate }}%)</span>
            <span class="text-lg font-mono font-bold text-rose-400">
              -{{ calculateFee().toLocaleString() }}
            </span>
          </div>
          
          <div class="pt-3 border-t border-slate-700/50">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-400">{{ t.wallet.receiveAmount }}</span>
              <span class="text-2xl font-mono font-bold text-emerald-400">
                {{ calculateReceiveAmount().toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Instructions -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <p class="font-bold text-slate-300 mb-2">{{ t.wallet.instructions }}</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>{{ t.wallet.minWithdraw }}: {{ minWithdraw.toLocaleString() }}</li>
            <li>{{ t.wallet.withdrawRate }}: {{ feeRate }}%</li>
            <li>{{ t.wallet.withdrawTime }}: {{ processTime }}</li>
            <li>{{ t.wallet.withdrawFee }}: {{ calculateFee().toLocaleString() }}</li>
          </ul>
        </div>
        
        <!-- Payment Account (Optional) -->
        <div v-if="paymentAccounts.length > 0" class="space-y-2">
          <label class="text-slate-400 text-xs font-bold">{{ t.wallet.selectAccount }}</label>
          <select 
            v-model="selectedAccountId"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">{{ t.wallet.selectAccountPlaceholder }}</option>
            <option 
              v-for="account in paymentAccounts" 
              :key="account.id"
              :value="account.id"
            >
              {{ account.bank_name }} - {{ account.account_number }} ({{ account.account_name }})
            </option>
          </select>
        </div>
        
        <!-- Action Button -->
        <div class="pt-4">
          <NeonButton 
            variant="blue" 
            fullWidth 
            @click="handleWithdraw"
            :loading="submitting"
            :disabled="!isFormValid || submitting"
          >
            {{ t.wallet.confirmWithdraw }}
          </NeonButton>
        </div>
        
        <!-- Recent Withdrawals -->
        <div v-if="recentWithdrawals.length > 0" class="mt-8 pt-6 border-t border-slate-800">
          <h3 class="text-white text-sm font-bold mb-3">{{ t.wallet.recentWithdrawals }}</h3>
          <div class="space-y-2">
            <div 
              v-for="withdrawal in recentWithdrawals" 
              :key="withdrawal.id"
              class="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-white font-bold text-sm">{{ withdrawal.amount.toLocaleString() }}</div>
                  <div class="text-xs text-slate-400">{{ formatDate(withdrawal.created_at) }}</div>
                </div>
                <div :class="`text-sm font-bold px-2 py-1 rounded ${getStatusClass(withdrawal.status)}`">
                  {{ getStatusText(withdrawal.status) }}
                </div>
              </div>
            </div>
          </div>
          <button 
            @click="$router.push('/transaction-history')" 
            class="w-full mt-3 py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
          >
            {{ t.wallet.viewAllHistory }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-2xl p-6 w-full max-w-sm mx-auto border border-slate-700">
        <h3 class="text-lg font-bold text-white mb-4">{{ t.wallet.confirmTitle }}</h3>
        
        <div class="space-y-3 mb-6">
          <div class="flex justify-between">
            <span class="text-slate-400">{{ t.wallet.withdrawAmount }}</span>
            <span class="text-white font-bold">{{ (parseFloat(amount) || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">{{ t.wallet.withdrawFee }}</span>
            <span class="text-rose-400">-{{ calculateFee().toLocaleString() }}</span>
          </div>
          <div class="pt-3 border-t border-slate-700">
            <div class="flex justify-between">
              <span class="text-slate-300">{{ t.wallet.receiveAmount }}</span>
              <span class="text-emerald-400 font-bold">{{ calculateReceiveAmount().toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="showConfirmDialog = false"
            class="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            {{ t.common.cancel }}
          </button>
          <button 
            @click="submitWithdraw"
            class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            :disabled="submitting"
          >
            <span v-if="submitting">{{ t.common.processing }}</span>
            <span v-else>{{ t.common.confirm }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { api, post } from '@/utils/api'
import { showToast } from '@/utils/notification'

const router = useRouter()
const { t } = useTranslation()
const authStore = useAuthStore()

// State
const loading = ref(false)
const submitting = ref(false)
const amount = ref('')
const amountError = ref('')
const showConfirmDialog = ref(false)

// Configuration
const userBalance = ref(0)
const minWithdraw = ref(1000)
const feeRate = ref(1) // 1%
const processTime = ref('1-3 工作日')
const quickAmounts = ref([10000, 50000, 100000, 200000])

// Payment Accounts
const paymentAccounts = ref([])
const selectedAccountId = ref('')

// Recent Withdrawals
const recentWithdrawals = ref([])

// Computed
const isFormValid = computed(() => {
  const numAmount = parseFloat(amount.value)
  return !amountError.value && 
         !isNaN(numAmount) && 
         numAmount >= minWithdraw.value && 
         numAmount <= userBalance.value &&
         (!paymentAccounts.value.length || selectedAccountId.value)
})

// Methods
function formatQuickAmount(val) {
  if (val >= 10000) return `${val / 10000}W`
  return val.toString()
}

function setQuickAmount(val) {
  if (val === userBalance.value) {
    amount.value = userBalance.value
  } else {
    amount.value = val
  }
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
  } else if (numAmount < minWithdraw.value) {
    amountError.value = t.value.mall.errors.minAmount.replace('{min}', minWithdraw.value.toLocaleString())
  } else if (numAmount > userBalance.value) {
    amountError.value = t.value.mall.errors.insufficientBalance
  } else {
    amountError.value = ''
  }
}

function calculateFee() {
  const numAmount = parseFloat(amount.value) || 0
  return Math.round(numAmount * (feeRate.value / 100))
}

function calculateReceiveAmount() {
  const numAmount = parseFloat(amount.value) || 0
  const fee = calculateFee()
  return numAmount - fee
}

async function fetchWithdrawData() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  loading.value = true
  
  try {
    // Fetch wallet balance
    const walletResponse = await api.get('/wallet')
    if (walletResponse.data.success) {
      const balance = parseFloat(walletResponse.data.data.wallet?.balance || 0)
      userBalance.value = balance
    }
    
    // Fetch withdraw settings
    const settingsResponse = await api.get('/withdraw/settings')
    if (settingsResponse.data.success) {
      const settings = settingsResponse.data.data
      minWithdraw.value = settings.min_amount || 1000
      feeRate.value = settings.fee_rate || 1
      processTime.value = settings.process_time || '1-3 工作日'
    }
    
    // Fetch payment accounts
    await fetchPaymentAccounts()
    
    // Fetch recent withdrawals
    await fetchRecentWithdrawals()
    
  } catch (error) {
    console.error('Fetch withdraw data error:', error)
    showToast({
      type: 'error',
      title: t.common.requestFailed,
      message: t.wallet.errors.fetchDataFailed
    })
    
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

async function fetchPaymentAccounts() {
  try {
    const response = await api.get('/payment/accounts')
    if (response.data.success) {
      paymentAccounts.value = response.data.data.accounts || []
      if (paymentAccounts.value.length > 0) {
        selectedAccountId.value = paymentAccounts.value[0].id
      }
    }
  } catch (error) {
    console.error('Fetch payment accounts error:', error)
    // Don't show error if it's just payment accounts
  }
}

async function fetchRecentWithdrawals() {
  try {
    const response = await api.get('/withdraw/history', {
      params: {
        limit: 5,
        type: 'withdraw'
      }
    })
    
    if (response.data.success) {
      recentWithdrawals.value = response.data.data.withdrawals || []
    }
  } catch (error) {
    console.error('Fetch recent withdrawals error:', error)
  }
}

function handleWithdraw() {
  if (!isFormValid.value) {
    showToast({
      type: 'error',
      title: t.wallet.errors.invalidForm,
      message: amountError.value || t.wallet.errors.pleaseCheckInput
    })
    return
  }
  
  showConfirmDialog.value = true
}

async function submitWithdraw() {
  submitting.value = true
  
  try {
    const withdrawData = {
      amount: parseFloat(amount.value),
      type:'SELL',
      remark:'會員提現點數',
      fee: calculateFee(),
      receive_amount: calculateReceiveAmount(),
      payment_account_id: paymentAccounts.value.length ? selectedAccountId.value : null
    }
    
    const response = await post('/trading/create-order', withdrawData)
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.value.wallet.withdrawSubmitted,
        message: t.value.wallet.withdrawSuccessMessage
      })
      
      // Close dialog and navigate back
      showConfirmDialog.value = false
      router.push('/my-wallet')
    } else {
      showToast({
        type: 'error',
        title: t.value.wallet.withdrawFailed,
        message: response.data.message || t.value.common.requestFailed
      })
    }
  } catch (error) {
    console.error('Submit withdraw error:', error)
    showToast({
      type: 'error',
      title: t.wallet.withdrawFailed,
      message: error.response?.data?.message || error.message || t.common.networkError
    })
  } finally {
    submitting.value = false
  }
}

function handleBack() {
  router.push('/my-wallet')
}

function formatDate(dateString) {
  if (!dateString) return '--'
  
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-500'
    case 'processing': return 'bg-blue-500/20 text-blue-500'
    case 'completed': return 'bg-emerald-500/20 text-emerald-500'
    case 'rejected': return 'bg-rose-500/20 text-rose-500'
    case 'cancelled': return 'bg-slate-500/20 text-slate-500'
    default: return 'bg-slate-500/20 text-slate-500'
  }
}

function getStatusText(status) {
  const statusMap = {
    'pending': t.wallet.status.pending,
    'processing': t.wallet.status.processing,
    'completed': t.wallet.status.completed,
    'rejected': t.wallet.status.rejected,
    'cancelled': t.wallet.status.cancelled
  }
  return statusMap[status] || status
}

// Lifecycle
onMounted(() => {
  fetchWithdrawData()
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
</style>