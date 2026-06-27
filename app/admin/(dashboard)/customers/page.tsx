import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const supabase = createAdminClient()

  const { data: customers } = await supabase
    .from('users')
    .select(`
      id, name, email, created_at,
      stamps(count),
      stamp_histories(granted_at)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Stamps</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Last visit</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(customers ?? []).map((c) => {
              const histories = (c.stamp_histories as { granted_at: string }[] | null) ?? []
              const lastVisit = histories.length > 0
                ? histories.reduce((a, b) => a.granted_at > b.granted_at ? a : b).granted_at
                : null
              const stampsData = c.stamps as { count: number } | { count: number }[] | null
              const stampCount = Array.isArray(stampsData) ? (stampsData[0]?.count ?? 0) : (stampsData?.count ?? 0)

              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                      {stampCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lastVisit
                      ? new Date(lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!customers || customers.length === 0) && (
          <p className="text-center text-gray-400 py-8">No customers yet</p>
        )}
      </div>
    </div>
  )
}
