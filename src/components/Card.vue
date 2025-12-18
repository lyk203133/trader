<template>
  <div :class="`bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-lg ${className}`">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>

