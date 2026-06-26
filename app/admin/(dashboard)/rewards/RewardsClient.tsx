'use client'

import { useState } from 'react'
import { createReward, toggleReward, deleteReward } from '@/lib/actions/admin-rewards'

interface Reward {
  id: string
  title: string
  required_stamp_count: number
  is_active: boolean
}

export default function RewardsClient({ initialRewards }: { initialRewards: Reward[] }) {
  const [rewards, setRewards] = useState(initialRewards)
  const [title, setTitle] = useState('')
  const [stampCount, setStampCount] = useState(10)
  const [saving, setSaving] = useState(false)

  async function addReward(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const result = await createReward(title.trim(), stampCount)
    if ('data' in result && result.data) {
      setRewards([...rewards, result.data])
      setTitle('')
      setStampCount(10)
    }
    setSaving(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await toggleReward(id, !current)
    setRewards(rewards.map((r) => r.id === id ? { ...r, is_active: !current } : r))
  }

  async function handleDelete(id: string) {
    await deleteReward(id)
    setRewards(rewards.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Add reward</h2>
        <form onSubmit={addReward} className="space-y-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Free coffee"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600 whitespace-nowrap">Stamps required:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={stampCount}
              onChange={(e) => setStampCount(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
          >
            {saving ? 'Adding...' : 'Add reward'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {rewards.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">No rewards yet</p>
        )}
        {rewards.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-gray-800">{r.title}</p>
              <p className="text-xs text-gray-400">{r.required_stamp_count} stamps</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(r.id, r.is_active)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  r.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {r.is_active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
