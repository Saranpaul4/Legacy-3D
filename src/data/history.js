import { personalities } from './personalities'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// "11-25" -> "25 November"
export const dayLabel = (day) => {
  const [m, d] = day.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

// link an event to a legend's story when it names one of them
export const findLegend = (text) => personalities.find((p) => text.includes(p.name)) ?? null
