import React, { useState } from 'react'

export default function ChecklistItem({ label, checked, onChange, note, children, timeLabel }) {
  const [bouncing, setBouncing] = useState(false)

  function handleToggle() {
    setBouncing(true)
    setTimeout(() => setBouncing(false), 200)
    onChange(!checked)
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-start gap-3 py-2.5 cursor-pointer group"
        onClick={handleToggle}
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all
            ${bouncing ? 'scale-110' : 'scale-100'}
            ${checked ? 'bg-[#2ECC71] border-[#2ECC71]' : 'border-[#2E3D52] group-hover:border-[#D4A843]'}`}
        >
          {checked && (
            <svg className="w-3 h-3 text-[#0F1621]" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm transition-colors ${checked ? 'text-[#6B7A8D] line-through' : 'text-[#E8EDF2]'}`}>
              {label}
            </span>
            {timeLabel && (
              <span className="text-xs text-[#D4A843] font-medium flex-shrink-0">{timeLabel}</span>
            )}
          </div>
          {note && <p className="text-xs text-[#6B7A8D] mt-0.5">{note}</p>}
        </div>
      </div>
      {children && <div className="ml-8">{children}</div>}
    </div>
  )
}
