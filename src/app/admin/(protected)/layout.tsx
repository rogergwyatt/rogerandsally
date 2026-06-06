import { isAdminAuthenticated } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import AdminNav from '@/controls/admin/AdminNav'

// Guards every authenticated admin page and wraps it in the sidebar chrome.
// The login page lives outside this route group, so it is never guarded here
// (which previously caused an infinite redirect loop).
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) redirect('/admin/login')
  return (
    <div className="min-h-screen bg-parchment flex flex-col lg:flex-row">
      <AdminNav />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
