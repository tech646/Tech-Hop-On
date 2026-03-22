'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home, User, BookOpen, Calculator, Brain,
  Calendar, Clock, BarChart2, HelpCircle, Info,
  CreditCard, LogOut, Bot
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/assistentes-ia', label: 'AI Assistants', icon: Bot },
  { href: '/trilha-de-aulas', label: 'Lesson Track', icon: BookOpen },
  { href: '/math-classes', label: 'Math Classes', icon: Calculator },
  { href: '/practicing', label: 'Practicing', icon: Brain },
  { href: '/diagnostico', label: 'Diagnostic', icon: BarChart2 },
  { href: '/calendario', label: 'Calendar', icon: Calendar },
  { href: '/agendamentos', label: 'Appointments', icon: Clock },
  { href: '/planos', label: 'Plans', icon: CreditCard },
]

const bottomItems = [
  { href: '/central-de-ajuda', label: 'Help Center', icon: HelpCircle },
  { href: '/quem-somos', label: 'About Us', icon: Info },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F111A] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0057B8] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-white font-bold text-lg">Hop On</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-[#0057B8] text-white'
                    : 'text-[#99A1AE] hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-white/5">
          <ul className="space-y-1">
            {bottomItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-[#0057B8] text-white'
                      : 'text-[#99A1AE] hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#99A1AE] hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
