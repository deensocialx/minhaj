import React, { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { useApp } from '../context/AppContext'
import ChecklistItem from '../components/ChecklistItem'
import QuranQuote from '../components/QuranQuote'
import { getItem, KEYS } from '../utils/storage'

function MiniCalendar() {
  const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))
  const log = getItem(KEYS.MORNING_LOG, {})

  return (
    <div className="flex gap-2 justify-between">
      {days.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const entry = log[key]
        const done = entry?.fajr_prayed && entry?.dhikr_done
        const partial = entry && !done && Object.values(entry).some(Boolean)
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-[#6B7A8D]">{format(d, 'E')}</span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold
                ${done ? 'bg-[#2ECC71] text-[#0F1621]' : partial ? 'bg-[#D4A843] text-[#0F1621]' : 'bg-[#243044] text-[#6B7A8D]'}`}
            >
              {format(d, 'd')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Morning() {
  const { today, getMorningLog, updateMorningLog } = useApp()
  const [log, setLog] = useState(() => getMorningLog()[today] || {})

  function toggle(field, val) {
    updateMorningLog({ [field]: val })
    setLog((prev) => ({ ...prev, [field]: val }))
  }

  function setNum(field, val) {
    updateMorningLog({ [field]: val })
    setLog((prev) => ({ ...prev, [field]: val }))
  }

  const fields = ['fajr_prayed', 'dhikr_done', 'deensocial_done', 'block3_rest']
  const done = fields.filter((f) => log[f]).length
  const pct = Math.round((done / fields.length) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#E8EDF2]">Morning Routine</h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-[#243044] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4A843] rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm text-[#D4A843] font-medium">{pct}%</span>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="card">
        <p className="label-sm mb-3">Last 7 Days</p>
        <MiniCalendar />
      </div>

      {/* Checklist */}
      <div className="card">
        <p className="label-sm mb-3">Today · {format(new Date(), 'MMMM d')}</p>
        <div className="divide-y divide-[#243044]">
          <ChecklistItem
            label="Fajr prayer"
            checked={!!log.fajr_prayed}
            onChange={(v) => toggle('fajr_prayed', v)}
            timeLabel="Before sunrise"
          />
          <ChecklistItem
            label="Post-Fajr dhikr"
            note="Until sunrise if possible"
            checked={!!log.dhikr_done}
            onChange={(v) => toggle('dhikr_done', v)}
          />
          <ChecklistItem
            label="DeenSocial work session"
            checked={!!log.deensocial_done}
            onChange={(v) => toggle('deensocial_done', v)}
          >
            {log.deensocial_done && (
              <input
                type="number"
                min="0"
                placeholder="Minutes spent"
                className="input-field w-36 mb-2"
                value={log.deensocial_minutes || ''}
                onChange={(e) => setNum('deensocial_minutes', Number(e.target.value))}
              />
            )}
          </ChecklistItem>
          <ChecklistItem
            label="Block 3 rest"
            note="Optional recovery block"
            checked={!!log.block3_rest}
            onChange={(v) => toggle('block3_rest', v)}
          />
          <ChecklistItem
            label="Up by 6:30 AM"
            checked={!!log.up_by_630}
            onChange={(v) => toggle('up_by_630', v)}
            timeLabel="06:30"
          />
        </div>
      </div>

      <QuranQuote section="morning" />
    </div>
  )
}
