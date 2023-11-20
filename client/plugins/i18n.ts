import { createI18n } from 'vue-i18n'
import en from '../locales/en-US.json'
import es from '../locales/es-ES.json'
import cat from '../locales/cat-Cat.json'
import fr from '../locales/fr-FR.json'

const langStorage = localStorage.getItem('lang')

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: langStorage || 'en-US',
    messages: {
      'en-US': en, 
      'es-ES': es,
      'cat-CAT': cat,
      'fr-FR': fr
    }
  })

  vueApp.use(i18n)
})