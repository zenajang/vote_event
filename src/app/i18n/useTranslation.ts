'use client'

import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation' // usePathname 추가
import i18next from 'i18next'
import { initI18n } from './init'
import { i18nConfig, type Locale } from './settings'

type TFunc = (key: string, options?: Record<string, unknown>) => string

export function useTranslation(ns: string = i18nConfig.defaultNS): { t: TFunc; lng: Locale } {
  const { locale } = useParams() as { locale?: string }
  const pathname = usePathname() // 추가
  const list = i18nConfig.locales as readonly string[]  
  const lng = ((locale && list.includes(locale)) ? locale : i18nConfig.defaultLocale) as Locale

  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    setInitialized(false) // 재초기화
    initI18n(lng).then(() => setInitialized(true))
  }, [lng, pathname]) // pathname도 의존성에 추가

  const t: TFunc = (key, options) => {
    if (!initialized) {
      return ''
    }
    
    const k = ns ? `${ns}:${key}` : key
    const v = i18next.t(k, { ...options, returnObjects: false })
    return typeof v === 'string' ? v : ''
  }

  return { t, lng }
}