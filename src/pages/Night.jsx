import React, { useState } from 'react'
import { format } from 'date-fns'
import { useApp } from '../context/AppContext'
import { usePrayer } from '../context/PrayerContext'
import { useStreaks } from '../hooks/useStreaks'
import ChecklistItem from '../components/ChecklistItem'
import QuranQuote from '../components/QuranQuote'
import HeatmapChart from '../components/HeatmapChart'
import { getItem, KEYS } from '../utils/storage'

const isWeekend = [0, 6].includes(new Date().getDay())

export default function Night() {
  const { today, getNightLog, updateNightLog } = useApp()
  const { times } = usePrayer()
  const { tahajjudStreak } = useStreaks()
  const [log, setLog] = useState(() => getNightLog()[today] || {})

  function toggle(field, val) {
    updateNightLog({ [field]: val })
    setLog((prev) => ({ ...prev, [field]: val }))
  }

  function setNum(field, val) {
    updateNightLog({ [field]: val })
    setLog((prev) => ({ ...prev, [field]: val }))
  }

  function setStr(field, val) {
    updateNightLog({ [field]: val })
    setLog((prev) => ({ ...prev, [field]: val }))
  }

  const nightLog = getItem(KEYS.NIGHT_LOG, {})

  const fields = ['maghrib_prayed', 'isha_prayed', 'tahajjud_done', 'muraqaba_done', 'nap_taken']
  const done = fields.filter((f) => log[f]).length
  const pct = Math.round((done / fields.length) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#E8EDF2]">Night Routine</h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-[#243044] rounded-full overflow-hidden">
            <div className="h-full bg-[#D4A843] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm text-[#D4A843] font-medium">{pct}%</span>
        </div>
      </div>

      {/* Tahajjud streak */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="label-sm">Tahajjud Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-[#D4A843]">{tahajjudStreak}</span>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B7A8D]">Keep going.</p>
          <p className="text-xs text-[#D4A843] mt-0.5">{times?.lastThirdStart ? `Last third: ${times.lastThirdStart}` : ''}</p>
        </div>
      </div>

      {/* Times reference */}
      {times && (
        <div className="card">
          <p className="label-sm mb-3">Tonight's Times</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[#6B7A8D] text-xs">Maghrib</p>
              <p className="text-[#E8EDF2] font-medium text-sm mt-0.5">{times.maghrib}</p>
            </div>
            <div>
              <p className="text-[#6B7A8D] text-xs">Nap Ends</p>
              <p className="text-[#D4A843] font-medium text-sm mt-0.5">{times.napEnd}</p>
            </div>
            <div>
              <p className="text-[#6B7A8D] text-xs">Last Third</p>
              <p className="text-[#D4A843] font-medium text-sm mt-0.5">{times.lastThirdStart}</p>
            </div>
            <div>
              <p className="text-[#6B7A8D] text-xs">Fajr</p>
              <p className="text-[#E8EDF2] font-medium text-sm mt-0.5">{times.fajr}</p>
            </div>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="card">
        <p className="label-sm mb-3">Tonight · {format(new Date(), 'MMMM d')}</p>
        <div className="divide-y divide-[#243044]">
          <ChecklistItem
            label={isWeekend ? 'Biggest meal by 12:30 PM' : 'Biggest meal by 5 PM'}
            checked={!!log.big_meal_done}
            onChange={(v) => toggle('big_meal_done', v)}
            timeLabel={isWeekend ? '12:30' : '17:00'}
          />
          <ChecklistItem
            label="Light dinner"
            note="Keep it light for nap quality"
            checked={!!log.light_dinner}
            onChange={(v) => toggle('light_dinner', v)}
          />
          <ChecklistItem
            label="Maghrib prayer"
            checked={!!log.maghrib_prayed}
            onChange={(v) => toggle('maghrib_prayed', v)}
            timeLabel={times?.maghrib}
          />
          <ChecklistItem
            label="Post-Maghrib nap"
            note={times ? `Nap window: ${times.maghrib} → ${times.napEnd}` : 'Nap window: Maghrib → +90 min'}
            checked={!!log.nap_taken}
            onChange={(v) => toggle('nap_taken', v)}
          >
            {log.nap_taken && (
              <input
                type="number"
                min="0"
                max="120"
                placeholder="Duration (min)"
                className="input-field w-36 mb-2"
                value={log.nap_duration || ''}
                onChange={(e) => setNum('nap_duration', Number(e.target.value))}
              />
            )}
          </ChecklistItem>
          <ChecklistItem
            label="Isha prayer"
            note="With niyyah for tahajjud"
            checked={!!log.isha_prayed}
            onChange={(v) => toggle('isha_prayed', v)}
            timeLabel={times?.isha}
          />
          <ChecklistItem
            label="Sleep Block 1"
            note="10:30 PM → 1:30 AM"
            checked={!!log.block1_done}
            onChange={(v) => toggle('block1_done', v)}
            timeLabel="22:30"
          />
          <ChecklistItem
            label="Wake + Wudu"
            note={times ? `Last third opens: ${times.lastThirdStart}` : 'Last third of night'}
            checked={!!log.wudu_done}
            onChange={(v) => toggle('wudu_done', v)}
            timeLabel="01:30"
          />
          <ChecklistItem
            label="Tahajjud prayer"
            checked={!!log.tahajjud_done}
            onChange={(v) => toggle('tahajjud_done', v)}
          >
            {log.tahajjud_done && (
              <input
                type="number"
                min="0"
                placeholder="Rakaat count"
                className="input-field w-36 mb-2"
                value={log.tahajjud_rakaat || ''}
                onChange={(e) => setNum('tahajjud_rakaat', Number(e.target.value))}
              />
            )}
          </ChecklistItem>
          <ChecklistItem
            label="Muraqaba"
            checked={!!log.muraqaba_done}
            onChange={(v) => toggle('muraqaba_done', v)}
          >
            {log.muraqaba_done && (
              <input
                type="number"
                min="0"
                placeholder="Minutes"
                className="input-field w-36 mb-2"
                value={log.muraqaba_minutes || ''}
                onChange={(e) => setNum('muraqaba_minutes', Number(e.target.value))}
              />
            )}
          </ChecklistItem>
          <ChecklistItem
            label="Sleep Block 2"
            note="90 min · before Fajr"
            checked={!!log.block2_done}
            onChange={(v) => toggle('block2_done', v)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <p className="label-sm mb-2">Notes</p>
        <textarea
          className="input-field min-h-[80px] resize-none"
          placeholder="Reflections for tonight..."
          value={log.notes || ''}
          onChange={(e) => setStr('notes', e.target.value)}
        />
      </div>

      {/* 30-day heatmap */}
      <div className="card">
        <HeatmapChart
          log={nightLog}
          checkFn={(e) => e?.tahajjud_done}
          days={30}
          label="Tahajjud · Last 30 Days"
        />
      </div>

      <QuranQuote section="night" />
    </div>
  )
}
