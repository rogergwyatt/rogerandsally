'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { serif } from '@/controls/fonts'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin/orders')
    } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <main className="bg-parchment min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-maple rounded-lg p-8 w-full max-w-sm shadow-sm">
        <h1 className={`text-2xl text-walnut mb-6 text-center ${serif.className}`}>Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cherry text-white py-2 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
