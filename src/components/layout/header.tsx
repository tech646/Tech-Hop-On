'use client'

import { Bell, Search } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#EDEFF3] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-[#1B2232]">{title}</h1>
        {subtitle && <p className="text-xs text-[#657585]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg border border-[#EDEFF3] flex items-center justify-center text-[#657585] hover:bg-[#F3F5F7] transition-colors">
          <Search size={16} />
        </button>
        <button className="w-9 h-9 rounded-lg border border-[#EDEFF3] flex items-center justify-center text-[#657585] hover:bg-[#F3F5F7] transition-colors relative">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0057B8] rounded-full" />
        </button>
        <Link href="/profile">
          <div className="w-9 h-9 rounded-lg bg-[#0057B8] flex items-center justify-center text-white font-bold text-sm hover:bg-[#1F3D7A] transition-colors">
            U
          </div>
        </Link>
      </div>
    </header>
  )
}
