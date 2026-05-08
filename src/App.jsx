import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PrayerProvider } from './context/PrayerContext'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Morning from './pages/Morning'
import Night from './pages/Night'
import Workout from './pages/Workout'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import Plan from './pages/Plan'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <PrayerProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/morning" element={<Morning />} />
              <Route path="/night" element={<Night />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </PrayerProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
