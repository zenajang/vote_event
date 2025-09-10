import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import { i18nConfig } from './settings'

let initialized = false

export async function initI18n(lng: string) {
  if (!initialized) {
    await i18next
      .use(HttpBackend)          // ✅ public/locales 사용
      .use(initReactI18next)
      .init({
        lng,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        ns: ['common'],         // 필요하면 네임스페이스 추가
        defaultNS: 'common',
        interpolation: { escapeValue: false },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json', // ✅ public/locales 사용
        },
        react: { useSuspense: false },
      })
    initialized = true
  } else if (i18next.language !== lng) {
    await i18next.changeLanguage(lng)
  }
  return i18next
}
