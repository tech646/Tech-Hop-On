import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const GEM_RATES: Record<string, number> = {
  diagnostic_complete: 100,
  profile_setup: 50,
  lesson_complete: 20,
  ai_message: 2,
  math_class: 50,
  sat_practicing_session: 150,
  hearts_milestone: 50,
}

const ONE_TIME_TYPES = ['diagnostic_complete', 'profile_setup']

// Max gem awards per minute per user (prevents abuse)
const RATE_LIMIT_PER_MINUTE = 30

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const type: string = typeof body.type === 'string' ? body.type : ''
    // Sanitize referenceId: only allow alphanumeric + dash + underscore
    const referenceId: string = typeof body.referenceId === 'string'
      ? body.referenceId.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 100)
      : ''

    const baseAmount = GEM_RATES[type]
    if (!baseAmount) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    // Rate limiting: max RATE_LIMIT_PER_MINUTE awards per minute
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString()
    const { count } = await supabase
      .from('hop_gem_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneMinuteAgo)

    if ((count ?? 0) >= RATE_LIMIT_PER_MINUTE) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // One-time awards: check if already given
    if (ONE_TIME_TYPES.includes(type)) {
      const { data } = await supabase
        .from('hop_gem_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .limit(1)
      if (data && data.length > 0) return NextResponse.json({ already_awarded: true })
    }

    // Check if in top 5 for multiplier
    let multiplier = 1
    const { data: ranking } = await supabase.rpc('get_ranking', { current_user_id: user.id })
    const userRank = (ranking as Array<{ is_self: boolean; rank_pos: number }> | null)?.find(r => r.is_self)
    if (userRank && userRank.rank_pos <= 5) multiplier = 1.5

    const finalAmount = Math.round(baseAmount * multiplier)
    const description = referenceId ? `${type} — ${referenceId}` : type

    // Insert transaction log
    await supabase.from('hop_gem_transactions').insert({
      user_id: user.id,
      amount: finalAmount,
      type,
      description,
    })

    // Atomic balance update — no race condition
    await supabase.rpc('award_gems_atomic', {
      p_user_id: user.id,
      p_amount: finalAmount,
    })

    // Create notification for notable gem awards (skip ai_message — too frequent)
    if (type !== 'ai_message') {
      const notifTitles: Record<string, string> = {
        diagnostic_complete: '🎯 Diagnostic complete!',
        profile_setup: '👤 Profile set up!',
        lesson_complete: '📚 Lesson complete!',
        math_class: '📐 Math Class booked!',
        sat_practicing_session: '⭐ SAT Practice session done!',
        hearts_milestone: '❤️ Hearts milestone reached!',
      }
      const title = notifTitles[type]
      if (title) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'gems',
          title,
          body: `+${finalAmount} HopGems${multiplier > 1 ? ` (${multiplier}× multiplier!)` : ''}`,
        })
      }
    }

    return NextResponse.json({ awarded: finalAmount, multiplier })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
