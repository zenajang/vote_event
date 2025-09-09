'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import LanguageSwitcher from './LanguageSwitcher';
import { i18nConfig } from '@/app/i18n/settings';
import { useTranslation } from '@/app/i18n/useTranslation';

export default function Header() {
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

  const { t, lng } = useTranslation('common');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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

  if (isLoginPage) {
    return (
      <header className="w-full border-b bg-background/95">
        <div className="h-12 flex items-center justify-end px-4">
          <LanguageSwitcher />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {t('header.title')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="h-9 px-4 hover:bg-muted hover:text-muted-foreground transition-colors"
              >
                {t('header.logout')}
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={goLogin}
              className="h-9 px-4"
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}