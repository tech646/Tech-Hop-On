import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Heart, Users, Award } from 'lucide-react'

export default function QuemSomosPage() {
  return (
    <div>
      <Header title="Quem Somos" />
      <div className="p-6 max-w-4xl space-y-8">

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1B2232] to-[#0057B8] rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Hop On Academy</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Somos uma plataforma de preparação para o SAT e ingresso em universidades internacionais, dedicada a tornar a educação de qualidade acessível a estudantes brasileiros.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Target,
              title: 'Nossa Missão',
              text: 'Democratizar o acesso ao ensino superior internacional, preparando estudantes brasileiros com tecnologia de ponta e suporte personalizado.',
              color: '#0057B8',
            },
            {
              icon: Heart,
              title: 'Nossos Valores',
              text: 'Acreditamos que todo estudante merece a chance de chegar longe. Trabalhamos com dedicação, empatia e excelência.',
              color: '#EF467C',
            },
            {
              icon: Users,
              title: 'Nossa Equipe',
              text: 'Formada por educadores, engenheiros e estudantes que já passaram pelo processo de admissão internacional.',
              color: '#37B0DD',
            },
            {
              icon: Award,
              title: 'Nossos Resultados',
              text: 'Mais de 2.400 alunos preparados, 89% de taxa de aprovação e parcerias com as melhores universidades do mundo.',
              color: '#FFCB22',
            },
          ].map(({ icon: Icon, title, text, color }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-[#1B2232] mb-2">{title}</h3>
                <p className="text-sm text-[#657585] leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '2.400+', label: 'Alunos ativos' },
                { value: '89%', label: 'Taxa de aprovação' },
                { value: '150+', label: 'Universidades parceiras' },
                { value: '4.9★', label: 'Avaliação média' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-[#0057B8]">{value}</p>
                  <p className="text-sm text-[#657585] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
