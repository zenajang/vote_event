import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'


const ALLOWED_COUNTRIES = new Set(["KR"]); 

function getCountry(req: NextRequest) {
  return (
    process.env.TEST_FORCE_COUNTRY ||              
    (req as any).geo?.country ||                            
    req.headers.get("x-vercel-ip-country") ||    
    req.headers.get("cf-ipcountry") ||     
    ""
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const country = getCountry(req)
  if (!ALLOWED_COUNTRIES.has(country)) {
    return new NextResponse('Not Found', { status: 404 })
    // or return NextResponse.rewrite(new URL('/not-available', req.url)) 
  }
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
