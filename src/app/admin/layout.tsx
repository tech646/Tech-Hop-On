import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const email = user.email || ''
  if (!email.endsWith('@hopon.academy')) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-[#0f111a]">
      <nav className="bg-[#141631] border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[#FFCB22] font-extrabold text-xl leading-none">HOP</span>
            <span className="text-white font-extrabold text-xl leading-none ml-1">ON</span>
          </div>
          <span className="bg-[#ff9500] text-white text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">{email}</span>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
