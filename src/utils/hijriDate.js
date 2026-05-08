// Algorithmic Gregorian → Hijri conversion (Kuwaiti algorithm)
export function toHijri(date = new Date()) {
  const D = date.getDate()
  const M = date.getMonth() + 1
  const Y = date.getFullYear()

  let JD = Math.floor((1461 * (Y + 4800 + Math.floor((M - 14) / 12))) / 4)
  JD += Math.floor((367 * (M - 2 - 12 * Math.floor((M - 14) / 12))) / 12)
  JD -= Math.floor((3 * (Math.floor((Y + 4900 + Math.floor((M - 14) / 12)) / 100))) / 4)
  JD += D - 32075

  let l = JD - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  l = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238)
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29
  const month = Math.floor((24 * l) / 709)
  const day = l - Math.floor((709 * month) / 24)
  const year = 30 * n + j - 30

  return { day, month, year }
}

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
]

export function formatHijri(date = new Date()) {
  const { day, month, year } = toHijri(date)
  return `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH`
}
