'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CancelamentoPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState('')

  const reasons = [
    "I'm not using the platform",
    'The price is too high',
    'I found another platform',
    "I've already reached my goal",
    'Other reason',
  ]

  if (step === 3) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-[#1b2232] mb-2">Subscription cancelled</h1>
        <p className="text-[#65758b] mb-8">You will have access until the end of the paid period. Hope to see you back soon!</p>
        <Link href="/home" className="bg-[#0057b8] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0046a0] transition-colors inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <Link href="/profile" className="flex items-center gap-1 text-sm text-[#65758b] hover:text-[#1b2232] mb-8 w-fit">
        <ArrowLeft size={14} /> Back
      </Link>

      {step === 1 && (
        <div>
          <div className="text-4xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-[#1b2232] mb-2">Cancel subscription?</h1>
          <p className="text-[#65758b] mb-6">Before you go, here&apos;s what you&apos;ll lose by cancelling:</p>

          <div className="bg-white rounded-2xl border border-[#e1e7ef] p-5 mb-6 space-y-3">
            {['Access to all video lessons', 'Math Class sessions with specialists', 'Chat with AI Assistants (Mrs Brighta, Gritty, Smartle, Wan)', 'Personalized admissions support'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-[#1b2232]">
                <span className="text-red-400">✕</span> {item}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href="/profile" className="flex-1 bg-[#1f2c47] text-white font-bold py-3 rounded-xl text-center hover:bg-[#0057b8] transition-colors text-sm">
              Keep subscription
            </Link>
            <button onClick={() => setStep(2)} className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-3 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors text-sm">
              Continue cancellation
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold text-[#1b2232] mb-2">Why are you cancelling?</h1>
          <p className="text-[#65758b] mb-6">Your feedback helps us improve.</p>

          <div className="space-y-3 mb-6">
            {reasons.map(r => (
              <button key={r} onClick={() => setReason(r)}
                className={`w-full text-left p-4 rounded-xl border-2 text-sm transition-all ${reason === r ? 'border-[#0057b8] bg-[#0057b8]/5 text-[#1b2232]' : 'border-[#e1e7ef] text-[#1b2232] hover:border-[#0057b8]/50'}`}>
                {r}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-[#e1e7ef] text-[#65758b] font-medium py-3 rounded-xl hover:border-[#1b2232] hover:text-[#1b2232] transition-colors text-sm">
              Back
            </button>
            <button
              disabled={!reason}
              onClick={() => setStep(3)}
              className="flex-1 bg-[#ff4444] disabled:opacity-50 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors text-sm"
            >
              Confirm cancellation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
