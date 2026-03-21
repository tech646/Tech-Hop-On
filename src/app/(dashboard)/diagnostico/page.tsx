'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const questions = [
  {
    id: 1,
    question: 'How would you define your knowledge regarding the application process for universities abroad?',
    options: [
      "I don't know anything about it, help me!",
      "I kind of know some things, but I have many doubts!",
      "I'm a pro! I just need someone to tutor me along the way.",
    ]
  },
  {
    id: 2,
    question: 'What is your current English proficiency level?',
    options: ['Beginner (A1-A2)', 'Intermediate (B1-B2)', 'Advanced (C1-C2)']
  },
  {
    id: 3,
    question: 'When do you plan to start your studies abroad?',
    options: ['In less than 1 year', 'In 1-2 years', 'In more than 2 years']
  },
  {
    id: 4,
    question: 'What type of university are you interested in?',
    options: ['Research universities (MIT, Stanford, Harvard)', 'Liberal arts colleges', 'I\'m not sure yet']
  },
  {
    id: 5,
    question: 'What is your main goal for studying abroad?',
    options: ['Academic excellence and research', 'Career opportunities', 'Cultural experience and personal growth']
  },
  {
    id: 6,
    question: 'Have you taken the SAT or ACT before?',
    options: ['Yes, I have a good score', 'Yes, but I want to improve', 'No, I haven\'t taken it yet']
  },
  {
    id: 7,
    question: 'How would you rate your writing skills in English?',
    options: ['I struggle with writing in English', 'I can write but need improvement', 'I write well in English']
  },
  {
    id: 8,
    question: 'What is your biggest challenge in the application process?',
    options: ['Understanding requirements', 'Writing essays and personal statements', 'Financial planning and scholarships']
  },
  {
    id: 9,
    question: 'How much time per week can you dedicate to studying?',
    options: ['Less than 5 hours', '5-10 hours', 'More than 10 hours']
  },
]

export default function DiagnosticoPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])

  const q = questions[current]
  const total = questions.length
  const progress = ((current) / total) * 100

  function handleNext() {
    if (!selected) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)

    if (current < total - 1) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      router.push('/home')
    }
  }

  function handleBack() {
    if (current > 0) {
      setCurrent(current - 1)
      setSelected(answers[current - 1] || null)
      setAnswers(answers.slice(0, -1))
    } else {
      router.back()
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <button onClick={handleBack} className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-8">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="max-w-[680px] mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#e1e7ef]">
          {/* Progress */}
          <p className="text-sm font-bold text-[#65758b] mb-2">Pergunta {current + 1}/{total}</p>
          <div className="w-full h-1.5 bg-[#f3f5f7] rounded-full mb-6">
            <div className="h-full bg-[#0057b8] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="text-lg font-semibold text-[#1b2232] mb-6">{q.question}</h2>

          <div className="space-y-3 mb-8">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm transition-all ${
                  selected === opt
                    ? 'border-[#0057b8] bg-[#0057b8]/5 text-[#1b2232]'
                    : 'border-[#e1e7ef] text-[#1b2232] hover:border-[#0057b8]/50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === opt ? 'border-[#0057b8]' : 'border-[#e1e7ef]'}`}>
                  {selected === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#0057b8]" />}
                </div>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232]">
              <ArrowLeft size={14} /> Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              {current === total - 1 ? 'Finalizar' : 'Próximo'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
