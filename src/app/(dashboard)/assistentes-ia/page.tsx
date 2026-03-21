import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const assistants = [
  {
    id: 'brighta',
    name: 'Brighta',
    role: 'A Arquiteta de Narrativas',
    subtitle: 'The Storyteller',
    description: 'Especialista em criar narrativas poderosas para seus essays, personal statements e cartas de motivação. Ela transforma suas experiências em histórias memoráveis.',
    tags: ['Essays', 'Personal Statements', 'Cartas de Motivação'],
    emoji: '👩‍💼',
    bg: 'bg-[#fff8e7]',
    tagBg: 'bg-[#ffcb22]/15 text-[#a07800]',
    iconColor: 'text-[#ffcb22]',
  },
  {
    id: 'gritty',
    name: 'Gritty',
    role: 'O Treinador de Performance',
    subtitle: 'The High-Performance Coach',
    description: 'Seu coach pessoal para manter foco, disciplina e alta performance nos estudos. Ele cria planos de estudo e te mantém motivado para conquistar seus objetivos.',
    tags: ['Plano de Estudos', 'Motivação', 'Gestão do Tempo'],
    emoji: '💪',
    bg: 'bg-[#fdf2f8]',
    tagBg: 'bg-pink-100 text-pink-700',
    iconColor: 'text-pink-400',
  },
  {
    id: 'smartle',
    name: 'Smartle',
    role: 'A Estrategista de Admissões',
    subtitle: 'The Admission Officer',
    description: 'Sua consultora para entender os processos de admissão das melhores universidades. Ela te guia em cada etapa, desde a escolha da universidade até a submissão.',
    tags: ['Admissões', 'Universidades', 'Estratégia'],
    emoji: '🎓',
    bg: 'bg-[#f0f7ff]',
    tagBg: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-400',
  },
  {
    id: 'wan',
    name: 'Professor Wan',
    role: 'O Arquiteto de Processos',
    subtitle: 'The Operation Master',
    description: 'O mestre dos processos operacionais: vistos, documentação, prazos e logística. Ele garante que nenhum detalhe seja esquecido na sua jornada internacional.',
    tags: ['Vistos', 'Documentação', 'Prazos'],
    emoji: '🧑‍💻',
    bg: 'bg-[#f0fdf4]',
    tagBg: 'bg-green-100 text-green-700',
    iconColor: 'text-green-400',
  },
]

export default function AssistentesIAPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Lar
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">⚡</span>
        <h1 className="text-3xl font-bold text-[#1b2232]">Assistentes IA</h1>
      </div>
      <p className="text-[#65758b] mb-8">Escolha o assistente ideal para te ajudar na sua jornada educacional</p>

      <div className="grid grid-cols-2 gap-5">
        {assistants.map((a) => (
          <div key={a.id} className={`${a.bg} rounded-2xl p-6 flex flex-col`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shrink-0 shadow-sm">
                {a.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1b2232]">{a.name}</h3>
                <p className="text-sm font-medium text-[#1b2232]/70">{a.role}</p>
                <p className="text-xs text-[#65758b]">{a.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-[#1b2232]/80 leading-relaxed mb-4 flex-1">{a.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {a.tags.map(tag => (
                <span key={tag} className={`${a.tagBg} text-xs font-medium px-3 py-1 rounded-full`}>{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center">
                <span className="text-xs">{a.emoji}</span>
              </div>
              <Link href={`/assistentes-ia/${a.id}`} className="text-[#0057b8] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Conversar agora <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
