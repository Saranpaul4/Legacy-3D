import { useMemo } from 'react'
import { personalities, getPortrait } from './data/personalities'
import './OnThisDay.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// "March 14, 1879" -> { month: 2, day: 14 }
function parseBirthday(bornDate) {
  const match = /^([A-Za-z]+)\s+(\d{1,2})/.exec(bornDate || '')
  if (!match) return null
  const month = MONTHS.indexOf(match[1])
  return month === -1 ? null : { month, day: Number(match[2]) }
}

function daysUntil(birthday, today) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(today.getFullYear(), birthday.month, birthday.day)
  if (next < start) next = new Date(today.getFullYear() + 1, birthday.month, birthday.day)
  return { days: Math.round((next - start) / 86400000), year: next.getFullYear() }
}

export default function OnThisDay({ onSelectPerson }) {
  // Only shows on a legend's birthday; on other days the section is left out.
  const { todays, today, birthdayYear } = useMemo(() => {
    const now = new Date()
    const withDays = personalities
      .map((person) => {
        const birthday = parseBirthday(person.bornDate)
        return birthday ? { person, ...daysUntil(birthday, now) } : null
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days)

    const born = withDays.filter((x) => x.days === 0).map((x) => x.person)
    return {
      todays: born,
      today: now,
      birthdayYear: Object.fromEntries(withDays.map((x) => [x.person.name, x.year])),
    }
  }, [])

  if (todays.length === 0) return null

  const dateLabel = `${today.getDate()} ${MONTHS[today.getMonth()]}`

  return (
    <section className="on-this-day" aria-labelledby="on-this-day-title">
      <div className="otd-intro">
        <h2 id="on-this-day-title">Born on this day, {dateLabel}</h2>
        <p>{todays.length > 1 ? 'Legends who share today’s date.' : 'A legend who shares today’s date.'}</p>
      </div>

      <div className="otd-list">
        {todays.map((person) => {
          const age = person.died == null ? birthdayYear[person.name] - person.born : null
          return (
            <article className="otd-card" key={person.name}>
              <img src={getPortrait(person)} alt="" width="120" height="137" loading="lazy" decoding="async" />
              <div>
                <p className="otd-date">{person.bornDate}</p>
                <h3>{person.name}</h3>
                <p className="otd-text">
                  Born in {person.birthplace}.{' '}
                  {age != null
                    ? `Turns ${age} today.`
                    : `${person.achievement}.`}
                </p>
                <button className="secondary-button" onClick={() => onSelectPerson(person)}>
                  Read their story
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
