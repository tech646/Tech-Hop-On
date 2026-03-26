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

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, referenceId } = await req.json()
  const baseAmount = GEM_RATES[type]
  if (!baseAmount) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

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

  // Insert transaction
  await supabase.from('hop_gem_transactions').insert({
    user_id: user.id,
    amount: finalAmount,
    type,
    description: referenceId ? `${type} — ${referenceId}` : type,
  })

  // Upsert balance
  const { data: existing } = await supabase
    .from('hop_gems')
    .select('balance, total_earned')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('hop_gems').update({
      balance: (existing as { balance: number; total_earned: number }).balance + finalAmount,
      total_earned: (existing as { balance: number; total_earned: number }).total_earned + finalAmount,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)
  } else {
    await supabase.from('hop_gems').insert({
      user_id: user.id,
      balance: finalAmount,
      total_earned: finalAmount,
    })
  }

  return NextResponse.json({ awarded: finalAmount, multiplier })
}
