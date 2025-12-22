<template>
  <div class="flex flex-col h-full bg-slate-900">
    <div class="p-4 flex items-center bg-slate-800 shadow-lg z-10">
      <button @click="$router.push('/profile')" class="p-2 mr-2">
        <ArrowLeft class="text-white" />
      </button>
      <div>
        <h2 class="text-white font-bold text-lg">{{ t.service.title }}</h2>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar flex flex-col">
      <div class="flex-1 space-y-6">
        <p class="text-slate-400 text-xs">{{ t.service.desc }}</p>
        <div class="space-y-4">
          <div>
            <label class="text-xs text-slate-500 block mb-1">{{ t.service.subject }}</label>
            <input 
              type="text" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500" 
              :placeholder="t.service.placeholderSub" 
              v-model="subject"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">{{ t.service.content }}</label>
            <textarea 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-500 h-32 resize-none" 
              :placeholder="t.service.placeholderContent" 
              v-model="content"
            ></textarea>
          </div>
          <div>
            <label class="text-xs text-slate-500 block mb-1">{{ t.service.attachment }}</label>
            <div class="space-y-2 mb-2">
              <div 
                v-for="(file, idx) in attachments" 
                :key="idx" 
                class="flex items-center justify-between bg-slate-800 border border-slate-700 rounded p-2 px-3"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                  <FileImage :size="14" class="text-emerald-400 flex-shrink-0" />
                  <span class="text-xs text-slate-300 truncate">{{ file }}</span>
                </div>
                <button @click="removeAttachment(idx)" class="text-slate-500 hover:text-rose-400">
                  <XCircle :size="14" />
                </button>
              </div>
            </div>
            <button @click="addAttachment" class="w-full h-12 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs hover:border-emerald-500 hover:text-emerald-400 transition-colors">
              <Upload :size="14" class="mr-2" />{{ t.common.addFile }}
            </button>
          </div>
          <NeonButton fullWidth @click="handleSend">{{ t.service.send }}</NeonButton>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-800">
        <p class="text-center text-xs text-slate-500 mb-4">{{ t.service.social }}</p>
        <div class="flex justify-center gap-6">
          <button class="flex flex-col items-center gap-1 group">
            <div class="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2] transition-colors">
              <Facebook :size="20" class="text-[#1877F2] group-hover:text-white" />
            </div>
            <span class="text-[10px] text-slate-400">Facebook</span>
          </button>
          <button class="flex flex-col items-center gap-1 group">
            <div class="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc] transition-colors">
              <Send :size="20" class="text-[#0088cc] group-hover:text-white" />
            </div>
            <span class="text-[10px] text-slate-400">Telegram</span>
          </button>
          <button class="flex flex-col items-center gap-1 group">
            <div class="w-10 h-10 rounded-full bg-[#00B900]/20 flex items-center justify-center group-hover:bg-[#00B900] transition-colors">
              <MessageCircle :size="20" class="text-[#00B900] group-hover:text-white" />
            </div>
            <span class="text-[10px] text-slate-400">Line</span>
          </button>
          <button class="flex flex-col items-center gap-1 group">
            <div class="w-10 h-10 rounded-full bg-[#0068FF]/20 flex items-center justify-center group-hover:bg-[#0068FF] transition-colors">
              <MessageSquare :size="20" class="text-[#0068FF] group-hover:text-white" />
            </div>
            <span class="text-[10px] text-slate-400">Zalo</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, FileImage, XCircle, Upload, Facebook, Send, MessageCircle, MessageSquare } from 'lucide-vue-next'
import NeonButton from '@/components/NeonButton.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const subject = ref('')
const content = ref('')
const attachments = ref([])

function addAttachment() {
  const newFile = `Screenshot_${attachments.value.length + 1}.jpg`
  attachments.value.push(newFile)
}

function removeAttachment(index) {
  attachments.value.splice(index, 1)
}

function handleSend() {
  if (!subject.value || !content.value) return alert('Please fill all fields')
  alert(`${t.value.common.success}\nAttachments: ${attachments.value.length}`)
  subject.value = ''
  content.value = ''
  attachments.value = []
}
</script>

