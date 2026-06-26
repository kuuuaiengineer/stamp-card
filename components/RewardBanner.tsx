interface Props {
  title: string
  onRedeem?: () => void
}

export default function RewardBanner({ title, onRedeem }: Props) {
  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-center shadow">
      <div className="text-2xl mb-1">🎉</div>
      <p className="font-bold text-amber-800">Reward unlocked!</p>
      <p className="text-amber-700 text-sm mb-3">{title}</p>
      {onRedeem && (
        <button
          onClick={onRedeem}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Redeem now
        </button>
      )}
    </div>
  )
}
