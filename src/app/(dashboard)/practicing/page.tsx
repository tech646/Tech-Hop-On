'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const questions = [
  {
    id: 1,
    type: 'math',
    text: 'If 3x + 7 = 22, what is the value of x?',
    options: ['3', '5', '7', '9'],
    correct: 1,
    explanation: '3x + 7 = 22 → 3x = 15 → x = 5',
  },
  {
    id: 2,
    type: 'verbal',
    text: 'Choose the word that best completes the sentence: The scientist\'s _______ approach to the experiment ensured accurate results.',
    options: ['haphazard', 'meticulous', 'impulsive', 'careless'],
    correct: 1,
    explanation: '"Meticulous" means showing great attention to detail, which fits the context of ensuring accurate results.',
  },
  {
    id: 3,
    type: 'math',
    text: 'What is 15% of 240?',
    options: ['32', '36', '40', '42'],
    correct: 1,
    explanation: '240 × 0.15 = 36',
  },
]

export default function PracticingPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[currentQ]

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === question.correct) setScore(s => s + 1)
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div>
        <Header title="Practicing" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">
                {score === questions.length ? '🏆' : score >= questions.length / 2 ? '😊' : '💪'}
              </div>
              <h2 className="text-2xl font-bold text-[#1B2232] mb-2">Resultado</h2>
              <p className="text-5xl font-bold text-[#0057B8] mb-2">{score}/{questions.length}</p>
              <p className="text-[#657585] mb-8">
                {score === questions.length ? 'Perfeito! Continue assim!' : 'Continue praticando para melhorar!'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleRestart}>
                  <RotateCcw size={16} /> Tentar novamente
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/diagnostico'}>
                  Fazer diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Practicing" subtitle={`Questão ${currentQ + 1} de ${questions.length}`} />
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Score */}
          <div className="flex justify-between items-center">
            <Badge variant="info">
              {question.type === 'math' ? '📐 Matemática' : '📖 Verbal'}
            </Badge>
            <span className="text-sm text-[#657585]">
              ✅ {score} corretas
            </span>
          </div>

          {/* Question */}
          <Card>
            <CardContent className="p-6">
              <p className="text-base font-medium text-[#1B2232] mb-6 leading-relaxed">
                {question.text}
              </p>

              <div className="space-y-3">
                {question.options.map((option, i) => {
                  let variant = 'default'
                  if (answered) {
                    if (i === question.correct) variant = 'correct'
                    else if (i === selected) variant = 'wrong'
                  } else if (i === selected) {
                    variant = 'selected'
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-between ${
                        variant === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                        variant === 'wrong' ? 'border-red-400 bg-red-50 text-red-600' :
                        variant === 'selected' ? 'border-[#0057B8] bg-[#0057B8]/5 text-[#0057B8]' :
                        'border-[#EDEFF3] text-[#1B2232] hover:border-[#0057B8]/30'
                      }`}
                    >
                      <span>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </span>
                      {answered && i === question.correct && <CheckCircle size={18} className="text-green-500" />}
                      {answered && i === selected && i !== question.correct && <XCircle size={18} className="text-red-500" />}
                    </button>
                  )
                })}
              </div>

              {answered && (
                <div className="mt-4 p-4 bg-[#F3F5F7] rounded-xl">
                  <p className="text-sm font-semibold text-[#1B2232] mb-1">Explicação:</p>
                  <p className="text-sm text-[#657585]">{question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {answered && (
            <div className="flex justify-end">
              <Button onClick={handleNext}>
                {currentQ < questions.length - 1 ? 'Próxima questão' : 'Ver resultado'}
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
