import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Service role client — bypasses RLS, safe for server-only webhook
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    // Optional: verify Cal.com webhook secret
    const secret = process.env.CAL_WEBHOOK_SECRET
    if (secret) {
      const signature = req.headers.get('x-cal-signature-256')
      if (signature !== secret) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const body = await req.json()
    const { triggerEvent, payload } = body

    // Only handle new bookings
    if (triggerEvent !== 'BOOKING_CREATED') {
      return NextResponse.json({ ok: true })
    }

    const supabase = createAdminClient()

    // Extract booking details from Cal.com payload
    const startTime: string = payload.startTime
    const organizerEmail: string = payload.organizer?.email ?? ''
    const organizerName: string = payload.organizer?.name ?? ''
    const attendeeEmail: string = payload.attendees?.[0]?.email ?? ''

    // Meeting link — Cal.com puts it in different places depending on conferencing setup
    const meetingUrl: string =
      payload.metadata?.videoCallUrl ??
      payload.conferenceData?.entryPoints?.find(
        (e: { entryPointType: string; uri: string }) => e.entryPointType === 'video'
      )?.uri ??
      ''

    // Find the student by email
    const { data: studentProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', attendeeEmail)
      .maybeSingle()

    if (!studentProfile) {
      // Attendee not a platform user — ignore silently
      return NextResponse.json({ ok: true })
    }

    // Find teacher name from organizer email (best effort)
    const { data: teacherProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', organizerEmail)
      .maybeSingle()

    const teacherName = teacherProfile?.full_name ?? organizerName

    // Save appointment to Supabase
    await supabase.from('math_appointments').insert({
      user_id: studentProfile.id,
      scheduled_at: startTime,
      status: 'confirmed',
      teacher_name: teacherName,
      notes: payload.title ?? 'Math Class',
      meeting_url: meetingUrl || null,
    })

    // Award gems for booking
    await supabase.from('gems_log').insert({
      user_id: studentProfile.id,
      amount: 50,
      type: 'math_class',
    }).then(() => {})  // fire-and-forget, don't fail if gems_log doesn't exist

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('cal-webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
