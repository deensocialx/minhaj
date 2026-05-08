import React from 'react'
import { usePrayer } from '../context/PrayerContext'
import { parseTimeToDate } from '../utils/prayerCalc'

const PRAYERS = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'sunrise', label: 'Sunrise' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
]

export default function PrayerStrip() {
  const { times, fresh } = usePrayer()
  const now = new Date()

  if (!times) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {PRAYERS.map((p) => (
          <div key={p.key} className="flex-shrink-0 px-3 py-2 rounded-lg bg-[#1E2A3A] border border-[#243044] animate-pulse w-16 h-12" />
        ))}
      </div>
    )
  }

  // find active prayer (most recent passed)
  let activePrayer = 'isha'
  for (let i = 0; i < PRAYERS.length; i++) {
    const t = parseTimeToDate(times[PRAYERS[i].key])
    if (t && t > now) {
      activePrayer = i > 0 ? PRAYERS[i - 1].key : 'isha'
      break
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="label-sm">Prayer Times</span>
        <div className="flex items-center gap-1.5">
          {fresh && <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse-dot" />}
          <span className="text-xs text-[#6B7A8D]">{times.city}</span>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRAYERS.map((p) => {
          const isActive = activePrayer === p.key
          return (
            <div
              key={p.key}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg border transition-all
                ${isActive
                  ? 'bg-[#D4A843] border-[#D4A843] text-[#0F1621]'
                  : 'bg-[#1E2A3A] border-[#243044] text-[#A0AABB]'
                }`}
            >
              <span className={`text-xs font-medium ${isActive ? 'text-[#0F1621]' : ''}`}>{p.label}</span>
              <span className={`text-sm font-semibold mt-0.5 ${isActive ? 'text-[#0F1621]' : 'text-[#E8EDF2]'}`}>
                {times[p.key]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
