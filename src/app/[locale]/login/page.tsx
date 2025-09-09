// app/[locale]/login/page.tsx (Server Component)
import LoginClient from './LoginClient';
import { headers } from 'next/headers';
import { i18nConfig } from '@/app/i18n/settings';

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;                    
  const list = i18nConfig.locales as unknown as string[];
  const lng = list.includes(locale) ? locale : i18nConfig.defaultLocale;

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const origin = `${proto}://${host}`;

  const dict = await fetch(`${origin}/locales/${lng}/common.json`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  }).then(r => r.json());

  return <LoginClient dict={dict} locale={lng} />;
}
