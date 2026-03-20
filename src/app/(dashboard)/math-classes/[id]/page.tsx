import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'

const topics = [
  { id: '1', title: 'Equações de 1° grau', duration: '15 min', completed: true },
  { id: '2', title: 'Equações de 2° grau', duration: '20 min', completed: true },
  { id: '3', title: 'Sistemas de equações', duration: '25 min', completed: false },
  { id: '4', title: 'Inequações', duration: '20 min', completed: false },
  { id: '5', title: 'Valores absolutos', duration: '15 min', completed: false },
]

export default function MathClassDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Header title="Álgebra Linear" subtitle="Math Classes" />
      <div className="p-6 max-w-3xl">
        <Link href="/math-classes" className="inline-flex items-center gap-2 text-sm text-[#657585] hover:text-[#1B2232] mb-6">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="space-y-3">
          {topics.map((topic, index) => {
            const isLocked = !topic.completed && index > 2
            return (
              <Card key={topic.id} className={isLocked ? 'opacity-60' : ''}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    topic.completed ? 'bg-[#FFCB22]' : isLocked ? 'bg-[#EDEFF3]' : 'bg-[#FFCB22]/20'
                  }`}>
                    {topic.completed ? (
                      <CheckCircle size={18} className="text-white" />
                    ) : isLocked ? (
                      <Lock size={16} className="text-[#99A1AE]" />
                    ) : (
                      <Play size={16} className="text-[#FFCB22]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1B2232] text-sm">{topic.title}</p>
                    <p className="text-xs text-[#99A1AE]">{topic.duration}</p>
                  </div>
                  {topic.completed ? (
                    <Badge variant="success">Concluído</Badge>
                  ) : !isLocked ? (
                    <Button size="sm">Assistir</Button>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
