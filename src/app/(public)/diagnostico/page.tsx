'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const questions = [
  {
    id: 1,
    question: 'How would you define your knowledge regarding the application process for universities abroad?',
    options: [
      "I don't know anything about it, help me!",
      "I kind of know some things, but I have many doubts!",
      "I'm a pro! I just need someone to tutor me along the way.",
    ],
  },
  {
    id: 2,
    question: 'What is your proficiency level?',
    options: [
      'Beginner - A1',
      'Basic - A2',
      'Intermediate - B1',
      'Intermediate-advanced - B2',
      'Advanced - C1',
      'Advanced-proficient - C2',
      "I don't know",
    ],
  },
  {
    id: 3,
    question: 'Do/did you attend a bilingual school in the past 2 years?',
    options: [
      "No, I don't/didn't.",
      'Yes, I do.',
      "Yes, I did, but don't anymore.",
    ],
  },
  {
    id: 4,
    question: 'Did you ever take an English proficiency test?',
    options: ["No, I didn't.", 'Yes, I did.'],
  },
  {
    id: 5,
    question: 'What is your final goal?',
    options: [
      'Improve my English, mostly.',
      'Prepare myself for proficiency tests.',
      'Apply to universities abroad.',
    ],
  },
  {
    id: 6,
    question: 'Have you ever applied to any institution abroad? (High school, summer school, undergraduate, etc.)',
    options: ['No.', 'Yes.'],
  },
]


const resultCards = [
  { src: '/images/brighta.png', alt: 'Mrs Brighta', text: 'Browse the video lessons to learn more about the English language!' },
  { src: '/images/gritty.png', alt: 'Gritty', text: 'Use our AI assistants to get answers anytime!' },
  { src: '/images/smartle.png', alt: 'Smartle', text: 'Practice your SAT!' },
  { src: '/images/wan.png', alt: 'Wan', text: 'Book a math class with our specialists!' },
]

const plans = [
  {
    id: 'gratuito',
    name: 'Free',
    description: 'Access to login and diagnostic assessment. No access to lessons or assistants.',
    price: 'Free',
    badge: 'Active',
    badgeColor: 'bg-green-100 text-green-700',
    active: true,
  },
  {
    id: 'mensal',
    name: 'Monthly',
    description: 'Full flexibility, no commitment. Includes 1 one-on-one Math Class with a specialist per month.',
    price: 'R$ 450/month',
    badge: null,
    active: false,
  },
  {
    id: 'semestral',
    name: '6-Month',
    description: '6 months of access at a discount. Includes 2 one-on-one Math Classes with a specialist per month.',
    price: 'R$ 380/month',
    total: 'R$ 2,280.00 total',
    badge: 'Save R$ 420',
    badgeColor: 'bg-orange-100 text-orange-700',
    active: false,
  },
  {
    id: 'anual',
    name: 'Annual',
    description: 'Best value on the platform. Includes 3 one-on-one Math Classes with a specialist per month.',
    price: 'R$ 290/month',
    total: 'R$ 3,480.00 total',
    badge: 'Recommended',
    badgeColor: 'bg-blue-100 text-blue-700',
    extraBadge: 'Save R$1,920',
    active: false,
  },
]

