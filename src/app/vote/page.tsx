'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Match = { id: number; team_a: string; team_b: string };

export default function VotePage() {
  const supabase = createClient();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('matches').select('id, team_a, team_b').order('id', { ascending: false });
      setMatches(data ?? []);
    })();
  }, []);

  const vote = async (matchId: number, choice: 'A' | 'B') => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('votes').insert({ match_id: matchId, user_id: user?.id, choice });
    setMsg(error ? '이미 투표했거나 오류가 발생했어요.' : '투표 완료!');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Finance 이벤트 투표</h1>
          <Button variant="outline" onClick={logout}>
            로그아웃
          </Button>
        </div>
        <div className="space-y-4">
          {matches.map((m) => (
            <Card key={m.id} className="p-4 flex items-center justify-between">
              <div className="font-medium">{m.team_a} vs {m.team_b}</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => vote(m.id, 'A')}>{m.team_a}</Button>
                <Button variant="outline" onClick={() => vote(m.id, 'B')}>{m.team_b}</Button>
              </div>
            </Card>
          ))}
          {msg && <p className="text-sm text-center mt-4">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
