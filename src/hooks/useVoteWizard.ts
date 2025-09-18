'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type Step = 'intro' | 'country' | 'team' | 'result';

function useSessionState<T>(key: string, initial: T | null) {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem(key);
    setValue(raw ? (JSON.parse(raw) as T) : initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (value === null || value === undefined) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function useVoteWizardState() {
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  const step = (qs.get('step') as Step) || 'intro';
  const [countryId, setCountryId] = useSessionState<number>('countryId', null);
  const [teamId, setTeamId] = useSessionState<number>('teamId', null);
  const [msg, setMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const go = useCallback(
    (next: Step) => {
      const url = `${pathname}?step=${next}`;
      router.replace(url);
    },
    [router, pathname]
  );

  const reset = useCallback(() => {
    setCountryId(null);
    setTeamId(null);
    setMsg('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('countryId');
      sessionStorage.removeItem('teamId');
    }
    go('intro');
  }, [go, setCountryId, setTeamId]);

  return {
    step,
    go,
    countryId,
    setCountryId,
    teamId,
    setTeamId,
    msg,
    setMsg,
    submitting,
    setSubmitting,
    reset,
  };
}

export function useGuardedStep(step: Step, hasCountry: boolean, go: (s: Step) => void) {
  useEffect(() => {
    if (step === 'team' && !hasCountry) go('country');
    if (step === 'result' && !hasCountry) go('country');
  }, [step, hasCountry, go]);
}

export function useSelected<T extends { id: number }>(list: T[], id: number | null) {
  return useMemo(() => list.find((x) => x.id === id) ?? null, [list, id]);
}
