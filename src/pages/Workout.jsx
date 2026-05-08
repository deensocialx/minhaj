import React, { useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { useApp } from '../context/AppContext'
import QuranQuote from '../components/QuranQuote'
import { getItem, KEYS } from '../utils/storage'

const SCHEDULE = {
  1: {
    name: 'Push',
    muscles: 'Chest · Shoulders · Triceps',
    type: 'gym',
    slot: 'Evening',
    hasRun: false,
  },
  2: {
    name: 'Pull',
    muscles: 'Back · Biceps',
    type: 'gym',
    slot: '18:00',
    hasRun: true,
    run: { type: 'Interval', slot: '11:00 AM', target: '30-40 min' },
  },
  3: {
    name: 'Legs',
    muscles: 'Quads · Hamstrings · Calves · Glutes',
    type: 'gym',
    slot: 'Evening',
    hasRun: false,
  },
  4: {
    name: 'Rest / Recovery',
    muscles: 'Active recovery, stretch, mobility',
    type: 'rest',
    slot: '—',
    hasRun: false,
  },
  5: {
    name: 'Arms',
    muscles: 'Biceps · Triceps · Forearms',
    type: 'gym',
    slot: 'Evening',
    hasRun: false,
  },
  6: {
    name: 'Chest & Back',
    muscles: 'Chest · Back superset',
    type: 'gym',
    slot: 'After 15:00',
    hasRun: true,
    run: { type: 'Easy', slot: 'Before 08:00', target: '30-45 min' },
  },
  0: {
    name: 'Long Run',
    muscles: 'Aerobic endurance',
    type: 'run',
    slot: 'Before 08:00',
    hasRun: true,
    run: { type: 'Long', slot: 'Before 08:00', target: '60-90 min' },
  },
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function WeekGrid({ workoutLog }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const dow = d.getDay()
        const sched = SCHEDULE[dow]
        const entry = workoutLog[key]
        const isToday = format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

        return (
          <div
            key={key}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border
              ${isToday ? 'border-[#D4A843]' : 'border-[#243044]'}
              ${entry?.completed ? 'bg-[#1A7A44]/20' : 'bg-[#1E2A3A]'}`}
          >
            <span className={`text-[10px] font-medium ${isToday ? 'text-[#D4A843]' : 'text-[#6B7A8D]'}`}>
              {DAY_NAMES[dow]}
            </span>
            <span className="text-xs text-[#E8EDF2] font-medium text-center leading-tight">
              {sched?.name.split(' ')[0]}
            </span>
            <div className={`w-2 h-2 rounded-full ${entry?.completed ? 'bg-[#2ECC71]' : 'bg-[#243044]'}`} />
          </div>
        )
      })}
    </div>
  )
}

export default function Workout() {
  const { today, getWorkoutLog, updateWorkoutLog } = useApp()
  const dow = new Date().getDay()
  const sched = SCHEDULE[dow]
  const workoutLog = getItem(KEYS.WORKOUT_LOG, {})
  const [log, setLog] = useState(() => workoutLog[today] || {})

  function update(patch) {
    updateWorkoutLog(patch)
    setLog((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      <h2 className="text-xl font-semibold text-[#E8EDF2]">Workout</h2>

      {/* Today's workout */}
      <div className="card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="label-sm mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
            <h3 className="text-lg font-semibold text-[#E8EDF2]">{sched.name}</h3>
            <p className="text-sm text-[#6B7A8D] mt-0.5">{sched.muscles}</p>
          </div>
          <span
            className={`pill text-xs mt-1
              ${sched.type === 'rest' ? 'bg-[#243044] text-[#6B7A8D]' : 'bg-[#D4A843]/20 text-[#D4A843]'}`}
          >
            {sched.type === 'run' ? '🏃 Run' : sched.type === 'rest' ? '🧘 Rest' : '🏋️ Gym'}
          </span>
        </div>

        {sched.slot !== '—' && (
          <p className="text-xs text-[#6B7A8D] mb-4">
            ⏰ {sched.type === 'gym' ? 'Gym' : 'Workout'} · {sched.slot}
          </p>
        )}

        {/* Run block */}
        {sched.hasRun && sched.run && (
          <div className="bg-[#243044] rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-[#D4A843] mb-2">
              🏃 {sched.run.type} Run · {sched.run.slot}
            </p>
            <p className="text-xs text-[#6B7A8D]">Target: {sched.run.target}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs text-[#6B7A8D] mb-1">Distance (km)</p>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="input-field"
                  value={log.run_distance || ''}
                  onChange={(e) => update({ run_distance: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <p className="text-xs text-[#6B7A8D] mb-1">Duration (min)</p>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={log.run_duration || ''}
                  onChange={(e) => update({ run_duration: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-2">
              <button
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                  ${log.run_done ? 'bg-[#2ECC71]/20 border-[#2ECC71] text-[#2ECC71]' : 'border-[#2E3D52] text-[#6B7A8D] hover:border-[#2ECC71] hover:text-[#2ECC71]'}`}
                onClick={() => update({ run_done: !log.run_done })}
              >
                {log.run_done ? '✓ Run done' : 'Mark run done'}
              </button>
            </div>
          </div>
        )}

        {/* Gym log form */}
        {sched.type !== 'rest' && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#6B7A8D] mb-1">Duration (min)</p>
              <input
                type="number"
                min="0"
                className="input-field"
                value={log.duration || ''}
                onChange={(e) => update({ duration: Number(e.target.value) })}
              />
            </div>
            <div>
              <p className="text-xs text-[#6B7A8D] mb-1">Notes</p>
              <textarea
                className="input-field resize-none min-h-[60px]"
                placeholder="PR, sets, how it felt..."
                value={log.notes || ''}
                onChange={(e) => update({ notes: e.target.value })}
              />
            </div>
          </div>
        )}

        <button
          className={`w-full mt-4 py-3 rounded-lg font-semibold text-sm transition-all active:scale-[0.98]
            ${log.completed
              ? 'bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71]'
              : 'bg-[#D4A843] text-[#0F1621] hover:bg-[#E8C470]'
            }`}
          onClick={() => update({ completed: !log.completed })}
        >
          {log.completed ? '✓ Completed' : sched.type === 'rest' ? 'Mark Recovery Done' : 'Mark Complete'}
        </button>
      </div>

      {/* Week grid */}
      <div className="card">
        <p className="label-sm mb-3">This Week</p>
        <WeekGrid workoutLog={workoutLog} />
      </div>

      <QuranQuote section="workout" />
    </div>
  )
}
