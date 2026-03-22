'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14163A]">
        <div className="bg-[#7BB8E3]/10 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-[#99A1AE] text-sm mb-6">
            We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#14163A]">
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
            Start your SAT preparation today!
          </h1>
          <p className="text-[#99A1AE] text-lg leading-relaxed">
            Join over 2,400 students already on the path to the world&apos;s best universities.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-[#7BB8E3]/10 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
            <p className="text-[#99A1AE] text-sm mb-8">Fill in your details below to get started</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                icon={<User size={16} />}
                required
              />
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
                <label className="text-sm font-medium text-[#D0D5DB]">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#657585]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={8}
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

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Create account
              </Button>
            </form>

            <p className="text-center text-sm text-[#99A1AE] mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[#50A2FF] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
