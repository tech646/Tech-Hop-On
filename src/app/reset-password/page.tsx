'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem'); return }
    if (password.length < 6) { setError('A senha deve ter ao menos 6 caracteres'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div className="min-h-screen bg-[#141631] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm border border-white/10">
        <div className="mb-6">
          <Image src="/images/logo.svg" alt="Hop On" width={80} height={44} />
        </div>
        {done ? (
          <div className="text-center">
            <p className="text-white font-bold text-xl mb-2">Senha atualizada!</p>
            <p className="text-white/60 text-sm">Redirecionando para o login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">Nova senha</h1>
            <p className="text-white/60 text-sm mb-6">Crie uma nova senha segura para sua conta.</p>
            {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-xl">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/70 text-xs font-bold uppercase tracking-wider block mb-2">Nova senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 h-14 text-white placeholder:text-white/40 outline-none focus:border-[#0057b8]"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-xs font-bold uppercase tracking-wider block mb-2">Confirmar senha</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 h-14 text-white placeholder:text-white/40 outline-none focus:border-[#0057b8]"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold rounded-2xl h-14 transition-colors disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
