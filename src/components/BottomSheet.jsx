import React, { useEffect } from 'react'

export default function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#1A2333] rounded-t-2xl border-t border-[#243044] bottom-sheet-enter max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#243044] flex-shrink-0">
          <span className="font-semibold text-[#E8EDF2]">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#243044] flex items-center justify-center text-[#6B7A8D] hover:text-[#E8EDF2] transition-colors"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
      </div>
    </div>
  )
}
