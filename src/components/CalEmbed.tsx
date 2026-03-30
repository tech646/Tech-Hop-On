'use client'

import Cal from '@calcom/embed-react'

export function CalEmbed({ calLink, onClose }: { calLink: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[720px] shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e1e7ef]">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <div>
              <p className="font-bold text-[#1b2232] text-sm">Schedule your class</p>
              <p className="text-xs text-[#65758b]">Pick a time that works for you</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#65758b] hover:text-[#1b2232] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <Cal
            calLink={calLink}
            style={{ width: '100%', height: '600px', overflow: 'scroll' }}
            config={{ layout: 'month_view' }}
          />
        </div>
      </div>
    </div>
  )
}
