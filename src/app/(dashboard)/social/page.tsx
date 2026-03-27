'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Tab = 'overview' | 'ranking' | 'gems' | 'anelisa'

type RankEntry = {
  user_id: string
  display_name: string
  avatar_url: string | null
  score: number
  rank_pos: number
  is_self: boolean
}

type GemTransaction = {
  id: string
  amount: number
  type: string
  description: string
  created_at: string
}

type GoldenTicket = {
  id: string
  expires_at: string
  status: string
}

type AnelisaAppointment = {
  id: string
  scheduled_at: string
  status: string
}

const TYPE_LABELS: Record<string, string> = {
  diagnostic_complete: '🎯 Diagnostic Test completed',
  profile_setup: '👤 Profile set up',
  lesson_complete: '📚 Lesson completed',
  ai_message: '🤖 AI Assistant used',
  math_class: '📐 Math Class completed',
  sat_practicing_session: '⭐ SAT Practicing session',
  hearts_milestone: '❤️ 100 hearts milestone',
  spent_anelisa: '🌟 Anelisa class unlocked',
  multiplier: '⚡ Top 5 multiplier bonus',
}

const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1)
const START_DAY = 6 // March 2026 starts on Sunday

export default function SocialPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [userName, setUserName] = useState('Student')
  const [ranking, setRanking] = useState<RankEntry[]>([])
  const [gemBalance, setGemBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [transactions, setTransactions] = useState<GemTransaction[]>([])
  const [heartsReceived, setHeartsReceived] = useState(0)
  const [heartsSentToday, setHeartsSentToday] = useState(0)
  const [goldenTicket, setGoldenTicket] = useState<GoldenTicket | null>(null)
  const [userRankPos, setUserRankPos] = useState<number | null>(null)
  const [anelisaAppointments, setAnelisaAppointments] = useState<AnelisaAppointment[]>([])
  const [showAnelisaModal, setShowAnelisaModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [anelisaTime, setAnelisaTime] = useState('')
  const [anelisaLoading, setAnelisaLoading] = useState(false)
  const [anelisaError, setAnelisaError] = useState('')
  const [heartingUserId, setHeartingUserId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeemConfirm, setRedeemConfirm] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'
      setUserName(name.split(' ')[0])

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [
        { data: rankData },
        { data: gemsData },
        { data: txnsData },
        { data: heartsIn },
        { data: heartsOut },
        { data: ticketData },
        { data: anelisaData },
      ] = await Promise.all([
        supabase.rpc('get_ranking', { current_user_id: user.id }),
        supabase.from('hop_gems').select('balance, total_earned').eq('user_id', user.id).single(),
        supabase.from('hop_gem_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
        supabase.from('hearts').select('id').eq('to_user_id', user.id),
        supabase.from('hearts').select('id, created_at').eq('from_user_id', user.id).gte('created_at', today.toISOString()),
        supabase.from('golden_tickets').select('*').eq('user_id', user.id).eq('status', 'active').gte('expires_at', new Date().toISOString()).limit(1),
        supabase.from('anelisa_appointments').select('*').eq('user_id', user.id).order('scheduled_at', { ascending: true }),
      ])

      setRanking((rankData as RankEntry[]) ?? [])
      if (gemsData) {
        setGemBalance((gemsData as { balance: number; total_earned: number }).balance)
        setTotalEarned((gemsData as { balance: number; total_earned: number }).total_earned)
      }
      setTransactions((txnsData as GemTransaction[]) ?? [])
      setHeartsReceived(heartsIn?.length ?? 0)
      setHeartsSentToday(heartsOut?.length ?? 0)
      setGoldenTicket(ticketData && ticketData.length > 0 ? (ticketData[0] as GoldenTicket) : null)
      setAnelisaAppointments((anelisaData as AnelisaAppointment[]) ?? [])

      const self = (rankData as RankEntry[])?.find(r => r.is_self)
      if (self) setUserRankPos(self.rank_pos)

      setLoading(false)
    })
  }, [])

  const isAnelisaEligible = (userRankPos !== null && userRankPos <= 10) || goldenTicket !== null
  const canSendHeart = heartsSentToday < 2
  const heartsToNextMilestone = 100 - (heartsReceived % 100)
  const nextMilestoneProgress = (heartsReceived % 100)

  async function sendHeart(toUserId: string) {
    if (!canSendHeart || !userId || heartingUserId) return
    setHeartingUserId(toUserId)
    const supabase = createClient()
    await supabase.from('hearts').insert({ from_user_id: userId, to_user_id: toUserId })
    setHeartsSentToday(prev => prev + 1)
    setHeartingUserId(null)
  }

  async function bookAnelisa() {
    if (!selectedDay || !anelisaTime || !userId) return
    if (gemBalance < 1000) { setAnelisaError('You need at least 1,000 HopGems to book.'); return }
    setAnelisaLoading(true)
    setAnelisaError('')
    const supabase = createClient()

    const date = new Date(2026, 2, selectedDay)
    const [h, m] = anelisaTime.split(':').map(Number)
    date.setHours(h, m, 0, 0)

    // Deduct gems
    await supabase.from('hop_gem_transactions').insert({
      user_id: userId, amount: -1000, type: 'spent_anelisa', description: 'Anelisa class booking'
    })
    await supabase.from('hop_gems').update({
      balance: gemBalance - 1000, updated_at: new Date().toISOString()
    }).eq('user_id', userId)

    // Mark golden ticket as used if applicable
    if (goldenTicket) {
      await supabase.from('golden_tickets').update({ status: 'used', used_at: new Date().toISOString() }).eq('id', goldenTicket.id)
    }

    // Create appointment
    const { data: appt } = await supabase.from('anelisa_appointments').insert({
      user_id: userId,
      scheduled_at: date.toISOString(),
      golden_ticket_id: goldenTicket?.id ?? null,
    }).select().single()

    if (appt) {
      setAnelisaAppointments(prev => [...prev, appt as AnelisaAppointment])
      setGemBalance(prev => prev - 1000)
      setGoldenTicket(null)
      setShowAnelisaModal(false)
      setSelectedDay(null)
      setAnelisaTime('')
      // Notify user about the booking
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'anelisa_class',
        title: '🌟 Class with Anelisa scheduled!',
        body: `Your class is confirmed for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${anelisaTime}. Don't forget!`,
      })
    }
    setAnelisaLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#0057b8] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]"><ArrowLeft size={18} /></Link>
          <div className="w-9 h-9 rounded-xl bg-[#0057b8]/10 flex items-center justify-center text-lg">🌐</div>
          <div>
            <h1 className="text-xl font-bold text-[#1b2232]">Social</h1>
            <p className="text-sm text-[#65758b]">Ranking, HopGems & community</p>
          </div>
        </div>

        {/* Gem balance badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#ffd700]/20 to-[#ffb300]/20 border border-[#ffd700]/40 rounded-2xl px-4 py-2">
          <span className="text-xl">💎</span>
          <div>
            <p className="text-xs text-[#a07800] font-medium">HopGems</p>
            <p className="text-lg font-bold text-[#1b2232]">{gemBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Golden ticket banner */}
      {goldenTicket && (
        <div className="bg-gradient-to-r from-[#ffd700] to-[#ffb300] rounded-2xl p-4 mb-5 flex items-center gap-4">
          <span className="text-3xl">🎟️</span>
          <div className="flex-1">
            <p className="font-bold text-[#1b2232]">You have a Golden Ticket!</p>
            <p className="text-sm text-[#1b2232]/70">
              You&apos;re invited to book a class with Anelisa. Valid until {new Date(goldenTicket.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.
            </p>
          </div>
          <button
            onClick={() => setTab('anelisa')}
            className="bg-[#1b2232] text-white text-sm font-bold px-4 py-2 rounded-xl"
          >
            Book now
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-6 border-b border-[#e1e7ef] overflow-x-auto scrollbar-none">
        {[
          { key: 'overview', label: 'Overview', icon: '🏠' },
          { key: 'ranking', label: 'Ranking', icon: '🏆' },
          { key: 'gems', label: 'HopGems', icon: '💎' },
          { key: 'anelisa', label: 'Anelisa Class', icon: '🌟' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === t.key ? 'border-[#0057b8] text-[#0057b8]' : 'border-transparent text-[#65758b] hover:text-[#1b2232]'}`}
          >
            <span>{t.icon}</span> {t.label}
            {t.key === 'anelisa' && isAnelisaEligible && (
              <span className="w-2 h-2 bg-[#22c55e] rounded-full ml-1" />
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div className="space-y-5">

          {/* Greeting + stats */}
          <div className="bg-gradient-to-br from-[#1f2c47] to-[#0057b8] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-4 opacity-20 pointer-events-none select-none">
              <Image src="/images/gritty.png" alt="" width={160} height={160} className="object-contain" />
            </div>
            <p className="text-sm opacity-70 mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold mb-4">{userName}! 👋</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{userRankPos ? `#${userRankPos}` : '—'}</p>
                <p className="text-xs opacity-70 mt-0.5">Ranking</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">💎 {gemBalance.toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-0.5">HopGems</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">❤️ {heartsReceived}</p>
                <p className="text-xs opacity-70 mt-0.5">Hearts</p>
              </div>
            </div>
          </div>

          {/* HopGems explanation — Gritty */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex gap-4 items-start">
            <div className="w-20 h-20 shrink-0 relative">
              <Image src="/images/gritty.png" alt="Gritty" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💎</span>
                <h3 className="font-bold text-[#1b2232]">What are HopGems?</h3>
              </div>
              <p className="text-sm text-[#65758b] leading-relaxed">
                HopGems are Hop On&apos;s currency — earned every time you study, use an AI assistant, attend a math class or practice your SAT. The more active you are, the more gems you collect. Top 5 students get a <strong className="text-[#a07800]">1.5× multiplier</strong> on every gem they earn!
              </p>
              <button onClick={() => setTab('gems')} className="mt-3 text-xs font-bold text-[#0057b8] hover:underline">
                See my HopGems →
              </button>
            </div>
          </div>

          {/* Ranking explanation — Smartle */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex gap-4 items-start">
            <div className="w-20 h-20 shrink-0 relative">
              <Image src="/images/smartle.png" alt="Smartle" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🏆</span>
                <h3 className="font-bold text-[#1b2232]">How does the Ranking work?</h3>
              </div>
              <p className="text-sm text-[#65758b] leading-relaxed">
                Your position in the ranking is based on <strong>everything you do</strong> on the platform: lessons completed, SAT scores, AI usage, math classes and gems earned. Other students&apos; names are kept private to protect everyone&apos;s data.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#ffd700]/20 text-[#a07800] px-2 py-1 rounded-full font-medium">⚡ Top 5 → 1.5× gems</span>
                <span className="text-xs bg-[#22c55e]/10 text-[#15803d] px-2 py-1 rounded-full font-medium">🌟 Top 10 → Anelisa eligible</span>
              </div>
              <button onClick={() => setTab('ranking')} className="mt-3 text-xs font-bold text-[#0057b8] hover:underline">
                See the ranking →
              </button>
            </div>
          </div>

          {/* Hearts explanation — Wan */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex gap-4 items-start">
            <div className="w-20 h-20 shrink-0 relative">
              <Image src="/images/wan.png" alt="Professor Wan" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">❤️</span>
                <h3 className="font-bold text-[#1b2232]">Hearts — community appreciation</h3>
              </div>
              <p className="text-sm text-[#65758b] leading-relaxed">
                You can send up to <strong>2 hearts per day</strong> to other students in the ranking. When you reach <strong>100 hearts received</strong>, you automatically earn <strong className="text-[#22c55e]">+50 HopGems</strong>. Hearts are a way to celebrate your fellow students — even anonymously!
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[#65758b] mb-1">
                  <span>Hearts received: {heartsReceived}</span>
                  <span>{100 - (heartsReceived % 100)} to next +50 💎</span>
                </div>
                <div className="w-full bg-[#f3f5f7] rounded-full h-1.5">
                  <div className="bg-[#ff4444] h-1.5 rounded-full" style={{ width: `${(heartsReceived % 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Anelisa — premium section */}
          <div className="bg-gradient-to-br from-[#ffd700]/10 via-white to-[#ffb300]/10 border border-[#ffd700]/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-2 bottom-0 opacity-90 pointer-events-none select-none">
              <Image src="/images/brighta-face.png" alt="Anelisa" width={130} height={130} className="object-contain rounded-full" />
            </div>
            <div className="max-w-[60%]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌟</span>
                <h3 className="font-bold text-[#1b2232] text-lg">Class with Anelisa</h3>
              </div>
              <p className="text-sm text-[#65758b] leading-relaxed mb-3">
                This is Hop On&apos;s most exclusive experience. A <strong>one-on-one session directly with Anelisa</strong> — co-founder and head strategist — to review your application, your goals, and your path to your dream university.
              </p>
              <div className="space-y-1.5 mb-4">
                {[
                  '🏆 Only for Top 10 students in the ranking',
                  '🎟️ Or by invitation via Golden Ticket',
                  '💎 Costs 1,000 HopGems to unlock',
                  '💵 Class value: R$ 1,500',
                ].map((item, i) => (
                  <p key={i} className="text-xs text-[#1b2232] font-medium">{item}</p>
                ))}
              </div>
              {goldenTicket && (
                <div className="bg-[#ffd700] text-[#1b2232] text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 mb-3">
                  🎟️ You have a Golden Ticket!
                </div>
              )}
              <button
                onClick={() => setTab('anelisa')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${
                  isAnelisaEligible
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#ffb300] text-[#1b2232] hover:opacity-90'
                    : 'bg-[#f3f5f7] text-[#65758b] cursor-default'
                }`}
              >
                {isAnelisaEligible ? 'Book now →' : `Reach Top 10 to unlock${userRankPos ? ` (you are #${userRankPos})` : ''}`}
              </button>
            </div>
          </div>

          {/* Golden Ticket explanation — Mrs Brighta */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 flex gap-4 items-start">
            <div className="w-20 h-20 shrink-0 relative">
              <Image src="/images/ana-paula.png" alt="Mrs Brighta" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎟️</span>
                <h3 className="font-bold text-[#1b2232]">What is a Golden Ticket?</h3>
              </div>
              <p className="text-sm text-[#65758b] leading-relaxed">
                The Golden Ticket is a <strong>rare, personal invitation</strong> from the Hop On team. Only <strong>2 are issued per month</strong>, reserved for students who are showing exceptional dedication — lots of activity, consistent effort — but haven&apos;t yet broken into the Top 10. If you receive one, you have <strong>1 week to use it</strong>. Don&apos;t let it expire!
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ── RANKING TAB ── */}
      {tab === 'ranking' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#65758b]">
              Hearts sent today: <span className="font-bold text-[#1b2232]">{heartsSentToday}/2</span>
            </p>
            <p className="text-xs text-[#65758b] bg-[#f3f5f7] px-3 py-1 rounded-full">
              Other students&apos; names are hidden for privacy
            </p>
          </div>

          {ranking.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center text-[#65758b] text-sm">
              No ranking data yet. Complete activities to appear here!
            </div>
          )}

          {ranking.map((entry) => (
            <div
              key={entry.user_id}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-colors ${entry.is_self ? 'border-[#0057b8] bg-[#f0f7ff]' : 'border-[#e1e7ef]'}`}
            >
              {/* Position */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                entry.rank_pos === 1 ? 'bg-[#ffd700] text-white' :
                entry.rank_pos === 2 ? 'bg-[#c0c0c0] text-white' :
                entry.rank_pos === 3 ? 'bg-[#cd7f32] text-white' :
                'bg-[#f3f5f7] text-[#65758b]'
              }`}>
                {entry.rank_pos <= 3 ? ['🥇','🥈','🥉'][entry.rank_pos - 1] : `#${entry.rank_pos}`}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#e1e7ef] overflow-hidden shrink-0 relative">
                {entry.is_self && entry.avatar_url ? (
                  <Image src={entry.avatar_url} alt="You" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#65758b] text-sm">👤</div>
                )}
              </div>

              {/* Name + score */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${entry.is_self ? 'text-[#0057b8]' : 'text-[#1b2232] blur-[3px] select-none'}`}>
                  {entry.is_self ? `${entry.display_name} (You)` : entry.display_name}
                </p>
                <p className="text-xs text-[#65758b]">{entry.score.toLocaleString()} pts</p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {entry.rank_pos <= 5 && (
                  <span className="text-xs bg-[#ffd700]/20 text-[#a07800] font-medium px-2 py-0.5 rounded-full">⚡ 1.5x</span>
                )}
                {entry.rank_pos <= 10 && (
                  <span className="text-xs bg-[#22c55e]/10 text-[#15803d] font-medium px-2 py-0.5 rounded-full">🌟 Anelisa</span>
                )}
              </div>

              {/* Heart button */}
              {!entry.is_self && (
                <button
                  onClick={() => sendHeart(entry.user_id)}
                  disabled={!canSendHeart || heartingUserId === entry.user_id}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    canSendHeart
                      ? 'bg-[#fff0f0] hover:bg-[#ffe0e0] text-[#ff4444]'
                      : 'bg-[#f3f5f7] text-[#d1d5dc] cursor-not-allowed'
                  }`}
                >
                  <Heart size={15} fill={canSendHeart ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── HOPGEMS TAB ── */}
      {tab === 'gems' && (
        <div className="space-y-5">
          {/* Balance card */}
          <div className="bg-gradient-to-br from-[#1f2c47] to-[#0057b8] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-70 mb-1">Current balance</p>
            <p className="text-4xl font-bold mb-1">💎 {gemBalance.toLocaleString()}</p>
            <p className="text-sm opacity-60">Total earned: {totalEarned.toLocaleString()} gems</p>

            {gemBalance >= 1000 && isAnelisaEligible && (
              <button
                onClick={() => { setRedeemConfirm(true) }}
                className="mt-4 bg-white text-[#0057b8] font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                🌟 Redeem 1,000 gems → Book Anelisa
              </button>
            )}
          </div>

          {/* Hearts progress */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-[#ff4444]" fill="currentColor" />
                <p className="font-bold text-[#1b2232] text-sm">Hearts received</p>
              </div>
              <span className="text-sm font-bold text-[#1b2232]">{heartsReceived}</span>
            </div>
            <div className="w-full bg-[#f3f5f7] rounded-full h-2 mb-2">
              <div
                className="bg-[#ff4444] h-2 rounded-full transition-all"
                style={{ width: `${(nextMilestoneProgress / 100) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#65758b]">
              {heartsToNextMilestone} more hearts = <span className="font-bold text-[#22c55e]">+50 HopGems</span>
            </p>
          </div>

          {/* How to earn */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5">
            <p className="font-bold text-[#1b2232] mb-3">How to earn HopGems</p>
            <div className="space-y-2">
              {[
                { label: 'Complete Diagnostic Test', gems: 100, icon: '🎯', once: true },
                { label: 'Set up your profile', gems: 50, icon: '👤', once: true },
                { label: 'Complete a lesson', gems: 20, icon: '📚' },
                { label: 'Use an AI Assistant', gems: 2, icon: '🤖', per: 'message' },
                { label: 'Complete a Math Class', gems: 50, icon: '📐' },
                { label: 'SAT Practicing session', gems: 150, icon: '⭐' },
                { label: 'Receive 100 hearts', gems: 50, icon: '❤️' },
                { label: 'Top 5 in ranking', gems: null, icon: '⚡', extra: '1.5× multiplier on all gems' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#f3f5f7] last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-[#1b2232]">{item.label}</span>
                    {item.once && <span className="text-xs bg-[#f3f5f7] text-[#65758b] px-2 py-0.5 rounded-full">once</span>}
                    {item.per && <span className="text-xs text-[#65758b]">/ {item.per}</span>}
                  </div>
                  {item.gems ? (
                    <span className="text-sm font-bold text-[#0057b8]">+{item.gems} 💎</span>
                  ) : (
                    <span className="text-xs font-bold text-[#a07800]">{item.extra}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transaction history */}
          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5">
            <p className="font-bold text-[#1b2232] mb-3">Recent transactions</p>
            {transactions.length === 0 && (
              <p className="text-sm text-[#65758b] text-center py-4">No transactions yet. Start completing activities!</p>
            )}
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-[#f3f5f7] last:border-0">
                  <div>
                    <p className="text-sm text-[#1b2232]">{TYPE_LABELS[tx.type] || tx.description || tx.type}</p>
                    <p className="text-xs text-[#65758b]">{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-[#22c55e]' : 'text-[#ff4444]'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} 💎
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ANELISA TAB ── */}
      {tab === 'anelisa' && (
        <div className="space-y-4">
          {!isAnelisaEligible ? (
            <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center">
              <p className="text-4xl mb-3">🔒</p>
              <p className="font-bold text-[#1b2232] mb-2">Not yet available</p>
              <p className="text-sm text-[#65758b] max-w-sm mx-auto">
                This class is exclusive to the <strong>Top 10</strong> students in the ranking, or students who receive a <strong>Golden Ticket</strong>. Keep studying!
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#f3f5f7] rounded-xl px-4 py-2">
                {userRankPos ? (
                  <p className="text-sm text-[#1b2232]">Your current rank: <strong>#{userRankPos}</strong></p>
                ) : (
                  <p className="text-sm text-[#65758b]">Complete activities to appear in the ranking</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Eligibility card */}
              <div className="bg-gradient-to-r from-[#ffd700]/20 to-[#ffb300]/20 border border-[#ffd700]/40 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <p className="font-bold text-[#1b2232]">You are eligible!</p>
                    <p className="text-sm text-[#65758b]">
                      {goldenTicket ? 'You have a Golden Ticket' : `You are #${userRankPos} in the ranking`}
                    </p>
                  </div>
                </div>
                <div className="bg-white/60 rounded-xl p-3 text-sm text-[#1b2232]">
                  <p>💎 Cost: <strong>1,000 HopGems</strong> to unlock booking</p>
                  <p className="mt-1">💵 Class price: <strong>R$ 1,500.00</strong> (paid separately)</p>
                  <p className={`mt-1 text-xs ${gemBalance >= 1000 ? 'text-[#22c55e]' : 'text-[#ff4444]'}`}>
                    Your balance: {gemBalance.toLocaleString()} gems {gemBalance < 1000 ? `(need ${1000 - gemBalance} more)` : '✓'}
                  </p>
                </div>
              </div>

              {/* Upcoming Anelisa appointments */}
              {anelisaAppointments.filter(a => a.status !== 'cancelled').length > 0 && (
                <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5">
                  <p className="font-bold text-[#1b2232] mb-3">Your bookings</p>
                  {anelisaAppointments.filter(a => a.status !== 'cancelled').map(a => (
                    <div key={a.id} className="flex items-center gap-3 py-2 border-b border-[#f3f5f7] last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">🌟</div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1b2232] text-sm">Class with Anelisa</p>
                        <p className="text-xs text-[#65758b]">
                          {new Date(a.scheduled_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        a.status === 'confirmed' ? 'bg-[#22c55e]/10 text-[#15803d]' : 'bg-[#ffd700]/20 text-[#a07800]'
                      }`}>
                        {a.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Book button */}
              <button
                onClick={() => setShowAnelisaModal(true)}
                disabled={gemBalance < 1000}
                className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffb300] hover:from-[#ffb300] hover:to-[#ffd700] disabled:opacity-50 disabled:cursor-not-allowed text-[#1b2232] font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Calendar size={18} /> Book a class with Anelisa
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Redeem confirm modal ── */}
      {redeemConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-xl">
            <h3 className="font-bold text-[#1b2232] text-lg mb-2">Redeem HopGems?</h3>
            <p className="text-sm text-[#65758b] mb-4">
              You will spend <strong>1,000 💎 HopGems</strong> to unlock the Anelisa class booking. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRedeemConfirm(false)} className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-2.5 rounded-xl text-sm">Cancel</button>
              <button
                onClick={() => { setRedeemConfirm(false); setTab('anelisa'); setShowAnelisaModal(true) }}
                className="flex-1 bg-gradient-to-r from-[#ffd700] to-[#ffb300] text-[#1b2232] font-bold py-2.5 rounded-xl text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Anelisa booking modal ── */}
      {showAnelisaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:w-[480px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1b2232]">Book class with Anelisa</h3>
              <button onClick={() => setShowAnelisaModal(false)} className="text-[#65758b] hover:text-[#1b2232]"><X size={18} /></button>
            </div>

            <div className="bg-[#fff8e7] border border-[#ffd700]/40 rounded-xl p-3 mb-5 text-sm">
              <p className="font-medium text-[#a07800]">💎 1,000 HopGems will be deducted from your balance upon confirmation.</p>
            </div>

            {/* Calendar */}
            <div className="mb-4">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Select a date</label>
              <div className="border border-[#e1e7ef] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-[#1b2232] text-sm">March 2026</p>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="text-[#65758b] font-medium py-1">{d}</div>
                  ))}
                  {Array.from({ length: START_DAY }).map((_, i) => <div key={`e${i}`} />)}
                  {DAYS_IN_MONTH.map(d => (
                    <button key={d} onClick={() => setSelectedDay(d)}
                      className={`py-1.5 rounded-full text-xs transition-colors ${selectedDay === d ? 'bg-[#0057b8] text-white font-bold' : 'text-[#1b2232] hover:bg-[#f3f5f7]'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[#1b2232] mb-2 block">Select a time</label>
              <select
                value={anelisaTime}
                onChange={e => setAnelisaTime(e.target.value)}
                className="w-full border border-[#e1e7ef] rounded-xl px-3 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8]"
              >
                <option value="">Choose a time slot</option>
                {['09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {anelisaError && <p className="text-red-500 text-sm mb-3">{anelisaError}</p>}

            <button
              onClick={bookAnelisa}
              disabled={!selectedDay || !anelisaTime || anelisaLoading || gemBalance < 1000}
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffb300] disabled:opacity-50 text-[#1b2232] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {anelisaLoading ? (
                <div className="w-4 h-4 border-2 border-[#1b2232] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>✓ Confirm booking — spend 1,000 💎</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
