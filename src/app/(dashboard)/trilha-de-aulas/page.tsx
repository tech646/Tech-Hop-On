import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Lock, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const mockCourses = [
  { id: '1', title: 'Introdução ao SAT', description: 'Entenda a estrutura e estratégias do teste', duration_minutes: 45, type: 'aula', completed: true, order: 1 },
  { id: '2', title: 'Reading & Writing — Fundamentos', description: 'Estratégias para a seção verbal', duration_minutes: 60, type: 'aula', completed: true, order: 2 },
  { id: '3', title: 'Math — Álgebra Básica', description: 'Equações, inequações e funções', duration_minutes: 90, type: 'aula', completed: false, order: 3 },
  { id: '4', title: 'Math — Geometria', description: 'Formas, ângulos e medidas', duration_minutes: 75, type: 'aula', completed: false, order: 4 },
  { id: '5', title: 'Reading Avançado', description: 'Inferências e análise de texto', duration_minutes: 80, type: 'aula', completed: false, order: 5 },
  { id: '6', title: 'Simulado Completo 1', description: 'Pratique com questões reais do SAT', duration_minutes: 180, type: 'aula', completed: false, order: 6 },
]

export default async function TrilhaDeAulasPage() {
  const completedCount = mockCourses.filter(c => c.completed).length
  const progress = Math.round((completedCount / mockCourses.length) * 100)

  return (
    <div>
      <Header title="Trilha de Aulas" subtitle={`${completedCount}/${mockCourses.length} aulas concluídas`} />
      <div className="p-6">
        <div className="max-w-3xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[#657585] mb-2">
              <span>Seu progresso</span>
              <span className="font-semibold text-[#0057B8]">{progress}%</span>
            </div>
            <div className="h-3 bg-[#EDEFF3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0057B8] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Course list */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#EDEFF3]" />

            <div className="space-y-4">
              {mockCourses.map((course, index) => {
                const isLocked = index > completedCount + 0
                return (
                  <div key={course.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 z-10 ${
                      course.completed
                        ? 'bg-[#0057B8] border-[#0057B8]'
                        : isLocked
                        ? 'bg-white border-[#EDEFF3]'
                        : 'bg-white border-[#0057B8]'
                    }`} />

                    <Card className={isLocked ? 'opacity-60' : ''}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          course.completed ? 'bg-[#0057B8]' : isLocked ? 'bg-[#EDEFF3]' : 'bg-[#0057B8]/10'
                        }`}>
                          {course.completed ? (
                            <CheckCircle size={22} className="text-white" />
                          ) : isLocked ? (
                            <Lock size={18} className="text-[#99A1AE]" />
                          ) : (
                            <Play size={18} className="text-[#0057B8]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-[#1B2232] text-sm">{course.title}</h4>
                            {course.completed && <Badge variant="success">Concluída</Badge>}
                          </div>
                          <p className="text-xs text-[#657585] truncate">{course.description}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-[#99A1AE]">
                            <Clock size={11} />
                            {course.duration_minutes} min
                          </div>
                        </div>
                        {!isLocked && (
                          <Link href={`/video-aula/${course.id}`}>
                            <Button size="sm" variant={course.completed ? 'outline' : 'primary'}>
                              {course.completed ? 'Rever' : 'Assistir'}
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
