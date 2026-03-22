'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react'

const categories = [
  {
    id: 'aulas',
    icon: '📺',
    title: 'Lessons & Content',
    color: 'bg-[#0057b8]/10',
    faqs: [
      { q: 'How do I access my lessons?', a: 'Go to the main menu and click "Lessons". All your lessons will be organized by module and topic.' },
      { q: 'Can I watch lessons offline?', a: 'At the moment, lessons are only available online. We are working on offline mode for future versions.' },
      { q: 'How do I track my progress?', a: 'On the Lessons page, you can see the progress bar and how many lessons have been completed.' },
    ],
  },
  {
    id: 'pagamentos',
    icon: '💳',
    title: 'Payments & Plans',
    color: 'bg-[#ff9500]/10',
    faqs: [
      { q: 'What payment methods are accepted?', a: 'We accept credit card, debit card, and PIX. Installments available for 6-month and annual plans.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Profile > My Plan > Cancel subscription. You keep access until the end of the paid period.' },
      { q: 'Can I switch plans?', a: 'Yes! The difference will be calculated proportionally. Go to Profile > My Plan to switch.' },
    ],
  },
  {
    id: 'conta',
    icon: '🔒',
    title: 'Account & Security',
    color: 'bg-[#22c55e]/10',
    faqs: [
      { q: 'How do I change my password?', a: 'Go to Profile > Personal Information > Edit. You will receive an email to reset your password.' },
      { q: 'I forgot my password, what should I do?', a: 'On the sign in screen, click "Forgot?" and follow the instructions sent to your email.' },
      { q: 'How do I enable two-step verification?', a: 'Go to Profile > Security > Two-step verification and follow the instructions.' },
    ],
  },
  {
    id: 'config',
    icon: '⚙️',
    title: 'Settings',
    color: 'bg-[#8b5cf6]/10',
    faqs: [
      { q: 'How do I change the platform language?', a: 'The platform is now available in English. More language options coming soon.' },
      { q: 'How do I enable dark mode?', a: 'Go to profile settings. Dark mode will be available in upcoming updates.' },
    ],
  },
]

export default function CentralDeAjudaPage() {
  const [search, setSearch] = useState('')
  const [openItem, setOpenItem] = useState<string | null>('Como acesso minhas aulas?')

  const filtered = categories.map(cat => ({
    ...cat,
    faqs: search
      ? cat.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
      : cat.faqs,
  })).filter(cat => cat.faqs.length > 0)

  return (
    <div className="max-w-[760px] mx-auto px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#1f2c47] flex items-center justify-center text-2xl mx-auto mb-4">❓</div>
        <h1 className="text-3xl font-bold text-[#1b2232] mb-2">Help Center</h1>
        <p className="text-[#65758b]">Find answers to the most frequently asked questions or report a problem.</p>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-[#e1e7ef] rounded-xl px-4 py-3 gap-3 mb-8">
        <Search size={16} className="text-[#65758b]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search frequently asked questions..."
          className="flex-1 text-sm text-[#1b2232] placeholder:text-[#65758b] outline-none bg-transparent"
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-4 mb-8">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1e7ef]">
              <div className={`${cat.color} w-9 h-9 rounded-xl flex items-center justify-center text-lg`}>{cat.icon}</div>
              <h2 className="font-bold text-[#1b2232]">{cat.title}</h2>
            </div>
            <div className="divide-y divide-[#f3f5f7]">
              {cat.faqs.map(faq => (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenItem(openItem === faq.q ? null : faq.q)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#fafafa] transition-colors"
                  >
                    <span className="text-sm font-medium text-[#1b2232]">{faq.q}</span>
                    {openItem === faq.q ? <ChevronUp size={16} className="text-[#65758b] shrink-0" /> : <ChevronDown size={16} className="text-[#65758b] shrink-0" />}
                  </button>
                  {openItem === faq.q && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-[#65758b] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Report bug */}
      <div className="bg-white rounded-2xl border border-[#e1e7ef] p-8 text-center mb-6">
        <div className="text-3xl mb-3">🐛</div>
        <h3 className="font-bold text-[#1b2232] text-lg mb-1">Found a problem?</h3>
        <p className="text-[#65758b] text-sm mb-4">Help us improve by reporting errors or bugs.</p>
        <button className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl mx-auto text-sm transition-colors">
          🐛 Report Error or Bug
        </button>
      </div>

      <Link href="/home" className="text-sm text-[#65758b] hover:text-[#0057b8] flex items-center justify-center gap-1">
        <ArrowLeft size={14} /> Back to Home
      </Link>
    </div>
  )
}
