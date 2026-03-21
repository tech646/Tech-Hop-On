import { createClient } from '@/lib/supabase/server'
import { getUserStats } from '@/lib/supabase/actions'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Calculator, Brain, Sparkles } from 'lucide-react'

const journeyCards = [
  {
    title: 'Aulas',
    description: 'Acesse as vídeo aulas',
    href: '/trilha-de-aulas',
    icon: BookOpen,
    iconBg: 'bg-[#008db8]/10',
    iconColor: 'text-[#008db8]',
    image: '/images/card-aulas.png',
  },
  {
    title: 'Math Classes',
    description: 'Clique e agende!',
    href: '/math-classes',
    icon: Calculator,
    iconBg: 'bg-[#ff9500]/10',
    iconColor: 'text-[#ff9500]',
    image: '/images/card-math.png',
  },
  {
    title: 'Praticando',
    description: 'Pratique o SAT',
    href: '/practicing',
    icon: Brain,
    iconBg: 'bg-[#ef467c]/10',
    iconColor: 'text-[#ef467c]',
    image: '/images/card-practicing.png',
  },
  {
    title: 'Assistentes IA',
    description: 'Tire suas dúvidas agora',
    href: '/assistentes-ia',
    icon: Sparkles,
    iconBg: 'bg-[#ffcb22]/10',
    iconColor: 'text-[#a07800]',
    image: '/images/card-ia.png',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'aluno'

  const { completedLessons, studyHours, latestSAT, aiMessages } = user
    ? await getUserStats(user.id)
    : { completedLessons: 0, studyHours: 0, latestSAT: null, aiMessages: 0 }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Hero banner */}
      <div className="bg-[#1f2c47] rounded-2xl overflow-hidden relative mb-8 h-[384px]">
        <div className="absolute inset-0 p-12 flex flex-col justify-center z-10">
          <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 w-fit">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Boas-vindas ao futuro</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Welcome back!</h1>
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
            Seu sonho de estudar fora está 12% mais próximo hoje. Vamos continuar sua jornada!
          </p>
          <div className="flex gap-4">
            <Link href="/trilha-de-aulas" className="bg-white text-[#1b2232] font-bold text-sm px-6 h-11 rounded-full flex items-center hover:bg-white/90 transition-colors shadow-sm">
              Continuar Aula
            </Link>
            <Link href="/math-classes" className="border border-white/20 text-white font-bold text-sm px-6 h-11 rounded-full flex items-center hover:bg-white/10 transition-colors">
              Marcar Math Class
            </Link>
          </div>
        </div>
        {/* Hero illustration */}
        <div className="absolute right-0 bottom-0 w-[438px] h-[280px] z-0">
          <Image src="/images/hero-illustration.png" alt="Hero" fill className="object-contain object-bottom" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Aulas Concluídas', value: completedLessons.toString(), icon: BookOpen, color: 'bg-[#0057b8]/10' },
          { label: 'Horas de Estudo', value: `${studyHours}h`, icon: Brain, color: 'bg-[#ff9500]/10' },
          { label: 'Último Teste SAT', value: latestSAT?.toString() ?? '--', icon: Sparkles, color: 'bg-[#1f4435]/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 flex items-center gap-4">
            <div className={`${color} rounded-xl w-12 h-12 flex items-center justify-center shrink-0`}>
              <Icon size={24} className="text-[#1b2232]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#65758b] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-bold text-[#1b2232]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Journey section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1b2232] mb-1">Sua Jornada</h2>
        <p className="text-[#65758b] mb-5">Tudo o que você precisa para alcançar o topo</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {journeyCards.map(({ title, description, href, icon: Icon, iconBg, iconColor, image }) => (
            <Link key={href} href={href} className="bg-white rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className={`${iconBg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <p className="font-bold text-[#1b2232] text-base mb-1">{title}</p>
                <p className="text-[#65758b] text-sm mb-3">{description}</p>
                <span className="text-[#0057b8] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Começar agora <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
