import React, { useState } from 'react'
import { format } from 'date-fns'
import { formatHijri } from '../utils/hijriDate'
import { useApp } from '../context/AppContext'
import { usePrayer } from '../context/PrayerContext'
import { useStreaks } from '../hooks/useStreaks'
import PrayerStrip from '../components/PrayerStrip'
import CountdownTimer from '../components/CountdownTimer'
import CompletionRing from '../components/CompletionRing'
import QuranQuote from '../components/QuranQuote'
import BottomSheet from '../components/BottomSheet'
import ChecklistItem from '../components/ChecklistItem'

function calcMorningPercent(log) {
  if (!log) return 0
  const fields = ['fajr_prayed', 'dhikr_done', 'deensocial_done']
  const done = fields.filter((f) => log[f]).length
  return Math.round((done / fields.length) * 100)
}

function calcNightPercent(log) {
  if (!log) return 0
  const fields = ['maghrib_prayed', 'isha_prayed', 'tahajjud_done', 'muraqaba_done']
  const done = fields.filter((f) => log[f]).length
  return Math.round((done / fields.length) * 100)
}

function StreakBadge({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        <span className="text-[#D4A843] font-bold text-xl">{value}</span>
        <span className="text-base">🔥</span>
      </div>
      <span className="text-xs text-[#6B7A8D] text-center leading-tight">{label}</span>
    </div>
  )
}

export default function Dashboard() {
  const { today, getMorningLog, getNightLog, getWorkoutLog, updateMorningLog, updateNightLog } = useApp()
  const { times } = usePrayer()
  const streaks = useStreaks()

  const [morningSheet, setMorningSheet] = useState(false)
  const [nightSheet, setNightSheet] = useState(false)

  const morningLog = getMorningLog()[today] || {}
  const nightLog = getNightLog()[today] || {}

  const morningPct = calcMorningPercent(morningLog)
  const nightPct = calcNightPercent(nightLog)
  const workoutLog = getWorkoutLog()[today]

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div>
        <p className="text-[#6B7A8D] text-xs">{formatHijri()}</p>
        <h2 className="text-xl font-semibold text-[#E8EDF2] mt-0.5">
          {format(new Date(), 'EEEE, MMMM d')}
        </h2>
      </div>

      {/* Countdown */}
      <div className="card">
        <CountdownTimer />
        <PrayerStrip />
      </div>

      {/* Tonight's Plan */}
      {times && (
        <div className="card">
          <p className="label-sm mb-3">Tonight's Plan</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[#6B7A8D] text-xs">Nap Ends</p>
              <p className="text-[#D4A843] font-semibold text-sm mt-0.5">{times.napEnd || '—'}</p>
            </div>
            <div>
              <p className="text-[#6B7A8D] text-xs">Last Third</p>
              <p className="text-[#D4A843] font-semibold text-sm mt-0.5">{times.lastThirdStart || '—'}</p>
            </div>
            <div>
              <p className="text-[#6B7A8D] text-xs">Fajr</p>
              <p className="text-[#D4A843] font-semibold text-sm mt-0.5">{times.fajr || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion rings */}
      <div className="card">
        <p className="label-sm mb-4">Today's Progress</p>
        <div className="flex justify-around">
          <CompletionRing percent={morningPct} label="Morning" size={72} />
          <CompletionRing percent={nightPct} label="Night" size={72} />
          <CompletionRing
            percent={workoutLog?.completed ? 100 : 0}
            label="Workout"
            size={72}
            color={workoutLog?.completed ? '#2ECC71' : '#D4A843'}
          />
        </div>
      </div>

      {/* Streaks */}
      <div className="card">
        <p className="label-sm mb-4">Streaks</p>
        <div className="flex justify-around">
          <StreakBadge value={streaks.tahajjudStreak} label="Tahajjud" />
          <StreakBadge value={streaks.morningStreak} label="Morning" />
          <StreakBadge value={streaks.workoutStreak} label="Workout" />
        </div>
      </div>

      {/* Quick log buttons */}
      <div className="flex gap-3">
        <button className="flex-1 btn-primary py-3" onClick={() => setMorningSheet(true)}>
          Log Morning ✓
        </button>
        <button className="flex-1 btn-ghost py-3" onClick={() => setNightSheet(true)}>
          Log Night ✓
        </button>
      </div>

      {/* Quote */}
      <QuranQuote section="dashboard" />

      {/* Morning quick sheet */}
      <BottomSheet open={morningSheet} onClose={() => setMorningSheet(false)} title="Morning Log">
        <div className="space-y-1 divide-y divide-[#1E2A3A]">
          <ChecklistItem
            label="Fajr prayer"
            checked={!!morningLog.fajr_prayed}
            onChange={(v) => updateMorningLog({ fajr_prayed: v })}
          />
          <ChecklistItem
            label="Post-Fajr dhikr"
            note="Until sunrise if possible"
            checked={!!morningLog.dhikr_done}
            onChange={(v) => updateMorningLog({ dhikr_done: v })}
          />
          <ChecklistItem
            label="DeenSocial work session"
            checked={!!morningLog.deensocial_done}
            onChange={(v) => updateMorningLog({ deensocial_done: v })}
          >
            {morningLog.deensocial_done && (
              <input
                type="number"
                placeholder="Minutes"
                className="input-field w-28"
                value={morningLog.deensocial_minutes || ''}
                onChange={(e) => updateMorningLog({ deensocial_minutes: Number(e.target.value) })}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </ChecklistItem>
        </div>
      </BottomSheet>

      {/* Night quick sheet */}
      <BottomSheet open={nightSheet} onClose={() => setNightSheet(false)} title="Night Log">
        <div className="space-y-1 divide-y divide-[#1E2A3A]">
          <ChecklistItem
            label="Maghrib prayer"
            checked={!!nightLog.maghrib_prayed}
            onChange={(v) => updateNightLog({ maghrib_prayed: v })}
          />
          <ChecklistItem
            label="Isha prayer"
            checked={!!nightLog.isha_prayed}
            onChange={(v) => updateNightLog({ isha_prayed: v })}
          />
          <ChecklistItem
            label="Tahajjud prayer"
            checked={!!nightLog.tahajjud_done}
            onChange={(v) => updateNightLog({ tahajjud_done: v })}
          />
          <ChecklistItem
            label="Muraqaba"
            checked={!!nightLog.muraqaba_done}
            onChange={(v) => updateNightLog({ muraqaba_done: v })}
          >
            {nightLog.muraqaba_done && (
              <input
                type="number"
                placeholder="Minutes"
                className="input-field w-28"
                value={nightLog.muraqaba_minutes || ''}
                onChange={(e) => updateNightLog({ muraqaba_minutes: Number(e.target.value) })}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </ChecklistItem>
        </div>
      </BottomSheet>
    </div>
  )
}
