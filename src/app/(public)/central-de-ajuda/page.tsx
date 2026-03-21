'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react'

const categories = [
  {
    id: 'aulas',
    icon: '📺',
    title: 'Aulas e Conteúdo',
    color: 'bg-[#0057b8]/10',
    faqs: [
      { q: 'Como acesso minhas aulas?', a: 'Acesse o menu principal e clique em "Aulas". Todas as suas aulas estarão organizadas por módulo e tema.' },
      { q: 'Posso assistir as aulas offline?', a: 'No momento, as aulas estão disponíveis apenas online. Estamos trabalhando no modo offline para versões futuras.' },
      { q: 'Como acompanho meu progresso?', a: 'Na página de Aulas, você pode ver a barra de progresso e quantas aulas já foram concluídas.' },
    ],
  },
  {
    id: 'pagamentos',
    icon: '💳',
    title: 'Pagamentos e Planos',
    color: 'bg-[#ff9500]/10',
    faqs: [
      { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartão de crédito, débito e PIX. Parcelamento disponível para planos semestral e anual.' },
      { q: 'Como cancelo minha assinatura?', a: 'Acesse Perfil > Meu Plano > Cancelar assinatura. Você mantém acesso até o fim do período pago.' },
      { q: 'Posso trocar de plano?', a: 'Sim! A diferença será calculada proporcionalmente. Acesse Perfil > Meu Plano para trocar.' },
    ],
  },
  {
    id: 'conta',
    icon: '🔒',
    title: 'Conta e Segurança',
    color: 'bg-[#22c55e]/10',
    faqs: [
      { q: 'Como altero minha senha?', a: 'Acesse Perfil > Informações Pessoais > Editar. Você receberá um e-mail para redefinir a senha.' },
      { q: 'Esqueci minha senha, o que faço?', a: 'Na tela de login, clique em "Esqueceu?" e siga as instruções enviadas ao seu e-mail.' },
      { q: 'Como ativo a verificação em duas etapas?', a: 'Acesse Perfil > Segurança > Verificação em duas etapas e siga as instruções.' },
    ],
  },
  {
    id: 'config',
    icon: '⚙️',
    title: 'Configurações',
    color: 'bg-[#8b5cf6]/10',
    faqs: [
      { q: 'Como altero o idioma da plataforma?', a: 'No momento, a plataforma está disponível apenas em português. Mais idiomas em breve.' },
      { q: 'Como ativo o modo escuro?', a: 'Acesse as configurações do perfil. O modo escuro estará disponível em próximas atualizações.' },
    ],
  },
]

export default function CentralDeAjudaPage() {
  const [search, setSearch] = useState('')
  const [openItem, setOpenItem] = useState<string | null>('Como acesso minhas aulas?')

  const filtered = categories.map(cat => ({
    ...cat,
    faqs: search
      ? cat.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
      : cat.faqs,
  })).filter(cat => cat.faqs.length > 0)

  return (
    <div className="max-w-[760px] mx-auto px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#1f2c47] flex items-center justify-center text-2xl mx-auto mb-4">❓</div>
        <h1 className="text-3xl font-bold text-[#1b2232] mb-2">Central de Ajuda</h1>
        <p className="text-[#65758b]">Encontre respostas para as dúvidas mais frequentes ou reporte um problema.</p>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-[#e1e7ef] rounded-xl px-4 py-3 gap-3 mb-8">
        <Search size={16} className="text-[#65758b]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar nas perguntas frequentes..."
          className="flex-1 text-sm text-[#1b2232] placeholder:text-[#65758b] outline-none bg-transparent"
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-4 mb-8">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1e7ef]">
              <div className={`${cat.color} w-9 h-9 rounded-xl flex items-center justify-center text-lg`}>{cat.icon}</div>
              <h2 className="font-bold text-[#1b2232]">{cat.title}</h2>
            </div>
            <div className="divide-y divide-[#f3f5f7]">
              {cat.faqs.map(faq => (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenItem(openItem === faq.q ? null : faq.q)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#fafafa] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#1b2232]">{faq.q}</span>
                    {openItem === faq.q ? <ChevronUp size={16} className="text-[#65758b] shrink-0" /> : <ChevronDown size={16} className="text-[#65758b] shrink-0" />}
                  </button>
                  {openItem === faq.q && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-[#65758b] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Report bug */}
      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center mb-6">
        <div className="text-3xl mb-3">🐛</div>
        <h3 className="font-bold text-[#1b2232] text-lg mb-1">Encontrou um problema?</h3>
        <p className="text-[#65758b] text-sm mb-4">Nos ajude a melhorar reportando erros ou bugs.</p>
        <button className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl mx-auto text-sm transition-colors">
          🐛 Reportar Erro ou Bug
        </button>
      </div>

      <Link href="/home" className="text-sm text-[#65758b] hover:text-[#0057b8] flex items-center justify-center gap-1">
        <ArrowLeft size={14} /> Voltar para a página Inicial
      </Link>
    </div>
  )
}
