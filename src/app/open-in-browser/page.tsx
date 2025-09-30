// app/open-in-browser/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OpenInBrowserPage() {
  const [ua, setUa] = useState('');
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const redirect = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const r = params.get('redirect') || '/';
    // 절대경로로 보정
    return r.startsWith('http') ? r : `${window.location.origin}${r}`;
  }, [params]);

  useEffect(() => {
    const s = (navigator.userAgent || '').toLowerCase();
    setUa(s);
    setIsAndroid(s.includes('android'));
    setIsIOS(/iphone|ipad|ipod/.test(s));
  }, []);

  const openInDefaultBrowser = () => {
    if (isAndroid) {
      // Chrome 강제 오픈 (미설치 시 마켓 혹은 fallback)
      const target = redirect.replace(/^https?:\/\//, '');
      window.location.href = `intent://${target}#Intent;scheme=https;package=com.android.chrome;end`;

      // Fallback (일부 환경에서 intent 실패 시 현재 창 이동)
      setTimeout(() => {
        window.location.href = redirect;
      }, 1000);
      return;
    }

    // iOS: 자동 전환 성공 보장X → 새창 시도 + 안내
    window.open(redirect, '_blank');
    alert('오른쪽 상단 메뉴(공유 또는 ⋯)에서 "Safari로 열기"를 눌러 진행해 주세요.');
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(redirect);
      alert('URL을 복사했어요. Safari/Chrome에서 붙여넣기 해주세요.');
    } catch {
      alert('복사 실패. 길게 눌러 주소를 선택/복사해 주세요.');
    }
  };

  return (
    <main className="min-h-[calc(100dvh-65px)] flex items-center justify-center p-6">
      <div className="container mx-auto max-w-xl">
        <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold mb-3">외부 브라우저에서 열어주세요</h2>
          <p className="text-sm text-gray-600 mb-6">
            인앱 브라우저에서는 Google 로그인이 차단됩니다. Safari/Chrome으로 열어 진행해 주세요.
          </p>

          <div className="space-y-3">
            <Button onClick={openInDefaultBrowser} className="w-full h-12">
              외부 브라우저로 열기
            </Button>
            <Button onClick={copyUrl} variant="outline" className="w-full h-12">
              URL 복사하기
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-xs text-gray-600">
            <p className="font-medium mb-1">📱 수동으로 여는 방법</p>
            <p><b>iPhone</b>: 공유 또는 ⋯ → <b>Safari에서 열기</b></p>
            <p><b>Android</b>: ⋮ 메뉴 → <b>Chrome에서 열기</b></p>
            <p className="mt-2 break-all text-gray-500">{redirect}</p>
          </div>

          <p className="mt-4 text-[11px] text-gray-400">UA: {ua}</p>
        </div>
      </div>
    </main>
  );
}
