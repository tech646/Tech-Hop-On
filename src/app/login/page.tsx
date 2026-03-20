'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos.')
    } else {
      router.push('/home')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleSocialLogin(provider: 'google' | 'facebook' | 'apple') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex bg-[#14163A]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0057B8]/30 to-[#14163A]" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#0057B8] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-white font-bold text-xl">Hop On Academy</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Sua jornada para o Ensino Superior internacional começa aqui!
          </h1>
          <p className="text-[#99A1AE] text-lg leading-relaxed">
            Prepare-se para o SAT com assistentes IA, aulas personalizadas e diagnósticos precisos.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Alunos', value: '2.400+' },
              { label: 'Aprovações', value: '89%' },
              { label: 'Universidades', value: '150+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-[#99A1AE] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-[#7BB8E3]/10 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
            <p className="text-[#99A1AE] text-sm mb-8">Entre na sua conta para continuar</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[#D0D5DB]">Senha</label>
                  <Link href="/forgot-password" className="text-xs text-[#50A2FF] hover:underline">
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#657585]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#1F222F] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-[#99A1AE] focus:border-[#0057B8] focus:outline-none focus:ring-1 focus:ring-[#0057B8] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#657585] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#1F222F] text-[#0057B8] focus:ring-[#0057B8]"
                />
                <span className="text-sm text-[#D0D5DB]">Lembrar de mim</span>
              </label>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Entrar
              </Button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#657585] uppercase tracking-wider">Ou continuar com</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { provider: 'google' as const, label: 'G', color: '#EA4335' },
                { provider: 'facebook' as const, label: 'f', color: '#1877F2' },
                { provider: 'apple' as const, label: '', color: '#fff' },
              ].map(({ provider, label, color }) => (
                <button
                  key={provider}
                  onClick={() => handleSocialLogin(provider)}
                  className="h-11 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <span className="font-bold text-sm" style={{ color }}>{label}</span>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-[#99A1AE] mt-6">
              Não tem conta?{' '}
              <Link href="/register" className="text-[#50A2FF] hover:underline font-medium">
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
