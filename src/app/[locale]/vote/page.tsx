'use client';

import { useEffect, useState } from 'react';
import {
  fetchCountries,
  fetchTeams,
  submitVote,
  type Country,
  type Team,
  fetchMyVoteTeamId,
} from '@/services/voteService';
import { useVoteWizardState, useSelected} from '@/hooks/useVoteWizard';

import StepIntro from '@/components/vote/StepIntro';
import StepCountry from '@/components/vote/StepCountry';
import StepTeam from '@/components/vote/StepTeam';
import StepResult from '@/components/vote/StepResult';
import { useTranslation } from '@/app/i18n/useTranslation';

export default function VoteWizard() {
  const {
    step, go,
    countryId, setCountryId,
    teamId, setTeamId,
    msg, setMsg,
    submitting, setSubmitting
  } = useVoteWizardState();

  const [countries, setCountries] = useState<Country[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [checkingVote, setCheckingVote] = useState(true);

  const currentCountry = useSelected(countries, countryId ?? null);
  const { lng } = useTranslation('common'); 

  // 국가 목록 로드
  useEffect(() => {
    (async () => {
      try {
        setLoadingCountries(true);
        const list = await fetchCountries(lng);
        setCountries(list);
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, [lng]);

  // 선택한 국가의 팀 목록 로드
  useEffect(() => {
    (async () => {
      if (!countryId) {
        setTeams([]);
        setTeamId(null);
        return;
      }
      try {
        setLoadingTeams(true);
        const list = await fetchTeams(countryId);
        setTeams(list);
        // 이전에 선택한 teamId가 없어진 경우 초기화
        if (teamId && !list.some((t) => t.id === teamId)) setTeamId(null);
      } finally {
        setLoadingTeams(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  // 스텝 가드
  useEffect(() => {
    if (step === 'team' && !countryId) go('country');
  }, [step, countryId, go]);

useEffect(() => {
  if (step === 'result') { setCheckingVote(false); return; }
  setCheckingVote(true);

  let cancelled = false;
  (async () => {
    try {
      const votedTeamId = await fetchMyVoteTeamId();
      if (!cancelled && votedTeamId) {
        setTeamId(votedTeamId);
        setMsg('투표를 완료하셨습니다.');
        go('result');
      }
    } finally {
      if (!cancelled) setCheckingVote(false);
    }
  })();

  return () => { cancelled = true; };
}, [step, go, setTeamId, setMsg]);

useEffect(() => {
  if (step !== 'result' || teamId != null) return;

  let cancelled = false;
  (async () => {
    try {
      const voted = await fetchMyVoteTeamId();
      if (!cancelled && voted) setTeamId(voted);
    } catch {
      // 비로그인/권한 이슈 등은 무시
    }
  })();

  return () => { cancelled = true; };
}, [step, teamId, setTeamId]);

  
if ((step === 'country' || step === 'team') && checkingVote) {
  return null; 
}

// 제출
const onSubmit = async () => {
  if (!teamId || submitting) return;
  setSubmitting(true);
  setMsg('');

  try {
    await submitVote(teamId);
    setMsg('투표 완료!');
    go('result');
    return;
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    if (error?.code === '23505') {
      try {
        const votedTeamId = await fetchMyVoteTeamId();
        if (votedTeamId) setTeamId(votedTeamId);
      } catch {}
      setMsg('투표를 완료하셨습니다.');
      go('result');
      return;
    } else if (error?.code === '401' || error?.message === 'unauthorized') {
      setMsg('로그인이 필요합니다.');
    } else {
      setMsg('오류가 발생했어요.');
    }
  } finally {
    setSubmitting(false);
  }
};


  if (step === 'intro') {
    return <StepIntro onNext={() => go('country')} />;
  }

  if (step === 'country') {
    return (
      <StepCountry
        countries={countries}
        loading={loadingCountries}
        selectedCountryId={countryId ?? null}
        onSelect={(id) => setCountryId(id)}
        onPrev={() => go('intro')}
        onNext={() => go('team')}
      />
    );
  }

  if (step === 'team') {
    return (
      <StepTeam
        country={currentCountry ?? undefined}
        teams={teams}
        loading={loadingTeams}
        selectedTeamId={teamId ?? null}
        onSelect={(id) => setTeamId(id)}
        onPrev={() => go('country')}
        onSubmit={onSubmit}
        submitting={submitting}
        msg={msg}
        canSubmit={!!teamId && teams.length > 0}
      />
    );
  }

  if (step === 'result') {
  return (
    <StepResult
      myTeamId={teamId ?? null}
      message={msg}
    />
  );
}
}
