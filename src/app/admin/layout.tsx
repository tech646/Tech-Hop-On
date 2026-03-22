import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const email = user.email || ''
  if (!email.endsWith('@hopon.academy')) redirect('/home')

  return (
    <div className="min-h-screen bg-[#f3f5f7] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
