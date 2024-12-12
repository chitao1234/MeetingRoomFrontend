<template>
  <div class="language-switcher">
    <button 
      v-for="locale in availableLocales" 
      :key="locale.code"
      @click="switchLanguage(locale.code)"
      :class="['lang-btn', { active: currentLocale === locale.code }]"
    >
      {{ locale.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
]

const currentLocale = computed(() => locale.value)

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang) // Save preference
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.lang-btn:hover:not(.active) {
  background: var(--background-light);
}
</style> 