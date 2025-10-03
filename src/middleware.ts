import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_COUNTRIES = new Set(["KR"]);

const AUTH_FREE_RE =
  /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:login|signup|auth(?:\/.*)?|not-available|closed|open-in-browser)(?:\/|$)/;

const PROTECTED_RE = /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:vote|results)(?:\/|$)/;

function isClosedNow() {
  const d = process.env.NEXT_PUBLIC_VOTE_DEADLINE;
  if (!d) return false;
  const t = Date.parse(d);
  return !Number.isNaN(t) && Date.now() >= t;
}

function getCountry(req: NextRequest) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).geo?.country ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    ""
  );
}

function isWebView(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (/Android/i.test(ua) && /; wv\)/i.test(ua)) return true;
  if (
    /iPhone|iPad|iPod/i.test(ua) &&
    !/Safari/i.test(ua) &&
    /AppleWebKit/i.test(ua)
  )
    return true;
  if (/(NAVER|Instagram|FBAV|FBAN)/i.test(ua)) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (req.method === "OPTIONS") return NextResponse.next();

  // ✅ 1단계: not-available 페이지는 항상 허용 (무한 리디렉트 방지)
  if (pathname === "/not-available" || pathname.startsWith("/not-available/")) {
    return NextResponse.next();
  }

  // ✅ 2단계: 국가 체크 - 가장 먼저! (한국 아니면 무조건 차단)
  const country = getCountry(req);
  if (country !== "" && !ALLOWED_COUNTRIES.has(country)) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-available";
    url.search = "";
    const res = NextResponse.redirect(url, 302);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Vary", "x-vercel-ip-country");
    return res;
  }

  // 3단계: WebView 체크
  if (isWebView(req) && /^\/(login|signup)/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/open-in-browser";
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url, 302);
  }

  // 4단계: 투표 마감 체크
  if (isClosedNow() && !AUTH_FREE_RE.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/closed";
    url.search = "";
    return NextResponse.redirect(url, 302);
  }

  // 5단계: AUTH_FREE 페이지는 통과
  if (AUTH_FREE_RE.test(pathname)) return NextResponse.next();

  // 6단계: PROTECTED가 아니면 통과
  if (!PROTECTED_RE.test(pathname)) return NextResponse.next();

  // 7단계: 인증 체크
  const res = NextResponse.next();
  res.headers.set("Vary", "x-vercel-ip-country");
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
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt)).*)",
  ],
};
