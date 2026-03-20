'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS, formatCurrency } from '@/lib/utils'
import { Check, CreditCard, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PagamentoPage() {
  const { plano } = useParams<{ plano: string }>()
  const plan = PLANS.find(p => p.id === plano) ?? PLANS[0]

  const [billing, setBilling] = useState<'monthly' | 'semester' | 'annual'>(plano as 'monthly' | 'semester' | 'annual')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate payment gateway (Stripe, etc.)
    await new Promise(r => setTimeout(r, 1500))
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div>
        <Header title="Pagamento" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2232] mb-2">Pagamento confirmado!</h2>
            <p className="text-[#657585] mb-8">
              Seu plano {plan.name} foi ativado com sucesso. Bons estudos!
            </p>
            <Link href="/home">
              <Button className="w-full">Ir para o início</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Pagamento" subtitle={`Plano ${plan.name}`} />
      <div className="p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Dados do pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Billing period selector */}
                <div className="flex gap-2 mb-6">
                  {PLANS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setBilling(p.id as 'monthly' | 'semester' | 'annual')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        billing === p.id
                          ? 'bg-[#0057B8] text-white border-[#0057B8]'
                          : 'border-[#EDEFF3] text-[#657585] hover:border-[#0057B8]'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#657585]">Nome no cartão</label>
                    <input
                      type="text"
                      placeholder="Como está no cartão"
                      required
                      className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#657585]">Número do cartão</label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        required
                        className="w-full rounded-lg border border-[#EDEFF3] pl-10 pr-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#657585]">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                        className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#657585]">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        maxLength={4}
                        required
                        className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                    <Lock size={16} />
                    Pagar {formatCurrency(PLANS.find(p => p.id === billing)?.price ?? plan.price)}/mês
                  </Button>
                  <p className="text-xs text-center text-[#99A1AE] flex items-center justify-center gap-1">
                    <Lock size={11} /> Pagamento seguro e criptografado
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#657585]">Plano {plan.name}</span>
                  <span className="font-semibold text-[#1B2232]">
                    {formatCurrency(PLANS.find(p => p.id === billing)?.price ?? plan.price)}/mês
                  </span>
                </div>
                {'savings' in plan && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Desconto</span>
                    <Badge variant="success">{(plan as typeof plan & { savings: string }).savings}</Badge>
                  </div>
                )}
                <div className="border-t border-[#EDEFF3] pt-4">
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[#657585]">
                        <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F3F5F7] rounded-lg p-3 text-xs text-[#657585]">
                  7 dias grátis. Cancele quando quiser sem multa.
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
