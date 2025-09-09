'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { i18nConfig } from '@/app/i18n/settings';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const LOCALES = i18nConfig.locales as readonly string[];

  const first = pathname.split('/')[1] || '';
  const hasLocale = LOCALES.includes(first);
  const from = hasLocale ? first : null;
  const value = from ?? i18nConfig.defaultLocale;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    if (lng === from) return;

    const nextPath = from
      ? `/${lng}${pathname.slice(from.length + 1)}`
      : `/${lng}${pathname === '/' ? '' : pathname}`;

    const sp = new URLSearchParams(searchParams.toString());
    const rd = sp.get('redirect');
    if (rd && from && rd.startsWith(`/${from}/`)) {
      sp.set('redirect', `/${lng}${rd.slice(from.length + 1)}`);
    }

    const qs = sp.toString();
    router.push(`${nextPath}${qs ? `?${qs}` : ''}`);
  };

  return (
    <select
      value={value}
      onChange={onChange}
      className="h-9 px-2 border rounded-md text-black"
      aria-label="Select language"
    >
      {LOCALES.map(l => (
        <option key={l} value={l}>{l.toUpperCase()}</option>
      ))}
    </select>
  );
}
