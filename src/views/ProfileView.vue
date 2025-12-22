<template>
  <div class="flex flex-col h-full bg-slate-900 relative">
    <div class="p-6 bg-slate-800 pb-10 rounded-b-[2rem] shadow-lg mb-4">
      <div class="flex justify-between items-start">
        <button @click="$router.push('/dashboard')">
          <ArrowLeft class="text-white" />
        </button>
        <LanguageSwitcher v-model:currentLang="lang" @update:currentLang="setLang" />
      </div>
      
      <!-- Avatar Section -->
      <div class="flex flex-col items-center mt-[-20px]">
        <div class="relative group cursor-pointer" @click="handleAvatarClick">
          <div class="w-24 h-24 rounded-full border-4 border-slate-900 p-1 bg-gradient-to-tr from-emerald-500 to-slate-700 shadow-xl overflow-hidden relative">
            <img 
              v-if="store.userInfo.avatar"
              :src="store.userInfo.avatar" 
              alt="avatar" 
              class="w-full h-full rounded-full object-cover bg-slate-900" 
            />
            <img 
              v-else
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="avatar" 
              class="rounded-full bg-slate-900 w-full h-full" 
            />
            <!-- Overlay Hint -->
            <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera class="text-white" :size="24" />
            </div>
          </div>
          <input type="file" ref="fileInputRef" @change="handleFileChange" hidden accept="image/*" />
        </div>

        <!-- Nickname Section -->
        <div class="mt-3 flex items-center justify-center gap-2 h-8">
          <div v-if="isEditingName" class="flex items-center bg-slate-900 rounded-full px-2 border border-emerald-500 animate-in fade-in duration-200">
            <input 
              v-model="tempName" 
              type="text"
              class="bg-transparent text-white text-sm font-bold w-32 outline-none text-center"
              @keyup.enter="handleNameSave"
            />
            <button @click="handleNameSave" class="p-1 text-emerald-400 hover:text-white">
              <Check :size="16"/>
            </button>
            <button @click="isEditingName = false" class="p-1 text-rose-400 hover:text-white">
              <X :size="16"/>
            </button>
          </div>
          <template v-else>
            <h2 class="text-xl font-bold text-white">{{ store.userInfo.nickname }}</h2>
            <button @click="isEditingName = true" class="text-slate-500 hover:text-emerald-400 transition-colors">
              <Edit3 :size="16" />
            </button>
          </template>
        </div>
        <p class="text-slate-400 text-xs mt-1">UID: 88392010</p>
      </div>

      <div class="flex justify-around mt-6">
        <div class="text-center">
          <div class="text-lg font-mono font-bold text-white">128</div>
          <div class="text-[10px] text-slate-500 uppercase">{{ t.profile.totalOrders }}</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-mono font-bold text-emerald-400">99%</div>
          <div class="text-[10px] text-slate-500 uppercase">{{ t.profile.rate }}</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-mono font-bold text-white">Level 3</div>
          <div class="text-[10px] text-slate-500 uppercase">{{ t.profile.level }}</div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar">
      <div class="mx-4 bg-slate-900 rounded-xl overflow-hidden mb-4">
        <p class="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{{ t.profile.groupTrans }}</p>
        <MenuItem :icon="FileText" :label="t.profile.record" @click="$router.push('/transaction-history')" />
        <MenuItem :icon="CreditCard" :label="t.profile.account" @click="$router.push('/payment-account')" />
      </div>
      
      <!-- NEW GROUP: Referral & Membership -->
      <div class="mx-4 bg-slate-900 rounded-xl overflow-hidden mb-4">
        <p class="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Center</p>
        <MenuItem :icon="Users" :label="t.profile.referral" @click="$router.push('/referral-center')" />
        <MenuItem :icon="Crown" :label="t.profile.membership" @click="$router.push('/membership')" />
      </div>

      <div class="mx-4 bg-slate-900 rounded-xl overflow-hidden">
        <p class="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">{{ t.profile.groupSys }}</p>
        <MenuItem :icon="Shield" :label="t.profile.security" @click="$router.push('/security-center')" />
        <MenuItem :icon="User" :label="t.profile.service" @click="$router.push('/customer-service')" />
        <div class="p-4 mt-4">
          <NeonButton variant="outline" fullWidth @click="$router.push('/login')">
            <LogOut :size="16" class="mr-2" />{{ t.profile.logout }}
          </NeonButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Camera, Check, X, Edit3, FileText, CreditCard, Users, Crown, Shield, User, LogOut } from 'lucide-vue-next'
import NeonButton from '@/components/NeonButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import MenuItem from '@/components/MenuItem.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAppStore } from '@/stores/app'

const { t, lang, setLang } = useTranslation()
const store = useAppStore()

const isEditingName = ref(false)
const tempName = ref(store.userInfo.nickname)
const fileInputRef = ref(null)

function handleNameSave() {
  store.updateUserInfo({ nickname: tempName.value })
  isEditingName.value = false
}

function handleAvatarClick() {
  fileInputRef.value.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      store.updateUserInfo({ avatar: reader.result })
    }
    reader.readAsDataURL(file)
  }
}
</script>

