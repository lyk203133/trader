<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-20">
      <div class="flex items-center">
        <button @click="handleBack" class="p-2 mr-2 hover:bg-slate-700 rounded-full">
          <ArrowLeft class="text-white" :size="20" />
        </button>
        <div>
          <h2 class="text-white font-bold text-lg">{{ t.history.title }}</h2>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Filter Button -->
        <button 
          @click="showFilter = !showFilter"
          class="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white border border-slate-600"
        >
          <Filter :size="14" />
          <span>{{ t.history.filter }}</span>
        </button>
        <!-- Export Button -->
        <button 
          @click="handleExport"
          class="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white border border-slate-600"
          :disabled="loading"
        >
          <Download :size="14" />
          <span>{{ t.history.export }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !transactions.length" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !transactions.length" class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-rose-500 mb-3 text-center">{{ error }}</div>
      <button 
        @click="fetchTransactions"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
      >
        {{ t.common.retry }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar">
      <!-- Filter Panel -->
      <div v-if="showFilter" class="bg-slate-800/80 p-4 border-b border-slate-700">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label class="text-xs text-slate-400 mb-1 block">{{ t.history.filterType }}</label>
            <select 
              v-model="filters.type"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            >
              <option value="all">{{ t.common.all }}</option>
              <option value="buy">{{ t.history.types.buy }}</option>
              <option value="sell">{{ t.history.types.sell }}</option>
              <option value="deposit">{{ t.history.types.deposit }}</option>
              <option value="withdraw">{{ t.history.types.withdraw }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">{{ t.history.filterStatus }}</label>
            <select 
              v-model="filters.status"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            >
              <option value="all">{{ t.common.all }}</option>
              <option value="success">{{ t.history.statuses.success }}</option>
              <option value="pending">{{ t.history.statuses.pending }}</option>
              <option value="processing">{{ t.history.statuses.processing }}</option>
              <option value="cancelled">{{ t.history.statuses.cancelled }}</option>
              <option value="abnormal">{{ t.history.statuses.abnormal }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">{{ t.history.startDate }}</label>
            <input 
              type="date" 
              v-model="filters.startDate"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            />
          </div>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">{{ t.history.endDate }}</label>
            <input 
              type="date" 
              v-model="filters.endDate"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button 
            @click="resetFilters"
            class="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            {{ t.common.reset }}
          </button>
          <button 
            @click="applyFilters"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg"
          >
            {{ t.common.apply }}
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="bg-slate-800/50 p-4 grid grid-cols-4 gap-4 border-b border-slate-700">
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.count }}</span>
          <span class="text-lg font-mono font-bold text-blue-400">{{ stats.totalCount || 0 }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.points }}</span>
          <span class="text-lg font-mono font-bold text-white">{{ (stats.totalAmount || 0).toLocaleString() }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.fees }}</span>
          <span class="text-lg font-mono font-bold text-rose-400">{{ (stats.totalFee || 0).toLocaleString() }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-400 mb-1">{{ t.history.stats.bonus }}</span>
          <span class="text-lg font-mono font-bold text-emerald-400">{{ (stats.totalBonus || 0).toLocaleString() }}</span>
        </div>
      </div>
      
      <!-- Transactions List -->
      <div v-if="!loading && transactions.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="text-slate-500 mb-3">{{ t.history.noData }}</div>
        <button 
          @click="fetchTransactions"
          class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          {{ t.common.refresh }}
        </button>
      </div>

      <div v-else class="p-4">
        <!-- Loading more indicator -->
        <div v-if="loadingMore" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
        </div>

        <!-- Transactions -->
        <div 
          v-for="tx in transactions" 
          :key="tx.id"
          class="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer"
          @click="showTransactionDetail(tx)"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-emerald-400">{{ tx.order_no || tx.id }}</span>
                <span class="text-xs text-slate-500 px-2 py-0.5 bg-slate-900/50 rounded">
                  {{ tx.target_type || 'N/A' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1">{{ formatDate(tx.created_at) }}</p>
            </div>
            <span :class="`px-2 py-1 rounded text-xs font-bold ${getStatusColor(tx.status)}`">
              {{ getStatusText(tx.status) }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-500">{{ t.common.type }}:</span>
              <span :class="`ml-2 font-bold ${getTypeColor(tx.type)}`">
                {{ getTypeText(tx.type) }}
              </span>
            </div>
            <div>
              <span class="text-slate-500">{{ t.common.amount }}:</span>
              <span class="ml-2 font-mono font-bold text-white">{{ (tx.amount_points || 0).toLocaleString() }}</span>
            </div>
            <div v-if="tx.fee">
              <span class="text-slate-500">{{ t.history.fee }}:</span>
              <span class="ml-2 font-mono text-rose-400">-{{ tx.fee.toLocaleString() }}</span>
            </div>
            <div v-if="tx.bonus">
              <span class="text-slate-500">{{ t.history.bonus }}:</span>
              <span class="ml-2 font-mono text-emerald-400">+{{ tx.bonus.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Transaction Remarks -->
          <div v-if="tx.remark" class="mt-3 pt-3 border-t border-slate-700/30">
            <p class="text-xs text-slate-500 italic">"{{ tx.remark }}"</p>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore" class="text-center mt-4">
          <button 
            @click="loadMore"
            class="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm"
            :disabled="loadingMore"
          >
            <span v-if="loadingMore">{{ t.common.loading }}...</span>
            <span v-else>{{ t.common.loadMore }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-auto border border-slate-700 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-white">{{ t.history.transactionDetail }}</h3>
          <button @click="showDetailModal = false" class="text-slate-400 hover:text-white">
            <X :size="20" />
          </button>
        </div>

        <div v-if="selectedTransaction" class="space-y-4">
          <!-- Basic Info -->
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.history.transactionId }}</span>
              <span class="text-white font-mono text-sm">{{ selectedTransaction.transaction_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.history.orderNo }}</span>
              <span class="text-white font-mono text-sm">{{ selectedTransaction.order_no }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.common.type }}</span>
              <span :class="`font-bold ${getTypeColor(selectedTransaction.type)}`">
                {{ getTypeText(selectedTransaction.type) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.history.status }}</span>
              <span :class="`font-bold ${getStatusColor(selectedTransaction.status)}`">
                <a :href="'trade-buy?id='+selectedTransaction.id">{{ getStatusText(selectedTransaction.status) }}</a> 
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.history.createTime }}</span>
              <span class="text-white">{{ formatDateTime(selectedTransaction.created_at) }}</span>
            </div>
          </div>

          <!-- Amount Details -->
          <div class="pt-4 border-t border-slate-700 space-y-3">
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t.common.amount }}</span>
              <span class="text-xl font-mono font-bold text-white">{{ (selectedTransaction.amount || 0).toLocaleString() }}</span>
            </div>
            <div v-if="selectedTransaction.fee" class="flex justify-between">
              <span class="text-slate-400">{{ t.history.fee }}</span>
              <span class="font-mono text-rose-400">-{{ selectedTransaction.fee.toLocaleString() }}</span>
            </div>
            <div v-if="selectedTransaction.bonus" class="flex justify-between">
              <span class="text-slate-400">{{ t.history.bonus }}</span>
              <span class="font-mono text-emerald-400">+{{ selectedTransaction.bonus.toLocaleString() }}</span>
            </div>
            <div v-if="selectedTransaction.actual_amount" class="flex justify-between pt-3 border-t border-slate-700">
              <span class="text-slate-300">{{ t.history.actualAmount }}</span>
              <span class="text-xl font-mono font-bold text-emerald-400">{{ selectedTransaction.actual_amount.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Additional Info -->
          <div v-if="selectedTransaction.remark" class="pt-4 border-t border-slate-700">
            <p class="text-slate-400 text-sm mb-2">{{ t.history.remark }}</p>
            <p class="text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg">{{ selectedTransaction.remark }}</p>
          </div>

          <!-- Action Buttons -->
          <div v-if="selectedTransaction.status === 'pending'" class="pt-4 border-t border-slate-700 flex gap-2">
            <button 
              @click="handleTransactionAction('cancel', selectedTransaction)"
              class="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
            >
              {{ t.common.cancel }}
            </button>
            <button 
              @click="handleTransactionAction('confirm', selectedTransaction)"
              class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
            >
              {{ t.common.confirm }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, Filter, X } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/api'
import { showToast } from '@/utils/notification'

const router = useRouter()
const { t } = useTranslation()
const authStore = useAuthStore()

// State
const loading = ref(false)
const loadingMore = ref(false)
const error = ref('')
const showFilter = ref(false)
const showDetailModal = ref(false)
const selectedTransaction = ref(null)

// Data
const transactions = ref([])
const stats = ref({})
const filters = ref({
  type: 'all',
  status: 'all',
  startDate: '',
  endDate: '',
  page: 1,
  limit: 10
})
const hasMore = ref(true)

// Methods
async function fetchTransactions(reset = true) {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (reset) {
    loading.value = true
    filters.value.page = 1
    hasMore.value = true
  } else {
    loadingMore.value = true
  }
  
  error.value = ''

  try {
    // Prepare query params
    const params = {
      page: filters.value.page,
      limit: filters.value.limit
    }
    
    // Add filters if not 'all'
    if (filters.value.type !== 'all') {
      params.type = filters.value.type
    }
    
    if (filters.value.status !== 'all') {
      params.status = filters.value.status
    }
    
    if (filters.value.startDate) {
      params.start_date = filters.value.startDate
    }
    
    if (filters.value.endDate) {
      params.end_date = filters.value.endDate
    }

    const response = await api.get('/transactions', { params })
    
    if (response.data.success) {
      const data = response.data.data
      
      if (reset) {
        transactions.value = data.transactions || []
        stats.value = data.stats || {}
      } else {
        transactions.value = [...transactions.value, ...(data.transactions || [])]
      }
      
      // Check if has more data
      const total = data.stats?.totalCount || 0
      const loaded = transactions.value.length
      hasMore.value =  data.pagination.has_more;// loaded < total
      
      // Update stats
      if (reset) {
        stats.value = data.stats || {}
      }
    } else {
      error.value = response.data.message || t.value.common.requestFailed
    }
  } catch (err) {
    console.error('Fetch transactions error:', err)
    error.value = err.response?.data?.message || err.message || t.value.common.networkError
    
    // If token expired, redirect to login
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  
  filters.value.page++
  await fetchTransactions(false)
}

function applyFilters() {
  showFilter.value = false
  fetchTransactions(true)
}

function resetFilters() {
  filters.value = {
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  }
  fetchTransactions(true)
}

function showTransactionDetail(tx) {
  selectedTransaction.value = tx
  showDetailModal.value = true
}

async function handleTransactionAction(action, tx) {
  try {
    let response
    const data = { transaction_id: tx.id }
    
    if (action === 'cancel') {
      response = await api.post('/transactions/cancel', data)
    } else if (action === 'confirm') {
      response = await api.post('/transactions/confirm', data)
    }
    
    if (response?.data.success) {
      showToast({
        type: 'success',
        title: t.value.common.success,
        message: response.data.message || '操作成功'
      })
      
      // Refresh transaction list
      fetchTransactions(true)
      showDetailModal.value = false
    } else {
      showToast({
        type: 'error',
        title: t.value.common.requestFailed,
        message: response?.data.message || '操作失败'
      })
    }
  } catch (err) {
    console.error('Transaction action error:', err)
    showToast({
      type: 'error',
      title: t.value.common.requestFailed,
      message: err.response?.data?.message || t.value.common.networkError
    })
  }
}

async function handleExport() {
  try {
    const response = await api.get('/transactions/export', {
      params: filters.value,
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    showToast({
      type: 'success',
      title: t.value.history.exportSuccess,
      message: t.value.history.exportSuccessMessage
    })
  } catch (err) {
    console.error('Export error:', err)
    showToast({
      type: 'error',
      title: t.value.history.exportFailed,
      message: err.response?.data?.message || t.value.common.networkError
    })
  }
}

function handleBack() {
  router.push('/profile')
}

function formatDate(dateString) {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
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
    0: 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30',
    1: 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30',
    2: 'bg-blue-900/50 text-blue-400 border border-blue-500/30',
    3: 'bg-slate-700 text-slate-400 border border-slate-500/30',
    4: 'bg-rose-900/50 text-rose-400 border border-rose-500/30'
  }
  return colors[status] || colors.success
}

function getStatusText(status) {
  return t.value.mall.status[status] || status
}

function getTypeColor(type) {
  const colors = {
    buy: 'text-emerald-400',
    sell: 'text-rose-400',
    deposit: 'text-blue-400',
    withdraw: 'text-yellow-400'
  }
  return colors[type] || 'text-white'
}

function getTypeText(type) {
  return t.value.history.types[type] || type
}

// Lifecycle
onMounted(() => {
  fetchTransactions(true)
})

// Optional: Auto-refresh when page becomes visible
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && authStore.isAuthenticated) {
      fetchTransactions(true)
    }
  })
}
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