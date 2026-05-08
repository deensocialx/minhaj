export const QUOTES = {
  dashboard: [
    { text: 'And whoever relies upon Allah — then He is sufficient for him.', ref: '65:3' },
    { text: 'Say: Nothing will befall us except what Allah has decreed for us.', ref: '9:51' },
    { text: 'Verily, with hardship comes ease.', ref: '94:6' },
    { text: 'Allah does not burden a soul beyond what it can bear.', ref: '2:286' },
  ],
  morning: [
    { text: 'Indeed, Allah is with those who are patient.', ref: '2:153' },
    { text: 'And do good; indeed, Allah loves the doers of good.', ref: '2:195' },
    { text: "So whoever does an atom's weight of good will see it.", ref: '99:7' },
    { text: 'Rise and warn. And your Lord — glorify Him.', ref: '74:2-3' },
  ],
  night: [
    { text: 'They arise from their beds; they supplicate their Lord in fear and hope.', ref: '32:16' },
    { text: 'And in the hours before dawn they would seek forgiveness.', ref: '51:18' },
    {
      text: 'Is one who is devoutly obedient during the night, prostrating and standing, fearing the Hereafter and hoping for the mercy of his Lord, equal to one who is not?',
      ref: '39:9',
    },
    { text: 'O you who wraps himself in clothing, arise the night, except for a little.', ref: '73:1-2' },
  ],
  workout: [
    {
      text: 'And prepare against them whatever you are able.',
      ref: '8:60',
      note: 'Strength is an amanah.',
    },
    {
      text: 'The strong believer is better and more beloved to Allah than the weak believer.',
      ref: 'Muslim',
    },
  ],
  insights: [
    {
      text: 'O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow.',
      ref: '59:18',
    },
    {
      text: 'Take account of yourselves before you are held to account.',
      ref: 'Umar ibn al-Khattab',
    },
  ],
}

export function getDailyQuote(section) {
  const list = QUOTES[section] || QUOTES.dashboard
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  return list[dayOfYear % list.length]
}
