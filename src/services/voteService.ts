'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type Country = { id: number; code: string; name: string };
export type Team = { id: number; name: string; country_id: number };
export type OverallRow = {
  overall_rank: number;
  is_country_champion: boolean;
  team_id: number;
  team_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  votes: number;
};

export async function fetchOverallRankings(limit?: number): Promise<OverallRow[]> {
  let q = supabase.from('overall_rankings').select('*').order('overall_rank', { ascending: true });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('id, code, name')
    .order('id', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTeams(countryId: number): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('id, name, country_id')
    .eq('country_id', countryId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMyVoteTeamId(): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('votes')
    .select('team_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.team_id ?? null;
}


export async function submitVote(teamId: number): Promise<'ok'> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const e = new Error('unauthorized');
    // @ts-expect-error
    e.code = '401';
    throw e;
  }

  const { error } = await supabase
    .from('votes')
    .insert({ user_id: user.id, team_id: teamId });

  if (error) throw error;
  return 'ok';
}
