export const KEYS = {
  PRAYER_TIMES: 'minhaj_prayer_times',
  MORNING_LOG: 'minhaj_morning_log',
  NIGHT_LOG: 'minhaj_night_log',
  WORKOUT_LOG: 'minhaj_workout_log',
  SETTINGS: 'minhaj_settings',
  STREAKS: 'minhaj_streaks',
}

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed', e)
  }
}

export function removeItem(key) {
  localStorage.removeItem(key)
}

export function exportAllData() {
  const data = {}
  Object.values(KEYS).forEach(k => {
    const v = getItem(k)
    if (v !== null) data[k] = v
  })
  return data
}

export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
