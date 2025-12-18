<template>
  <div class="flex flex-col h-full justify-center px-6 relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-rose-500/10 rounded-full blur-3xl"></div>
    <div class="absolute top-6 right-6 z-20">
      <LanguageSwitcher v-model:currentLang="lang" @update:currentLang="setLang" />
    </div>
    <div class="z-10 w-full max-w-sm mx-auto">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">
          <Shield :size="40" class="text-emerald-400" />
        </div>
        <h1 class="text-3xl font-bold text-white tracking-widest">{{ t.appName }}</h1>
        <p class="text-slate-400 text-sm mt-2">{{ t.appSub }}</p>
      </div>
      <div class="space-y-4">
        <InputField :icon="User" :placeholder="t.login.accPlaceholder" v-model="account" />
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :placeholder="t.login.passPlaceholder" 
          v-model="password"
        />
        <InputField 
          :icon="Key" 
          :isSecure="true" 
          :placeholder="t.login.captchaPlaceholder" 
          v-model="captcha"
        />
        <NeonButton fullWidth @click="handleLogin">{{ t.login.loginBtn }}</NeonButton>
        <div class="flex justify-between text-xs text-slate-400 mt-4">
          <button @click="$router.push('/register')" class="hover:text-emerald-400 underline decoration-slate-600">
            {{ t.login.register }}
          </button>
          <button @click="$router.push('/forgot-password')" class="hover:text-emerald-400 hover:underline decoration-slate-600 transition-all">
            {{ t.login.forgotPass }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key, Shield } from 'lucide-vue-next'
import InputField from '@/components/InputField.vue'
import NeonButton from '@/components/NeonButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/useTranslation'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store = useAppStore()
const { t, lang, setLang } = useTranslation()

const account = ref('')
const password = ref('')
const captcha = ref('')

function handleLogin() {
  router.push('/dashboard')
}
</script>

