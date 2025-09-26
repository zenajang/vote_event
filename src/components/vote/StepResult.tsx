'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { fetchOverallRankings, type OverallRow } from '@/services/voteService';
import { cn, regionNameByLocale } from '@/lib/utils';
import { Spinner } from '@radix-ui/themes';

type Props = {
  message?: string;
  myTeamId?: number | null;
  pollMs?: number;
};

const flagSrc = (code: string) =>
  `/images/country/${String(code).toLowerCase()}_r.png`;

export default function StepResult({ message, myTeamId, pollMs = 100000 }: Props) {
  const [rows, setRows] = useState<OverallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async (mode: 'initial' | 'refresh' = 'initial') => {
      try {
        if (mode === 'initial') setLoading(true);
        else setRefreshing(true);

        setErrorMsg('');
        const data = await fetchOverallRankings();
        if (!cancelled) setRows(data ?? []);
      } catch (e: unknown) {
         console.error(e);
      } finally {
        if (!cancelled) {
          if (mode === 'initial') setLoading(false);
          else setRefreshing(false);
        }
      }
    };

    load('initial');
    const timer = setInterval(() => load('refresh'), pollMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pollMs]);

  const championsMap = useMemo(() => {
    const map = new Map<string, OverallRow>(); // country_code -> best row
    for (const r of rows) {
      const cur = map.get(r.country_code);
      if (!cur || r.votes > cur.votes) {
        map.set(r.country_code, r);
      }
    }
    return map;
  }, [rows]);

  const topPerCountry = useMemo(
    () => Array.from(championsMap.values()).sort((a, b) => b.votes - a.votes),
    [championsMap]
  );

  const championTeamIds = useMemo(
    () => new Set(topPerCountry.map((r) => r.team_id)),
    [topPerCountry]
  );

  const remainingSorted = useMemo(() => {
    const rest = rows.filter((r) => !championTeamIds.has(r.team_id));
    return rest.sort((a, b) => b.votes - a.votes);
  }, [rows, championTeamIds]);

  return (
    <div className="container mx-auto max-w-xl px-3 pt-6">
      <h1 className="heading3-primary text-primary text-center">
        GME Cricket Tournament-2025
      </h1>

      <h1 className="mt-4 text-center heading2 relative">
        Top Voted Team from Each Country
        {refreshing && (
          <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground align-middle">
            <Spinner size="3" />
          </span>
        )}
      </h1>

      {message && (
        <p className="mb-3 inline-block rounded bg-muted px-3 py-2 text-sm">{message}</p>
      )}
      {errorMsg && (
        <p className="mb-3 inline-block rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="3" />
        </div>
      ) : (
        <>
          <section className="mt-4 mb-6">
            <div className="rounded-2xl bg-white shadow-sm border overflow-hidden">
              {topPerCountry.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No country champions yet.
                </div>
              ) : (
                <ul>
                  {topPerCountry.map((r) => {
                    const isMine = myTeamId ? r.team_id === myTeamId : false;
                    return (
                    <li
                      key={`top-${r.country_code}`}
                      className={cn('px-4 py-2', isMine && 'bg-yellow-50')}
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Image
                            src={flagSrc(r.country_code)}
                            alt={`${regionNameByLocale(r.country_code)} flag`}
                            width={36}
                            height={36}
                            className="rounded-full shrink-0"
                          />
                          <p className="text-sm font-semibold truncate">
                            {regionNameByLocale(r.country_code)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm truncate">
                            {r.team_name}
                          {isMine && (
                            <span className="rounded bg-yellow-200 ml-2 px-2 py-0.5 text-xs font-semibold shrink-0">
                              My Pick
                            </span>
                          )}  
                          </p>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-base font-bold text-primary tabular-nums">
                            {r.votes}
                          </span>
                        </div>
                      </div>
                    </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
          
          <section className="pb-10">
            <h3 className="heading2 mb-3 text-center">Remaining Teams in the Rankings</h3>

            {remainingSorted.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No teams remaining after country champions.
              </div>
            ) : (
              <div className="space-y-2">
                {remainingSorted.map((r, idx) => {
                  const rank = idx + 1;
                  const isMine = myTeamId ? r.team_id === myTeamId : false;

                  return (
                 <div
                    key={`${r.team_id}-${rank}`}
                    className={cn(
                      'rounded-xl bg-white border p-3 shadow-sm',
                      isMine && 'bg-yellow-50',
                      rank <= 3 && 'border-2 border-red-500'
                    )}
                  >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3">
                  <span
                    className={cn(
                      'w-6 text-center font-bold tabular-nums',
                      rank <= 3 ? 'text-primary' : 'text-black'
                    )}
                  >
                    {rank}
                  </span>
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={flagSrc(r.country_code)}
                      alt={`${regionNameByLocale(r.country_code)} flag`}
                      width={36}
                      height={36}
                      className="rounded-full shrink-0"
                    />
                    <p className="text-sm font-semibold truncate">
                      {regionNameByLocale(r.country_code)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {r.team_name}
                    {isMine && (
                      <span className="rounded bg-yellow-200 ml-2 px-2 py-0.5 text-xs font-semibold shrink-0">
                        My Pick
                      </span>
                    )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="tabular-nums text2">{r.votes}</div>
                  </div>
                  </div>
                </div>

                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
