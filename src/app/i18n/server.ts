'use server';

import { initI18n } from './init';

export async function getServerT(lng: string, ns?: string) {
  const i18n = await initI18n(lng);
  return (key: string, options?: Record<string, unknown>) =>
    i18n.t(ns ? `${ns}:${key}` : key, options);
}
