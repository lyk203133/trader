<template>
  <div class="mb-4">
    <label v-if="label" class="block text-slate-400 text-xs mb-1 uppercase tracking-wider">
      {{ label }}
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-emerald-500" />
      </div>
      <input 
        :type="finalType" 
        class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 pr-10 p-3 placeholder-slate-500 transition-colors" 
        :placeholder="placeholder" 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)" 
      />
      <button 
        v-if="isSecure"
        type="button"
        @click="toggleShow"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-emerald-400 transition-colors"
      >
        <component :is="showContent ? EyeOff : Eye" :size="18" />
      </button>
    </div>
    <p v-if="subLabel" class="mt-1 text-xs text-slate-500">{{ subLabel }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  modelValue: [String, Number],
  label: String,
  subLabel: String,
  isSecure: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const showContent = ref(!props.isSecure)

const finalType = computed(() => {
  if (props.isSecure) {
    return showContent.value ? 'text' : 'password'
  }
  return props.type
})

function toggleShow() {
  showContent.value = !showContent.value
}
</script>

