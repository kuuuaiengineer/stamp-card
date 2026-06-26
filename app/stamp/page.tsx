'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserToken } from '@/lib/browser-token'
import StampGrid from '@/components/StampGrid'
import VisitHistory from '@/components/VisitHistory'
import RewardBanner from '@/components/RewardBanner'
import { redeemReward } from '@/lib/actions/redeem-reward'
import { getUserData, type UserData } from '@/lib/actions/get-user-data'

const REQUIRED_STAMPS = 10

function StampPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)

  const loadData = useCallback(async (token: string) => {
    const result = await getUserData(token)
    if (!result) {
      router.replace('/register')
      return
    }
    setData(result)
    setLoading(false)
  }, [router])

  useEffect(() => {
    const token = getBrowserToken()
    if (!token) {
      router.replace('/register')
      return
    }
    loadData(token)
  }, [loadData, router])

  async function handleRedeem() {
    if (!data?.activeReward) return
    const token = getBrowserToken()
    if (!token) return

    setRedeeming(true)
    const result = await redeemReward(token, data.activeReward.id)
    if ('success' in result && result.success) {
      await loadData(token)
    }
    setRedeeming(false)
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!data) return null

  const isWelcome = searchParams.get('welcome') === '1'

  return (
    <main className="max-w-sm mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">☕</div>
        <h1 className="text-xl font-bold text-gray-800">Hi, {data.name}!</h1>
        {isWelcome && (
          <p className="text-green-600 text-sm font-medium mt-1">Welcome — first stamp collected!</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Your stamps</h2>
          <span className="text-2xl font-bold text-amber-500">
            {data.stampCount} / {REQUIRED_STAMPS}
          </span>
        </div>
        <StampGrid current={data.stampCount} required={REQUIRED_STAMPS} />
        <div className="mt-4 bg-gray-100 rounded-full h-2">
          <div
            className="bg-amber-400 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (data.stampCount / REQUIRED_STAMPS) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {REQUIRED_STAMPS - data.stampCount > 0
            ? `${REQUIRED_STAMPS - data.stampCount} more to go!`
            : 'You have a reward to redeem!'}
        </p>
      </div>

      {data.activeReward && (
        <div className="mb-4">
          <RewardBanner
            title={data.activeReward.title}
            onRedeem={redeeming ? undefined : handleRedeem}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Visit history</h2>
        <VisitHistory visits={data.visits} />
      </div>

      <div className="text-center mt-6">
        <a href="/recovery" className="text-xs text-gray-400 underline">
          Using a new device? Recover your account
        </a>
      </div>
    </main>
  )
}

export default function StampPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <StampPageInner />
    </Suspense>
  )
}
