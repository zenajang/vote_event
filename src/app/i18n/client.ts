'use client';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initI18n } from './init';
import { Locale } from './settings';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

export function useClientT(lng: Locale, ns?: string): TFunc {
  const [, rerender] = useState(0);

  useEffect(() => {
    initI18n(lng).then(() => rerender(n => n + 1));
  }, [lng]);

  return (key: string, options?: Record<string, unknown>) => {
    const k = ns ? `${ns}:${key}` : key;
    const v = i18next.t(k, { ...options, returnObjects: false });
    return typeof v === 'string' ? v : '';
  };
}
