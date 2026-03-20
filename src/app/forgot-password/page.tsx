'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14163A]">
      <div className="w-full max-w-sm px-4">
        <div className="bg-[#7BB8E3]/10 border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-[#50A2FF]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email enviado!</h2>
              <p className="text-[#99A1AE] text-sm mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Esqueceu a senha?</h2>
              <p className="text-[#99A1AE] text-sm mb-8">
                Digite seu email e enviaremos um link para redefinir sua senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  icon={<Mail size={16} />}
                  required
                />
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Enviar link
                </Button>
              </form>
              <p className="text-center text-sm text-[#99A1AE] mt-6">
                <Link href="/login" className="text-[#50A2FF] hover:underline">
                  ← Voltar ao login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
