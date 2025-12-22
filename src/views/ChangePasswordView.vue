<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/security-center')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.security.changePass }}</h2>
      </div>
    </div>
    <div class="flex-1 p-5 space-y-6">
      <div class="space-y-4">
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :label="t.security.oldPass" 
          v-model="oldPass"
        />
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :label="t.security.newPass" 
          :subLabel="t.security.passHint"
          v-model="newPass"
        />
        <InputField 
          :icon="Lock" 
          :isSecure="true" 
          :label="t.security.confirmPass" 
          v-model="confirmPass"
        />
      </div>
      <NeonButton fullWidth @click="handleSave">{{ t.common.save }}</NeonButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Lock } from 'lucide-vue-next'
import InputField from '@/components/InputField.vue'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()

const oldPass = ref('')
const newPass = ref('')
const confirmPass = ref('')

function handleSave() {
  if (!oldPass.value || !newPass.value || !confirmPass.value) return
  if (newPass.value !== confirmPass.value) return alert(t.value.security.errorMismatch)
  alert(t.value.security.successMsg)
  router.push('/security-center')
}
</script>

