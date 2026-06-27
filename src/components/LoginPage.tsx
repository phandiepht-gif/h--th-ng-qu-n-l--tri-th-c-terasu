import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email hoac mat khau khong dung')
      setLoading(false)
      return
    }
    onLoginSuccess()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-3">TR</div>
          <h1 className="text-white font-extrabold text-xl">TERASU EKMS</h1>
          <p className="text-slate-400 text-sm mt-1">He thong Quan ly Tri thuc Doanh nghiep</p>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-white font-bold text-base mb-5">Dang nhap</h2>
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ten@daichi.vn" required className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mat khau</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-lg transition-colors mt-2">
              {loading ? 'Dang dang nhap...' : 'Dang nhap'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-xs mt-4">Lien he IT Admin de duoc cap tai khoan</p>
      </div>
    </div>
  )
}
