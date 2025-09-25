'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import LanguageSwitcher from './LanguageSwitcher';
import { i18nConfig } from '@/app/i18n/settings';
import { useTranslation } from '@/app/i18n/useTranslation';
import Image from 'next/image';

function HeaderContent() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 
  const search = searchParams?.toString() || '';
  const [user, setUser] = useState<User | null>(null);

  const first = pathname.split('/')[1] || '';
  const LOCALES = i18nConfig.locales as readonly string[];
  const locale = LOCALES.includes(first) ? first : null;
  const isLoginPage = pathname === '/login' || (locale ? pathname === `/${locale}/login` : false);
  

  const { t } = useTranslation('common');

   useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) setUser(user);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const goLogin = () => {
    const loginPath = locale ? `/${locale}/login` : '/login';
    const current = pathname + (search ? `?${search}` : '');
    router.push(`${loginPath}?redirect=${encodeURIComponent(current)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#E81818]">
      <div className="relative flex h-12 items-center justify-center px-6">
        <div className="absolute left-3 inset-y-0 flex items-center">
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Vote Event Logo"
            width={65}
            height={18}
            priority
          />
        </div>

        <div className="absolute right-3 inset-y-0 flex items-center">
          {!isLoginPage && (
            user ? (
              <div className="flex items-center gap-3">
             {/*   <span className="text-sm text-white/90">
                {Array.from(user.user_metadata?.full_name || user.email || '').length > 4
                  ? Array.from(user.user_metadata?.full_name || user.email || '').slice(0, 4).join('') + '…'
                : user.user_metadata?.full_name || user.email || ''}
              </span> */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="h-7 px-3 text-[#E81818] bg-white hover:bg-white/90"
                >
                  {t('header.logout')}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={goLogin}
                className="h-7 px-3 text-[#E81818] bg-white hover:bg-white/90"
              >
                {t('header.login')}
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-gray-100 animate-pulse" />} >
      <HeaderContent />
    </Suspense>
  );
}