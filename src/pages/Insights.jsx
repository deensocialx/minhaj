import React from 'react'
import { format, subDays, startOfWeek, addDays, subWeeks } from 'date-fns'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { getItem, KEYS } from '../utils/storage'
import QuranQuote from '../components/QuranQuote'
import HeatmapChart from '../components/HeatmapChart'

const CHART_THEME = {
  grid: '#1E2A3A',
  axis: '#4A5568',
  gold: '#D4A843',
  emerald: '#2ECC71',
  area: '#D4A84333',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1A2333] border border-[#243044] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#6B7A8D] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

function SummaryCard({ label, value, sub }) {
  return (
    <div className="card flex flex-col gap-1">
      <p className="label-sm">{label}</p>
      <p className="text-2xl font-bold text-[#D4A843]">{value}</p>
      {sub && <p className="text-xs text-[#6B7A8D]">{sub}</p>}
    </div>
  )
}

export default function Insights() {
  const nightLog = getItem(KEYS.NIGHT_LOG, {})
  const morningLog = getItem(KEYS.MORNING_LOG, {})
  const workoutLog = getItem(KEYS.WORKOUT_LOG, {})

  // Morning completion: last 14 days
  const morningData = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i)
    const key = format(d, 'yyyy-MM-dd')
    const entry = morningLog[key] || {}
    const fields = ['fajr_prayed', 'dhikr_done', 'deensocial_done']
    const done = fields.filter((f) => entry[f]).length
    return {
      day: format(d, 'MMM d'),
      pct: Math.round((done / fields.length) * 100),
    }
  })

  // Muraqaba minutes: last 14 days
  const muraqabaData = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i)
    const key = format(d, 'yyyy-MM-dd')
    const entry = nightLog[key] || {}
    return {
      day: format(d, 'MMM d'),
      minutes: entry.muraqaba_minutes || 0,
    }
  })

  // DeenSocial minutes per week: last 8 weeks
  const deenSocialData = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 })
    let total = 0
    for (let d = 0; d < 7; d++) {
      const key = format(addDays(weekStart, d), 'yyyy-MM-dd')
      total += morningLog[key]?.deensocial_minutes || 0
    }
    return { week: format(weekStart, 'MMM d'), minutes: total }
  })

  // Workout weekly completion: last 8 weeks
  const workoutWeekData = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 })
    let done = 0
    for (let d = 0; d < 7; d++) {
      const key = format(addDays(weekStart, d), 'yyyy-MM-dd')
      if (workoutLog[key]?.completed) done++
    }
    return { week: format(weekStart, 'MMM d'), sessions: done }
  })

  // Sleep blocks last 14 days
  const sleepData = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i)
    const key = format(d, 'yyyy-MM-dd')
    const entry = nightLog[key] || {}
    const blocks = (entry.block1_done ? 1 : 0) + (entry.block2_done ? 1 : 0)
    return { day: format(d, 'MMM d'), blocks }
  })

  // Summary stats
  const allTahajjudDays = Object.values(nightLog).filter((e) => e?.tahajjud_done).length
  const totalDeenSocialMin = Object.values(morningLog).reduce((acc, e) => acc + (e?.deensocial_minutes || 0), 0)
  const avgSleepBlocks =
    sleepData.reduce((acc, d) => acc + d.blocks, 0) / (sleepData.filter((d) => d.blocks > 0).length || 1)

  // Best tahajjud streak
  let bestStreak = 0, cur = 0
  for (let i = 89; i >= 0; i--) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd')
    if (nightLog[key]?.tahajjud_done) { cur++; bestStreak = Math.max(bestStreak, cur) }
    else cur = 0
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      <h2 className="text-xl font-semibold text-[#E8EDF2]">Insights</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard label="Best Tahajjud Streak" value={`${bestStreak}d`} sub="All time" />
        <SummaryCard label="Total Tahajjud Days" value={allTahajjudDays} sub="Days logged" />
        <SummaryCard
          label="DeenSocial Time"
          value={`${Math.round(totalDeenSocialMin / 60)}h`}
          sub={`${totalDeenSocialMin} min total`}
        />
        <SummaryCard
          label="Avg Sleep Blocks"
          value={avgSleepBlocks.toFixed(1)}
          sub="Per logged night"
        />
      </div>

      {/* Tahajjud heatmap */}
      <div className="card">
        <HeatmapChart
          log={nightLog}
          checkFn={(e) => e?.tahajjud_done}
          days={30}
          label="Tahajjud Consistency · 30 Days"
        />
      </div>

      {/* Morning completion bar chart */}
      <div className="card">
        <p className="label-sm mb-4">Morning Routine · Last 14 Days</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={morningData} barSize={12}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey="day" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis domain={[0, 100]} tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pct" name="%" fill={CHART_THEME.gold} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep blocks */}
      <div className="card">
        <p className="label-sm mb-4">Sleep Blocks · Last 14 Days</p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={sleepData}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey="day" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis domain={[0, 2]} ticks={[0, 1, 2]} tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="blocks" name="Blocks" stroke={CHART_THEME.emerald} strokeWidth={2} dot={{ fill: CHART_THEME.emerald, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Workout weekly */}
      <div className="card">
        <p className="label-sm mb-4">Workout Sessions · Weekly</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={workoutWeekData} barSize={16}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey="week" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 7]} tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sessions" name="Sessions" fill={CHART_THEME.emerald} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DeenSocial area chart */}
      <div className="card">
        <p className="label-sm mb-4">DeenSocial Minutes · Weekly</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={deenSocialData}>
            <defs>
              <linearGradient id="dsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_THEME.gold} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_THEME.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey="week" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="minutes" name="Min" stroke={CHART_THEME.gold} fill="url(#dsGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Muraqaba line chart */}
      <div className="card">
        <p className="label-sm mb-4">Muraqaba Minutes · Last 14 Days</p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={muraqabaData}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey="day" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
            <YAxis tick={{ fill: CHART_THEME.axis, fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="minutes" name="Min" stroke={CHART_THEME.gold} strokeWidth={2} dot={{ fill: CHART_THEME.gold, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <QuranQuote section="insights" />
    </div>
  )
}
