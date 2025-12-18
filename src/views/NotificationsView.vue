<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700 shadow-lg z-10">
      <div class="flex items-center">
        <button @click="$router.push('/dashboard')" class="p-2 mr-2 hover:bg-slate-700 rounded-full">
          <ArrowLeft class="text-white" :size="20" />
        </button>
        <h2 class="text-white font-bold text-lg">{{ t.notification.title }}</h2>
      </div>
      <div class="flex items-center gap-2">
        <button @click="markAllRead" class="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-full" :title="t.notification.markAll">
          <CheckCheck :size="18" />
        </button>
        <button @click="clearAll" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-full" :title="t.notification.clearAll">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
      <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-600">
        <Bell :size="40" class="mb-2 opacity-50" />
        <p>{{ t.notification.empty }}</p>
      </div>
      <div 
        v-for="note in notifications" 
        :key="note.id" 
        :class="`bg-slate-800/50 border rounded-xl p-4 relative group hover:bg-slate-800 transition-all ${note.isRead ? 'border-slate-800' : 'border-slate-700'}`"
      >
        <div v-if="!note.isRead" class="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
        <div class="flex gap-4">
          <div class="mt-1">
            <component :is="getIcon(note.type)" class="text-emerald-400" :size="20" />
          </div>
          <div class="flex-1">
            <h3 :class="`font-bold text-sm mb-1 ${note.isRead ? 'text-slate-400' : 'text-white'}`">{{ getTitle(note) }}</h3>
            <p class="text-xs text-slate-400 mb-2 leading-relaxed">{{ getContent(note) }}</p>
            <div class="flex justify-between items-center">
              <span class="text-[10px] text-slate-500">{{ note.time }}</span>
              <div class="flex gap-3">
                <button v-if="!note.isRead" @click="markOneRead(note.id)" class="flex items-center text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Check :size="12" class="mr-1" />{{ t.notification.markRead }}
                </button>
                <button @click="deleteOne(note.id)" class="flex items-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors">
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Bell, CheckCheck, Trash2, Check, CheckCircle, Clock } from 'lucide-vue-next'
import { useTranslation } from '@/composables/useTranslation'

const { t, lang } = useTranslation()

const notifications = ref([
  { id: 1, type: 'success', title: { zh: '訂單狀態更新', en: 'Order Updated', vi: 'Cập nhật đơn hàng' }, content: { zh: '您的訂單 #ORD20241119001 已確認付款', en: 'Order #ORD20241119001 payment confirmed.', vi: 'Đơn hàng #ORD20241119001 đã xác nhận thanh toán.' }, time: '1m ago', isRead: false },
  { id: 2, type: 'pending', title: { zh: '匹配成功', en: 'Match Found', vi: 'Khớp lệnh thành công' }, content: { zh: '成功匹配商戶訂單，請準備轉帳', en: 'Merchant matched, please prepare transfer.', vi: 'Đã khớp lệnh với thương nhân, vui lòng chuẩn bị chuyển khoản.' }, time: '4m ago', isRead: false },
])

function markAllRead() {
  notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
}

function clearAll() {
  notifications.value = []
}

function deleteOne(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function markOneRead(id) {
  notifications.value = notifications.value.map(n => 
    n.id === id ? { ...n, isRead: true } : n
  )
}

function getIcon(type) {
  if (type === 'success') return CheckCircle
  if (type === 'pending') return Clock
  return Bell
}

function getTitle(note) {
  if (lang.value === 'zh-TW') return note.title.zh
  if (lang.value === 'vi-VN') return note.title.vi
  return note.title.en
}

function getContent(note) {
  if (lang.value === 'zh-TW') return note.content.zh
  if (lang.value === 'vi-VN') return note.content.vi
  return note.content.en
}
</script>

