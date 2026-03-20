import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { PLANS, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function PlanosPage() {
  return (
    <div>
      <Header title="Planos" subtitle="Escolha o melhor plano para você" />
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1B2232] mb-3">
              Invista no seu futuro
            </h2>
            <p className="text-[#657585] text-lg">
              Planos acessíveis para você chegar às melhores universidades do mundo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${plan.is_popular ? 'border-[#0057B8] shadow-lg' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="info">Mais popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#1B2232] mb-1">{plan.name}</h3>
                  {'savings' in plan && (
                    <Badge variant="success" className="mb-3">{plan.savings}</Badge>
                  )}
                  <div className="flex items-end gap-1 my-4">
                    <span className="text-3xl font-bold text-[#1B2232]">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-[#657585] text-sm mb-1">/{plan.period}</span>
                  </div>
                  {'total' in plan && (
                    <p className="text-xs text-[#657585] mb-4">
                      Total: {formatCurrency((plan as typeof plan & { total: number }).total)}
                    </p>
                  )}

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-[#657585]">
                        <Check size={15} className="text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/pagamento/${plan.id}`}>
                    <Button
                      className="w-full"
                      variant={plan.is_popular ? 'primary' : 'outline'}
                    >
                      Assinar {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#657585]">
              Todos os planos incluem 7 dias grátis. Cancele quando quiser, sem multa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
