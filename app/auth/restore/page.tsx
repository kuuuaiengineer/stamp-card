'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setBrowserToken } from '@/lib/browser-token'

function RestoreInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setBrowserToken(token)
      router.replace('/stamp')
    } else {
      router.replace('/register')
    }
  }, [router, searchParams])

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Restoring your account...</p>
      </div>
    </main>
  )
}

export default function RestorePage() {
  return (
    <Suspense>
      <RestoreInner />
    </Suspense>
  )
}
