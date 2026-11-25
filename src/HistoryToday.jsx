import { useEffect, useState } from 'react'
import EventDialog from './EventDialog'
import { findLegend } from './data/history'
import './HistoryToday.css'

// Every day of the year has its own small file in /public/history
// (e.g. 11-25.json), collected by scripts/fetch-history.py. The site only
// ever reads its own files, so this needs no outside service and changes
// automatically each day.
const SHOWN_AT_FIRST = 5

const pad = (n) => String(n).padStart(2, '0')

// link an event to a legend's story when it names one of them
const withLegends = (events) =>
  events.map((event) => ({
    ...event,
    legend: findLegend(event.text),
  }))

// a spread across the centuries rather than five events from one decade
function spread(events, count) {
  if (events.length <= count) return events
  const step = (events.length - 1) / (count - 1)
  return Array.from({ length: count }, (_, i) => events[Math.round(i * step)])
}

export default function HistoryToday({ onSelectPerson }) {
  const [today] = useState(() => new Date())
  const [events, setEvents] = useState(null)
  const [failed, setFailed] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [openEvent, setOpenEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/history/${pad(today.getMonth() + 1)}-${pad(today.getDate())}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((list) => {
        if (cancelled) return
        if (!Array.isArray(list) || list.length === 0) throw new Error('no events')
        setEvents(withLegends(list))
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [today])

  // a day with no file: leave the section out quietly
  if (failed) return null

  const dateLabel = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  const visible = events ? (showAll ? events : spread(events, SHOWN_AT_FIRST)) : []

  return (
    <section className="history-today" id="history-today" aria-labelledby="history-today-title" aria-busy={!events}>
      <div className="history-head">
        <h2 id="history-today-title">Happened on {dateLabel}</h2>
        <p>Moments from across history that share today’s date. A new set every day.</p>
      </div>

      {!events ? (
        <ol className="history-list loading" aria-hidden="true">
          {Array.from({ length: SHOWN_AT_FIRST }, (_, i) => (
            <li key={i} className="history-item">
              <span className="history-year" />
              <span className="history-text" />
            </li>
          ))}
        </ol>
      ) : (
        <>
          <ol className="history-list">
            {visible.map((event) => (
              <li key={event.year + event.text} className="history-item">
                <button className="history-open" onClick={() => setOpenEvent(event)}>
                  <span className="history-year">{event.year}</span>
                  <span className="history-body">
                    <span className="history-text">{event.text}</span>
                    <span className="history-more">
                      Read the full story →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="history-foot">
            {events.length > SHOWN_AT_FIRST && (
              <button className="secondary-button" onClick={() => setShowAll((s) => !s)}>
                {showAll ? 'Show fewer' : `Show all ${events.length} events`}
              </button>
            )}
            {/* the event texts are adapted from Wikipedia, whose licence asks for this credit */}
            <p className="history-credit">Events adapted from Wikipedia (CC BY-SA 4.0).</p>
          </div>
        </>
      )}

      <EventDialog
        event={openEvent}
        date={dateLabel}
        onClose={() => setOpenEvent(null)}
        onSelectPerson={onSelectPerson}
      />
    </section>
  )
}
