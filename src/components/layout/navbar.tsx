'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, LayoutGrid, Tv, MessageSquare, Calculator, Star, LogOut, User, Menu, X, Users, Heart, BookOpen, GraduationCap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState } from 'react'

const navItems = [
  { href: '/home', label: 'Menu', icon: LayoutGrid, exact: true },
  { href: '/trilha-de-aulas', label: 'Lessons', icon: Tv },
  { href: '/assistentes-ia', label: 'Assistants', icon: MessageSquare },
  { href: '/math-classes', label: 'Math Classes', icon: Calculator },
  { href: '/practicing', label: 'Practicing', icon: Star },
]

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'heart') return <Heart size={13} className="text-red-400" />
  if (type === 'gems') return <span className="text-xs leading-none">💎</span>
  if (type === 'new_content') return <BookOpen size={13} className="text-[#0057b8]" />
  if (type === 'math_class') return <Calculator size={13} className="text-[#8b5cf6]" />
  if (type === 'anelisa_class') return <GraduationCap size={13} className="text-[#22c55e]" />
  if (type === 'class_reminder') return <Clock size={13} className="text-[#ff9500]" />
  return <Bell size={13} className="text-[#65758b]" />
}

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [userName, setUserName] = useState('User')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isGestor, setIsGestor] = useState(false)
  const [isSocialEnabled, setIsSocialEnabled] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      setUserName(name.split(' ')[0])
      setIsSocialEnabled(true)
      if (user.email?.endsWith('@hopon.academy')) {
        setIsGestor(true)
      }
    })
  }, [supabase])

  useEffect(() => {
    supabase
      .from('notifications')
      .select('id, type, title, body, read, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setNotifications(data)
          setUnreadCount(data.filter((n: Notification) => !n.read).length)
        }
      })
  }, [supabase])

  function handleBellClick() {
    const opening = !notifOpen
    setNotifOpen(opening)
    if (opening && unreadCount > 0) {
      const ids = notifications.filter(n => !n.read).map(n => n.id)
      if (ids.length > 0) {
        supabase.from('notifications').update({ read: true }).in('id', ids).then(() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })))
          setUnreadCount(0)
        })
      }
    }
  }

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

        {/* Nav items — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                isActive({ href, exact })
                  ? 'bg-[#0057b8] text-white'
                  : 'text-[#1b2232] hover:bg-[#f3f5f7]'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          {isSocialEnabled && (
            <Link
              href="/social"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                pathname === '/social' || pathname.startsWith('/social/')
                  ? 'bg-[#0057b8] text-white'
                  : 'text-[#1b2232] hover:bg-[#f3f5f7]'
              )}
            >
              🌐 Social
            </Link>
          )}
          {isGestor && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                pathname === '/admin' || pathname.startsWith('/admin/')
                  ? 'bg-[#0057b8] text-white'
                  : 'text-[#1b2232] hover:bg-[#f3f5f7]'
              )}
            >
              <Users size={15} />
              Manager
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* Search — desktop */}
          <div className="hidden md:flex items-center bg-[#edf0f3] rounded-full px-3 h-8 gap-2 w-44">
            <Search size={14} className="text-[#65758b]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#65758b] outline-none w-full placeholder:text-[#65758b]"
            />
          </div>

          {/* Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={handleBellClick}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f5f7] transition-colors"
            >
              <Bell size={16} className="text-[#1b2232]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#0057b8] rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-[#e1e7ef] rounded-2xl shadow-xl overflow-hidden z-[100]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e7ef]">
                  <span className="text-sm font-bold text-[#1b2232]">Notifications</span>
                  <button type="button" onClick={() => setNotifOpen(false)} className="text-[#65758b] hover:text-[#1b2232]">
                    <X size={16} />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={24} className="text-[#d1d5db] mx-auto mb-2" />
                    <p className="text-sm text-[#65758b]">No notifications yet</p>
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f3f5f7]">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3',
                          !n.read ? 'bg-[#f0f6ff]' : 'hover:bg-[#fafafa]'
                        )}
                      >
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-[#f3f5f7] flex items-center justify-center shrink-0">
                          <NotifIcon type={n.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1b2232] leading-snug">{n.title}</p>
                          {n.body && <p className="text-xs text-[#65758b] mt-0.5 leading-snug">{n.body}</p>}
                          <p className="text-xs text-[#a0aec0] mt-1">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#0057b8] shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User menu — desktop */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-[#edf0f3] rounded-full pl-1 pr-3 h-10"
            >
              <div className="w-7 h-7 rounded-full bg-[#1f3d7a] flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-[#1b2232]">{userName}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-[#e1e7ef] rounded-xl shadow-lg py-2 w-44 z-[100]">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#1b2232] hover:bg-[#f3f5f7]"
                >
                  <User size={15} />
                  My Profile
                </Link>
                <Link
                  href="/central-de-ajuda"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#1b2232] hover:bg-[#f3f5f7]"
                >
                  🐛 Report a Bug
                </Link>
                <hr className="my-1 border-[#e1e7ef]" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#f3f5f7] w-full text-left"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f5f7] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} className="text-[#1b2232]" /> : <Menu size={20} className="text-[#1b2232]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e1e7ef] px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive({ href, exact })
                    ? 'bg-[#0057b8] text-white'
                    : 'text-[#1b2232] hover:bg-[#f3f5f7]'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {isSocialEnabled && (
              <Link
                href="/social"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === '/social' || pathname.startsWith('/social/')
                    ? 'bg-[#0057b8] text-white'
                    : 'text-[#1b2232] hover:bg-[#f3f5f7]'
                )}
              >
                🌐 Social
              </Link>
            )}
            {isGestor && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === '/admin' || pathname.startsWith('/admin/')
                    ? 'bg-[#0057b8] text-white'
                    : 'text-[#1b2232] hover:bg-[#f3f5f7]'
                )}
              >
                <Users size={16} />
                Manager
              </Link>
            )}
          </div>
          <div className="flex items-center bg-[#edf0f3] rounded-full px-3 h-10 gap-2 mt-3">
            <Search size={14} className="text-[#65758b]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#65758b] outline-none w-full placeholder:text-[#65758b]"
            />
          </div>
          <div className="mt-3 border-t border-[#e1e7ef] pt-3 flex flex-col gap-1">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-[#1b2232] hover:bg-[#f3f5f7] font-medium"
            >
              <User size={16} />
              My Profile
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-[#f3f5f7] w-full text-left font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
