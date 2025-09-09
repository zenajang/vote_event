import i18next from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { i18nConfig } from './settings';
import { addBackend, namespaces } from './locales';

let initialized = false;

export async function initI18n(lng: string) {
  if (!initialized) {
    addBackend();
    await i18next
      .use(initReactI18next)
      .init({
        lng,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        ns: namespaces,
        defaultNS: i18nConfig.defaultNS,
        returnEmptyString: false,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });
    initialized = true;
  } else if (i18next.language !== lng) {
    await i18next.changeLanguage(lng);
  }
  return i18next;
}
