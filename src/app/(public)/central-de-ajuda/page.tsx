'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    category: 'Plataforma',
    items: [
      { q: 'Como funciona a Hop On Academy?', a: 'Somos uma plataforma completa de preparação para o SAT com aulas em vídeo, assistentes IA, diagnósticos e simulados personalizados.' },
      { q: 'Como acessar meu conteúdo?', a: 'Após fazer login, você terá acesso a toda a trilha de aulas e recursos conforme seu plano.' },
    ],
  },
  {
    category: 'Assinatura',
    items: [
      { q: 'Posso cancelar quando quiser?', a: 'Sim! Você pode cancelar a qualquer momento sem multa. O acesso permanece até o fim do período pago.' },
      { q: 'Há período de teste gratuito?', a: 'Sim, todos os planos incluem 7 dias grátis para você experimentar a plataforma.' },
      { q: 'Como alterar meu plano?', a: 'Acesse "Planos" no menu lateral e escolha o novo plano. A diferença será cobrada proporcionalmente.' },
    ],
  },
  {
    category: 'SAT',
    items: [
      { q: 'O que é o SAT?', a: 'O SAT é um teste padronizado americano exigido pela maioria das universidades dos EUA. Avalia habilidades em leitura, escrita e matemática.' },
      { q: 'Quando devo fazer o SAT?', a: 'Recomendamos fazer o SAT pelo menos 1 ano antes da data de inscrição nas universidades. O teste é oferecido várias vezes ao ano.' },
    ],
  },
]

export default function CentralDeAjudaPage() {
  const [open, setOpen] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <div>
      <Header title="Central de Ajuda" />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
          <input
            type="text"
            placeholder="Buscar na central de ajuda..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#EDEFF3] pl-10 pr-4 py-3 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
          />
        </div>

        {/* FAQs */}
        {filtered.map((cat) => (
          <div key={cat.category}>
            <h3 className="font-bold text-[#1B2232] mb-3">{cat.category}</h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <Card key={item.q}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpen(open === item.q ? null : item.q)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-[#1B2232] text-sm pr-4">{item.q}</span>
                      {open === item.q ? (
                        <ChevronUp size={16} className="text-[#657585] shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-[#657585] shrink-0" />
                      )}
                    </button>
                    {open === item.q && (
                      <div className="px-4 pb-4 border-t border-[#EDEFF3] pt-3">
                        <p className="text-sm text-[#657585] leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <Card className="bg-[#0057B8] border-0">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-white mb-1">Não encontrou o que precisava?</p>
              <p className="text-white/70 text-sm">Nossa equipe está pronta para ajudar</p>
            </div>
            <Link href="/assistentes-ia">
              <Button className="bg-white text-[#0057B8] hover:bg-white/90">
                <MessageCircle size={16} /> Falar com IA
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
