import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const mathModules = [
  { id: '1', title: 'Álgebra Linear', topics: 12, completed: 8, difficulty: 'Médio', time: '4h 30min' },
  { id: '2', title: 'Geometria Plana', topics: 10, completed: 3, difficulty: 'Difícil', time: '5h 00min' },
  { id: '3', title: 'Funções', topics: 8, completed: 0, difficulty: 'Médio', time: '3h 00min' },
  { id: '4', title: 'Estatística e Probabilidade', topics: 7, completed: 0, difficulty: 'Fácil', time: '2h 30min' },
  { id: '5', title: 'Números e Operações', topics: 6, completed: 6, difficulty: 'Fácil', time: '2h 00min' },
  { id: '6', title: 'Trigonometria', topics: 9, completed: 0, difficulty: 'Difícil', time: '4h 00min' },
]

const difficultyColors: Record<string, string> = {
  Fácil: 'success',
  Médio: 'warning',
  Difícil: 'error',
}

export default function MathClassesPage() {
  return (
    <div>
      <Header title="Math Classes" subtitle="Domine a matemática do SAT" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Módulos completados', value: '2/6', icon: TrendingUp },
            { label: 'Tópicos estudados', value: '17/52', icon: Calculator },
            { label: 'Tempo total', value: '7h 30min', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFCB22]/15 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-[#FFCB22]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1B2232]">{value}</p>
                  <p className="text-xs text-[#657585]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mathModules.map((module) => {
            const progress = Math.round((module.completed / module.topics) * 100)
            return (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-[#1B2232]">{module.title}</h3>
                    <Badge variant={difficultyColors[module.difficulty] as 'success' | 'warning' | 'error'}>
                      {module.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#657585] mb-4">
                    <span className="flex items-center gap-1">
                      <Calculator size={12} /> {module.topics} tópicos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {module.time}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#657585] mb-1">
                      <span>{module.completed}/{module.topics} concluídos</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#EDEFF3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFCB22] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/math-classes/${module.id}`}>
                    <Button
                      variant={progress === 100 ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full"
                    >
                      {progress === 100 ? 'Revisar' : progress > 0 ? 'Continuar' : 'Começar'}
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
