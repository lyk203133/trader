<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="handleBack" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.account.title }}</h2>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p class="text-slate-400 text-sm">{{ t.common.loading }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-rose-500 mb-3 text-center">{{ error }}</div>
      <button 
        @click="fetchAccountInfo"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
      >
        {{ t.common.retry }}
      </button>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
      <!-- Status Messages -->
      <div v-if="accountInfo.status === 'pending'" class="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Clock class="text-yellow-500 shrink-0" :size="20" />
        <div>
          <h3 class="text-yellow-500 font-bold text-sm mb-1">{{ t.account.status.pending }}</h3>
          <p class="text-xs text-yellow-500/80">{{ t.account.pendingDesc }}</p>
        </div>
      </div>
      
      <div v-if="accountInfo.status === 'rejected'" class="bg-rose-900/30 border border-rose-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <XCircle class="text-rose-500 shrink-0" :size="20" />
        <div>
          <h3 class="text-rose-500 font-bold text-sm mb-1">{{ t.account.status.rejected }}</h3>
          <p class="text-xs text-rose-500/80">{{ t.account.rejectedDesc }}</p>
          <p v-if="accountInfo.reject_reason" class="text-xs text-rose-500/80 mt-2">
            {{ t.account.rejectReason }}: {{ accountInfo.reject_reason }}
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Verified Account Info -->
        <div v-if="accountInfo.is_verified === true" class="bg-slate-800 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
            {{ t.account.status.verified }}
          </div>
          <div class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.bankName }}</p>
            <p class="text-white font-bold">{{ accountInfo.bank_name }}</p>
          </div>
          <div class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.accountName }}</p>
            <p class="text-white font-bold">{{ accountInfo.account_name }}</p>
          </div>
          <div class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.accNo }}</p>
            <p class="text-white font-mono font-bold text-lg">{{ formatAccountNumber(accountInfo.account_number) }}</p>
          </div>
          <div v-if="accountInfo.bank_code" class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.bankCode }}</p>
            <p class="text-white font-mono font-bold">{{ accountInfo.bank_code }}</p>
          </div>
          <div v-if="accountInfo.branch_name" class="mb-4">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.branchName }}</p>
            <p class="text-white">{{ accountInfo.branch_name }}</p>
          </div>
          <div v-if="accountInfo.verified_at" class="pt-4 border-t border-slate-700/30">
            <p class="text-xs text-slate-400 mb-1">{{ t.account.verifiedTime }}</p>
            <p class="text-xs text-slate-300">{{ formatDate(accountInfo.verified_at) }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <NeonButton 
            v-if="accountInfo.status !== 'pending' && accountInfo.status !== 'editing'" 
            variant="outline" 
            fullWidth 
            @click="startEditing"
          >
            <Edit3 :size="16" class="mr-2"/> 
            {{ accountInfo.id ? t.account.edit : t.account.add }}
          </NeonButton>
          
          <NeonButton 
            v-if="accountInfo.status === 'verified'" 
            variant="danger" 
            class="w-24"
            @click="handleDelete"
          >
            <Trash2 :size="16" />
          </NeonButton>
        </div>

        <!-- Edit Form -->
        <div v-if="isEditing" class="animate-in fade-in slide-in-from-bottom duration-300 space-y-4">
          <div>
            <label class="text-xs text-slate-400 mb-1 block">{{ t.account.bankName }}</label>
            <select 
              v-model="formData.bank_name"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            >
              <option value="VIB">VIB</option>
              <option value="PG BANK">PG BANK</option>
              <option value="VTB">VTB</option>
              <option value="MB">MB</option>
              <option value="VCB">VCB</option>
              <option value="MSB">MSB</option>
              <option value="ACB">ACB</option>
              <option value="SEA">SEA</option>
              <option value="EIB">EIB</option>
              <option value="OCB">OCB</option>
              <option value="VIKKI ">VIKKI</option>
            </select>
          </div>
          <!--InputField 
            :icon="Building2" 
            :placeholder="t.account.bankName" 
            v-model="formData.bank_name"
            required
          /-->
          
          <InputField 
            :icon="User" 
            :placeholder="t.account.accountName" 
            v-model="formData.account_name"
            required
          />
          
          <InputField 
            :icon="CreditCard" 
            :placeholder="t.account.accNo" 
            v-model="formData.account_number"
            required
          />
          
          <div class="grid grid-cols-2 gap-4">
            <InputField 
              :icon="Hash" 
              :placeholder="t.account.bankCode" 
              v-model="formData.bank_code"
              class="col-span-1"
            />
            
            <InputField 
              :icon="MapPin" 
              :placeholder="t.account.branchName" 
              v-model="formData.branch_name"
              class="col-span-1"
            />
          </div>

          <!-- Upload Cards -->
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p class="text-xs text-slate-400 mb-3">{{ t.account.cardUpload }} <span class="text-rose-400">*</span></p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-400 mb-2">{{ t.account.cardFront }}</label>
                <div class="relative">
                  <input 
                    type="file" 
                    ref="cardFrontInput"
                    accept="image/*" 
                    @change="handleFileUpload('card_front', $event)"
                    class="hidden"
                  />
                  <button 
                    @click="$refs.cardFrontInput.click()" 
                    :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-900 transition-all ${uploads.card_front ? 'border-emerald-500 text-emerald-400' : 'border-slate-600'}`"
                  >
                    <Upload v-if="!uploads.card_front" class="mb-2" />
                    <Image v-else class="mb-2 text-emerald-400" />
                    <span class="text-xs">
                      {{ uploads.card_front ? t.account.uploaded : t.common.upload }}
                    </span>
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-xs text-slate-400 mb-2">{{ t.account.cardBack }}</label>
                <div class="relative">
                  <input 
                    type="file" 
                    ref="cardBackInput"
                    accept="image/*" 
                    @change="handleFileUpload('card_back', $event)"
                    class="hidden"
                  />
                  <button 
                    @click="$refs.cardBackInput.click()" 
                    :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-900 transition-all ${uploads.card_back ? 'border-emerald-500 text-emerald-400' : 'border-slate-600'}`"
                  >
                    <Upload v-if="!uploads.card_back" class="mb-2" />
                    <Image v-else class="mb-2 text-emerald-400" />
                    <span class="text-xs">
                      {{ uploads.card_back ? t.account.uploaded : t.common.upload }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Code Upload -->
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p class="text-xs text-slate-400 mb-3">{{ t.account.qr }} <span class="text-rose-400">({{ t.account.qrHint }})</span></p>
            <div class="relative">
              <input 
                type="file" 
                ref="qrCodeInput"
                accept="image/*" 
                @change="handleFileUpload('qr_code', $event)"
                class="hidden"
              />
              <button 
                @click="$refs.qrCodeInput.click()" 
                :class="`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 bg-slate-900 transition-all ${uploads.qr_code ? 'border-emerald-500 text-emerald-400' : 'border-slate-600'}`"
              >
                <Upload v-if="!uploads.qr_code" class="mb-2" />
                <Image v-else class="mb-2 text-emerald-400" />
                <span class="text-xs">
                  {{ uploads.qr_code ? t.account.uploaded : t.common.upload }}
                </span>
              </button>
            </div>
          </div>

          <!-- Preview Uploaded Images -->
          <div v-if="uploadedImages.length > 0" class="bg-slate-800/50 rounded-xl p-4">
            <p class="text-xs text-slate-400 mb-3">{{ t.account.uploadedImages }}</p>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="(image, index) in uploadedImages" 
                :key="index"
                class="relative"
              >
                <img 
                  :src="image.url" 
                  :alt="image.name"
                  class="w-full h-20 object-cover rounded-lg"
                />
                <button 
                  @click="removeUploadedImage(index)"
                  class="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <NeonButton 
            fullWidth 
            @click="handleSubmit"
            :loading="submitting"
            :disabled="!isFormValid || submitting"
          >
            {{ t.account.submit }}
          </NeonButton>
          
          <button 
            @click="cancelEditing" 
            class="w-full text-center text-slate-500 text-xs py-2 hover:text-white"
            :disabled="submitting"
          >
            {{ t.common.cancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Clock, 
  Edit3, 
  Building2, 
  Upload, 
  User, 
  CreditCard, 
  Hash, 
  MapPin, 
  Trash2, 
  XCircle,
  Image
} from 'lucide-vue-next'
import InputField from '@/components/InputField.vue'
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
const error = ref('')
const submitting = ref(false)
const isEditing = ref(false)

// Data
const accountInfo = ref({
  id: null,
  bank_name: '',
  account_name: '',
  account_number: '',
  bank_code: '',
  branch_name: '',
  status: 'none', // none, pending, verified, rejected
  reject_reason: '',
  verified_at: null,
  created_at: null,
  updated_at: null
})

const formData = ref({
  bank_name: '',
  account_name: '',
  account_number: '',
  bank_code: '',
  branch_name: ''
})

const uploads = ref({
  card_front: null,
  card_back: null,
  qr_code: null
})

const uploadedImages = ref([])

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.bank_name.trim() &&
    formData.value.account_name.trim() &&
    formData.value.account_number.trim() &&
    (uploads.value.card_front || accountInfo.value.id) && // 新申請需要上傳，編輯可選
    (uploads.value.qr_code || accountInfo.value.id)
  )
})

