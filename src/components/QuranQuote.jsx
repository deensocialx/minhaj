import React from 'react'
import { getDailyQuote } from '../utils/quotes'

export default function QuranQuote({ section = 'dashboard', className = '' }) {
  const quote = getDailyQuote(section)
  return (
    <div className={`border-l-2 border-[#D4A843] pl-4 py-1 ${className}`}>
      <p className="text-[#E8EDF2] text-sm leading-relaxed italic">"{quote.text}"</p>
      <p className="text-[#D4A843] text-xs mt-1 font-medium">— {quote.ref}</p>
      {quote.note && <p className="text-[#6B7A8D] text-xs mt-0.5">{quote.note}</p>}
    </div>
  )
}
