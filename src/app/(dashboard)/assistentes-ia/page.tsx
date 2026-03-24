import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const assistants = [
  {
    id: 'brighta',
    name: 'Mrs Brighta',
    role: 'Essay & Writing Specialist',
    subtitle: 'Your personal narrative coach',
    description: 'Mrs Brighta helps you write college application essays that stand out. Tell her your story and she will guide you to craft a compelling, authentic personal statement — the kind that gets noticed by Ivy League admissions officers.',
    tags: ['Essays', 'Personal Statements', 'Motivation Letters'],
    image: '/images/brighta.png',
    bg: 'bg-[#fff8e7]',
    tagBg: 'bg-[#ffcb22]/15 text-[#a07800]',
  },
  {
    id: 'gritty',
    name: 'Gritty',
    role: 'SAT Coach & Performance Trainer',
    subtitle: 'Your score-boosting strategist',
    description: 'Gritty analyzes your practice results, identifies exactly where you\'re losing points, and gives you a direct action plan to raise your SAT score. No fluff — just focused, effective preparation for the Digital SAT.',
    tags: ['SAT Prep', 'Study Plan', 'Score Strategy'],
    image: '/images/gritty.png',
    bg: 'bg-[#fdf2f8]',
    tagBg: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'smartle',
    name: 'Smartle',
    role: 'Admissions Strategist',
    subtitle: 'Your university selection expert',
    description: 'Smartle thinks like an admissions officer. She evaluates your profile, builds a balanced college list, and tells you honestly where you stand — so you apply to the right schools with the right strategy.',
    tags: ['College List', 'Admissions Strategy', 'Profile Analysis'],
    image: '/images/smartle.png',
    bg: 'bg-[#f0f7ff]',
    tagBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'wan',
    name: 'Professor Wan',
    role: 'Deadlines & Documentation Expert',
    subtitle: 'Your bureaucracy navigator',
    description: 'Professor Wan keeps your application process on track. From visa paperwork and financial aid forms to apostilles and submission deadlines — he makes sure nothing slips through the cracks.',
    tags: ['Visas', 'Deadlines', 'Financial Aid Forms'],
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
      <p className="text-[#65758b] mb-8">Each assistant is a specialist. Pick the one that matches what you need right now — and chat in English to practice while you learn.</p>

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
