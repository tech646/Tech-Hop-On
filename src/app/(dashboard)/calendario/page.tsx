'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const mockEvents: Record<string, { label: string; color: string }[]> = {
  '2026-03-05': [{ label: 'Aula: Álgebra', color: '#0057B8' }],
  '2026-03-10': [{ label: 'Math Class', color: '#FFCB22' }],
  '2026-03-15': [{ label: 'Diagnóstico', color: '#37B0DD' }],
  '2026-03-20': [{ label: 'Simulado SAT', color: '#EF467C' }],
  '2026-03-25': [{ label: 'Sessão com Brighta', color: '#0057B8' }],
}

export default function CalendarioPage() {
  const today = new Date()
  const [date, setDate] = useState(today)

  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() { setDate(new Date(year, month - 1, 1)) }
  function nextMonth() { setDate(new Date(year, month + 1, 1)) }

  function getKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div>
      <Header title="Calendário" subtitle="Seus eventos e agendamentos" />
      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{MONTHS[month]} {year}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold text-[#99A1AE] py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* Days */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const key = getKey(day)
                  const events = mockEvents[key] ?? []
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                  return (
                    <div
                      key={day}
                      className={`min-h-[60px] rounded-lg p-1.5 cursor-pointer hover:bg-[#F3F5F7] transition-colors ${
                        isToday ? 'bg-[#0057B8]/5 border border-[#0057B8]' : ''
                      }`}
                    >
                      <p className={`text-sm font-medium mb-1 ${isToday ? 'text-[#0057B8]' : 'text-[#1B2232]'}`}>
                        {day}
                      </p>
                      {events.map((ev, i) => (
                        <div
                          key={i}
                          className="text-white text-xs rounded px-1 py-0.5 truncate mb-0.5"
                          style={{ background: ev.color }}
                        >
                          {ev.label}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximos eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(mockEvents).slice(0, 5).map(([date, events]) => (
                <div key={date} className="flex gap-3 pb-3 border-b border-[#EDEFF3] last:border-0">
                  <div className="w-10 h-10 bg-[#F3F5F7] rounded-xl flex items-center justify-center shrink-0">
                    <p className="text-sm font-bold text-[#0057B8]">{date.split('-')[2]}</p>
                  </div>
                  <div>
                    {events.map((ev, i) => (
                      <p key={i} className="text-sm font-medium text-[#1B2232]">{ev.label}</p>
                    ))}
                    <p className="text-xs text-[#99A1AE]">{date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">Ver todos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
