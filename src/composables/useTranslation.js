import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { TRANSLATIONS } from '@/i18n/translations'

export function useTranslation() {
  const store = useAppStore()
  
  const t = computed(() => TRANSLATIONS[store.lang])
  
  return {
    t,
    lang: computed(() => store.lang),
    setLang: store.setLang
  }
}

