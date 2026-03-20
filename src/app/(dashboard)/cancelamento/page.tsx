'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const reasons = [
  'O preço está muito alto',
  'Não estou usando o suficiente',
  'Encontrei uma alternativa melhor',
  'Não atendeu minhas expectativas',
  'Problemas técnicos',
  'Outro motivo',
]

export default function CancelamentoPage() {
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleConfirm() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active')
    }
    setStep(3)
    setLoading(false)
  }

  if (step === 3) {
    return (
      <div>
        <Header title="Cancelamento" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2232] mb-2">Cancelamento confirmado</h2>
            <p className="text-[#657585] mb-8">
              Seu plano foi cancelado. Você continua tendo acesso até o fim do período pago.
            </p>
            <Link href="/home">
              <Button className="w-full">Voltar ao início</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Cancelar Assinatura" />
      <div className="p-6 max-w-lg">
        {step === 1 && (
          <div className="space-y-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5 flex gap-3">
                <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1B2232] mb-1">Tem certeza que quer cancelar?</p>
                  <p className="text-sm text-[#657585]">
                    Ao cancelar, você perderá acesso às aulas, assistentes IA e todos os recursos premium ao fim do período.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="font-medium text-[#1B2232] mb-4">Por que você está cancelando?</p>
                <div className="space-y-2">
                  {reasons.map((r) => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer py-2">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="text-[#0057B8]"
                      />
                      <span className="text-sm text-[#1B2232]">{r}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => setStep(2)}
                disabled={!reason}
                className="flex-1"
              >
                Continuar cancelamento
              </Button>
              <Link href="/profile" className="flex-1">
                <Button variant="outline" className="w-full">Manter assinatura</Button>
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1B2232] mb-2">Confirmar cancelamento</h3>
                <p className="text-[#657585] mb-6">
                  Esta ação não pode ser desfeita facilmente. Você perderá acesso premium ao fim do período pago.
                </p>
                <div className="flex gap-3">
                  <Button variant="danger" onClick={handleConfirm} loading={loading} className="flex-1">
                    Cancelar definitivamente
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
