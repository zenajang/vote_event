'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchOverallRankings, type OverallRow } from '@/services/voteService';
import { useTranslation } from '@/app/i18n/useTranslation';

type Props = {
  message?: string;
  myTeamId?: number | null;  
  pollMs?: number;        
};

export default function StepResult({ message, myTeamId, pollMs = 60000 }: Props) {
  const [rows, setRows] = useState<OverallRow[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation('common');
  

  useEffect(() => {
    let cancelled = false;
    let timerId: NodeJS.Timeout;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOverallRankings();
        if (!cancelled) setRows(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    timerId = setInterval(load, pollMs);
    
    return () => {
      cancelled = true;
      clearInterval(timerId);
    };
  }, [pollMs]);

  const totalVotes = useMemo(
    () => rows.reduce((sum, r) => sum + r.votes, 0),
    [rows]
  );

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-lg font-semibold">전체 종합 순위</h1>
      {message && (
        <p className="mb-4 inline-block rounded bg-muted px-3 py-2 text-sm">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">집계 로딩 중…</p>
      ) : (
        <ul className="divide-y rounded border">
          {rows.map((r) => {
            const isMine = myTeamId ? r.team_id === myTeamId : false;
            const pct = totalVotes ? Math.round((r.votes / totalVotes) * 100) : 0;
            return (
              <li key={r.overall_rank} className={`px-4 py-3 ${isMine ? 'bg-yellow-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 text-right text-sm">{r.overall_rank}</span>
                    <span className="text-sm">{r.country_name} - {r.team_name}</span>
                    {r.is_country_champion && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs">국가 1위</span>
                    )}
                    {isMine && (
                      <span className="rounded bg-yellow-200 px-2 py-0.5 text-xs">내 선택</span>
                    )}
                  </div>
                  <div className="tabular-nums text-sm text-muted-foreground ml-2 ">
                    {pct}% ({r.votes})
                  </div>
                </div>
                <div className="mt-2 h-2 rounded bg-muted">
                  <div className="h-2 rounded bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}