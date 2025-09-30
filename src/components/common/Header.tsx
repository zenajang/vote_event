'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

function HeaderContent() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || '';
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const isLoginPage = pathname === '/login';
  const isClosedPage = /^(?:\/[a-z]{2}(?:-[A-Z]{2})?)?\/closed(?:\/|$)/.test(pathname);

   useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) {
        setUser(user);
        setIsLoadingAuth(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoadingAuth(false);
      }
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
    const loginPath ='/login';
    const current = pathname + (search ? `?${search}` : '');
    router.push(`${loginPath}?redirect=${encodeURIComponent(current)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#E81818]">
      <div className="relative flex h-12 items-center justify-center px-6">
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
          {!isLoginPage && !isClosedPage && (
            isLoadingAuth ? (
              <div className="flex items-center justify-center w-16 h-7">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="h-7 px-3 text-[#E81818] bg-white hover:bg-white/90"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={goLogin}
                className="h-7 px-3 text-[#E81818] bg-white hover:bg-white/90"
              >
                Log In
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