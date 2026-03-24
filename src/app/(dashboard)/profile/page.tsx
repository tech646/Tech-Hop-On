'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Edit2, Plus, Trash2, RefreshCw, X, Loader2, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { UserCollege, SATResult } from '@/types'

type Tab = 'perfil' | 'plano'

const categoryMap: Record<UserCollege['category'], string> = {
  dream: 'Dream',
  target: 'Target',
  safety: 'Safety',
}

type ProfileData = {
  email: string
  name: string
  created: string
  phone: string
  city: string
  country: string
  school: string
  avatarUrl: string | null
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('perfil')
  const supabase = createClient()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<ProfileData | null>(null)
  const [colleges, setColleges] = useState<UserCollege[]>([])
  const [satHistory, setSatHistory] = useState<Pick<SATResult, 'score' | 'created_at'>[]>([])
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit profile modal
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', country: '', school: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Change password modal
  const [pwOpen, setPwOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwResetSent, setPwResetSent] = useState(false)

  async function handleForgotPassword() {
    if (!user?.email) return
    setPwResetSent(false)
    setPwError('')
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setPwError('Error sending recovery email. Please try again.'); return }
    setPwResetSent(true)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!pwForm.current) { setPwError('Please enter your current password.'); return }
    if (pwForm.newPassword.length < 8) { setPwError('New password must be at least 8 characters.'); return }
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    setPwSaving(true)
    setPwError('')
    // Verify current password by re-authenticating
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: pwForm.current,
    })
    if (authError) { setPwSaving(false); setPwError('Current password is incorrect.'); return }
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPassword })
    setPwSaving(false)
    if (error) { setPwError(error.message || 'Error updating password. Please try again.'); return }
    setPwSuccess(true)
    setTimeout(() => { setPwOpen(false); setPwSuccess(false); setPwForm({ current: '', newPassword: '', confirm: '' }) }, 1500)
  }

  // Add college modal
  const [addCollegeOpen, setAddCollegeOpen] = useState(false)
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    category: 'dream' as UserCollege['category'],
    requiredSat: '',
    mySat: '',
    usePlatformSat: false,
  })
  const [collegeSaving, setCollegeSaving] = useState(false)
  const [collegeError, setCollegeError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return
      setUserId(authUser.id)
      const base: ProfileData = {
        email: authUser.email || '',
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
        created: new Date(authUser.created_at).getFullYear().toString(),
        phone: '',
        city: '',
        country: '',
        school: '',
        avatarUrl: null,
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, city, country, school, avatar_url')
        .eq('id', authUser.id)
        .maybeSingle()
      if (profile) {
        base.name = profile.full_name || base.name
        base.phone = profile.phone || ''
        base.city = profile.city || ''
        base.country = profile.country || ''
        base.school = profile.school || ''
        base.avatarUrl = profile.avatar_url || null
      }
      setUser(base)

      const { data: collegesData } = await supabase
        .from('user_colleges')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at')
      setColleges((collegesData as UserCollege[]) ?? [])

      const { data: satData } = await supabase
        .from('sat_practice_results')
        .select('score, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setSatHistory(satData ?? [])
    })
  }, [])

  // ── Avatar upload ────────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setAvatarUploading(true)
    setAvatarError('')
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setAvatarUploading(false)
      setAvatarError(uploadError.message || 'Upload failed. Check Supabase Storage bucket.')
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const urlWithBust = `${publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').upsert({ id: userId, avatar_url: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    setUser(prev => prev ? { ...prev, avatarUrl: urlWithBust } : prev)
    setAvatarUploading(false)
  }

  // ── Edit profile ────────────────────────────────────────────────────────────
  function openEdit() {
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      country: user?.country || '',
      school: user?.school || '',
    })
    setEditError('')
    setEditOpen(true)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setEditSaving(true)
    setEditError('')
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: editForm.name,
        phone: editForm.phone,
        city: editForm.city,
        country: editForm.country,
        school: editForm.school,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
    setEditSaving(false)
    if (error) { setEditError('Error saving. Please try again.'); return }
    setUser(prev => prev ? { ...prev, name: editForm.name, phone: editForm.phone, city: editForm.city, country: editForm.country, school: editForm.school } : prev)
    setEditOpen(false)
  }

  // ── Add college ─────────────────────────────────────────────────────────────
  function openAddCollege() {
    setCollegeForm({ name: '', category: 'dream', requiredSat: '', mySat: '', usePlatformSat: false })
    setCollegeError('')
    setAddCollegeOpen(true)
  }

  async function handleAddCollege(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !collegeForm.name.trim()) { setCollegeError('Please enter the university name.'); return }
    setCollegeSaving(true)
    setCollegeError('')
    const requiredSat = collegeForm.requiredSat ? parseInt(collegeForm.requiredSat) : null
    const mySat = collegeForm.usePlatformSat
      ? (satHistory[0]?.score ?? null)
      : (collegeForm.mySat ? parseInt(collegeForm.mySat) : null)
    const { data, error } = await supabase
      .from('user_colleges')
      .insert({ user_id: userId, name: collegeForm.name.trim(), category: collegeForm.category, required_sat: requiredSat, my_sat: mySat })
      .select()
      .single()
    setCollegeSaving(false)
    if (error) { setCollegeError(error.message || 'Error adding. Please try again.'); return }
    setColleges(prev => [...prev, data as UserCollege])
    setAddCollegeOpen(false)
  }

  // ── Delete college ──────────────────────────────────────────────────────────
  async function handleDeleteCollege(id: string) {
    if (!confirm('Remove this university from your list?')) return
    await supabase.from('user_colleges').delete().eq('id', id)
    setColleges(prev => prev.filter(c => c.id !== id))
  }

  // ── Delete account ──────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <Link href="/home" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 w-fit">
        <ArrowLeft size={14} /> Back to home
      </Link>

      {/* Header */}
      <div className="bg-[#1f2c47] rounded-2xl p-6 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-white text-xl shrink-0">
          {user?.avatarUrl
            ? <Image src={user.avatarUrl} alt="Avatar" width={48} height={48} className="w-full h-full object-cover" unoptimized />
            : '👤'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/70 text-sm">Manage your information and track your application strategy.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-[#e1e7ef] mb-6 p-1 overflow-x-auto">
        {[{ key: 'perfil', label: 'My Profile' }, { key: 'plano', label: 'My Plan' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${tab === t.key ? 'bg-[#f3f5f7] text-[#1b2232]' : 'text-[#65758b] hover:text-[#1b2232]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'perfil' && (
        <div className="space-y-4">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1b2232] text-lg">Personal Information</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setPwForm({ current: '', newPassword: '', confirm: '' }); setPwError(''); setPwSuccess(false); setPwResetSent(false); setPwOpen(true) }}
                  className="flex items-center gap-1.5 text-[#65758b] text-sm font-medium hover:text-[#1b2232]"
                >
                  🔒 Change password
                </button>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1.5 text-[#0057b8] text-sm font-medium hover:underline"
                >
                  <Edit2 size={14} /> Edit my profile
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-[#f3f5f7] rounded-xl">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl shrink-0 overflow-hidden group"
                title="Change photo"
              >
                {avatarUploading
                  ? <Loader2 size={20} className="animate-spin text-[#65758b]" />
                  : user?.avatarUrl
                    ? <Image src={user.avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                    : <span>👤</span>
                }
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera size={16} className="text-white" />
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div>
                {avatarError && <p className="text-red-500 text-xs mb-1">{avatarError}</p>}
                <p className="font-bold text-[#1b2232]">{user?.name || '—'}</p>
                <p className="text-sm text-[#65758b]">{user?.email || '—'}</p>
                <p className="text-xs text-[#65758b]">Member since {user?.created}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full name', value: user?.name || '—', icon: '👤' },
                { label: 'Email', value: user?.email || '—', icon: '✉️' },
                { label: 'Phone', value: user?.phone || '—', icon: '📞' },
                { label: 'City', value: user?.city || '—', icon: '📍' },
                { label: 'Country', value: user?.country || '—', icon: '🌍' },
                { label: 'Current school', value: user?.school || '—', icon: '🏫' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="border border-[#e1e7ef] rounded-xl p-3">
                  <p className="text-xs text-[#65758b] mb-1 flex items-center gap-1"><span>{icon}</span>{label}</p>
                  <p className="text-sm font-medium text-[#1b2232]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* College list */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[#1b2232] text-lg">My College List</h2>
                <p className="text-xs text-[#65758b]">Organize your universities by application strategy.</p>
              </div>
              <button
                onClick={openAddCollege}
                className="flex items-center gap-1.5 bg-[#0057b8] hover:bg-[#0046a0] text-white text-sm px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                <Plus size={14} /> Add College
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(['dream', 'target', 'safety'] as const).map(cat => {
                const count = colleges.filter(c => c.category === cat).length
                return (
                  <span key={cat} className="text-xs border border-[#e1e7ef] rounded-full px-3 py-1 text-[#65758b] flex items-center gap-1">
                    🎯 {count} {categoryMap[cat]}
                  </span>
                )
              })}
            </div>

            {colleges.length === 0 && (
              <p className="text-sm text-[#65758b] text-center py-6">No universities added yet.</p>
            )}

            {(['dream', 'target', 'safety'] as const).map(cat => {
              const catColleges = colleges.filter(c => c.category === cat)
              if (catColleges.length === 0) return null
              return (
                <div key={cat} className="mb-4">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1b2232] mb-2">
                    🎯 {categoryMap[cat]}
                    <span className="text-xs font-normal text-[#65758b]">
                      {cat === 'dream' ? '— Very competitive, worth trying.' :
                       cat === 'target' ? '— Good fit with your profile.' :
                       '— High chances of admission.'}
                    </span>
                  </div>
                  {catColleges.map(college => (
                    <div key={college.id} className="flex items-start gap-3 py-2.5 border-b border-[#f3f5f7] last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#1b2232]">{college.name}</p>
                        {(college.required_sat || college.my_sat) && (
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {college.required_sat && (
                              <span className="text-xs text-[#65758b]">Required: <span className="font-medium text-[#1b2232]">{college.required_sat}</span></span>
                            )}
                            {college.my_sat && (
                              <span className={`text-xs font-medium ${college.required_sat ? (college.my_sat >= college.required_sat ? 'text-[#22c55e]' : 'text-[#ef4444]') : 'text-[#65758b]'}`}>
                                My score: {college.my_sat}
                                {college.required_sat && (college.my_sat >= college.required_sat ? ' ✓' : ' ✗')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCollege(college.id)}
                        className="text-[#65758b] hover:text-red-500 transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* SAT Score */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-2">Latest SAT Practice Result</h2>
            <p className="text-xs text-[#65758b] mb-4">Assessment for your application.</p>
            {satHistory.length === 0 ? (
              <p className="text-sm text-[#65758b] text-center py-4">No SAT practice completed yet.</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[#1b2232]">Score</p>
                  <p className="text-sm font-bold text-[#1b2232]">{satHistory[0].score}/1600</p>
                </div>
                <div className="w-full h-3 bg-[#f3f5f7] rounded-full mb-4">
                  <div className="h-full bg-[#1b2232] rounded-full" style={{ width: `${(satHistory[0].score / 1600) * 100}%` }} />
                </div>
                <p className="text-xs text-[#65758b] mb-3">
                  Last practice: {new Date(satHistory[0].created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </>
            )}
            <Link href="/practicing" className="w-full bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <RefreshCw size={14} /> Retake SAT Practice
            </Link>
          </div>

          {/* Delete */}
          <button onClick={handleDelete} className="w-full bg-[#ff4444] hover:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
            🗑 Delete account
          </button>
        </div>
      )}

      {tab === 'plano' && (
        <div className="space-y-4">
          <div className="bg-[#1f2c47] rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl mt-0.5">👑</span>
            <div>
              <p className="text-xs font-medium text-white/60 uppercase tracking-wide mb-1">Your current plan</p>
              <p className="text-2xl font-bold text-white">Free Plan</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-1">Choose your plan</h2>
            <p className="text-sm text-[#65758b] mb-5">Preparing to study abroad is a multi-year journey. The longer the commitment, the better the value.</p>
            <div className="space-y-3">
              <div className="border-2 border-[#e1e7ef] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1b2232]">Gratuito</span>
                    <span className="text-xs bg-[#f3f5f7] text-[#65758b] px-2 py-0.5 rounded-full">✓ Active</span>
                  </div>
                  <p className="text-sm text-[#65758b] mt-1">Access to login and diagnostic assessment. No access to lessons or assistants.</p>
                </div>
                <span className="font-bold text-[#1b2232] text-xl ml-4 shrink-0">Grátis</span>
              </div>
              {[
                { name: 'Monthly', price: 'R$ 450', period: '/mo', desc: 'Full flexibility, no commitment. Includes 1 live class with a specialist per month.' },
                { name: '6-Month', price: 'R$ 380', period: '/mo', desc: '6 months at a discount. Includes 2 live classes with specialists per month.', total: 'R$2,280 total', savings: 'Save R$420' },
                { name: 'Annual', price: 'R$ 290', period: '/mo', desc: 'Best value on the platform. Includes 3 live classes with specialists per month.', total: 'R$3,480 total', savings: 'Save R$1,920', recommended: true },
              ].map(p => (
                <div key={p.name} className={`border-2 rounded-2xl p-4 ${p.recommended ? 'border-[#ff9500]' : 'border-[#e1e7ef]'} relative`}>
                  {p.recommended && <div className="absolute -top-3 left-4 bg-[#ff9500] text-white text-xs font-bold px-3 py-1 rounded-full">🏆 Recommended</div>}
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <span className="font-bold text-[#1b2232]">{p.name}</span>
                    <div className="text-right"><span className="text-xl font-bold text-[#1b2232]">{p.price}</span><span className="text-sm text-[#65758b]">{p.period}</span></div>
                  </div>
                  <p className="text-sm text-[#65758b] mb-2">{p.desc}</p>
                  {p.savings && <span className="text-xs bg-[#f0fdf4] text-[#22c55e] px-2 py-0.5 rounded-full font-medium mb-3 inline-block">{p.savings}</span>}
                  <button className="w-full bg-[#ff9500] hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors block mt-2">
                    Choose {p.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-6">
            <h2 className="font-bold text-[#1b2232] text-lg mb-4">Frequently asked questions</h2>
            {[
              { q: 'Can I switch plans at any time?', a: 'Yes! The difference will be calculated proportionally and applied to the next billing.' },
              { q: 'What happens if I cancel?', a: 'You keep access until the end of the paid period. There is no cancellation fee.' },
              { q: 'Is there a discount for upfront payment?', a: 'The 6-month and annual plans already include a progressive discount.' },
            ].map(({ q, a }) => (
              <div key={q} className="py-3 border-b border-[#f3f5f7] last:border-0">
                <p className="font-medium text-[#1b2232] text-sm mb-1">{q}</p>
                <p className="text-sm text-[#65758b]">{a}</p>
              </div>
            ))}
          </div>

          <Link href="/cancelamento" className="block text-center text-sm text-[#65758b] hover:text-red-500 transition-colors">
            Cancel subscription
          </Link>
        </div>
      )}

      {/* ── Modal: Editar Perfil ──────────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef]">
              <h3 className="font-bold text-[#1b2232] text-lg">Edit Profile</h3>
              <button onClick={() => setEditOpen(false)} className="text-[#65758b] hover:text-[#1b2232]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Full name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Phone</label>
                <input
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 555 000-0000"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">City</label>
                <input
                  value={editForm.city}
                  onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="New York"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Country</label>
                <input
                  value={editForm.country}
                  onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))}
                  placeholder="Brazil"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Current school</label>
                <input
                  value={editForm.school}
                  onChange={e => setEditForm(f => ({ ...f, school: e.target.value }))}
                  placeholder="School name"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-2.5 rounded-xl text-sm hover:bg-[#f3f5f7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 bg-[#0057b8] hover:bg-[#0046a0] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {editSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Change Password ───────────────────────────────────────────── */}
      {pwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef]">
              <h3 className="font-bold text-[#1b2232] text-lg">Change Password</h3>
              <button onClick={() => { setPwOpen(false); setPwResetSent(false) }} className="text-[#65758b] hover:text-[#1b2232]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {pwSuccess ? (
                <p className="text-center text-[#22c55e] font-medium py-4">✓ Password updated successfully!</p>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#65758b]">Current password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#0057b8] hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                      placeholder="Enter your current password"
                      className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                      autoFocus
                    />
                    {pwResetSent && (
                      <p className="text-[#22c55e] text-xs mt-1.5">Recovery email sent! Check your inbox.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#65758b] mb-1">New password</label>
                    <input
                      type="password"
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#65758b] mb-1">Confirm new password</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      placeholder="Repeat your new password"
                      className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                    />
                  </div>
                  {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setPwOpen(false); setPwResetSent(false) }}
                      className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-2.5 rounded-xl text-sm hover:bg-[#f3f5f7] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="flex-1 bg-[#0057b8] hover:bg-[#0046a0] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      {pwSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                      Update password
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Adicionar College ──────────────────────────────────────────── */}
      {addCollegeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef]">
              <h3 className="font-bold text-[#1b2232] text-lg">Add College</h3>
              <button onClick={() => setAddCollegeOpen(false)} className="text-[#65758b] hover:text-[#1b2232]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCollege} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">University name</label>
                <input
                  value={collegeForm.name}
                  onChange={e => setCollegeForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: MIT, Harvard, UCLA..."
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Category</label>
                <select
                  value={collegeForm.category}
                  onChange={e => setCollegeForm(f => ({ ...f, category: e.target.value as UserCollege['category'] }))}
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors bg-white"
                >
                  <option value="dream">🎯 Dream — Very competitive</option>
                  <option value="target">🎯 Target — Good fit with my profile</option>
                  <option value="safety">🎯 Safety — High chances of admission</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">Required SAT score <span className="font-normal">(optional)</span></label>
                <input
                  type="number"
                  min={400} max={1600}
                  value={collegeForm.requiredSat}
                  onChange={e => setCollegeForm(f => ({ ...f, requiredSat: e.target.value }))}
                  placeholder="e.g. 1500"
                  className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#65758b] mb-1">My SAT score <span className="font-normal">(optional)</span></label>
                <label className={`flex items-center gap-2 mb-2 ${satHistory.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                  <input
                    type="checkbox"
                    checked={collegeForm.usePlatformSat}
                    disabled={satHistory.length === 0}
                    onChange={e => setCollegeForm(f => ({ ...f, usePlatformSat: e.target.checked, mySat: '' }))}
                    className="accent-[#0057b8]"
                  />
                  <span className="text-xs text-[#65758b]">
                    Use my latest SAT Practicing result
                    {satHistory.length > 0
                      ? <span className="font-semibold text-[#1b2232]"> ({satHistory[0].score}/1600)</span>
                      : <span className="italic"> — no results yet</span>
                    }
                  </span>
                </label>
                {!collegeForm.usePlatformSat && (
                  <input
                    type="number"
                    min={400} max={1600}
                    value={collegeForm.mySat}
                    onChange={e => setCollegeForm(f => ({ ...f, mySat: e.target.value }))}
                    placeholder="e.g. 1450"
                    className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                  />
                )}
              </div>
              {collegeError && <p className="text-red-500 text-sm">{collegeError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddCollegeOpen(false)}
                  className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-2.5 rounded-xl text-sm hover:bg-[#f3f5f7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={collegeSaving}
                  className="flex-1 bg-[#0057b8] hover:bg-[#0046a0] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {collegeSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
