'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, LayoutGrid, Tv, MessageSquare, Calculator, Star, LogOut, User, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/home', label: 'Menu', icon: LayoutGrid, exact: true },
  { href: '/trilha-de-aulas', label: 'Aulas', icon: Tv },
  { href: '/assistentes-ia', label: 'Assistente', icon: MessageSquare },
  { href: '/math-classes', label: 'Math Classes', icon: Calculator },
  { href: '/practicing', label: 'Practicing', icon: Star },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('Usuário')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
        setUserName(name.split(' ')[0])
      }
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e1e7ef]">
      <div className="flex items-center h-[65px] px-6 gap-2">
        {/* Logo */}
        <Link href="/home" className="flex items-center mr-4 shrink-0">
          <Image src="/images/logo.svg" alt="Hop On" width={80} height={44} priority />
        </Link>

        {/* Nav items — desktop only */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive({ href, exact })
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#0057b8] text-white'
                    : 'text-[#1b2232] hover:bg-[#f3f5f7]'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search — desktop only */}
          <div className="hidden md:flex items-center bg-[#edf0f3] rounded-full px-3 h-8 gap-2 w-44">
            <Search size={14} className="text-[#65758b]" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent text-sm text-[#65758b] outline-none w-full placeholder:text-[#65758b]"
            />
          </div>

          {/* Bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f5f7] transition-colors">
            <Bell size={16} className="text-[#1b2232]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0057b8] rounded-full" />
          </button>

          {/* User menu — desktop only */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-[#edf0f3] rounded-full pl-1 pr-3 h-10"
            >
              <div className="w-7 h-7 rounded-full bg-[#1f3d7a] flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-[#1b2232]">{userName}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#e1e7ef] rounded-xl shadow-lg py-2 w-44 z-50">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#1b2232] hover:bg-[#f3f5f7]"
                >
                  <User size={15} />
                  Meu Perfil
                </Link>
                <hr className="my-1 border-[#e1e7ef]" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#f3f5f7] w-full text-left"
                >
                  <LogOut size={15} />
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f5f7] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} className="text-[#1b2232]" /> : <Menu size={20} className="text-[#1b2232]" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e1e7ef] px-4 pb-4">
          {/* Nav items stacked */}
          <div className="flex flex-col gap-1 pt-3">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive({ href, exact })
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#0057b8] text-white'
                      : 'text-[#1b2232] hover:bg-[#f3f5f7]'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Search input */}
          <div className="flex items-center bg-[#edf0f3] rounded-full px-3 h-10 gap-2 mt-3">
            <Search size={14} className="text-[#65758b]" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent text-sm text-[#65758b] outline-none w-full placeholder:text-[#65758b]"
            />
          </div>

          {/* User actions */}
          <div className="mt-3 border-t border-[#e1e7ef] pt-3 flex flex-col gap-1">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#1b2232] hover:bg-[#f3f5f7] font-medium"
            >
              <User size={16} />
              Meu Perfil
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-[#f3f5f7] w-full text-left font-medium"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
