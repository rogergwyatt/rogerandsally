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
    <aside className="w-full lg:w-56 bg-walnut text-parchment flex flex-col lg:min-h-screen flex-shrink-0">
      {/* Header: logo + (mobile-only) sign-out on the right */}
      <div className="flex items-center justify-between p-4 lg:p-5 lg:border-b lg:border-white/10">
        <div>
          <Image src="/images/LogoNoWebsite_small.png" alt="Roger & Sally" width={160} height={60} className="invert opacity-90 w-28 lg:w-40 h-auto" />
          <p className="text-xs text-maple mt-2 opacity-70 hidden lg:block">Admin</p>
        </div>
        <button onClick={logout} className="lg:hidden text-xs text-maple opacity-70 hover:text-cherry">
          Sign out
        </button>
      </div>

      {/* Nav: horizontal scroll row on mobile, vertical list on desktop */}
      <nav className="flex flex-row lg:flex-col gap-1 px-2 pb-2 lg:px-4 lg:py-4 lg:flex-1 overflow-x-auto">
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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

      {/* Footer actions: desktop only (mobile sign-out is in the header) */}
      <div className="hidden lg:block p-4 border-t border-white/10">
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
