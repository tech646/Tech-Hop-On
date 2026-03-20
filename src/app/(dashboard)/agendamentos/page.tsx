'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AI_ASSISTANTS, formatDateTime } from '@/lib/utils'
import { Calendar, Clock, Plus, X } from 'lucide-react'

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  pending: { label: 'Pendente', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'error' },
  completed: { label: 'Concluído', variant: 'default' },
}

export default function AgendamentosPage() {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ assistant_id: '', scheduled_at: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAppointments() }, [])

  async function loadAppointments() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true })
    setAppointments(data ?? [])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('appointments').insert({ ...form, user_id: user.id })
    setShowModal(false)
    setForm({ assistant_id: '', scheduled_at: '', notes: '' })
    loadAppointments()
    setLoading(false)
  }

  async function handleCancel(id: string) {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    loadAppointments()
  }

  return (
    <div>
      <Header title="Agendamentos" subtitle="Sessões com assistentes IA" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Novo agendamento
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar size={40} className="text-[#EDEFF3] mx-auto mb-4" />
              <h3 className="font-bold text-[#1B2232] mb-2">Nenhum agendamento</h3>
              <p className="text-sm text-[#657585] mb-4">Agende uma sessão com um de nossos assistentes IA</p>
              <Button onClick={() => setShowModal(true)}>Agendar agora</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const assistant = AI_ASSISTANTS.find(a => a.id === String(apt.assistant_id))
              const status = statusConfig[String(apt.status)] ?? statusConfig.pending
              return (
                <Card key={String(apt.id)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: assistant?.color ?? '#0057B8' }}
                    >
                      {assistant?.emoji ?? '🤖'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1B2232]">{assistant?.name ?? 'Assistente'}</p>
                      <div className="flex items-center gap-1 text-xs text-[#657585] mt-0.5">
                        <Clock size={12} />
                        {formatDateTime(String(apt.scheduled_at))}
                      </div>
                      {apt.notes ? <p className="text-xs text-[#99A1AE] mt-1">{String(apt.notes)}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {apt.status === 'pending' && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(String(apt.id))}>
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Novo Agendamento</CardTitle>
                  <button onClick={() => setShowModal(false)} className="text-[#657585] hover:text-[#1B2232]">
                    <X size={20} />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#657585]">Assistente</label>
                    <select
                      value={form.assistant_id}
                      onChange={e => setForm(f => ({ ...f, assistant_id: e.target.value }))}
                      required
                      className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {AI_ASSISTANTS.map(a => (
                        <option key={a.id} value={a.id}>{a.name} — {a.specialty}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#657585]">Data e hora</label>
                    <input
                      type="datetime-local"
                      value={form.scheduled_at}
                      onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                      required
                      className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#657585]">Observações (opcional)</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      rows={2}
                      placeholder="Ex: Preciso de ajuda com funções..."
                      className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" loading={loading} className="flex-1">Agendar</Button>
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
