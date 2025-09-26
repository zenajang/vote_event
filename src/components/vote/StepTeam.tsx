'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn, regionNameByLocale } from '@/lib/utils';
import ConfirmSheet from '../common/ConfirmSheet';

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
function TeamImage({
  countryCode,
  teamId,
  teamName,
  logoUrl,
  className,
}: {
  countryCode?: string;
  teamId: number;
  teamName: string;
  logoUrl?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  const localSrc =
    countryCode ? `/images/team/${String(countryCode).toLowerCase()}/${teamId}.png` : '';

  const src = !error ? (localSrc || logoUrl || '') : '';

  return (
    <div
      className={cn(
        'relative w-full h-30 rounded-xl bg-muted overflow-hidden',
        'aspect-[4/3] sm:aspect-[16/9] min-h-[9rem] md:min-h-[12rem]',
        'grid place-items-center px-3 text-center',
        className
      )}
    >
      {src && !error && (
        <Image
          fill
          src={src}
          alt={`${teamName} photo`}
          className="object-cover"
          onError={() => {
            if (src === localSrc && logoUrl) {
              setError(true);
            } else {
              setError(true);
            }
          }}
          key={`${teamId}-${error ? 'fallback' : 'img'}`}
        />
      )}

      {(!src || error) && (
        <span className="text-sm font-semibold text-foreground/70 leading-tight line-clamp-2">
          {teamName}
        </span>
      )}
    </div>
  );
}

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

  const [confirmOpen, setConfirmOpen] = useState(false);

  const countryLabel = country ? regionNameByLocale(country.code) : 'Select Team';
  const openConfirm = () => {
    if (!canSubmit || submitting) return;
    setConfirmOpen(true);
  };
  const confirmAndSubmit = () => {
    if (submitting) return;
    setConfirmOpen(false);
    onSubmit();
  };

  return (
    <div className="container mx-auto max-w-xl px-3 pt-6">
      <h1 className="heading3-primary mb-5 text-primary text-center">
        GME Cricket Tournament-2025
      </h1>
      <h1 className="h1-onboarding mb-4 text-center">
        {country ? countryLabel : 'Select Team'}
      </h1>

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
                <Button
                  key={team.id}
                  variant="outline"
                  role="radio"
                  aria-checked={active}
                  tabIndex={tabIndex}
                  onClick={() => onSelect(team.id)}
                  className={cn(
                    'w-full h-auto p-0 !items-stretch !justify-start flex flex-col text-left',
                    'rounded-2xl gap-2 bg-card hover:bg-transparent hover:text-inherit',
                    'border border-input shadow-[0_6px_10px_rgba(0,0,0,0.14)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]',
                    active && 'border-2 border-primary'
                  )}
                >
                  <div className={cn('w-full overflow-hidden rounded-xl p-2')}>
                    <TeamImage
                      countryCode={country?.code}
                      teamId={team.id}
                      teamName={team.name}
                      logoUrl={team.logoUrl}
                    />
                  </div>
                  <div className="items-center flex flex-col mb-3">
                    <div className={cn('text2', active && 'text-primary')}>{team.name}</div>
                  </div>
                </Button>
              );
            })}
      </div>

      {msg && <p className="mt-4 text-sm rounded bg-muted px-3 py-2 inline-block">{msg}</p>}

      <div className="mt-6 flex justify-between pb-10">
        <Button variant="outline" className="btn-prev" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={openConfirm} className="btn-next" disabled={!canSubmit || submitting}>
          {submitting ? 'Submitting': 'Submit'}
        </Button>
      </div>

      <ConfirmSheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAndSubmit}
        busy={submitting}
        title="Do you want to submit?"
        description="Once you select a team, it cannot be changed. Do you want to proceed with the vote?"
        cancelText="Cancel"
        confirmText="Vote"
      />
    </div>
  );
}
