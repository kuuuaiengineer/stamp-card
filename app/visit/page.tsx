'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserToken } from '@/lib/browser-token'
import { grantStamp, type GrantResult } from '@/lib/actions/grant-stamp'

export default function VisitPage() {
  const router = useRouter()
  const [result, setResult] = useState<GrantResult | null>(null)

  useEffect(() => {
    const token = getBrowserToken()
    if (!token) {
      router.replace('/register')
      return
    }

    grantStamp(token).then((r) => {
      setResult(r)
      if (r.status === 'not_found') {
        router.replace('/register')
      } else {
        setTimeout(() => router.push('/stamp'), 2500)
      }
    })
  }, [router])

  if (!result) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking in...</p>
        </div>
      </main>
    )
  }

  if (result.status === 'granted') {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-xs w-full">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-2xl font-bold text-gray-800">Stamp added!</h1>
          <p className="text-4xl font-bold text-amber-500 mt-3">{result.stampCount}</p>
          <p className="text-gray-500 text-sm">total stamps</p>
          {result.reward && (
            <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-3">
              <p className="text-amber-800 font-semibold">🎉 {result.reward.title}</p>
              <p className="text-amber-600 text-sm">Reward ready to redeem!</p>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-5">Redirecting...</p>
        </div>
      </main>
    )
  }

  if (result.status === 'already_stamped') {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-xs w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-700">Already stamped today!</h1>
          <p className="text-gray-500 text-sm mt-2">Come back tomorrow for your next stamp.</p>
          <p className="text-3xl font-bold text-amber-500 mt-4">{result.stampCount}</p>
          <p className="text-gray-400 text-sm">stamps collected</p>
          <p className="text-gray-400 text-xs mt-5">Redirecting...</p>
        </div>
      </main>
    )
  }

  return null
}
