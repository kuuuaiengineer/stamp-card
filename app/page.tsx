'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserToken } from '@/lib/browser-token'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getBrowserToken()
    if (token) {
      router.replace('/stamp')
    } else {
      router.replace('/register')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
