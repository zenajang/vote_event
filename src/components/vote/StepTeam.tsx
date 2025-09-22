'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/app/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

type Country = { id: number; code: string; name: string };
type Team = { id: number; name: string; country_id: number; logoUrl?: string };

type Props = {
  country?: Country;
  teams: Team[];
  selectedTeamId: number | null;
  onSelect: (id: number) => void;
  onPrev: () => void;
  onSubmit: () => void;
  submitting: boolean;
  msg?: string;
  canSubmit: boolean;
  loading?: boolean;
};

export default function StepTeam({
  country,
  teams,
  selectedTeamId,
  onSelect,
  onPrev,
  onSubmit,
  submitting,
  msg,
  canSubmit,
  loading,
}: Props) {
  const { t } = useTranslation('common');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const openConfirm = () => {
    if (!canSubmit || submitting) return;
    setConfirmOpen(true);
  };
  const closeConfirm = () => setConfirmOpen(false);
  const confirmAndSubmit = () => {
    if (submitting) return;
    setConfirmOpen(false);
    onSubmit();
  };

  return (
    <div className="container mx-auto max-w-xl p-6">
      <h1 className="text-xl font-semibold mb-2">
        {country ? `${country.name}` : '팀 선택'}
      </h1>
      <p className="text-sm text-muted-foreground mb-4">{t("team.description")}</p>

      {/* 세로 일렬 라디오 리스트 */}
      <div role="radiogroup" aria-label="팀 선택 목록" className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="w-full h-16 rounded-xl px-4 flex items-center justify-between border bg-muted/40 animate-pulse"
                aria-hidden
              >
                <div className="h-3 w-40 rounded bg-muted" />
                <div className="size-12 rounded-full bg-muted" />
              </div>
            ))
          : teams.map((team, idx) => {
              const active = selectedTeamId === team.id;
              const tabIndex =
                selectedTeamId == null ? (idx === 0 ? 0 : -1) : active ? 0 : -1;

              return (
                <button
                  key={team.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={tabIndex}
                  onClick={() => onSelect(team.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(team.id);
                    }
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      const dir = e.key === 'ArrowDown' ? 1 : -1;
                      const radios = Array.from(
                        document.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
                      );
                      const nextIndex = (idx + dir + radios.length) % radios.length;
                      radios[nextIndex]?.focus();
                    }
                  }}
                  className={clsx(
                    'w-full h-16 rounded-xl px-4',
                    'flex items-center justify-between',
                    'border transition-colors',
                    active
                      ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/30'
                      : 'border-border hover:bg-muted/50',
                  )}
                >
                  {/* 왼쪽: 팀 이름 (+ 국가명 보조) */}
                  <div className="text-left">
                    <div className="text-base font-medium">{team.name}</div>
                    {country?.name && (
                      <div className="text-xs text-muted-foreground">{country.name}</div>
                    )}
                  </div>

                  {/* 오른쪽: 팀 사진 (없으면 이니셜) */}
                  <div
                    className={clsx(
                      'shrink-0 size-12 rounded-full overflow-hidden ring-1',
                      active ? 'ring-primary/50' : 'ring-border',
                    )}
                    aria-hidden
                  >
                    {team.logoUrl ? (
                      <Image
                        src={team.logoUrl}
                        alt={`${team.name} logo`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-muted text-foreground/70 text-sm font-semibold">
                        {getInitials(team.name)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
      </div>

      {msg && (
        <p className="mt-4 text-sm rounded bg-muted px-3 py-2 inline-block">{msg}</p>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          {t('button.back')}
        </Button>

        <Button onClick={openConfirm} disabled={!canSubmit || submitting}>
          {submitting ? t('button.submitting') : t('button.submit')}
        </Button>
      </div>

      <ConfirmSheet
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmAndSubmit}
        busy={submitting}
        title="제출하시겠습니까?"
        description="한번 선택 된 팀은 변경이 불가합니다. 투표 진행하시겠습니까?"
        cancelText="취소"
        confirmText="투표하기"
      />
    </div>
  );
}

/** 팀명 이니셜 (예: "FC Seoul" → "FS") */
function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
}

function ConfirmSheet({
    open,
    onClose,
    onConfirm,
    title,
    description,
    cancelText = '취소',
    confirmText = '확인',
    busy,
    } : {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    busy?: boolean;
  }) {
    const panelRef = useRef<HTMLDivElement | null>(null);

    // ESC, 바깥 클릭 닫기
    useEffect(() => {
      if (!open) return;

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      const onClick = (e: MouseEvent) => {
        if (!panelRef.current) return;
        if (e.target instanceof Node && !panelRef.current.contains(e.target)) {
          onClose();
        }
      };
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClick);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onClick);
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div
        aria-hidden={!open}
        aria-modal="true"
        role="dialog"
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      >
        {/* Dim */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

        {/* Panel (Bottom Sheet on mobile) */}
        <div
          ref={panelRef}
          className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-background p-5 shadow-xl sm:mx-auto"
        >
          {/* Grabber for mobile */}
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted sm:hidden" />

          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
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
  }
