import { redirect } from 'next/navigation';
import { i18nConfig } from '@/app/i18n/settings';

export default function Home() {
  redirect(`/${i18nConfig.defaultLocale}/login`);
}