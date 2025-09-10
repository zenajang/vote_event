'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import i18next from 'i18next'
import { initI18n } from './init'
import { i18nConfig, type Locale } from './settings'

type TFunc = (key: string, options?: Record<string, unknown>) => string

export function useTranslation(ns: string = i18nConfig.defaultNS): { t: TFunc; lng: Locale } {
  const { locale } = useParams() as { locale?: string }
  const list = i18nConfig.locales as readonly string[]  
  const lng = ((locale && list.includes(locale)) ? locale : i18nConfig.defaultLocale) as Locale

  const [, force] = useState(0)
  useEffect(() => {
    initI18n(lng).then(() => force(n => n + 1))
  }, [lng])

  const t: TFunc = (key, options) => {
    const k = ns ? `${ns}:${key}` : key
    const v = i18next.t(k, { ...options, returnObjects: false })
    return typeof v === 'string' ? v : ''
  }

  return { t, lng }
}
