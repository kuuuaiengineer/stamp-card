'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function redeemReward(browserToken: string, rewardId: string) {
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('browser_token', browserToken)
    .single()

  if (!user) return { error: 'User not found' }

  const { data: reward } = await supabase
    .from('rewards')
    .select('required_stamp_count, title')
    .eq('id', rewardId)
    .eq('is_active', true)
    .single()

  if (!reward) return { error: 'Reward not found' }

  const { data: stamps } = await supabase
    .from('stamps')
    .select('count')
    .eq('user_id', user.id)
    .single()

  if (!stamps || stamps.count < reward.required_stamp_count) {
    return { error: 'Not enough stamps' }
  }

  await supabase.from('reward_histories').insert({ user_id: user.id, reward_id: rewardId })

  const newCount = stamps.count - reward.required_stamp_count
  await supabase
    .from('stamps')
    .update({ count: newCount, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return { success: true, remainingStamps: newCount, rewardTitle: reward.title }
}
