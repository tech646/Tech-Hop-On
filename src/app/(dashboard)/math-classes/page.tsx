'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, ExternalLink, X } from 'lucide-react'

type Tab = 'proximas' | 'calendario' | 'historico'

const upcomingClasses = [
  {
    id: '1',
    day: '05',
    month: 'MAR',
    label: 'Amanhã às 10:00',
    title: 'Álgebra — Equações Quadráticas',
    teacher: 'A. Prof. Carlos Mendes',
    canCancel: false,
  },
  {
    id: '2',
    day: '07',
    month: 'MAR',
    label: '07 de março às 14:00',
    title: 'Geometria — Áreas e Volumes',
    teacher: 'A. Profª. Ana Oliveira',
    canCancel: true,
  },
]

const historyClasses = [
  { title: 'Estatística — Medidas de Tendência Central', teacher: 'Prof. Ricardo Lima', date: '02/03/2026 às 15:00' },
]

const DAYS_IN_MARCH = Array.from({ length: 31 }, (_, i) => i + 1)
const START_DAY = 6 // sunday=0, march 2026 starts on sunday

export default function MathClassesPage() {
  const [tab, setTab] = useState<Tab>('proximas')
  const [showModal, setShowModal] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [cancelTarget, setCancelTarget] = useState<typeof upcomingClasses[0] | null>(null)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#ff9500]/10 flex items-center justify-center text-lg">📐</div>
          <div>
            <h1 className="text-2xl font-bold text-[#1b2232]">Aulas de Matemática</h1>
            <p className="text-sm text-[#65758b]">Agende aulas e acesse suas reuniões</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Agendar Aula
        </button>
      </div>

      {/* Plan info (show in proximas) */}
      {tab === 'proximas' && (
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="text-[#65758b]">Plano <span className="font-bold text-[#1b2232]">Mensal</span></span>
          <span className="text-[#65758b]">Aulas inclusas: <span className="font-bold text-[#1b2232]">3</span></span>
          <span className="text-[#65758b]">Aulas realizadas: <span className="font-bold text-[#1b2232]">2</span></span>
          <span className="text-[#ff4444] font-medium">Próxima aula: extra de R$385,00</span>
          <button className="flex items-center gap-1 bg-[#1f2c47] text-white text-xs px-3 py-1.5 rounded-xl ml-auto">
            <ExternalLink size={12} /> Entrar na Aula
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#e1e7ef]">
        {[
          { key: 'proximas', label: 'Próximas Aulas', icon: '📋' },
          { key: 'calendario', label: 'Calendário', icon: '📅' },
          { key: 'historico', label: 'Histórico', icon: '⏱' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? 'border-[#0057b8] text-[#0057b8]' : 'border-transparent text-[#65758b] hover:text-[#1b2232]'}`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'proximas' && (
        <div className="space-y-3">
          {upcomingClasses.map(cls => (
            <div key={cls.id} className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex items-center gap-5">
              <div className="text-center w-14 shrink-0">
                <p className="text-3xl font-bold text-[#1b2232]">{cls.day}</p>
                <p className="text-xs font-bold text-[#65758b] uppercase">{cls.month}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#65758b] mb-1">{cls.label}</p>
                <p className="font-bold text-[#1b2232]">{cls.title}</p>
                <p className="text-sm text-[#65758b]">{cls.teacher}</p>
              </div>
              <div className="flex items-center gap-2">
                {cls.canCancel && (
                  <button onClick={() => { setCancelTarget(cls); setShowCancel(true) }} className="bg-[#ff4444] text-white text-sm px-3 py-1.5 rounded-xl flex items-center gap-1 font-medium">
                    Cancelar aula <ExternalLink size={12} />
                  </button>
                )}
                <button className="bg-[#1f2c47] text-white text-sm px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <ExternalLink size={12} /> Entrar na Aula
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'calendario' && (
        <div className="flex gap-6">
          {/* Mini calendar */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 w-56 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <button className="text-[#65758b] hover:text-[#1b2232]">‹</button>
              <p className="font-bold text-[#1b2232] text-sm">março 2026</p>
              <button className="text-[#65758b] hover:text-[#1b2232]">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {['dom','seg','ter','qua','qui','sex','sáb'].map(d => (
                <div key={d} className="text-[#65758b] font-medium py-1">{d}</div>
              ))}
              {Array.from({ length: START_DAY }).map((_, i) => <div key={`e${i}`} />)}
              {DAYS_IN_MARCH.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)}
                  className={`py-1 rounded-full transition-colors ${d === 4 ? 'bg-[#0057b8] text-white font-bold' : selectedDay === d ? 'bg-[#f3f5f7] text-[#1b2232] font-bold' : 'text-[#1b2232] hover:bg-[#f3f5f7]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Day content */}
          <div className="flex-1 bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <p className="font-bold text-[#1b2232] mb-4">04 de março, 2026</p>
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p className="text-[#65758b] text-sm">Nenhuma aula neste dia.</p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-[#65758b] text-sm border border-[#e1e7ef] px-4 py-1.5 rounded-xl hover:border-[#0057b8] hover:text-[#0057b8] transition-colors">
                <Plus size={14} /> Agendar neste dia
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'historico' && (
        <div className="space-y-3">
          {historyClasses.map((cls, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#ff9500]/10 flex items-center justify-center">📐</div>
              <div className="flex-1">
                <p className="font-bold text-[#1b2232]">{cls.title}</p>
                <p className="text-sm text-[#65758b]">{cls.teacher} — {cls.date}</p>
              </div>
              <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-full">Concluído</span>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1b2232]">Agendar Nova Aula</h3>
              <button onClick={() => setShowModal(false)} className="text-[#65758b] hover:text-[#1b2232]"><X size={18} /></button>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Professor</label>
              <select className="w-full border border-[#e1e7ef] rounded-xl px-3 py-2.5 text-sm text-[#65758b] outline-none focus:border-[#0057b8]">
                <option value="">Escolha um professor</option>
                <option>Prof. Carlos Mendes</option>
                <option>Profª. Ana Oliveira</option>
                <option>Prof. Ricardo Lima</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Data</label>
              <div className="border border-[#e1e7ef] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <button className="text-[#65758b] hover:text-[#1b2232]">‹</button>
                  <p className="font-bold text-[#1b2232] text-sm">março 2026</p>
                  <button className="text-[#65758b] hover:text-[#1b2232]">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {['dom','seg','ter','qua','qui','sex','sáb'].map(d => <div key={d} className="text-[#65758b] font-medium py-1">{d}</div>)}
                  {Array.from({ length: START_DAY }).map((_, i) => <div key={`e${i}`} />)}
                  {DAYS_IN_MARCH.map(d => (
                    <button key={d} onClick={() => setSelectedDay(d)}
                      className={`py-1.5 rounded-full text-xs transition-colors ${d === 4 ? 'bg-[#0057b8] text-white font-bold' : selectedDay === d ? 'bg-[#1f2c47] text-white font-bold' : 'text-[#1b2232] hover:bg-[#f3f5f7]'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              ✓ Confirmar Agendamento
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && cancelTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1b2232]">Desmarcar aula</h3>
              <button onClick={() => setShowCancel(false)} className="text-[#65758b] hover:text-[#1b2232]"><X size={18} /></button>
            </div>
            <p className="text-sm text-[#1b2232] mb-1">Aula: Math Class 1</p>
            <p className="text-sm text-[#65758b] mb-4">Prof: Lucas</p>
            <div className="bg-[#fff5f5] border border-[#ffcdd2] rounded-xl p-3 mb-6 text-sm text-[#c62828] space-y-1">
              <p>• Você poderá remarcar em até 5 dias.</p>
              <p>• Após 5 dias sem remarcar, a aula será considerada perdida.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 bg-[#1f2c47] text-white font-bold py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors">
                Manter aula
              </button>
              <button onClick={() => setShowCancel(false)} className="flex-1 bg-[#ff4444] text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors">
                Cancelar aula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
