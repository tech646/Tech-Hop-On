import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured')
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const title: string = typeof body.title === 'string' ? body.title.slice(0, 200) : ''
    const description: string = typeof body.description === 'string' ? body.description.slice(0, 2000) : ''
    const page: string = typeof body.page === 'string' ? body.page.slice(0, 100) : 'Not specified'

    if (!title.trim() || !description.trim()) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const resend = getResend()
    await resend.emails.send({
      from: 'Hop On Platform <noreply@hopon.academy>',
      to: 'tech@hopon.academy',
      subject: `🐛 Bug Report: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2c47; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🐛 New Bug Report</h1>
          </div>
          <div style="background: #f8f9fb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e1e7ef; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #65758b; font-size: 13px; width: 130px;">Reported by</td>
                <td style="padding: 8px 0; color: #1b2232; font-size: 13px; font-weight: bold;">${user.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #65758b; font-size: 13px;">Page / Section</td>
                <td style="padding: 8px 0; color: #1b2232; font-size: 13px;">${page}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #65758b; font-size: 13px;">Date</td>
                <td style="padding: 8px 0; color: #1b2232; font-size: 13px;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <p style="color: #65758b; font-size: 13px; margin: 0 0 6px 0;">Title</p>
              <div style="background: white; border: 1px solid #e1e7ef; border-radius: 8px; padding: 12px; color: #1b2232; font-size: 14px; font-weight: bold;">
                ${title}
              </div>
            </div>

            <div style="margin-top: 16px;">
              <p style="color: #65758b; font-size: 13px; margin: 0 0 6px 0;">Description</p>
              <div style="background: white; border: 1px solid #e1e7ef; border-radius: 8px; padding: 12px; color: #1b2232; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">
                ${description}
              </div>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 })
  }
}
