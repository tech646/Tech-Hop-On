import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator, Clock, TrendingUp, TrendingDown } from 'lucide-react'

const mockHistory = [
  { id: '1', date: '2026-03-18', module: 'Álgebra Linear', score: 85, time: '45 min', trend: 'up' },
  { id: '2', date: '2026-03-15', module: 'Equações de 2° grau', score: 72, time: '30 min', trend: 'down' },
  { id: '3', date: '2026-03-12', module: 'Funções', score: 90, time: '55 min', trend: 'up' },
  { id: '4', date: '2026-03-10', module: 'Números e Operações', score: 95, time: '40 min', trend: 'up' },
  { id: '5', date: '2026-03-05', module: 'Geometria Plana', score: 68, time: '60 min', trend: 'down' },
]

export default function HistoricoPage() {
  const avgScore = Math.round(mockHistory.reduce((s, h) => s + h.score, 0) / mockHistory.length)

  return (
    <div>
      <Header title="Histórico de Math Classes" subtitle="Seu desempenho ao longo do tempo" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Sessões realizadas', value: mockHistory.length, icon: Calculator, color: '#FFCB22' },
            { label: 'Média de pontuação', value: `${avgScore}%`, icon: TrendingUp, color: '#0057B8' },
            { label: 'Tempo total', value: '3h 50min', icon: Clock, color: '#37B0DD' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1B2232]">{value}</p>
                  <p className="text-xs text-[#657585]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sessões anteriores</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#EDEFF3]">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 bg-[#FFCB22]/15 rounded-xl flex items-center justify-center shrink-0">
                    <Calculator size={18} className="text-[#FFCB22]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1B2232] text-sm">{item.module}</p>
                    <div className="flex items-center gap-2 text-xs text-[#99A1AE] mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <Clock size={11} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {item.trend === 'up' ? (
                        <TrendingUp size={14} className="text-green-500" />
                      ) : (
                        <TrendingDown size={14} className="text-red-500" />
                      )}
                    </div>
                    <Badge
                      variant={item.score >= 85 ? 'success' : item.score >= 70 ? 'warning' : 'error'}
                    >
                      {item.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
