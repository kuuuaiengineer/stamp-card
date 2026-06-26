'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (!name?.trim() || !email?.trim()) {
    return { error: 'Name and email are required' }
  }

  const supabase = await createServiceClient()

  const { data: existing } = await supabase
    .from('users')
    .select('id, browser_token')
    .eq('email', email)
    .single()

  if (existing) {
    return { browserToken: existing.browser_token, userId: existing.id }
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ name: name.trim(), email: email.trim().toLowerCase() })
    .select('id, browser_token')
    .single()

  if (error) {
    console.error('registerUser error:', error)
    return { error: `Registration failed: ${error.message}` }
  }

  await supabase.from('stamps').insert({ user_id: data.id, count: 0 })

  return { browserToken: data.browser_token, userId: data.id }
}
