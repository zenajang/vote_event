import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import { i18nConfig } from '@/app/i18n/settings';

export default async function Home() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();
  const lng = i18nConfig.defaultLocale;

  if (!user) redirect(`/${lng}/login`);
  redirect(`/${lng}/vote`);
}
