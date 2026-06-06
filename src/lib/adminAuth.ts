import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE = 'rs_admin'

export function isAdminAuthenticated(): boolean {
  const store = cookies()
  return store.get(COOKIE)?.value === process.env.ADMIN_COOKIE_SECRET
}

export function requireAdmin(): NextResponse | null {
  if (!isAdminAuthenticated()) {
    return NextResponse.redirect(new URL('/admin/login', 'http://placeholder'))
  }
  return null
}

export function setAdminCookie(res: NextResponse) {
  res.cookies.set(COOKIE, process.env.ADMIN_COOKIE_SECRET ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.delete(COOKIE)
}
