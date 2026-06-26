import { createServiceClient } from '@/lib/supabase/server'
import RewardsClient from './RewardsClient'

export const dynamic = 'force-dynamic'

export default async function RewardsPage() {
  const supabase = await createServiceClient()
  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .order('required_stamp_count')

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rewards</h1>
      <RewardsClient initialRewards={rewards ?? []} />
    </div>
  )
}
