'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RecoveryPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?cbfor=recovery`,
      },
    })

    if (err) {
      setError('Could not send recovery email. Please try again.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-xs w-full">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-gray-800">Check your email</h1>
          <p className="text-gray-500 text-sm mt-2">
            We sent a magic link to <strong>{email}</strong>.<br />
            Click it to recover your account.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800">Recover account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we&apos;ll send you a magic link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/register" className="text-amber-600 underline">
            Back to registration
          </a>
        </p>
      </div>
    </main>
  )
}
