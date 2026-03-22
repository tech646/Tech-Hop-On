import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams, origin } = requestUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const type = requestUrl.searchParams.get('type')
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
      }
      // Check if user has completed diagnostic
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('diagnostic_results_v2')
          .select('user_id')
          .eq('user_id', user.id)
          .single()
        if (!data) {
          return NextResponse.redirect(`${origin}/diagnostico`)
        }
      }
      return NextResponse.redirect(`${origin}/home`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
