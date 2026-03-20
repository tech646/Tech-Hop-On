'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Mail, Phone, User, Edit2, Check, X } from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, string> | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', bio: '' })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({ full_name: data.full_name ?? '', phone: data.phone ?? '', bio: data.bio ?? '' })
      }
    }
    load()
  }, [])

  async function handleSave() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (data) setProfile(data)
    setEditing(false)
    setLoading(false)
  }

  const planLabels: Record<string, string> = {
    free: 'Gratuito',
    monthly: 'Mensal',
    semester: 'Semestral',
    annual: 'Anual',
  }

  return (
    <div>
      <Header title="Meu Perfil" />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Avatar + name */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#0057B8] flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.full_name?.[0] ?? 'U'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0057B8] rounded-lg flex items-center justify-center text-white hover:bg-[#1F3D7A] transition-colors">
                  <Camera size={13} />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1B2232]">{profile?.full_name ?? '—'}</h2>
                    <p className="text-sm text-[#657585]">{profile?.email}</p>
                    <div className="mt-2">
                      <Badge variant="info">{planLabels[profile?.plan ?? 'free']}</Badge>
                    </div>
                  </div>
                  {!editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 size={14} /> Editar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#657585]">Nome completo</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#657585]">Telefone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+55 11 99999-9999"
                    className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#657585]">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    placeholder="Fale um pouco sobre você..."
                    className="w-full rounded-lg border border-[#EDEFF3] px-3 py-2.5 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSave} loading={loading}>
                    <Check size={14} /> Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    <X size={14} /> Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: User, label: 'Nome', value: profile?.full_name ?? '—' },
                  { icon: Mail, label: 'Email', value: profile?.email ?? '—' },
                  { icon: Phone, label: 'Telefone', value: profile?.phone ?? '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-[#EDEFF3] last:border-0">
                    <Icon size={16} className="text-[#657585]" />
                    <div>
                      <p className="text-xs text-[#657585]">{label}</p>
                      <p className="text-sm font-medium text-[#1B2232]">{value}</p>
                    </div>
                  </div>
                ))}
                {profile?.bio && (
                  <div className="pt-2">
                    <p className="text-xs text-[#657585] mb-1">Bio</p>
                    <p className="text-sm text-[#1B2232]">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan info */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1B2232]">{planLabels[profile?.plan ?? 'free']}</p>
                <p className="text-sm text-[#657585] mt-0.5">
                  {profile?.plan === 'free' ? 'Acesso limitado' : 'Acesso completo à plataforma'}
                </p>
              </div>
              <a href="/planos">
                <Button size="sm">Mudar plano</Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Zona de perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#657585] mb-4">
              Cancelar sua assinatura irá desativar o acesso premium ao fim do período.
            </p>
            <a href="/cancelamento">
              <Button variant="danger" size="sm">Cancelar assinatura</Button>
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
