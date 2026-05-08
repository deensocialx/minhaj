import React, { useState, useEffect } from 'react'
import { usePrayer } from '../context/PrayerContext'
import { getNextPrayer, formatCountdown } from '../utils/prayerCalc'

export default function CountdownTimer() {
  const { times } = usePrayer()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  if (!times) return null

  const next = getNextPrayer(times)
  if (!next || !next.time) return null

  const ms = next.time - new Date()
  const countdown = formatCountdown(ms)

  return (
    <div className="flex flex-col items-center py-4">
      <p className="label-sm mb-1">Next Prayer</p>
      <p className="text-[#D4A843] text-2xl font-bold tracking-wider font-mono">{countdown}</p>
      <p className="text-[#A0AABB] text-sm mt-1">
        {next.name} · {next.time ? next.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      </p>
    </div>
  )
}
