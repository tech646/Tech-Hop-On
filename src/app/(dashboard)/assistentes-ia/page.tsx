import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AI_ASSISTANTS } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export default function AssistentesIAPage() {
  return (
    <div>
      <Header title="Assistentes IA" subtitle="Escolha seu assistente especializado" />
      <div className="p-6">
        <div className="max-w-5xl">
          <p className="text-[#657585] mb-8 text-base">
            Nossos assistentes de IA são especializados em diferentes áreas para te ajudar a alcançar o melhor resultado no SAT.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AI_ASSISTANTS.map((assistant) => (
              <Card key={assistant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div
                    className="h-24 flex items-center justify-between px-6"
                    style={{ background: `${assistant.color}15` }}
                  >
                    <div>
                      <span className="text-3xl">{assistant.emoji}</span>
                    </div>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: assistant.color }}
                    >
                      {assistant.name[0]}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#1B2232]">{assistant.name}</h3>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${assistant.color}15`, color: assistant.color }}
                      >
                        {assistant.specialty}
                      </span>
                    </div>
                    <p className="text-sm text-[#657585] mb-5 leading-relaxed">{assistant.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/assistentes-ia/${assistant.id}`} className="flex-1">
                        <Button className="w-full" style={{ background: assistant.color }}>
                          Conversar <ArrowRight size={14} />
                        </Button>
                      </Link>
                      <Link href="/agendamentos">
                        <Button variant="outline" size="md">
                          <Calendar size={15} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
