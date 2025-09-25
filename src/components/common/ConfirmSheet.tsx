'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  busy?: boolean;
};

export default function ConfirmSheet({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  busy,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = 'confirm-title';
  const descId = description ? 'confirm-desc' : undefined;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (e.target instanceof Node && !panelRef.current.contains(e.target)) onClose();
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);

    const focusable = panelRef.current?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
    focusable?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div
      aria-hidden={!open}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-background p-5 shadow-xl sm:mx-auto"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted sm:hidden" />
        <h3 id={titleId} className="text-base font-semibold">{title}</h3>
        {description && (
          <p id={descId} className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? '처리 중…' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  // 포털로 body에 렌더 (z-index/레이어 안정)
  return createPortal(node, document.body);
}
