'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    step: 1,
    title: 'Objetivo',
    question: 'Qual é o seu objetivo principal?',
    options: [
      'Entrar em uma universidade americana',
      'Melhorar meu inglês acadêmico',
      'Conseguir uma bolsa de estudos',
      'Transferência de universidade',
    ],
  },
  {
    step: 2,
    title: 'Nível de Inglês',
    question: 'Como você avalia seu nível de inglês atual?',
    options: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'],
  },
  {
    step: 3,
    title: 'Matemática',
    question: 'Como você se sente em relação à matemática?',
    options: ['Preciso de muita ajuda', 'Tenho dificuldades em alguns tópicos', 'Me saio bem', 'Sou muito bom'],
  },
  {
    step: 4,
    title: 'Tempo de Estudo',
    question: 'Quantas horas por semana você pode dedicar aos estudos?',
    options: ['Menos de 5 horas', '5 a 10 horas', '10 a 20 horas', 'Mais de 20 horas'],
  },
  {
    step: 5,
    title: 'Prazo',
    question: 'Quando você pretende fazer o SAT?',
    options: ['Em menos de 3 meses', 'Em 3 a 6 meses', 'Em 6 a 12 meses', 'Ainda não sei'],
  },
  {
    step: 6,
    title: 'Experiência',
    question: 'Você já fez algum teste SAT antes?',
    options: ['Nunca fiz', 'Já fiz uma vez', 'Já fiz duas ou mais vezes', 'Estou retestando para melhorar'],
  },
  {
    step: 7,
    title: 'Pontuação Alvo',
    question: 'Qual pontuação você deseja atingir no SAT?',
    options: ['1000 - 1100', '1100 - 1200', '1200 - 1350', '1350 - 1600'],
  },
  {
    step: 8,
    title: 'Maior Desafio',
    question: 'Qual é o seu maior desafio nos estudos?',
    options: ['Falta de foco/concentração', 'Dificuldade com o conteúdo', 'Falta de tempo', 'Ansiedade em provas'],
  },
  {
    step: 9,
    title: 'Estilo de Aprendizado',
    question: 'Qual estilo de aprendizado funciona melhor para você?',
    options: ['Vídeos e aulas visuais', 'Exercícios práticos', 'Leitura de materiais', 'Tutoriais interativos'],
  },
]

export default function DiagnosticoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const step = steps[currentStep]
  const progress = ((currentStep) / steps.length) * 100

  function handleAnswer(answer: string) {
    setAnswers(prev => ({ ...prev, [step.step]: answer }))
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  async function handleComplete() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('diagnostic_results').upsert({
        user_id: user.id,
        step: 9,
        answers,
        completed_at: new Date().toISOString(),
      })
    }
    setCompleted(true)
    setLoading(false)
  }

  if (completed) {
    return (
      <div>
        <Header title="Diagnóstico" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B2232] mb-3">Diagnóstico concluído!</h2>
            <p className="text-[#657585] mb-8">
              Com base nas suas respostas, criamos um plano de estudos personalizado para você atingir sua meta no SAT.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/home')}>Ver meu plano</Button>
              <Button variant="outline" onClick={() => router.push('/planos')}>Ver planos</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Diagnóstico SAT" subtitle={`Etapa ${currentStep + 1} de ${steps.length}`} />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[#657585] mb-2">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-[#EDEFF3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0057B8] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < currentStep
                      ? 'bg-[#0057B8] text-white'
                      : i === currentStep
                      ? 'bg-[#0057B8] text-white ring-4 ring-[#0057B8]/20'
                      : 'bg-[#EDEFF3] text-[#99A1AE]'
                  }`}
                >
                  {i < currentStep ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Question */}
          <Card>
            <CardContent className="p-8">
              <div className="mb-2">
                <span className="text-xs font-bold text-[#0057B8] uppercase tracking-wider">
                  {step.title}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#1B2232] mb-6">{step.question}</h2>

              <div className="space-y-3">
                {step.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      answers[step.step] === option
                        ? 'border-[#0057B8] bg-[#0057B8]/5 text-[#0057B8]'
                        : 'border-[#EDEFF3] text-[#1B2232] hover:border-[#0057B8]/30'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft size={16} /> Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!answers[step.step]}
                  loading={loading}
                >
                  {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                  {currentStep < steps.length - 1 && <ArrowRight size={16} />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
