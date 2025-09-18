'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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

// 안전한 step 관리
function useStepFromURL() {
  const [step, setStep] = useState<Step>('intro');
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step') as Step;
    if (stepParam && ['intro', 'country', 'team', 'result'].includes(stepParam)) {
      setStep(stepParam);
    }
    
    // URL 변경 감지
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newStep = newParams.get('step') as Step;
      if (newStep && ['intro', 'country', 'team', 'result'].includes(newStep)) {
        setStep(newStep);
      } else {
        setStep('intro');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return step;
}

export function useVoteWizardState() {
  const router = useRouter();
  const pathname = usePathname();
  
  const step = useStepFromURL();
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