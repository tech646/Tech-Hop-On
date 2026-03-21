'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'perfil' | 'plano'

const PLANS = [
  { key: 'gratuito', name: 'Gratuito', price: 'Grátis', period: '', desc: 'Acesso ao login e avaliação diagnóstica. Sem acesso a aulas ou assistentes.', active: false, cta: 'Gratuito' },
  { key: 'mensal', name: 'Mensal', price: 'R$ 450', period: '/mês', desc: 'Flexibilidade total, sem fidelidade. Direito a duas (2) aulas com especialistas por semana.', active: false, cta: 'Trocar para Mensal' },
  { key: 'semestral', name: 'Semestral', price: 'R$ 380', period: '/mês', desc: '6 meses de acesso com desconto. Direito a três (3) aulas com especialistas por semana.', total: 'R$2.280,00 total', savings: 'Economia de R$420', active: false, cta: 'Trocar para Semestral' },
  { key: 'anual', name: 'Anual', price: 'R$ 290', period: '/mês', desc: '12 meses — o melhor custo-benefício para quem leva a sério o sonho de estudar fora. Direito a quatro (4) aulas com especialistas por semana.', total: 'R$3.480,00 total', savings: 'Economia de R$1.920', active: false, cta: 'Trocar para Anual', recommended: true },
]

