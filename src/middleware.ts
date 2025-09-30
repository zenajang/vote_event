
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const AUTH_FREE_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:login|signup|auth(?:\/.*)?|not-available|closed|open-in-browser)(?:\/|$)/

const PROTECTED_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:vote|results)(?:\/|$)/

function isClosedNow() {
  const d = process.env.NEXT_PUBLIC_VOTE_DEADLINE
  if (!d) return false
  const t = Date.parse(d)
  return !Number.isNaN(t) && Date.now() >= t
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (req.method === 'OPTIONS') return NextResponse.next()

  if (isClosedNow() && !AUTH_FREE_RE.test(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = '/closed'
    url.search = ''
    return NextResponse.redirect(url, 302)
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
