import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const assistants = [
  {
    id: 'brighta',
    name: 'Brighta',
    role: 'The Narrative Architect',
    subtitle: 'The Storyteller',
    description: 'Expert at crafting powerful narratives for your essays, personal statements, and motivation letters. She transforms your experiences into memorable stories.',
    tags: ['Essays', 'Personal Statements', 'Motivation Letters'],
    image: '/images/brighta.png',
    bg: 'bg-[#fff8e7]',
    tagBg: 'bg-[#ffcb22]/15 text-[#a07800]',
  },
  {
    id: 'gritty',
    name: 'Gritty',
    role: 'The High-Performance Coach',
    subtitle: 'The High-Performance Coach',
    description: 'Your personal coach for focus, discipline, and high performance in your studies. He creates study plans and keeps you motivated to achieve your goals.',
    tags: ['Study Plan', 'Motivation', 'Time Management'],
    image: '/images/gritty.png',
    bg: 'bg-[#fdf2f8]',
    tagBg: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'smartle',
    name: 'Smartle',
    role: 'The Admissions Strategist',
    subtitle: 'The Admission Officer',
    description: 'Your consultant for understanding admissions processes at top universities. She guides you through every step, from choosing a school to submitting your application.',
    tags: ['Admissions', 'Universities', 'Strategy'],
    image: '/images/smartle.png',
    bg: 'bg-[#f0f7ff]',
    tagBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'wan',
    name: 'Professor Wan',
    role: 'The Process Architect',
    subtitle: 'The Operation Master',
    description: 'The master of operational processes: visas, documentation, deadlines, and logistics. He ensures no detail is missed on your international journey.',
    tags: ['Visas', 'Documentation', 'Deadlines'],
    image: '/images/wan.png',
    bg: 'bg-[#f0fdf4]',
    tagBg: 'bg-green-100 text-green-700',
  },
]

export default function AssistentesIAPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Home
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">⚡</span>
        <h1 className="text-3xl font-bold text-[#1b2232]">AI Assistants</h1>
      </div>
      <p className="text-[#65758b] mb-8">Choose the ideal assistant to help you on your educational journey</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {assistants.map((a) => (
          <div key={a.id} className={`${a.bg} rounded-2xl p-6 flex flex-col`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0 relative">
                <Image src={a.image} alt={a.name} fill className="object-contain p-1" />
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
              <div className="w-6 h-6 rounded-full bg-white/50 overflow-hidden relative">
                <Image src={a.image} alt={a.name} fill className="object-contain" />
              </div>
              <Link href={`/assistentes-ia/${a.id}`} className="text-[#0057b8] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Chat now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
