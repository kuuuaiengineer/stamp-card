interface Visit {
  id: string
  granted_at: string
}

interface Props {
  visits: Visit[]
}

export default function VisitHistory({ visits }: Props) {
  if (visits.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-4">No visits yet</p>
  }

  return (
    <ul className="space-y-2">
      {visits.map((v) => (
        <li key={v.id} className="flex items-center gap-3 text-sm text-gray-600">
          <span className="text-amber-500">☕</span>
          <span>
            {new Date(v.granted_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </li>
      ))}
    </ul>
  )
}
