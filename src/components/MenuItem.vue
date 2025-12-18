<template>
  <div 
    @click="$emit('click')" 
    class="flex items-center justify-between p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
  >
    <div class="flex items-center">
      <div class="p-2 bg-slate-800 rounded-lg mr-3 text-emerald-500">
        <component :is="icon" :size="20" />
      </div>
      <div>
        <div class="text-white text-sm font-bold">{{ label }}</div>
        <div v-if="sub" class="text-[10px] text-slate-500">{{ sub }}</div>
      </div>
    </div>
    <ChevronRight :size="16" class="text-slate-600" />
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

defineProps({
  icon: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  sub: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

