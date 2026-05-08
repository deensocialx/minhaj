import { format, addMinutes, addDays, parse, isValid } from 'date-fns'

export function parseTimeToDate(timeStr, baseDate = new Date()) {
  if (!timeStr) return null
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const d = new Date(baseDate)
    d.setHours(hours, minutes, 0, 0)
    return d
  } catch {
    return null
  }
}

export function calcNightTimes(maghribStr, fajrNextStr) {
  const today = new Date()
  const maghrib = parseTimeToDate(maghribStr, today)
  let fajrNext = parseTimeToDate(fajrNextStr, today)
  if (!maghrib || !fajrNext) return {}

  // fajr next day
  if (fajrNext <= maghrib) {
    fajrNext = addDays(fajrNext, 1)
  }

  const nightMs = fajrNext - maghrib
  const lastThirdStart = new Date(maghrib.getTime() + (nightMs * 2) / 3)
  const napEnd = addMinutes(maghrib, 90)

  return {
    nightDurationMin: Math.round(nightMs / 60000),
    lastThirdStart: format(lastThirdStart, 'HH:mm'),
    napEnd: format(napEnd, 'HH:mm'),
  }
}

export function getNextPrayer(prayerTimes) {
  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const now = new Date()

  for (const name of prayers) {
    const t = parseTimeToDate(prayerTimes[name.toLowerCase()])
    if (t && t > now) {
      return { name, time: t }
    }
  }
  // All passed — next is Fajr tomorrow
  const fajrTomorrow = parseTimeToDate(prayerTimes['fajr'], addDays(new Date(), 1))
  return { name: 'Fajr', time: fajrTomorrow }
}

export function formatCountdown(ms) {
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}
