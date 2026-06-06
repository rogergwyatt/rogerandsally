import { isAdminAuthenticated } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import AdminOrdersClient from './AdminOrdersClient'

export const dynamic = 'force-dynamic'

export default function AdminOrdersPage() {
  if (!isAdminAuthenticated()) redirect('/admin/login')
  return <AdminOrdersClient />
}