// Methods
async function fetchAccountInfo() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/payment-account')
    
    if (response.data.success) {
      accountInfo.value = response.data.data || {}
      
      // 如果有數據，填充到表單中
      if (accountInfo.value.id) {
        formData.value = {
          bank_name: accountInfo.value.bank_name || '',
          account_name: accountInfo.value.account_name || '',
          account_number: accountInfo.value.account_number || '',
          bank_code: accountInfo.value.bank_code || '',
          branch_name: accountInfo.value.branch_name || ''
        }
      }
    } else if (response.data.code === 404) {
      // 沒有支付帳戶是正常的
      accountInfo.value = {
        status: 'none',
        id: null
      }
    } else {
      error.value = response.data.message || t.common.requestFailed
    }
  } catch (err) {
    console.error('Fetch account info error:', err)
    
    // 404 表示沒有支付帳戶，這是正常的
    if (err.response?.status === 404) {
      accountInfo.value = {
        status: 'none',
        id: null
      }
    } else {
      error.value = err.response?.data?.message || err.message || t.common.networkError
      
      if (err.response?.status === 401) {
        authStore.logout()
        router.push('/login')
      }
    }
  } finally {
    loading.value = false
  }
}

function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  
  // 重置表單為當前帳戶信息
  if (accountInfo.value.id) {
    formData.value = {
      bank_name: accountInfo.value.bank_name || '',
      account_name: accountInfo.value.account_name || '',
      account_number: accountInfo.value.account_number || '',
      bank_code: accountInfo.value.bank_code || '',
      branch_name: accountInfo.value.branch_name || ''
    }
  } else {
    formData.value = {
      bank_name: '',
      account_name: '',
      account_number: '',
      bank_code: '',
      branch_name: ''
    }
  }
  
  uploads.value = {
    card_front: null,
    card_back: null,
    qr_code: null
  }
  
  uploadedImages.value = []
}

