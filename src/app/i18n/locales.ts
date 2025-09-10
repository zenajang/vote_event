import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { i18nConfig } from './settings'


export const namespaces = [i18nConfig.defaultNS] as const

export function addBackend() {
  i18next.use(HttpBackend)
}

export const backendOptions = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
}
