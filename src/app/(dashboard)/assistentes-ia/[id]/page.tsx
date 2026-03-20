'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AI_ASSISTANTS } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AssistentePage() {
  const { id } = useParams<{ id: string }>()
  const assistant = AI_ASSISTANTS.find(a => a.id === id) ?? AI_ASSISTANTS[0]

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou ${assistant.name}, seu assistente especializado em ${assistant.specialty}. Como posso te ajudar hoje?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // TODO: integrate with real AI (Claude API, OpenAI, etc.)
    await new Promise(r => setTimeout(r, 1000))
    const reply: Message = {
      role: 'assistant',
      content: `Ótima pergunta! Como especialista em ${assistant.specialty}, posso te ajudar com isso. [Integre com a API de IA aqui para respostas reais.]`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, reply])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 bg-white border-b border-[#EDEFF3] flex items-center px-6 gap-4 sticky top-0 z-30">
        <Link href="/assistentes-ia" className="text-[#657585] hover:text-[#1B2232]">
          <ArrowLeft size={20} />
        </Link>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: assistant.color }}
        >
          {assistant.name[0]}
        </div>
        <div>
          <p className="font-bold text-[#1B2232] text-sm">{assistant.name}</p>
          <p className="text-xs text-[#657585]">{assistant.specialty} • Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F3F5F7]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1"
                style={{ background: assistant.color }}
              >
                {assistant.name[0]}
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0057B8] text-white rounded-br-sm'
                  : 'bg-white text-[#1B2232] rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
              style={{ background: assistant.color }}
            >
              {assistant.name[0]}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#99A1AE] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#EDEFF3]">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Pergunte algo para ${assistant.name}...`}
            className="flex-1 rounded-xl border border-[#EDEFF3] px-4 py-3 text-sm text-[#1B2232] focus:border-[#0057B8] focus:outline-none"
          />
          <Button type="submit" disabled={!input.trim() || loading} className="rounded-xl px-4">
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  )
}
