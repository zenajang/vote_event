'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { fetchOverallRankings, type OverallRow } from '@/services/voteService';
import { useTranslation } from '@/app/i18n/useTranslation';
import { cn, regionNameByLocale } from '@/lib/utils';

type Props = {
  message?: string;
  myTeamId?: number | null;
  pollMs?: number;
};

const flagSrc = (code: string) =>
  `/images/country/${String(code).toLowerCase()}_r.png`;

export default function StepResult({ message, myTeamId, pollMs = 60000 }: Props) {
  const [rows, setRows] = useState<OverallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lng } = useTranslation('common');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOverallRankings(lng);
        if (!cancelled) setRows(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const timer: ReturnType<typeof setInterval> = setInterval(load, pollMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [lng, pollMs]);

  const totalVotes = useMemo(
    () => rows.reduce((sum, r) => sum + r.votes, 0),
    [rows]
  );

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => b.votes - a.votes),
    [rows]
  );

  const topPerCountry = useMemo(() => {
    return rows
      .filter((r) => r.is_country_champion)
      .sort((a, b) => b.votes - a.votes);
  }, [rows]);

  return (
    <div className="container mx-auto max-w-xl px-6 pt-6">
      <h1 className="heading3-primary text-primary text-center">
        GME Cricket Tournament-2025
      </h1>
      <h1 className="mt-4 text-center heading2">{t('result.title')}</h1>

      {message && (
        <p className="mb-4 inline-block rounded bg-muted px-3 py-2 text-sm">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">{t('result.loading')}</p>
      ) : (
        <>
        {/* 하나의 카드 안에 국가별 1위들을 리스트로 나열 */}
          {topPerCountry.length > 0 && (
            <section className="mt-4 mb-6">
              <div className="rounded-2xl bg-white shadow-sm border">
                <ul className="divide-y">
                  {topPerCountry.map((r) => {
                    const isMine = myTeamId ? r.team_id === myTeamId : false;
                    return (
                      <li
                        key={`top-${r.country_code}`}
                        className={cn(
                          'px-4 py-2',
                          isMine && 'bg-yellow-50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <Image
                              src={flagSrc(r.country_code)}
                              alt={`${regionNameByLocale(r.country_code, lng)} flag`}
                              width={24}
                              height={24}
                              className="rounded-full shrink-0"
                            />
                            <div className="leading-tight min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {regionNameByLocale(r.country_code, lng)}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {r.team_name}
                              </p>
                            </div>

                            {/* 🔹 My Pick 배지 (국가별 1위 카드에도 표시) */}
                            {isMine && (
                              <span className="ml-2 rounded bg-yellow-200 px-2 py-0.5 text-xs shrink-0">
                                {t('result.myPick') ?? '내 선택'}
                              </span>
                            )}
                          </div>

                          <span className="text-base font-bold text-primary tabular-nums">
                            {r.votes}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}
         <section className='mb-10'>
            <h3 className="heading2 mb-3 text-center">
              {t('result.title2') ?? 'Overall Rankings'}
            </h3>

            <div className="space-y-2">
              {sortedRows.map((r, idx) => {
                const rank = idx + 1; 
                const isMine = myTeamId ? r.team_id === myTeamId : false;

                return (
                  <div
                    key={`${r.team_id}-${rank}`}
                    className={[
                      'flex items-center justify-between rounded-xl bg-white shadow-sm border p-3',
                      isMine ? 'bg-yellow-50' : '',
                    ].join(' ')}
                  >
                    <span className="w-6 text-center font-bold text-primary">{rank}</span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Image
                        src={flagSrc(r.country_code)}
                        alt={`${regionNameByLocale(r.country_code, lng)} flag`}
                        width={24}
                        height={24}
                        className="rounded-full shrink-0"
                      />
                      <div className="leading-tight min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {regionNameByLocale(r.country_code, lng)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{r.team_name}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isMine && (
                          <span className="rounded bg-yellow-200 px-2 py-0.5 text-xs">
                            {t('result.myPick')}
                          </span>
                        )}
                      </div>
                    </div>
                      <div className="text-right shrink-0">
                        <div className="tabular-nums text2">{r.votes}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            </>
          )}
        </div>
      );
    }
