'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

const INITIAL_MSG = '👋 Olá! Eu sou seu tutor de preparação para o SAT. Vou te apresentar questões no estilo do exame e explicar cada resposta em detalhe.\n\nDigite **"começar"** para receber sua primeira questão, ou me pergunte qualquer dúvida sobre o SAT!'

interface Message { role: 'assistant' | 'user'; content: string }

export default function PracticingPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: INITIAL_MSG }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const history = [...messages, { role: 'user', content: userMsg }]
      const geminiMessages = history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assistantId: 'sat', messages: geminiMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Erro ao obter resposta.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar com a IA. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 65px - 200px)' }}>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#0057b8]/10 flex items-center justify-center">
          <span className="text-xl">⭐</span>
        </div>
        <div>
          <p className="font-bold text-[#1b2232]">Praticando SAT</p>
          <p className="text-xs text-[#65758b]">Simulado interativo com questões reais</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden border border-[#e1e7ef]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-[#0057b8]/10 flex items-center justify-center text-xl shrink-0">⭐</div>
              )}
              <div className={`max-w-[600px] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-[#f3f5f7] text-[#1b2232]' : 'bg-[#0057b8] text-white'}`}>
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f3f5f7] flex items-center justify-center shrink-0">⭐</div>
              <div className="bg-[#f3f5f7] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0,150,300].map(d => <div key={d} className="w-2 h-2 bg-[#65758b] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-[#e1e7ef] p-4 flex gap-3">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Digite sua resposta ou mensagem..." className="flex-1 bg-[#f3f5f7] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] placeholder:text-[#65758b] outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || loading} className="w-10 h-10 bg-[#1f2c47] hover:bg-[#0057b8] disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
