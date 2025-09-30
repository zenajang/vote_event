'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OpenInBrowserPage() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    const url = window.location.origin;
    setCurrentUrl(url);

    // 인앱 브라우저 감지
    const isInApp = /KAKAOTALK|NAVER|Line|Instagram|FB|Facebook|FBAV|FBAN/.test(ua);
    setIsInAppBrowser(isInApp);
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('URL이 복사되었습니다! 외부 브라우저에 붙여넣기 해주세요.');
  };

  const openInDefaultBrowser = () => {
    // 안드로이드: intent 스킴 사용
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      // iOS: 사용자에게 안내
      alert('Safari나 Chrome에서 열어주세요.\n1. 우측 상단 메뉴(···)를 탭\n2. "Safari에서 열기" 또는 "Chrome에서 열기"를 선택');
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

          <h2 className="h1-onboarding text-primary mb-4">
            외부 브라우저에서 열어주세요
          </h2>

          <p className="text5 mb-6 text-gray-600">
            {isInAppBrowser
              ? '현재 인앱 브라우저에서는 일부 기능이 제한될 수 있습니다.'
              : '일부 네트워크 환경에서는 외부 브라우저 사용이 필요합니다.'}
          </p>

          <div className="space-y-3">
            <Button
              onClick={openInDefaultBrowser}
              className="w-full h-12 bg-[#E81818] hover:bg-[#d01616] text-white font-semibold"
            >
              외부 브라우저로 열기
            </Button>

            <Button
              onClick={copyUrl}
              variant="outline"
              className="w-full h-12 font-semibold"
            >
              URL 복사하기
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">📱 수동으로 여는 방법</p>
            <p className="text-xs text-gray-500 text-left">
              <strong>iOS:</strong> 우측 상단 메뉴(···) → Safari에서 열기<br />
              <strong>Android:</strong> 우측 상단 메뉴(⋮) → Chrome에서 열기
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}