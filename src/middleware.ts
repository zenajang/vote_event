import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'


const PROTECTED_RE = /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:vote|results)(?:\/|$)/

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  if (!PROTECTED_RE.test(pathname)) return NextResponse.next()

  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (pairs) => pairs.forEach(({ name, value, options }) =>
          res.cookies.set({ name, value, ...options })
        ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const seg0 = pathname.split('/').filter(Boolean)[0]
    const login = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(seg0) ? `/${seg0}/login` : '/login'
    const url = new URL(login, req.url)
    url.searchParams.set('redirect', pathname + search)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!auth|api|_next|favicon.ico|.*\\..*).*)'],
}
