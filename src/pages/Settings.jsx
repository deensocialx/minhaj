import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { exportAllData, clearAllData, KEYS, getItem, setItem } from '../utils/storage'

export default function Settings() {
  const { settings, updateSettings } = useApp()
  const [msg, setMsg] = useState('')
  const [locLoading, setLocLoading] = useState(false)

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 2500)
  }

  function detectLocation() {
    if (!navigator.geolocation) return flash('Geolocation not supported')
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        updateSettings({ location: { lat, lng, city: 'Your Location' } })
        // Clear cached prayer times so they refresh
        localStorage.removeItem(KEYS.PRAYER_TIMES)
        setLocLoading(false)
        flash('Location updated — prayer times will refresh')
      },
      () => {
        setLocLoading(false)
        flash('Could not detect location')
      }
    )
  }

  function handleExport() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `minhaj-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('Data exported')
  }

  function handleClear() {
    if (window.confirm('Clear all Minhaj data? This cannot be undone.')) {
      clearAllData()
      flash('All data cleared')
    }
  }

  function updateLocation(field, value) {
    updateSettings({
      location: { ...settings.location, [field]: field === 'city' ? value : parseFloat(value) || 0 },
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
      <h2 className="text-xl font-semibold text-[#E8EDF2]">Settings</h2>

      {msg && (
        <div className="bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] text-sm px-4 py-2 rounded-lg">
          {msg}
        </div>
      )}

      {/* Location */}
      <div className="card space-y-3">
        <p className="label-sm">Location</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#E8EDF2]">{settings.location?.city || 'Unknown'}</p>
            <p className="text-xs text-[#6B7A8D] mt-0.5">
              {settings.location?.lat?.toFixed(4)}, {settings.location?.lng?.toFixed(4)}
            </p>
          </div>
          <button className="btn-ghost text-xs py-1.5" onClick={detectLocation} disabled={locLoading}>
            {locLoading ? 'Detecting...' : 'Re-detect'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-[#6B7A8D] mb-1">City name</p>
            <input
              className="input-field"
              value={settings.location?.city || ''}
              onChange={(e) => updateLocation('city', e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-[#6B7A8D] mb-1">Latitude</p>
            <input
              type="number"
              step="0.0001"
              className="input-field"
              value={settings.location?.lat || ''}
              onChange={(e) => updateLocation('lat', e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-[#6B7A8D] mb-1">Longitude</p>
            <input
              type="number"
              step="0.0001"
              className="input-field"
              value={settings.location?.lng || ''}
              onChange={(e) => updateLocation('lng', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Times */}
      <div className="card space-y-3">
        <p className="label-sm">Schedule</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Wake Time', field: 'wake_time' },
            { label: 'Work Start', field: 'work_start' },
            { label: 'Gym (Weekday)', field: 'gym_time_weekday' },
            { label: 'Gym (Weekend)', field: 'gym_time_weekend' },
          ].map(({ label, field }) => (
            <div key={field}>
              <p className="text-xs text-[#6B7A8D] mb-1">{label}</p>
              <input
                type="time"
                className="input-field"
                value={settings[field] || ''}
                onChange={(e) => updateSettings({ [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Calculation method */}
      <div className="card">
        <p className="label-sm mb-3">Prayer Calculation Method</p>
        <select
          className="input-field"
          value={settings.calculation_method}
          onChange={(e) => {
            updateSettings({ calculation_method: Number(e.target.value) })
            localStorage.removeItem(KEYS.PRAYER_TIMES)
          }}
        >
          <option value={2}>ISNA (Islamic Society of North America)</option>
          <option value={1}>University of Islamic Sciences, Karachi</option>
          <option value={3}>Muslim World League</option>
          <option value={4}>Umm al-Qura, Makkah</option>
          <option value={5}>Egyptian General Authority</option>
          <option value={15}>Diyanet İşleri Başkanlığı, Turkey</option>
        </select>
      </div>

      {/* Data management */}
      <div className="card space-y-3">
        <p className="label-sm">Data</p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1 py-2.5" onClick={handleExport}>
            Export JSON
          </button>
          <button
            className="flex-1 border border-red-500/40 text-red-400 px-4 py-2.5 rounded-lg text-sm transition-all hover:bg-red-500/10 active:scale-95"
            onClick={handleClear}
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <p className="label-sm mb-2">About</p>
        <p className="text-sm text-[#6B7A8D] leading-relaxed">
          <span className="text-[#D4A843] font-semibold">Minhaj</span> (منهج) — a personal Islamic
          lifestyle tracker for morning routine, tahajjud, and intentional daily practice.
        </p>
        <p className="text-xs text-[#4A5568] mt-3">All data stored locally on this device.</p>
      </div>
    </div>
  )
}
