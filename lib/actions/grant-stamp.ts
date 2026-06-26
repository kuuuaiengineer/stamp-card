'use server'

import { createServiceClient } from '@/lib/supabase/server'

export type GrantResult =
  | { status: 'granted'; stampCount: number; reward: { title: string } | null }
  | { status: 'already_stamped'; stampCount: number }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

export async function grantStamp(browserToken: string): Promise<GrantResult> {
  if (!browserToken) return { status: 'not_found' }

  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('browser_token', browserToken)
    .single()

  if (!user) return { status: 'not_found' }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayStamp } = await supabase
    .from('stamp_histories')
    .select('id')
    .eq('user_id', user.id)
    .gte('granted_at', today.toISOString())
    .single()

  const { data: stamps } = await supabase
    .from('stamps')
    .select('count')
    .eq('user_id', user.id)
    .single()

  const currentCount = stamps?.count ?? 0

  if (todayStamp) {
    return { status: 'already_stamped', stampCount: currentCount }
  }

  const { error: histError } = await supabase
    .from('stamp_histories')
    .insert({ user_id: user.id })

  if (histError) return { status: 'error', message: 'Failed to grant stamp' }

  const newCount = currentCount + 1

  await supabase
    .from('stamps')
    .upsert({ user_id: user.id, count: newCount, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

  const { data: reward } = await supabase
    .from('rewards')
    .select('title')
    .eq('required_stamp_count', newCount)
    .eq('is_active', true)
    .single()

  return {
    status: 'granted',
    stampCount: newCount,
    reward: reward ?? null,
  }
}
