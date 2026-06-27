import { createServiceClient } from '@/lib/supabase/server'
import QRDisplay from './QRDisplay'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createServiceClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [usersRes, todayRes] = await Promise.all([
    supabase.from('users').select('id'),
    supabase
      .from('stamp_histories')
      .select('id')
      .gte('granted_at', today.toISOString()),
  ])

  const totalCustomers = usersRes.data?.length ?? 0
  const todayVisits = todayRes.data?.length ?? 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const visitUrl = `${siteUrl}/visit`

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-amber-500">{totalCustomers}</p>
          <p className="text-gray-500 text-sm mt-1">Total customers</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-amber-500">{todayVisits}</p>
          <p className="text-gray-500 text-sm mt-1">Visits today</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-4">QR Code for your cafe</h2>
        <p className="text-sm text-gray-500 mb-4">
          Print or display this QR code. Customers scan it to collect stamps.
        </p>
        <QRDisplay url={visitUrl} />
        <p className="text-xs text-gray-400 mt-3 break-all">{visitUrl}</p>
      </div>
    </div>
  )
}
