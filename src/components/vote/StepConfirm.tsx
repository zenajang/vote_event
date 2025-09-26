'use client';

import Image from 'next/image';
import { Button } from '../ui/button';

type TopTeam = {
  country: string;        
  countryCode: string; 
  team: string;            
  votes: number;      
};

type GlobalRank = {
  country: string;        
  countryCode: string; 
  team: string;           
  votes: number;      
};

type Props = {
  onViewRankings: () => void;
  onClose?: () => void;
  date?: string;        
  place?: string;  
  message?: string;
  topTeams?: TopTeam[];       
  globalRankings?: GlobalRank[];
};

/** 국가 플래그 경로: /images/country/{code}_r.png */
const flagSrc = (code: string) =>
  `/images/country/${String(code).toLowerCase()}_r.png`;

/** 상단: 국가별 1위 카드 */
function TopTeamCard({ country, countryCode, team, votes }: TopTeam) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white shadow-sm p-3">
      <div className="flex items-center gap-3">
        <Image
          src={flagSrc(countryCode)}
          alt={`${country} flag`}
          width={28}
          height={28}
          className="rounded-full"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold">{country}</p>
          <p className="text-xs text-muted-foreground">{team}</p>
        </div>
      </div>
      <span className="text-lg font-bold text-primary tabular-nums">{votes}</span>
    </div>
  );
}

function GlobalRankingRow({
  rank,
  item,
}: {
  rank: number;
  item: GlobalRank;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white shadow-sm p-3">
      <span className="w-6 text-center font-bold text-primary">{rank}</span>

      <div className="flex items-center gap-3 flex-1">
        <Image
          src={flagSrc(item.countryCode)}
          alt={`${item.country} flag`}
          width={24}
          height={24}
          className="rounded-full"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold">{item.country}</p>
          <p className="text-xs text-muted-foreground">{item.team}</p>
        </div>
      </div>

      <span className="text-base font-bold text-primary tabular-nums">
        {item.votes}
      </span>
    </div>
  );
}

export default function StepConfirm({
  onViewRankings,
  onClose,
  date,
  place,

  topTeams = [],
  globalRankings = [],
}: Props) {
  return (
    <div className="container mx-auto max-w-xl px-4 pt-6">
      <h1 className="heading3-primary mb-5 text-primary text-center">
        GME Cricket Tournament-2025
      </h1>

      <div className="w-full bg-card rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] mt-6 p-5">
        {/* 상단 체크 + 안내 */}
        <div className="flex flex-col items-center mt-3">
          <Image src="/images/check.png" alt="check icon" width={80} height={24} />
          <h2 className="h1-onboarding text-primary mt-5 mb-3">Vote Completed</h2>
          <p className="text-center text5">
            Your vote has been successfully submitted!<br/>
            Invite your friends to support their favorite team
          </p>
          {/* 일정/장소 */}
          <div className="flex items-center gap-2 text-sm mt-13">
            <Image src="/images/calendar.png" alt="calendar icon" width={15} height={15} />
            <span className="heading3-secondary">
              {date || '2nd November 2025'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1 mb-5">
            <Image src="/images/pin.png" alt="pin icon" width={13} height={13} />
            <span className="heading3-secondary">
              {place || 'Incheon International Cricket Stadium'}
            </span>
          </div>
        </div>

        {topTeams.length > 0 && (
          <>
            <h3 className="heading3-secondary mb-3 text-center">
              Top Voted Team from Each Country
            </h3>
            <div className="space-y-3 mb-6">
              {topTeams.map((t, i) => (
                <TopTeamCard key={`${t.countryCode}-${i}`} {...t} />
              ))}
            </div>
          </>
        )}

        {globalRankings.length > 0 && (
          <>
            <h3 className="heading3-secondary mb-3 text-center">
              Overall Rankings
            </h3>
            <div className="space-y-2 mb-6">
              {globalRankings.map((g, i) => (
                <GlobalRankingRow key={`${g.countryCode}-${i}`} rank={i + 1} item={g} />
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 justify-center mt-10 mb-5">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
          <Button onClick={onViewRankings} className="btn-primary px-9">
            View Team Rankings
          </Button>
        </div>
      </div>
    </div>
  );
}