// step 0 = welcome, steps 1-6 = questions, step 7 = results, step 8 = plan selection
export default function DiagnosticoPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(6).fill(null))
  const [selectedPlan, setSelectedPlan] = useState<string>('gratuito')

  const totalQuestions = questions.length

  function handleNext() {
    if (step === 0) {
      setStep(1)
      return
    }

    if (step >= 1 && step <= totalQuestions) {
      if (!selected) return
      const newAnswers = [...answers]
      newAnswers[step - 1] = selected
      setAnswers(newAnswers)
      setSelected(null)
      setStep(step + 1)
      return
    }

    if (step === totalQuestions + 1) {
      // results -> plan selection
      setStep(totalQuestions + 2)
      return
    }

    if (step === totalQuestions + 2) {
      // plan selection -> save + redirect
      handleFinish()
    }
  }

  function handleBack() {
    if (step === 0) return
    if (step === 1) {
      setStep(0)
      setSelected(null)
      return
    }
    if (step >= 2 && step <= totalQuestions) {
      const prevAnswer = answers[step - 2]
      setSelected(prevAnswer)
      setStep(step - 1)
      return
    }
    if (step === totalQuestions + 1) {
      // results -> last question
      const prevAnswer = answers[totalQuestions - 1]
      setSelected(prevAnswer)
      setStep(totalQuestions)
      return
    }
    if (step === totalQuestions + 2) {
      setStep(totalQuestions + 1)
      return
    }
  }

  async function handleFinish() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const answersMap: Record<string, string> = {}
        questions.forEach((q, i) => {
          answersMap[`q${q.id}`] = answers[i] ?? ''
        })
        await supabase
          .from('diagnostic_results_v2')
          .upsert(
            {
              user_id: user.id,
              answers: answersMap,
              plan: selectedPlan,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
        localStorage.setItem(`diagnostic_done_${user.id}`, 'true')
      }
    } catch {
      // Non-blocking: proceed even if save fails
    }
    router.push('/home')
  }

  // ── Step 0: Welcome ──────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-[#e1e7ef] text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-2xl font-bold text-[#1b2232] mb-4">
              We can&apos;t wait to help you get where you want to be!
            </h2>
            <p className="text-[#65758b] text-sm mb-3">
              And for that, we need to know more about you and your journey.
            </p>
            <p className="text-[#65758b] text-sm mb-8">
              Please fill in the information on the next form honestly and truthfully!
            </p>

            <div className="flex items-center justify-center mb-10">
              <Image
                src="/images/hero-illustration.png"
                alt="Hop On characters"
                width={248}
                height={346}
                className="object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Steps 1-6: Questions ─────────────────────────────────────────────────────
  if (step >= 1 && step <= totalQuestions) {
    const q = questions[step - 1]
    const currentSelected = selected !== null ? selected : answers[step - 1]

    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-[#e1e7ef]">
          <p className="text-lg font-bold text-[#1b2232] mb-2">
            Question {step}/{totalQuestions}
          </p>
          <p className="text-[#65758b] text-sm mb-6">{q.question}</p>

          <div className="space-y-3 mb-8">
            {q.options.map((opt) => {
              const isSelected = currentSelected === opt
              return (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#0057b8] bg-[#eff5ff]'
                      : 'border-[#e1e7ef] bg-white hover:border-[#0057b8]/40'
                  }`}
                >
                  {/* Icon container */}
                  <div className="w-11 h-11 bg-[#edf0f3] rounded-xl flex items-center justify-center shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#0057b8]' : 'bg-[rgba(15,17,26,0.2)]'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[#65758b] text-sm">{opt}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-[#1b2232] text-sm hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!currentSelected}
              className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 7: Results ──────────────────────────────────────────────────────────
  if (step === totalQuestions + 1) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-[#e1e7ef]">
          <h2 className="text-xl font-bold text-[#1b2232] mb-3 max-w-[600px]">
            The path to your dream university has many details, but you don&apos;t have to walk it in the dark.
          </h2>
          <p className="text-[#65758b] text-sm mb-6">
            Based on your profile, you can take advantage of:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {resultCards.map((card) => (
              <div
                key={card.alt}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#e1e7ef] bg-[#f3f5f7]"
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={32}
                  height={32}
                  className="rounded-lg object-cover shrink-0"
                />
                <p className="text-[#1b2232] text-sm">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-[#1b2232] text-sm hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 8: Plan selection ───────────────────────────────────────────────────
  if (step === totalQuestions + 2) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-[#e1e7ef]">
          <h2 className="text-xl font-bold text-[#1b2232] mb-2">Choose your plan</h2>
          <p className="text-[#65758b] text-sm mb-6">
            Preparing to study abroad is a multi-year journey. The longer the commitment, the better the value.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0057b8] bg-[#eff5ff]'
                      : 'border-[#e1e7ef] bg-white hover:border-[#0057b8]/40'
                  }`}
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                    {plan.badge && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    )}
                    {plan.extraBadge && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                        {plan.extraBadge}
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-[#1b2232] text-base mb-1">{plan.name}</p>
                  <p className="text-[#65758b] text-xs mb-4 flex-1">{plan.description}</p>

                  <div className="mt-auto">
                    <p className="font-bold text-[#1b2232] text-base">{plan.price}</p>
                    {plan.total && (
                      <p className="text-[#65758b] text-xs">{plan.total}</p>
                    )}
                    {!plan.active && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.id) }}
                        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                      >
                        Choose {plan.name}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-[#1b2232] text-sm hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
