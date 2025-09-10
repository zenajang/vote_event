import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nConfig, type Locale } from './settings'
import { resources, namespaces } from './locales'

let initialized = false

export async function initI18n(lng: Locale) {
  const supported = i18nConfig.locales
  const fallback = i18nConfig.defaultLocale
  const safeLng = supported.includes(lng) ? lng : fallback

  if (!initialized) {
    await i18next.use(initReactI18next).init({
      lng: safeLng,
      fallbackLng: fallback,
      supportedLngs: supported,
      ns: namespaces as unknown as string[],
      defaultNS: i18nConfig.defaultNS,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      resources,         
    })
    initialized = true
  } else if (i18next.language !== safeLng) {
    await i18next.changeLanguage(safeLng)
  }
  return i18next
}
