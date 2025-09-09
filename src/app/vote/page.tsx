import { redirect } from 'next/navigation';
import { i18nConfig } from '@/app/i18n/settings';

export default function Page() {
  redirect(`/${i18nConfig.defaultLocale}/vote`);
}