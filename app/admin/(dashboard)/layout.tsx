export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <span className="font-semibold text-gray-800">Admin</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <a href="/admin" className="text-gray-600 hover:text-amber-600">Dashboard</a>
          <a href="/admin/customers" className="text-gray-600 hover:text-amber-600">Customers</a>
          <a href="/admin/rewards" className="text-gray-600 hover:text-amber-600">Rewards</a>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
