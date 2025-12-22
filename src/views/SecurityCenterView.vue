<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/profile')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.security.title }}</h2>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-4 no-scrollbar">
      <div class="bg-slate-900 rounded-xl overflow-hidden mb-4 border border-slate-800">
        <MenuItem :icon="Lock" :label="t.security.changePass" @click="$router.push('/change-password')" />
        <MenuItem :icon="Shield" :label="t.security.changePin" @click="$router.push('/change-pin')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Lock, Shield } from 'lucide-vue-next'
import MenuItem from '@/components/MenuItem.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script>

