import React, { createContext, useContext, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { getItem, setItem, KEYS } from '../utils/storage'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  location: { lat: 45.2734, lng: -66.0633, city: 'Saint John, NB' },
  calculation_method: 2,
  wake_time: '06:30',
  work_start: '08:00',
  gym_time_weekday: '18:00',
  gym_time_weekend: '08:00',
  custom_routine_items: [],
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => getItem(KEYS.SETTINGS, DEFAULT_SETTINGS))

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      setItem(KEYS.SETTINGS, next)
      return next
    })
  }, [])

  const today = format(new Date(), 'yyyy-MM-dd')

  function getMorningLog() {
    return getItem(KEYS.MORNING_LOG, {})
  }
  function getNightLog() {
    return getItem(KEYS.NIGHT_LOG, {})
  }
  function getWorkoutLog() {
    return getItem(KEYS.WORKOUT_LOG, {})
  }

  function updateMorningLog(patch) {
    const log = getItem(KEYS.MORNING_LOG, {})
    const updated = { ...log, [today]: { ...(log[today] || {}), ...patch } }
    setItem(KEYS.MORNING_LOG, updated)
  }

  function updateNightLog(patch) {
    const log = getItem(KEYS.NIGHT_LOG, {})
    const updated = { ...log, [today]: { ...(log[today] || {}), ...patch } }
    setItem(KEYS.NIGHT_LOG, updated)
  }

  function updateWorkoutLog(patch) {
    const log = getItem(KEYS.WORKOUT_LOG, {})
    const updated = { ...log, [today]: { ...(log[today] || {}), ...patch } }
    setItem(KEYS.WORKOUT_LOG, updated)
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        today,
        getMorningLog,
        getNightLog,
        getWorkoutLog,
        updateMorningLog,
        updateNightLog,
        updateWorkoutLog,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
