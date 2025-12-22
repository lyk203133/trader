<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-10">
      <div class="flex items-center">
        <button @click="$router.push('/dashboard')" class="p-2 mr-2 hover:bg-slate-700 rounded-full">
          <ArrowLeft class="text-white" :size="20" />
        </button>
        <h2 class="text-white font-bold text-lg">{{ t.announce.title }}</h2>
      </div>
      <button @click="markAllRead" class="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-full">
        <CheckCheck :size="20" />
      </button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
      <div 
        v-for="item in announcements" 
        :key="item.id" 
        @click="toggleExpand(item.id)" 
        :class="`relative bg-slate-800 border rounded-xl p-4 transition-all cursor-pointer hover:bg-slate-700/50 ${item.isRead ? 'border-slate-800' : 'border-emerald-500/50'}`"
      >
        <div v-if="!item.isRead" class="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        <div class="pr-6">
          <h3 :class="`font-bold text-sm mb-1 ${item.isRead ? 'text-slate-300' : 'text-white'}`">{{ getTitle(item) }}</h3>
          <div class="flex items-center text-[10px] text-slate-500 mb-2">
            <Clock :size="10" class="mr-1" />{{ item.time }}
          </div>
          <p :class="`text-xs text-slate-400 leading-relaxed ${expandedId === item.id ? '' : 'line-clamp-2'}`">
            {{ getContent(item) }}
          </p>
        </div>
        <div class="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
          <span class="text-[10px] text-emerald-500/70 flex items-center">
            <Info :size="10" class="mr-1" />
            {{ expandedId === item.id ? t.announce.clickCollapse : t.announce.clickExpand }}
          </span>
          <button 
            v-if="!item.isRead" 
            @click.stop="markOneRead(item.id)" 
            class="flex items-center text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-900/50 border border-emerald-500/20"
          >
            <Check :size="10" class="mr-1" />{{ t.announce.markRead }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, CheckCheck, Clock, Info, Check } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'

const { t, lang } = useTranslation()

const expandedId = ref(null)
const announcements = ref([
  { 
    id: 1, 
    title: { zh: '系統維護公告', en: 'System Maintenance', vi: 'Thông báo bảo trì' }, 
    time: '2023-11-28', 
    content: { zh: '我們將於 2023-11-30 凌晨 02:00 進行系統升級維護，預計耗時 2 小時。維護期間暫停所有交易服務，請提前做好資金安排。', en: 'System maintenance scheduled for 2023-11-30 02:00 AM.', vi: 'Hệ thống sẽ bảo trì nâng cấp vào 02:00 sáng ngày 30/11/2023.' }, 
    isRead: false 
  },
  { 
    id: 2, 
    title: { zh: '反詐騙提醒', en: 'Security Alert', vi: 'Cảnh báo lừa đảo' }, 
    time: '2023-11-25', 
    content: { zh: '近期詐騙猖獗，請勿相信任何非官方管道的投資訊息。本平台不會要求用戶私下轉帳或提供密碼，請提高警覺。', en: 'Please be aware of phishing scams. Do not trust unofficial channels.', vi: 'Gần đây có nhiều lừa đảo, vui lòng không tin vào các kênh không chính thức.' }, 
    isRead: false 
  }
])

function markAllRead() {
  announcements.value = announcements.value.map(a => ({ ...a, isRead: true }))
}

function markOneRead(id) {
  announcements.value = announcements.value.map(a => 
    a.id === id ? { ...a, isRead: true } : a
  )
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function getTitle(item) {
  if (lang.value === 'zh-TW') return item.title.zh
  if (lang.value === 'vi-VN') return item.title.vi
  return item.title.en
}

function getContent(item) {
  if (lang.value === 'zh-TW') return item.content.zh
  if (lang.value === 'vi-VN') return item.content.vi
  return item.content.en
}
</script>

