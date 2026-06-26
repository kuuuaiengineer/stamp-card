interface Props {
  current: number
  required: number
}

export default function StampGrid({ current, required }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: required }).map((_, i) => (
        <div
          key={i}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
            i < current
              ? 'bg-amber-500 border-amber-600 shadow-md'
              : 'bg-gray-100 border-gray-300'
          }`}
        >
          {i < current ? '☕' : ''}
        </div>
      ))}
    </div>
  )
}
