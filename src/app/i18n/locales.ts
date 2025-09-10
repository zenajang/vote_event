import type { Locale } from './settings'

import ko_common from '@/locales/ko/common.json'
import en_common from '@/locales/en/common.json'


export const resources: Record<Locale, Record<string, Record<string, string>>> = {
  ko: { common: ko_common },
  en: { common: en_common },
}

export const namespaces = ['common'] as const
