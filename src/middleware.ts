import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_COUNTRIES = new Set(['KR'])

const AUTH_FREE_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:login|signup|auth(?:\/.*)?|not-available)(?:\/|$)/

const PROTECTED_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:vote|results)(?:\/|$)/

function getCountry(req: NextRequest) {
  return (
    process.env.TEST_FORCE_COUNTRY ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).geo?.country ||
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    ''
  )
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (req.method === 'OPTIONS') return NextResponse.next()

  const country = getCountry(req)
  if (!ALLOWED_COUNTRIES.has(country)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (AUTH_FREE_RE.test(pathname)) return NextResponse.next()

  if (!PROTECTED_RE.test(pathname)) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (pairs) =>
          pairs.forEach(({ name, value, options }) =>
            res.cookies.set({ name, value, ...options })
          ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname + search)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt)).*)',
  ],
}
