// app/open-in-browser/page.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function OpenInBrowserPage() {
  const [ua, setUa] = useState('');
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isNaver, setIsNaver] = useState(false);
  const [isHardBlocked, setIsHardBlocked] = useState(false); // Naver/Instagram/Facebook, etc.

  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const redirect = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const r = params.get('redirect') || '/';
    return r.startsWith('http') ? r : `${window.location.origin}${r}`;
  }, [params]);

  useEffect(() => {
    const s = (navigator.userAgent || '').toLowerCase();
    setUa(s);
    const isAnd = s.includes('android');
    const isiOS = /iphone|ipad|ipod/.test(s);
    const inApp = /(kakaotalk|naver|line|instagram|fbav|fban|; wv\)| webview)/.test(s);
    const hardBlock = /(naver|instagram|fbav|fban)/.test(s); // commonly block external intents
    setIsAndroid(isAnd);
    setIsIOS(isiOS);
    setIsNaver(/naver/.test(s));
    setIsHardBlocked(inApp && hardBlock);
  }, []);

  // Android: show system chooser (no package specified)
  const openWithChooser = () => {
    if (!isAndroid) return;
    const target = redirect.replace(/^https?:\/\//, '');
    location.href = `intent://${target}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    setTimeout(() => (location.href = redirect), 1200); // fallback
  };

  // Android: open with Chrome directly
  const openWithChrome = () => {
    if (!isAndroid) return;
    const target = redirect.replace(/^https?:\/\//, '');
    location.href = `intent://${target}#Intent;scheme=https;package=com.android.chrome;end`;
    setTimeout(() => (location.href = redirect), 1200);
  };

  // iOS: best-effort open + user instructions
  const openIOSAttempt = () => {
    window.open(redirect, '_blank');
    alert('In this in-app browser, automatic switching may be blocked.\nPlease tap the Share or “…” menu, then choose “Open in Safari”.');
  };

  // iOS custom schemes (work only when user taps and the app is installed)
  const chromeURLiOS = useMemo(() => {
    try {
      const protocol = redirect.startsWith('https:') ? 'googlechromes:' : 'googlechrome:';
      return redirect.replace(/^https?:/, protocol);
    } catch {
      return '#';
    }
  }, [redirect]);

  const firefoxURLiOS = `firefox://open-url?url=${encodeURIComponent(redirect)}`;
  const edgeURLiOS = `microsoft-edge-${redirect.startsWith('https') ? 'https' : 'http'}://${redirect.replace(/^https?:\/\//, '')}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(redirect);
      alert('URL copied. Please paste it into Safari or Chrome.');
    } catch {
      alert('Copy is blocked. Long-press the address to copy it.');
    }
  };

  return (
    <main className="min-h-[calc(100dvh-65px)] flex items-center justify-center p-6">
      <div className="container mx-auto max-w-xl">
        <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Please open this page in your browser</h2>
          <p className="text-sm text-gray-600 mb-6">
            In-app browsers may block Google Sign-In or prevent opening an external browser.
          </p>

          {/* For hard-blocked apps like Naver/Instagram/Facebook: show guidance only */}
          {isHardBlocked ? (
            <div className="space-y-3">
              <Button onClick={copyUrl} variant="outline" className="w-full h-12">Copy URL</Button>
              <div className="text-left text-xs text-gray-600 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-1">📱 How to open externally</p>
                {isNaver && <p><b>Naver app</b>: Top-right <b>⋮</b> → <b>Open in default browser</b></p>}
                <p><b>iPhone</b>: Share or <b>…</b> → <b>Open in Safari</b></p>
                <p><b>Android</b>: <b>⋮</b> → <b>Open in Chrome</b></p>
                <p className="mt-2 break-all text-gray-500">{redirect}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isAndroid && (
                <>
                  <Button onClick={openWithChooser} className="w-full h-12">Choose a browser</Button>
                  <Button onClick={openWithChrome} variant="outline" className="w-full h-12">Open in Chrome</Button>
                </>
              )}
              {isIOS && (
                <>
                  <Button onClick={openIOSAttempt} className="w-full h-12">Open new tab (Safari hint)</Button>
                  <div className="flex gap-2 justify-center text-xs">
                    <a className="underline" href={chromeURLiOS}>Try iOS Chrome</a>
                    <span>·</span>
                    <a className="underline" href={firefoxURLiOS}>Try iOS Firefox</a>
                    <span>·</span>
                    <a className="underline" href={edgeURLiOS}>Try iOS Edge</a>
                  </div>
                </>
              )}
              {!isAndroid && !isIOS && (
                <Button onClick={copyUrl} className="w-full h-12">Copy URL</Button>
              )}
              <Button onClick={copyUrl} variant="outline" className="w-full h-12">Copy URL</Button>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-xs text-gray-600">
                <p className="font-medium mb-1">📱 How to open externally</p>
                {isNaver && <p><b>Naver app</b>: Top-right <b>⋮</b> → <b>Open in default browser</b></p>}
                <p><b>iPhone</b>: Share or <b>…</b> → <b>Open in Safari</b></p>
                <p><b>Android</b>: <b>⋮</b> → <b>Open in Chrome</b></p>
                <p className="mt-2 break-all text-gray-500">{redirect}</p>
              </div>
            </div>
          )}
          <p className="mt-4 text-[11px] text-gray-400">UA: {ua}</p>
        </div>
      </div>
    </main>
  );
}
