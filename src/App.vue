<template>
  <div 
    class="w-full h-[100dvh] bg-black text-slate-200 font-sans flex items-center justify-center bg-fixed overflow-hidden"
    style="background-image: radial-gradient(circle at 50% 120%, #1e293b 10%, #000000 80%)"
  >
    <div class="w-full h-full md:w-[400px] md:h-[92vh] md:max-h-[920px] md:rounded-[3rem] md:border-[8px] md:border-slate-800 bg-slate-900 overflow-hidden relative shadow-2xl flex flex-col transition-all duration-300">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

