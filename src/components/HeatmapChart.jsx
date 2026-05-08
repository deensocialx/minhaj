import React from 'react'
import { format, subDays } from 'date-fns'

export default function HeatmapChart({ log = {}, checkFn, days = 30, label = '' }) {
  const cells = []
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i)
    const key = format(d, 'yyyy-MM-dd')
    const entry = log[key]
    const done = entry ? checkFn(entry) : false
    cells.push({ key, date: d, done })
  }

  return (
    <div>
      {label && <p className="label-sm mb-2">{label}</p>}
      <div className="flex flex-wrap gap-1">
        {cells.map(({ key, date, done }) => (
          <div
            key={key}
            title={`${format(date, 'MMM d')} — ${done ? 'Done' : 'Missed'}`}
            className={`w-5 h-5 rounded-sm transition-colors ${done ? 'bg-[#2ECC71]' : 'bg-[#243044]'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-3 h-3 rounded-sm bg-[#2ECC71]" />
        <span className="text-xs text-[#6B7A8D]">Done</span>
        <div className="w-3 h-3 rounded-sm bg-[#243044] ml-2" />
        <span className="text-xs text-[#6B7A8D]">Missed</span>
      </div>
    </div>
  )
}
