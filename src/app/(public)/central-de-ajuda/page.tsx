'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Search, X, Loader2 } from 'lucide-react'

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
  const [showBugModal, setShowBugModal] = useState(false)
  const [bugTitle, setBugTitle] = useState('')
  const [bugPage, setBugPage] = useState('')
  const [bugDescription, setBugDescription] = useState('')
  const [bugSending, setBugSending] = useState(false)
  const [bugSent, setBugSent] = useState(false)
  const [bugError, setBugError] = useState('')

  async function handleBugSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBugSending(true)
    setBugError('')
    try {
      const res = await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bugTitle, description: bugDescription, page: bugPage }),
      })
      if (!res.ok) throw new Error()
      setBugSent(true)
      setBugTitle('')
      setBugPage('')
      setBugDescription('')
    } catch {
      setBugError('Failed to send. Please try again.')
    } finally {
      setBugSending(false)
    }
  }

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
        <button
          onClick={() => { setShowBugModal(true); setBugSent(false); setBugError('') }}
          className="flex items-center gap-2 bg-[#1f2c47] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl mx-auto text-sm transition-colors"
        >
          🐛 Report Error or Bug
        </button>
      </div>

      <Link href="/home" className="text-sm text-[#65758b] hover:text-[#0057b8] flex items-center justify-center gap-1">
        <ArrowLeft size={14} /> Back to Home
      </Link>

      {/* Bug report modal */}
      {showBugModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#e1e7ef]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐛</span>
                <h3 className="font-bold text-[#1b2232]">Report a Bug</h3>
              </div>
              <button onClick={() => setShowBugModal(false)} className="text-[#65758b] hover:text-[#1b2232]">
                <X size={20} />
              </button>
            </div>

            {bugSent ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-[#1b2232] mb-1">Report sent!</p>
                <p className="text-sm text-[#65758b] mb-5">Our team will look into this as soon as possible.</p>
                <button
                  onClick={() => setShowBugModal(false)}
                  className="bg-[#1f2c47] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#0057b8] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBugSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#65758b] mb-1">What happened? <span className="text-red-400">*</span></label>
                  <input
                    value={bugTitle}
                    onChange={e => setBugTitle(e.target.value)}
                    placeholder="Brief title of the problem"
                    required
                    className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#65758b] mb-1">Where did it happen? <span className="text-[#65758b] font-normal">(optional)</span></label>
                  <input
                    value={bugPage}
                    onChange={e => setBugPage(e.target.value)}
                    placeholder="e.g. Lessons page, AI Assistants, Profile..."
                    className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#65758b] mb-1">Describe in detail <span className="text-red-400">*</span></label>
                  <textarea
                    value={bugDescription}
                    onChange={e => setBugDescription(e.target.value)}
                    placeholder="What were you doing? What did you expect to happen? What actually happened?"
                    required
                    rows={4}
                    className="w-full border border-[#e1e7ef] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] outline-none focus:border-[#0057b8] transition-colors resize-none"
                  />
                </div>
                {bugError && <p className="text-red-500 text-sm">{bugError}</p>}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowBugModal(false)}
                    className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-2.5 rounded-xl text-sm hover:bg-[#f3f5f7] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bugSending}
                    className="flex-1 bg-[#1f2c47] hover:bg-[#0057b8] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {bugSending ? <Loader2 size={14} className="animate-spin" /> : null}
                    Send Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
