import { useState } from 'react'
import { personalities, getPortrait } from './data/personalities'
import './QuoteOfTheDay.css'

// A different quote each day, the same one for everyone on that day
function pickToday() {
  const withQuotes = personalities.filter((p) => p.quote)
  if (withQuotes.length === 0) return null
  const now = new Date()
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000)
  return withQuotes[dayNumber % withQuotes.length]
}

export default function QuoteOfTheDay({ onSelectPerson }) {
  const [person] = useState(pickToday)

  if (!person) return null

  return (
    <section className="quote-of-day" aria-labelledby="quote-of-day-title">
      <p className="quote-of-day-label" id="quote-of-day-title">Quote of the day</p>
      <figure>
        <blockquote>“{person.quote.text}”</blockquote>
        <figcaption>
          <img src={getPortrait(person)} alt="" width="44" height="50" loading="lazy" decoding="async" />
          <span>
            <strong>{person.name}</strong>
            {person.quote.source}
          </span>
        </figcaption>
      </figure>
      <button className="secondary-button" onClick={() => onSelectPerson(person)}>
        Read their story
      </button>
    </section>
  )
}
