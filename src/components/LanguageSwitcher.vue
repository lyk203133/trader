<template>
  <div class="relative group">
    <Globe :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
    <select
      :value="currentLang"
      @change="$emit('update:currentLang', $event.target.value)"
      class="bg-slate-800 border border-slate-700 rounded-full pl-9 pr-8 py-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500 focus:border-emerald-500 appearance-none outline-none cursor-pointer transition-all relative z-0"
    >
      <option value="zh-TW">繁體中文</option>
      <option value="en-US">English</option>
      <option value="vi-VN">Tiếng Việt</option>
    </select>
    <ChevronDown :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
  </div>
</template>

<script setup>
import { Globe, ChevronDown } from 'lucide-vue-next'

defineProps({
  currentLang: {
    type: String,
    required: true
  }
})

defineEmits(['update:currentLang'])
</script>

