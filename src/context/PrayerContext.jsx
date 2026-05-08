import React, { createContext, useContext } from 'react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'

const PrayerContext = createContext(null)

export function PrayerProvider({ children }) {
  const prayerData = usePrayerTimes()
  return <PrayerContext.Provider value={prayerData}>{children}</PrayerContext.Provider>
}

export function usePrayer() {
  return useContext(PrayerContext)
}
