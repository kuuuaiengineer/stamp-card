'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function createReward(title: string, requiredStampCount: number) {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('rewards')
    .insert({ title, required_stamp_count: requiredStampCount, is_active: true })
    .select()
    .single()
  if (error) return { error: error.message }
  return { data }
}

export async function toggleReward(id: string, isActive: boolean) {
  const supabase = await createServiceClient()
  const { error } = await supabase.from('rewards').update({ is_active: isActive }).eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteReward(id: string) {
  const supabase = await createServiceClient()
  const { error } = await supabase.from('rewards').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
