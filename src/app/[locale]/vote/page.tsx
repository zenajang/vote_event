'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Match = { id: number; team_a: string; team_b: string };

export default function VotePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.from('matches').select('id, team_a, team_b').order('id', { ascending: false });
      setMatches(data ?? []);
    })();
  }, []);

  const vote = async (matchId: number, choice: 'A' | 'B') => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('votes').insert({ match_id: matchId, user_id: user?.id, choice });
    setMsg(error ? '이미 투표했거나 오류가 발생했어요.' : '투표 완료!');
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <div className="space-y-6">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">현재 진행 중인 투표가 없습니다.</p>
          </div>
        ) : (
          matches.map((m) => (
            <Card key={m.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{m.team_a} vs {m.team_b}</div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => vote(m.id, 'A')}
                    className="min-w-[100px] hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {m.team_a}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => vote(m.id, 'B')}
                    className="min-w-[100px] hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {m.team_b}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
        {msg && (
          <div className="text-center">
            <p className="text-sm font-medium bg-muted px-4 py-2 rounded-md inline-block">
              {msg}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
