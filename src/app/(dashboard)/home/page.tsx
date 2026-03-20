import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Calculator, Brain, Bot, ArrowRight, TrendingUp, Clock, Award } from 'lucide-react'

const journeyCards = [
  {
    href: '/trilha-de-aulas',
    title: 'Aulas',
    description: 'Acompanhe sua trilha de aprendizado personalizada',
    icon: BookOpen,
    color: '#0057B8',
    bg: 'rgba(0,87,184,0.08)',
  },
  {
    href: '/math-classes',
    title: 'Math Classes',
    description: 'Pratique matemática com exercícios focados no SAT',
    icon: Calculator,
    color: '#FF9500',
    bg: 'rgba(255,149,0,0.08)',
  },
  {
    href: '/practicing',
    title: 'Praticando',
    description: 'Simulados e exercícios para fixar o conteúdo',
    icon: Brain,
    color: '#EF467C',
    bg: 'rgba(239,70,124,0.08)',
  },
  {
    href: '/assistentes-ia',
    title: 'Assistentes IA',
    description: 'Tire dúvidas com nossos assistentes especializados',
    icon: Bot,
    color: '#FFCB22',
    bg: 'rgba(255,203,34,0.08)',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: stats }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('user_stats').select('*').eq('user_id', user!.id).single(),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Estudante'

  return (
    <div>
      <Header title="Home" subtitle="Bem-vindo de volta!" />
      <div className="p-6 space-y-6">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-[#1B2232] to-[#0057B8] rounded-2xl overflow-hidden p-8">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, #78B4E3 0%, transparent 60%)'
          }} />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">Olá, {firstName}! 👋</p>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-white/75 text-lg mb-6">
              Continue de onde parou. Você está indo muito bem!
            </p>
            <Link href="/diagnostico">
              <Button className="bg-white text-[#0057B8] hover:bg-white/90 font-bold">
                Continuar estudando <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Aulas Concluídas', value: stats?.aulas_concluidas ?? 0, icon: Award, color: '#0057B8' },
            { label: 'Horas de Estudo', value: `${stats?.horas_de_estudo ?? 0}h`, icon: Clock, color: '#37B0DD' },
            { label: 'Último Teste SAT', value: stats?.ultimo_sat_score ?? '—', icon: TrendingUp, color: '#FFCB22' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B2232]">{value}</p>
                  <p className="text-sm text-[#657585]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sua Jornada */}
        <div>
          <h3 className="text-lg font-bold text-[#1B2232] mb-4">Sua Jornada</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {journeyCards.map(({ href, title, description, icon: Icon, color, bg }) => (
              <Link key={href} href={href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: bg }}
                    >
                      <Icon size={22} style={{ color }} />
                    </div>
                    <h4 className="text-base font-bold text-[#1B2232] mb-1">{title}</h4>
                    <p className="text-sm text-[#657585] mb-4 leading-relaxed">{description}</p>
                    <span
                      className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                      style={{ color }}
                    >
                      Começar agora <ArrowRight size={14} />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5">
              <h4 className="font-bold text-[#1B2232] mb-3">Próximo Agendamento</h4>
              <p className="text-sm text-[#657585] mb-4">Nenhum agendamento próximo.</p>
              <Link href="/agendamentos">
                <Button variant="outline" size="sm">Ver agendamentos</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h4 className="font-bold text-[#1B2232] mb-3">Diagnóstico SAT</h4>
              <p className="text-sm text-[#657585] mb-4">Descubra seu nível atual e receba um plano personalizado.</p>
              <Link href="/diagnostico">
                <Button size="sm">Fazer diagnóstico</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
