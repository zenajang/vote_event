import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerAction } from '@/lib/supabase/server-action';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = await createServerAction();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const jar = await cookies();
  const next = jar.get('next')?.value || `/main`;
  jar.set('next', '', { path: '/', maxAge: 0 });

  return NextResponse.redirect(new URL(next, url.origin));
}
