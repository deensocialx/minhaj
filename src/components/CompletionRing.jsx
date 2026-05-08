import React from 'react'

export default function CompletionRing({ percent = 0, size = 64, label, sublabel, color = '#D4A843' }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#243044" strokeWidth="6" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#E8EDF2]">{Math.round(percent)}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-[#A0AABB] text-center leading-tight">{label}</span>}
      {sublabel && <span className="text-xs text-[#6B7A8D] text-center">{sublabel}</span>}
    </div>
  )
}
