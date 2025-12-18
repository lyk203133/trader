<template>
  <button 
    @click="!disabled && $emit('click')"
    :class="buttonClass"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  const baseStyle = "font-bold py-3 px-6 rounded relative transition-all duration-200 flex items-center justify-center uppercase tracking-wider"
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400",
    blue: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-emerald-400 hover:text-emerald-400",
    disabled: "bg-slate-700 text-slate-500 border border-slate-600 cursor-not-allowed shadow-none"
  }
  
  const variantClass = props.disabled ? variants.disabled : variants[props.variant]
  const widthClass = props.fullWidth ? 'w-full' : ''
  
  return `${baseStyle} ${variantClass} ${widthClass}`
})
</script>

