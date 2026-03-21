'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { use } from 'react'

const assistantData: Record<string, { name: string; subtitle: string; emoji: string; greeting: string }> = {
  brighta: {
    name: 'Brighta',
    subtitle: 'The Storyteller',
    emoji: '👩‍💼',
    greeting: '👋 Olá! Eu sou Brighta, sua especialista em narrativas para admissões. Posso te ajudar com **essays**, **personal statements** e **cartas de motivação**.\n\nDigite **"começar"** para receber sua primeira orientação, ou me pergunte qualquer dúvida sobre como escrever histórias impactantes!',
  },
  gritty: {
    name: 'Gritty',
    subtitle: 'The High-Performance Coach',
    emoji: '💪',
    greeting: '👋 Olá! Eu sou Gritty, seu coach de alta performance! Estou aqui para te ajudar a **manter foco**, criar **planos de estudo** e te manter motivado.\n\nDigite **"começar"** para receber seu plano de estudos, ou me pergunte qualquer dúvida sobre organização e produtividade!',
  },
  smartle: {
    name: 'Smartle',
    subtitle: 'The Admission Officer',
    emoji: '🎓',
    greeting: '👋 Olá! Eu sou Smartle, sua estrategista de admissões! Posso te ajudar a entender os processos das melhores universidades e criar uma **estratégia personalizada**.\n\nDigite **"começar"** para iniciar, ou me pergunte sobre qualquer universidade ou processo de admissão!',
  },
  wan: {
    name: 'Professor Wan',
    subtitle: 'The Operation Master',
    emoji: '🧑‍💻',
    greeting: '👋 Olá! Eu sou o Professor Wan, seu especialista em **vistos**, **documentação** e **prazos** internacionais. Garantirei que nenhum detalhe seja esquecido na sua jornada.\n\nDigite **"começar"** para iniciar, ou me pergunte sobre qualquer processo operacional da sua candidatura!',
  },
}

interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default function AssistantChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const assistant = assistantData[id] || assistantData.brighta
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: assistant.greeting }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Entendi sua mensagem! Como ${assistant.name}, estou aqui para te ajudar. Para uma resposta personalizada, conecte a IA via Supabase Edge Functions. Por enquanto, continue me fazendo perguntas!`
      }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 65px - 200px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/assistentes-ia" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
          {assistant.emoji}
        </div>
        <div>
          <p className="font-bold text-[#1b2232]">{assistant.name}</p>
          <p className="text-xs text-[#65758b]">{assistant.subtitle}</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden border border-[#e1e7ef]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-[#f3f5f7] flex items-center justify-center text-xl shrink-0">
                  {assistant.emoji}
                </div>
              )}
              <div className={`max-w-[600px] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[#f3f5f7] text-[#1b2232]'
                  : 'bg-[#0057b8] text-white'
              }`}>
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? 'mt-2' : ''}
                    dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#f3f5f7] flex items-center justify-center text-xl shrink-0">
                {assistant.emoji}
              </div>
              <div className="bg-[#f3f5f7] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#65758b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#65758b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#65758b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#e1e7ef] p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua resposta ou mensagem..."
            className="flex-1 bg-[#f3f5f7] rounded-xl px-4 py-2.5 text-sm text-[#1b2232] placeholder:text-[#65758b] outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-[#1f2c47] hover:bg-[#0057b8] disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
