'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { serif } from '@/controls/fonts'
import Image from 'next/image'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👤' },
  { href: '/admin/promo', label: 'Promo Codes', icon: '🏷️' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 bg-walnut text-parchment flex flex-col min-h-screen flex-shrink-0">
      <div className="p-5 border-b border-walnut/50">
        <Image src="/images/LogoNoWebsite_small.png" alt="Roger & Sally" width={160} height={60} className="invert opacity-90" />
        <p className="text-xs text-maple mt-2 opacity-70">Admin</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-cherry text-white'
                  : 'text-maple hover:bg-white/10'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <a href="/" className="flex items-center gap-2 text-xs text-maple opacity-60 hover:opacity-100 mb-3" target="_blank">
          ↗ View site
        </a>
        <button onClick={logout} className="text-xs text-maple opacity-60 hover:opacity-100 hover:text-cherry transition-colors">
          Sign out
        </button>
      </div>
    </aside>
  )
}
