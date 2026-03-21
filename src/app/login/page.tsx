'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
    } else {
      router.push('/home')
    }
  }

  async function handleGoogle() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-[#141631] flex items-center justify-center relative overflow-hidden p-0 lg:p-4">
      {/* Blur orbs */}
      <div className="absolute -top-20 -left-40 w-[613px] h-[300px] rounded-full bg-[#155dfc]/10 blur-[60px]" />
      <div className="absolute -bottom-20 -right-40 w-[613px] h-[300px] rounded-full bg-[#4f39f6]/10 blur-[60px]" />
      <div className="absolute top-36 right-20 w-[300px] h-[300px] rounded-full bg-white/5 blur-[40px]" />

      {/* Modal */}
      <div className="w-full lg:w-[1200px] lg:max-w-[95vw] lg:h-[752px] lg:max-h-[95vh] bg-white/10 backdrop-blur-xl border border-white/10 rounded-none lg:rounded-[32px] shadow-2xl overflow-hidden flex min-h-screen lg:min-h-0">
        {/* Left panel — hidden on mobile */}
        <div className="hidden lg:flex w-[649px] bg-gradient-to-br from-[#fafafa] to-white border-r border-white/5 flex-col p-12 relative overflow-hidden shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="Hop On" width={100} height={55} priority />
          </div>

          <div className="mt-16 flex-1">
            <h1 className="text-[36px] font-bold text-[#0f111a] leading-tight mb-4">
              Sua jornada para o Ensino<br />Superior internacional<br />começa aqui!
            </h1>
            <p className="text-[18px] text-[#0f111a]/70 leading-relaxed">
              Acesse a plataforma Hop On e descubra novas possibilidades.
            </p>
          </div>

          {/* CTA card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2b7fff]/20 border border-[#2b7fff]/30 flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#0f111a]" />
            </div>
            <div>
              <p className="text-[#0f111a] font-semibold text-base">Quer saber mais?</p>
              <p className="text-[#0f111a]/70 text-sm">Clique aqui e faça o teste para saber como a Hop On pode te ajudar!</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-12 overflow-y-auto">
          <h2 className="text-[30px] font-bold text-white mb-1">Bem-vindo</h2>
          <p className="text-[#99a1af] text-base mb-8">Entre com suas credenciais ou use uma conta social.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#d1d5dc] text-sm font-medium mb-1.5">E-mail</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5565]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-[#1f222f] border border-white/10 rounded-2xl h-[58px] pl-12 pr-4 text-white placeholder:text-[#4a5565] text-base outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[#d1d5dc] text-sm font-medium">Senha</label>
                <Link href="/forgot-password" className="text-[#51a2ff] text-xs hover:underline">Esqueceu?</Link>
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5565]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1f222f] border border-white/10 rounded-2xl h-[58px] pl-12 pr-12 text-white placeholder:text-[#4a5565] text-base outline-none focus:border-[#0057b8] transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5565] hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPass ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className={`w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center transition-colors cursor-pointer ${remember ? 'bg-[#0057b8]' : 'bg-[#1f222f]'}`}
                onClick={() => setRemember(!remember)}
              >
                {remember && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-[#99a1af] text-sm">Lembrar de mim</span>
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold text-base rounded-2xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_10px_15px_-3px_rgba(28,57,142,0.3)]"
            >
              {loading ? 'Entrando...' : 'Entrar'}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 border-t border-white/5" />
            <span className="text-[#6a7282] text-xs uppercase tracking-widest">Ou continuar com</span>
            <div className="flex-1 border-t border-white/5" />
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <button
              onClick={handleGoogle}
              className="flex-1 h-[50px] bg-white/3 hover:bg-white/8 border border-white/5 rounded-2xl flex items-center justify-center transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button className="flex-1 h-[50px] bg-white/3 hover:bg-white/8 border border-white/5 rounded-2xl flex items-center justify-center transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="flex-1 h-[50px] bg-white/3 hover:bg-white/8 border border-white/5 rounded-2xl flex items-center justify-center transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Register link */}
          <p className="text-center mt-5 text-sm text-[#6a7282]">
            Não possui uma conta?{' '}
            <Link href="/register" className="text-[#51a2ff] font-bold hover:underline">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
