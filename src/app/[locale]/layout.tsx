import type { ReactNode } from 'react';
import { i18nConfig } from '@/app/i18n/settings';

// 서버 컴포넌트
export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((l) => ({ locale: l }));
}
