'use client';

import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';



export default function LoginClient() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (provider: 'google') => {
    if (isLoading) return;
    setIsLoading(true);
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `next=/main; Path=/; SameSite=Lax${secure}`;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

    const ua = navigator.userAgent || '';
    const isRestrictedInApp = /(NAVER|Instagram|FBAV|FBAN)/i.test(ua);

    if (isRestrictedInApp) {
      window.location.href = '/open-in-browser?redirect=/login';
      return;
    }

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center p-6">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Log In</h1>
        </div>

        <Button variant="outline" className="w-full h-12" onClick={() => signIn('google')} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-semibold">Signing in...</span>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <span className="font-semibold">Log In With Google</span>
            </>
          )}
        </Button>
        <Separator />
        <p className="text-xs text-muted-foreground text-center">You must sign in with Google to vote.</p>
      </Card>
    </div>
  );
}
