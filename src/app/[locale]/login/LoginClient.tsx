// app/[locale]/login/LoginClient.tsx (Client)
'use client';

import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Props = {
  dict: Record<string, string>;
  locale: string;
};

export default function LoginClient({ dict, locale }: Props) {
  const supabase = createClient();
  const t = (k: string) => dict[k] ?? k;

  const signIn = async (provider: 'google' | 'facebook') => {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `next=/${locale}/vote; Path=/; SameSite=Lax${secure}`;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">{t('login.title')}</h1>
        </div>

        <Button variant="outline" className="w-full h-12" onClick={() => signIn('google')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <span className="font-semibold">{t('login.google')}</span>
        </Button>

        <Button
          className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold flex items-center justify-center gap-3 rounded-md shadow-sm"
          onClick={() => signIn('facebook')}
          aria-label={t('login.facebook')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#fff" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.02 1.792-4.688 4.532-4.688 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.492 0-1.952.926-1.952 1.874v2.244h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z"/>
          </svg>
          <span>{t('login.facebook')}</span>
        </Button>

        <Separator />
        <p className="text-xs text-muted-foreground text-center">{t('login.note')}</p>
      </Card>
    </div>
  );
}
