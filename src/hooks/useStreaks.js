import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { getItem, KEYS } from '../utils/storage'

function calcStreak(log, checkFn) {
  let streak = 0
  let d = new Date()
  // start from yesterday if today not yet logged
  const todayKey = format(d, 'yyyy-MM-dd')
  if (!checkFn(log[todayKey])) {
    d = subDays(d, 1)
  }
  while (true) {
    const key = format(d, 'yyyy-MM-dd')
    if (checkFn(log[key])) {
      streak++
      d = subDays(d, 1)
    } else {
      break
    }
  }
  return streak
}

export function useStreaks() {
  return useMemo(() => {
    const morningLog = getItem(KEYS.MORNING_LOG, {})
    const nightLog = getItem(KEYS.NIGHT_LOG, {})
    const workoutLog = getItem(KEYS.WORKOUT_LOG, {})

    const morningStreak = calcStreak(morningLog, (d) => d?.fajr_prayed && d?.dhikr_done)
    const tahajjudStreak = calcStreak(nightLog, (d) => d?.tahajjud_done)
    const nightStreak = calcStreak(nightLog, (d) => d?.maghrib_prayed && d?.isha_prayed)
    const workoutStreak = calcStreak(workoutLog, (d) => d?.completed)

    return { morningStreak, tahajjudStreak, nightStreak, workoutStreak }
  }, [])
}
