'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, ExternalLink, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MathAppointment } from '@/types'

type Tab = 'proximas' | 'calendario' | 'historico'

const historyClasses = [
  { title: 'Statistics — Measures of Central Tendency', teacher: '🧑‍🏫 Professor Lucas', date: '03/02/2026 at 3:00 PM' },
]

const DAYS_IN_MARCH = Array.from({ length: 31 }, (_, i) => i + 1)
const START_DAY = 6 // sunday=0, march 2026 starts on sunday

const PLAN_CLASSES: Record<string, number> = {
  free: 0,
  monthly: 1,
  semester: 2,
  annual: 3,
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  monthly: 'Monthly',
  semester: '6-Month',
  annual: 'Annual',
}

export default function MathClassesPage() {
  const [tab, setTab] = useState<Tab>('proximas')
  const [showModal, setShowModal] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [cancelTarget, setCancelTarget] = useState<MathAppointment | null>(null)
  const [appointments, setAppointments] = useState<MathAppointment[]>([])
  const [userPlan, setUserPlan] = useState<string>('free')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const [{ data: appts }, { data: profile }] = await Promise.all([
          supabase.from('math_appointments').select('*').eq('user_id', user.id).order('scheduled_at', { ascending: true }),
          supabase.from('profiles').select('plan').eq('id', user.id).single(),
        ])
        setAppointments((appts as MathAppointment[]) ?? [])
        if (profile?.plan) setUserPlan(profile.plan)
      }
    })
  }, [])

  const upcomingClasses = appointments
    .filter(a => a.status !== 'cancelled' && a.status !== 'completed')
    .map(a => {
      const date = new Date(a.scheduled_at)
      return {
        id: a.id,
        day: date.getDate().toString().padStart(2, '0'),
        month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        label: date.toLocaleString('en-US', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
        title: a.notes || 'Math Class',
        teacher: a.teacher_name || '—',
        canCancel: a.status === 'pending',
        raw: a,
      }
    })

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#ff9500]/10 flex items-center justify-center text-lg">📐</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1b2232]">Math Classes</h1>
            <p className="text-sm text-[#65758b]">Book classes and access your sessions</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Book Class
        </button>
      </div>

      {/* Plan info (show in proximas) */}
      {tab === 'proximas' && (() => {
        const now = new Date()
        const includedClasses = PLAN_CLASSES[userPlan] ?? 0
        const usedThisMonth = appointments.filter(a => {
          const d = new Date(a.scheduled_at)
          return a.status !== 'cancelled' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length
        const remaining = Math.max(0, includedClasses - usedThisMonth)
        return (
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="text-[#65758b]">Plan <span className="font-bold text-[#1b2232]">{PLAN_LABELS[userPlan]}</span></span>
            <span className="text-[#65758b]">Included/month: <span className="font-bold text-[#1b2232]">{includedClasses}</span></span>
            <span className="text-[#65758b]">Used this month: <span className="font-bold text-[#1b2232]">{usedThisMonth}</span></span>
            <span className={`font-medium ${remaining > 0 ? 'text-[#22c55e]' : 'text-[#ff4444]'}`}>
              {remaining > 0 ? `${remaining} class${remaining > 1 ? 'es' : ''} remaining` : 'No classes remaining this month'}
            </span>
          </div>
        )
      })()}

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-6 border-b border-[#e1e7ef] overflow-x-auto scrollbar-none">
        {[
          { key: 'proximas', label: 'Upcoming Classes', icon: '📋' },
          { key: 'calendario', label: 'Calendar', icon: '📅' },
          { key: 'historico', label: 'History', icon: '⏱' },
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
            <div key={cls.id} className="bg-white rounded-2xl border border-[#e1e7ef] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="text-center w-14 shrink-0">
                  <p className="text-3xl font-bold text-[#1b2232]">{cls.day}</p>
                  <p className="text-xs font-bold text-[#65758b] uppercase">{cls.month}</p>
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="text-xs text-[#65758b] mb-1">{cls.label}</p>
                  <p className="font-bold text-[#1b2232]">{cls.title}</p>
                  <p className="text-sm text-[#65758b]">{cls.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                {cls.canCancel && (
                  <button onClick={() => { setCancelTarget(cls.raw); setShowCancel(true) }} className="bg-[#ff4444] text-white text-sm px-3 py-1.5 rounded-xl flex items-center gap-1 font-medium">
                    Cancel class <ExternalLink size={12} />
                  </button>
                )}
                <button className="bg-[#1f2c47] text-white text-sm px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <ExternalLink size={12} /> Join Class
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
              <p className="font-bold text-[#1b2232] text-sm">March 2026</p>
              <button className="text-[#65758b] hover:text-[#1b2232]">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
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
            <p className="font-bold text-[#1b2232] mb-4">March 04, 2026</p>
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p className="text-[#65758b] text-sm">No classes on this day.</p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-[#65758b] text-sm border border-[#e1e7ef] px-4 py-1.5 rounded-xl hover:border-[#0057b8] hover:text-[#0057b8] transition-colors">
                <Plus size={14} /> Book on this day
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
              <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-full">Completed</span>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:w-[480px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1b2232]">Book New Class</h3>
              <button onClick={() => setShowModal(false)} className="text-[#65758b] hover:text-[#1b2232]"><X size={18} /></button>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Teacher</label>
              <select className="w-full border border-[#e1e7ef] rounded-xl px-3 py-2.5 text-sm text-[#65758b] outline-none focus:border-[#0057b8]">
                <option value="">Choose a teacher</option>
                <option>🧑‍🏫 Professor Lucas</option>
                <option>👩‍🏫 Professor Leticia</option>
                <option>🧑‍🏫 Professor Jonas</option>
                <option>🧑‍🏫 Professor Arthur</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Date</label>
              <div className="border border-[#e1e7ef] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <button className="text-[#65758b] hover:text-[#1b2232]">‹</button>
                  <p className="font-bold text-[#1b2232] text-sm">March 2026</p>
                  <button className="text-[#65758b] hover:text-[#1b2232]">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-[#65758b] font-medium py-1">{d}</div>)}
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
              ✓ Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && cancelTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:w-[480px] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1b2232]">Cancel class</h3>
              <button onClick={() => setShowCancel(false)} className="text-[#65758b] hover:text-[#1b2232]"><X size={18} /></button>
            </div>
            <p className="text-sm text-[#1b2232] mb-1">Class: Math Class 1</p>
            <p className="text-sm text-[#65758b] mb-4">Teacher: 🧑‍🏫 Professor Lucas</p>
            <div className="bg-[#fff5f5] border border-[#ffcdd2] rounded-xl p-3 mb-6 text-sm text-[#c62828] space-y-1">
              <p>• You can reschedule within 5 days.</p>
              <p>• After 5 days without rescheduling, the class will be considered lost.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 bg-[#1f2c47] text-white font-bold py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors">
                Keep class
              </button>
              <button
                onClick={async () => {
                  if (cancelTarget) {
                    const supabase = createClient()
                    await supabase
                      .from('math_appointments')
                      .update({ status: 'cancelled' })
                      .eq('id', cancelTarget.id)
                    setAppointments(prev => prev.map(a => a.id === cancelTarget.id ? { ...a, status: 'cancelled' } : a))
                  }
                  setShowCancel(false)
                  setCancelTarget(null)
                }}
                className="flex-1 bg-[#ff4444] text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-colors"
              >
                Cancelar aula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
