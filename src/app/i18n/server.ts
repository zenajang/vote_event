'use server';

import { initI18n } from './init';
import { Locale } from './settings';

export async function getServerT(lng: Locale, ns?: string) {
  const i18n = await initI18n(lng);
  return (key: string, options?: Record<string, unknown>) =>
    i18n.t(ns ? `${ns}:${key}` : key, options);
}
