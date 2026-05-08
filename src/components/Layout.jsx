import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/morning',
    label: 'Morning',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/night',
    label: 'Night',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/workout',
    label: 'Workout',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4v6M18 4v6M6 14v6M18 14v6M3 7h18M3 17h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/insights',
    label: 'Insights',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 16l4-4 4 4 4-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    to: '/plan',
    label: 'Plan',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
]

function NavItem({ to, label, icon, vertical = false }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        vertical
          ? `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
             ${isActive ? 'bg-[#1E2A3A] text-[#D4A843]' : 'text-[#6B7A8D] hover:text-[#A0AABB] hover:bg-[#1A2333]'}`
          : `flex flex-col items-center gap-0.5 px-2.5 py-1.5 flex-shrink-0 transition-all
             ${isActive ? 'text-[#D4A843]' : 'text-[#6B7A8D] hover:text-[#A0AABB]'}`
      }
    >
      {icon}
      <span className={vertical ? '' : 'text-[10px] font-medium'}>{label}</span>
    </NavLink>
  )
}

export default function Layout({ children }) {
  return (
    <div className="flex h-screen h-dvh">
      {/* Side nav — desktop only */}
      <nav className="hidden lg:flex flex-col w-56 bg-[#0F1621] border-r border-[#1A2333] py-6 px-3 flex-shrink-0">
        <div className="px-4 mb-8">
          <h1 className="text-[#D4A843] font-bold text-xl tracking-wide">Minhaj</h1>
          <p className="text-[#4A5568] text-xs mt-0.5">منهج</p>
        </div>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} vertical />
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>

        {/* Bottom nav — tablet/mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F1621] border-t border-[#1A2333] flex items-center overflow-x-auto px-1 py-1 z-40 safe-area-inset-bottom">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>
    </div>
  )
}
