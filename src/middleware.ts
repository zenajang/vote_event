// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const AUTH_FREE_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:login|signup|auth(?:\/.*)?|not-available|closed|open-in-browser)(?:\/|$)/;

const PROTECTED_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:vote|results)(?:\/|$)/;

// ✅ 인앱/웹뷰 UA 패턴 (서버 측)
const INAPP_UA_RE = /(kakaotalk|naver|line|fbav|fban|instagram|snapchat|; wv\)| wv;|webview)/i;

function isClosedNow() {
  const d = process.env.NEXT_PUBLIC_VOTE_DEADLINE;
  if (!d) return false;
  const t = Date.parse(d);
  return !Number.isNaN(t) && Date.now() >= t;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (req.method === 'OPTIONS') return NextResponse.next();

  // 1) 투표 마감 리다이렉트
  if (isClosedNow() && !AUTH_FREE_RE.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/closed';
    url.search = '';
    return NextResponse.redirect(url, 302);
  }

  // 2) ✅ 인앱 브라우저면 로그인/보호 경로 진입 전에 외부 브라우저 유도
  //    (국가와 무관하게 처리 — 이번 문제의 핵심)
  const ua = req.headers.get('user-agent') || '';
  const isInApp = INAPP_UA_RE.test(ua);
  if (isInApp && (AUTH_FREE_RE.test(pathname) || PROTECTED_RE.test(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = '/open-in-browser';
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url, 302);
  }

  // 3) 인증 자유 경로는 통과
  if (AUTH_FREE_RE.test(pathname)) return NextResponse.next();

  // 4) 보호 경로가 아니면 통과
  if (!PROTECTED_RE.test(pathname)) return NextResponse.next();

  // 5) 보호 경로면 Supabase 세션 확인
  const res = NextResponse.next();
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
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt)).*)',
  ],
};