const colleges = [
  { name: 'MIT', location: 'Cambridge, MA', deadline: 'Jan 1, 2025', acceptance: '4%', category: 'Dream/Sonho' },
  { name: 'Stanford University', location: 'Stanford, CA', deadline: 'Jan 5, 2025', acceptance: '4%', category: 'Dream/Sonho' },
  { name: 'UC Berkeley', location: 'Berkeley, CA', deadline: 'Nov 30, 2024', acceptance: '14%', category: 'Target/Provável' },
  { name: 'University of Michigan', location: 'Ann Arbor, MI', deadline: 'Feb 1, 2025', acceptance: '18%', category: 'Target/Provável' },
  { name: 'Purdue University', location: 'West Lafayette, IN', deadline: 'Mar 1, 2025', acceptance: '67%', category: 'Safety/Segura' },
  { name: 'Arizona State University', location: 'Tempe, AZ', deadline: 'Rolling', acceptance: '88%', category: 'Safety/Segura' },
]

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('perfil')
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string; created: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          created: new Date(user.created_at).getFullYear().toString(),
        })
      }
    })
  }, [])

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  const categoryColors: Record<string, string> = {
    'Dream/Sonho': 'text-[#1b2232]',
    'Target/Provável': 'text-[#1b2232]',
    'Safety/Segura': 'text-[#1b2232]',
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Voltar para home
      </Link>

      {/* Header card */}
      <div className="bg-[#1f2c47] rounded-2xl p-6 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">👤</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          <p className="text-white/70 text-sm">Gerencie suas informações e acompanhe sua estratégia de application.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-[#e1e7ef] mb-6 p-1">
        {[{key:'perfil',label:'Meu Perfil'},{key:'plano',label:'Meu Plano'}].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${tab === t.key ? 'bg-[#f3f5f7] text-[#1b2232]' : 'text-[#65758b] hover:text-[#1b2232]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'perfil' && (
        <div className="space-y-4">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1b2232] text-lg">Informações Pessoais</h2>
              <button className="flex items-center gap-1.5 text-[#0057b8] text-sm font-medium">
                <Edit2 size={14} /> Editar meu perfil
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-[#f3f5f7] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">👤</div>
              <div>
                <p className="font-bold text-[#1b2232]">{user?.name || 'Maria Silva'}</p>
                <p className="text-sm text-[#65758b]">{user?.email || 'maria.silva@email.com'}</p>
                <p className="text-xs text-[#65758b]">Membro desde janeiro de 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nome completo', value: user?.name || 'Maria Silva', icon: '👤' },
                { label: 'Email', value: user?.email || 'maria.silva@email.com', icon: '✉️' },
                { label: 'Telefone', value: '+55 11 91234-5678', icon: '📞' },
                { label: 'Data de nascimento', value: '01/01/2006', icon: '📅' },
                { label: 'Cidade', value: 'São Paulo / SP', icon: '📍' },
                { label: 'Escola atual', value: 'Hop On High School', icon: '🏫' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="border border-[#e1e7ef] rounded-xl p-3">
                  <p className="text-xs text-[#65758b] mb-1 flex items-center gap-1"><span>{icon}</span>{label}</p>
                  <p className="text-sm font-medium text-[#1b2232]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* College list */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[#1b2232] text-lg">Minha lista de College</h2>
                <p className="text-xs text-[#65758b]">Organize suas universidades por estratégia de application.</p>
              </div>
              <button className="flex items-center gap-1.5 bg-[#0057b8] text-white text-sm px-3 py-1.5 rounded-xl font-medium">
                <Plus size={14} /> Adicionar College
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 mb-4">
              {['2 Dream/Sonho', '2 Target/Provável', '2 Safety/Segura'].map(t => (
                <span key={t} className="text-xs border border-[#e1e7ef] rounded-full px-3 py-1 text-[#65758b] flex items-center gap-1">
                  <span>🎯</span>{t}
                </span>
              ))}
            </div>

            {['Dream/Sonho', 'Target/Provável', 'Safety/Segura'].map(category => (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1b2232] mb-2">
                  <span>🎯</span> {category}
                  <span className="text-xs font-normal text-[#65758b]">
                    {category === 'Dream/Sonho' ? 'Universidades muito competitivas, chances remotas mas vale tentar.' :
                     category === 'Target/Provável' ? 'Universidades com histórico de admissão no seu perfil.' :
                     'Altas chances de admissão, opções de backup.'}
                  </span>
                </div>
                {colleges.filter(c => c.category === category).map(college => (
                  <div key={college.name} className="flex items-center gap-3 py-2.5 border-b border-[#f3f5f7] last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1b2232]">{college.name}</p>
                      <p className="text-xs text-[#65758b]">{college.location} · Deadline: {college.deadline} · Aceitação: {college.acceptance}</p>
                    </div>
                    <button className="text-[#65758b] hover:text-[#0057b8]"><ExternalLink size={14} /></button>
                    <button className="text-[#65758b] hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* SAT Score */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-2">Último resultado de prática SAT</h2>
            <p className="text-xs text-[#65758b] mb-4">Avaliação para application.</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[#1b2232]">Resultado</p>
              <p className="text-sm font-bold text-[#1b2232]">1300/1600</p>
            </div>
            <div className="w-full h-3 bg-[#f3f5f7] rounded-full mb-4">
              <div className="h-full bg-[#1b2232] rounded-full" style={{ width: `${(1300/1600)*100}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#fff8e7] rounded-xl p-3 text-center">
                <p className="text-xs text-[#65758b] mb-1">Evidence Based Reading and Writing (EBRW)</p>
                <p className="text-sm font-bold text-[#a07800]">Fair</p>
              </div>
              <div className="bg-[#f0f7ff] rounded-xl p-3 text-center">
                <p className="text-xs text-[#65758b] mb-1">Math</p>
                <p className="text-sm font-bold text-[#0057b8]">Médio</p>
              </div>
            </div>
            <p className="text-xs text-[#65758b] mb-3">Última prática: 13 de janeiro, 2024</p>
            <button className="w-full bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <RefreshCw size={14} /> Refazer Prática SAT
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-4">Seu progresso</h2>
            {[
              { label: 'Aulas concluídas', value: '24/36' },
              { label: 'Exercícios Feitos', value: '154' },
              { label: 'Horas de Estudo', value: '41h' },
              { label: 'Mentorias Realizadas', value: '8' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[#f3f5f7] last:border-0">
                <p className="text-sm text-[#1b2232]">{label}</p>
                <p className="text-sm font-bold text-[#1b2232]">{value}</p>
              </div>
            ))}
          </div>

          {/* Delete */}
          <button onClick={handleDelete} className="w-full bg-[#ff4444] hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
            🗑 Deletar conta
          </button>
        </div>
      )}

      {tab === 'plano' && (
        <div className="space-y-4">
          {/* Current plan */}
          <div className="bg-[#1f2c47] rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl mt-0.5">👑</span>
            <div>
              <p className="text-xs font-medium text-white/60 uppercase tracking-wide mb-1">Seu plano atual</p>
              <p className="text-2xl font-bold text-white">Plano Mensal</p>
              <p className="text-sm text-white/70 mt-1">Próxima cobrança <span className="font-bold text-white">01/04/2026</span> <span className="font-bold text-white">R$ 450,00</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-1">Escolha seu plano</h2>
            <p className="text-sm text-[#65758b] mb-5">Preparar-se para estudar fora é um processo de anos. Quanto mais tempo, melhor o custo-benefício.</p>

            <div className="space-y-3">
              {/* Gratuito */}
              <div className="border-2 border-[#e1e7ef] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1b2232]">Gratuito</span>
                    <span className="text-xs bg-[#f3f5f7] text-[#65758b] px-2 py-0.5 rounded-full flex items-center gap-1">✓ Ativo</span>
                  </div>
                  <p className="text-sm text-[#65758b] mt-1">Acesso ao login e avaliação diagnóstica. Sem acesso a aulas ou assistentes.</p>
                </div>
                <span className="font-bold text-[#1b2232] text-xl ml-4 shrink-0">Grátis</span>
              </div>

              {/* Mensal */}
              <div className="border-2 border-[#e1e7ef] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#1b2232]">Mensal</span>
                  <div className="text-right"><span className="text-xl font-bold text-[#1b2232]">R$ 450</span><span className="text-sm text-[#65758b]">/mês</span></div>
                </div>
                <p className="text-sm text-[#65758b] mb-3">Flexibilidade total, sem fidelidade. Direito a duas (2) aulas com especialistas por semana.</p>
                <button className="w-full bg-[#ff9500] hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Trocar para Mensal</button>
              </div>

              {/* Semestral */}
              <div className="border-2 border-[#e1e7ef] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#1b2232]">Semestral</span>
                  <div className="text-right"><span className="text-xl font-bold text-[#1b2232]">R$ 380</span><span className="text-sm text-[#65758b]">/mês</span></div>
                </div>
                <p className="text-sm text-[#65758b] mb-2">6 meses de acesso com desconto. Direito a três (3) aulas com especialistas por semana.</p>
                <div className="text-right text-xs text-[#65758b] mb-2">R$2.280,00 total</div>
                <span className="text-xs bg-[#f0fdf4] text-[#22c55e] px-2 py-0.5 rounded-full font-medium mb-3 inline-block">Economia de R$420</span>
                <button className="w-full bg-[#ff9500] hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors block">Trocar para Semestral</button>
              </div>

              {/* Anual */}
              <div className="border-2 border-[#ff9500] rounded-2xl p-4 relative">
                <div className="absolute -top-3 left-4 bg-[#ff9500] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  🏆 Recomendado
                </div>
                <div className="flex items-center justify-between mb-2 mt-2">
                  <span className="font-bold text-[#1b2232]">Anual</span>
                  <div className="text-right"><span className="text-xl font-bold text-[#1b2232]">R$ 290</span><span className="text-sm text-[#65758b]">/mês</span></div>
                </div>
                <p className="text-sm text-[#65758b] mb-2">12 meses — o melhor custo-benefício para quem leva a sério o sonho de estudar fora. Direito a quatro (4) aulas com especialistas por semana.</p>
                <div className="text-right text-xs text-[#65758b] mb-2">R$3.480,00 total</div>
                <span className="text-xs bg-[#f0fdf4] text-[#22c55e] px-2 py-0.5 rounded-full font-medium mb-3 inline-block">Economia de R$1.920</span>
                <button className="w-full bg-[#ff9500] hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors block">Trocar para Anual</button>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-4">Perguntas frequentes</h2>
            {[
              { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim! A diferença será calculada proporcionalmente e aplicada na próxima cobrança.' },
              { q: 'O que acontece se eu cancelar?', a: 'Você mantém acesso até o fim do período pago. Não há multa por cancelamento.' },
              { q: 'Há desconto para pagamento à vista?', a: 'Os planos semestral e anual já incluem desconto progressivo.' },
            ].map(({ q, a }) => (
              <div key={q} className="py-3 border-b border-[#f3f5f7] last:border-0">
                <p className="font-medium text-[#1b2232] text-sm mb-1">{q}</p>
                <p className="text-sm text-[#65758b]">{a}</p>
              </div>
            ))}
          </div>

          <Link href="/cancelamento" className="block text-center text-sm text-[#65758b] hover:text-red-500 transition-colors">
            Cancelar assinatura
          </Link>
        </div>
      )}
    </div>
  )
}
