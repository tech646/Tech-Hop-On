import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const founders = [
  {
    name: 'Anelisa Macedo',
    role: 'Founder',
    aka: 'Also known as Mrs Brighta',
    image: '/images/brighta.png',
    bio: '+35 anos no mercado de educação. Experiência com processos de admissão ultra-seletivos (nacionais e internacionais, incluindo bolsas de estudo). Atua no desenvolvimento de estratégias personalizadas para potencializar as chances de aprovação de estudantes em universidades de excelência. Mestre em Educação pela Harvard Graduate School of Education.',
  },
  {
    name: 'Ana Paula Camargo',
    role: 'Founder',
    aka: 'Also known as Promptie',
    image: '/images/ana-paula.png',
    bio: 'Gestora de times de engenharia de AI, mestre em educação pela Tampere University (Finlândia), com mais de 20 anos de experiência em trilhas de aprendizagem e soluções em educação em meios digitais e gestão educacional e 3° setor.',
  },
]

const testimonials = [
  { name: 'Lucas F.', quote: '"A metodologia Hop On transformou meu sonho de estudar fora! Hoje estudo na NYU!"' },
  { name: 'Lucas F.', quote: '"A metodologia Hop On transformou meu sonho de estudar fora! Hoje estudo na NYU!"' },
  { name: 'Lucas F.', quote: '"A metodologia Hop On transformou meu sonho de estudar fora! Hoje estudo na NYU!"' },
]

export default function QuemSomosPage() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Voltar
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold text-[#1b2232]">Quem somos</h1>
      </div>
      <p className="text-[#65758b] mb-8">Conheça a história por trás da Hop On.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {founders.map(f => (
          <div key={f.name} className="bg-white rounded-2xl border border-[#e1e7ef] p-6 text-center">
            <div className="flex justify-center mb-3">
            <Image src={f.image} alt={f.name} width={128} height={128} className="object-contain" />
          </div>
            <h3 className="font-bold text-[#1b2232] text-lg">{f.name}</h3>
            <p className="text-sm text-[#65758b]">{f.role}</p>
            <p className="text-xs text-[#65758b] italic mb-4">{f.aka}</p>
            <p className="text-sm text-[#1b2232]/80 leading-relaxed text-left">{f.bio}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1b2232] mb-4">Nossa Missão</h2>
        <p className="text-[#65758b] leading-relaxed max-w-2xl mx-auto">
          Garantir que cada aluno tenha acesso a uma preparação completa, personalizada e acessível, aumentando suas chances de aprovação e sucesso nos processos internacionais de candidatura para graduação e pós-graduação.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center mb-8">
        <Link href="/assistentes-ia" className="inline-flex items-center gap-1.5 text-xs text-[#0057b8] border border-[#0057b8]/20 bg-[#0057b8]/5 rounded-full px-3 py-1 mb-4">
          ✨ Conheça nossos assistentes
        </Link>
        <h2 className="text-2xl font-bold text-[#1b2232] mb-4">Somos IA, mas sabemos muito!</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Image src="/images/ia-gritty.png" alt="Gritty" width={70} height={70} className="object-contain" />
          <Image src="/images/ia-smartle.png" alt="Smartle" width={70} height={70} className="object-contain" />
          <Image src="/images/ia-wan.png" alt="Wan" width={70} height={70} className="object-contain" />
        </div>
        <p className="text-[#65758b] leading-relaxed max-w-xl mx-auto mb-2">
          Nossos personagens são inteligências artificiais treinadas com uma base de conhecimento intensiva e especializada em estudar fora.
        </p>
        <p className="text-[#65758b] leading-relaxed max-w-xl mx-auto">
          Combinamos o conhecimento e histórico das fundadoras, com tecnologia de ponta para oferecer a melhor experiência acadêmica para nossos alunos.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#1b2232] text-center mb-2">Quem já estudou com a Hop On</h2>
        <p className="text-[#65758b] text-center mb-6">Histórias reais de alunos que conquistaram o mundo</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
              <div className="bg-[#f3f5f7] h-40 flex items-center justify-center">
                <button className="w-14 h-14 rounded-full bg-[#1f2c47] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </button>
              </div>
              <div className="p-4">
                <p className="font-bold text-[#1b2232] text-sm mb-1">{t.name}</p>
                <p className="text-xs text-[#65758b]">{t.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