function handleFileUpload(type, event) {
  const file = event.target.files[0]
  if (!file) return

  // 驗證文件類型
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 2 * 1024 * 1024 // 2MB

  if (!validTypes.includes(file.type)) {
    showToast({
      type: 'error',
      title: t.common.uploadError,
      message: t.account.invalidImageType
    })
    return
  }

  if (file.size > maxSize) {
    showToast({
      type: 'error',
      title: t.common.uploadError,
      message: t.account.imageTooLarge
    })
    return
  }

  // 創建預覽
  const reader = new FileReader()
  reader.onload = (e) => {
    uploads.value[type] = file
    uploadedImages.value.push({
      name: file.name,
      url: e.target.result,
      type: type
    })
  }
  reader.readAsDataURL(file)
}

function removeUploadedImage(index) {
  const image = uploadedImages.value[index]
  uploads.value[image.type] = null
  uploadedImages.value.splice(index, 1)
}

async function handleSubmit() {
  if (!isFormValid.value) {
    showToast({
      type: 'error',
      title: t.account.validationError,
      message: t.account.pleaseFillAllRequired
    })
    return
  }

  submitting.value = true

  try {
    // 創建 FormData 用於文件上傳
    const formDataToSend = new FormData()
    
    // 添加表單數據
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key]) {
        formDataToSend.append(key, formData.value[key])
      }
    })

    // 添加文件
    if (uploads.value.card_front) {
      formDataToSend.append('card_front', uploads.value.card_front)
    }
    if (uploads.value.card_back) {
      formDataToSend.append('card_back', uploads.value.card_back)
    }
    if (uploads.value.qr_code) {
      formDataToSend.append('qr_code', uploads.value.qr_code)
    }

    let response
    if (accountInfo.value.id) {
      // 更新現有帳戶
      response = await api.post(`/payment-account-update?id=${accountInfo.value.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      // 創建新帳戶
      response = await api.post('/payment-account-update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.value.account.submitSuccess,
        message: response.data.message || t.value.account.submitSuccessMessage
      })

      // 更新本地數據
      accountInfo.value = response.data.data.account
      accountInfo.value.status = 'pending' // 提交後變為審核中
      
      // 退出編輯模式
      isEditing.value = false
    } else {
      showToast({
        type: 'error',
        title: t.value.account.submitFailed,
        message: response.data.message || t.value.common.requestFailed
      })
    }
  } catch (err) {
    console.error('Submit account error:', err)
    showToast({
      type: 'error',
      title: t.value.account.submitFailed,
      message: err.response?.data?.message || err.message || t.value.common.networkError
    })
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!accountInfo.value.id) return

  if (!confirm(t.value.account.confirmDelete)) return

  try {
    const response = await api.delete(`/payment-account-delete/${accountInfo.value.id}`)
    
    if (response.data.success) {
      showToast({
        type: 'success',
        title: t.value.account.deleteSuccess,
        message: t.value.account.deleteSuccessMessage
      })
      
      // 重置數據
      accountInfo.value = {
        status: 'none',
        id: null
      }
    } else {
      showToast({
        type: 'error',
        title: t.value.account.deleteFailed,
        message: response.data.message || t.value.common.requestFailed
      })
    }
  } catch (err) {
    console.error('Delete account error:', err)
    showToast({
      type: 'error',
      title: t.value.account.deleteFailed,
      message: err.response?.data?.message || t.value.common.networkError
    })
  }
}

function handleBack() {
  router.push('/profile')
}

function formatAccountNumber(accountNumber) {
  if (!accountNumber) return '**** **** **** ****'
  // 只顯示最後4位，其他用*代替
  const visibleDigits = 4
  const lastDigits = accountNumber.slice(-visibleDigits)
  const maskedDigits = '*'.repeat(Math.max(0, accountNumber.length - visibleDigits))
  return `${maskedDigits}${lastDigits}`
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString([], { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchAccountInfo()
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

.slide-in-from-bottom {
  animation-name: slideInFromBottom;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>