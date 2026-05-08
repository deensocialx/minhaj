import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getItem, setItem, KEYS } from '../utils/storage'
import { calcNightTimes } from '../utils/prayerCalc'

const FALLBACK = { lat: 45.2734, lng: -66.0633, city: 'Saint John, NB' }

async function fetchTimes(lat, lng) {
  const dateStr = format(new Date(), 'dd-MM-yyyy')
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API error')
  const json = await res.json()
  return json.data.timings
}

export function usePrayerTimes() {
  const [times, setTimes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fresh, setFresh] = useState(false)

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const cached = getItem(KEYS.PRAYER_TIMES)

    if (cached && cached.date === today) {
      setTimes(cached)
      setFresh(false)
      setLoading(false)
      return
    }

    async function load(lat, lng, city) {
      try {
        const t = await fetchTimes(lat, lng)
        const nightData = calcNightTimes(t.Maghrib, t.Fajr)
        const data = {
          date: today,
          fajr: t.Fajr,
          sunrise: t.Sunrise,
          dhuhr: t.Dhuhr,
          asr: t.Asr,
          maghrib: t.Maghrib,
          isha: t.Isha,
          ...nightData,
          city,
          fetchedAt: new Date().toISOString(),
        }
        setItem(KEYS.PRAYER_TIMES, data)
        setTimes(data)
        setFresh(true)
      } catch {
        setTimes(cached || null)
      } finally {
        setLoading(false)
      }
    }

    const settings = getItem(KEYS.SETTINGS)
    if (settings?.location?.lat) {
      load(settings.location.lat, settings.location.lng, settings.location.city)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          load(lat, lng, 'Your Location')
        },
        () => load(FALLBACK.lat, FALLBACK.lng, FALLBACK.city)
      )
    } else {
      load(FALLBACK.lat, FALLBACK.lng, FALLBACK.city)
    }
  }, [])

  return { times, loading, fresh }
}
