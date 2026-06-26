'use server'

import { createServiceClient } from '@/lib/supabase/server'

export interface UserData {
  name: string
  stampCount: number
  visits: { id: string; granted_at: string }[]
  activeReward: { id: string; title: string; required_stamp_count: number } | null
}

export async function getUserData(browserToken: string): Promise<UserData | null> {
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, name')
    .eq('browser_token', browserToken)
    .single()

  if (!user) return null

  const [stampsRes, historyRes, rewardsRes] = await Promise.all([
    supabase.from('stamps').select('count').eq('user_id', user.id).single(),
    supabase
      .from('stamp_histories')
      .select('id, granted_at')
      .eq('user_id', user.id)
      .order('granted_at', { ascending: false })
      .limit(20),
    supabase
      .from('rewards')
      .select('id, title, required_stamp_count')
      .eq('is_active', true)
      .order('required_stamp_count'),
  ])

  const count = stampsRes.data?.count ?? 0
  const reward = rewardsRes.data?.find((r) => r.required_stamp_count <= count) ?? null

  return {
    name: user.name,
    stampCount: count,
    visits: historyRes.data ?? [],
    activeReward: reward,
  }
}
