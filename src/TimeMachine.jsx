import { useEffect, useMemo, useRef, useState } from 'react'
import { personalities, getPortrait, CURRENT_YEAR } from './data/personalities'
import { dayLabel } from './data/history'
import EventDialog from './EventDialog'
import './TimeMachine.css'

const FIRST_YEAR = 1450
// a few years worth stopping at; each one lands on a legend's big moment
const STOPS = [1452, 1687, 1863, 1905, 1947, 1969, 2011]

const ordinal = (n) => {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'
  return `${n}${tail}`
}

// what one legend was doing in a given year, if their story says
const momentIn = (person, year) => person.timeline?.find((t) => Number(t.year) === year)?.event

// the year in the address, e.g. /time-machine/1905
const yearFromAddress = () => {
  const match = /time-machine\/(\d{3,4})$/.exec(window.location.pathname)
  const year = match ? Number(match[1]) : 1905
  return Math.min(CURRENT_YEAR, Math.max(FIRST_YEAR, year))
}

export default function TimeMachine({ onSelectPerson }) {
  const [year, setYear] = useState(yearFromAddress)
  const [events, setEvents] = useState(null) // null while loading
  const [yearsWithEvents, setYearsWithEvents] = useState(null)
  const [openEvent, setOpenEvent] = useState(null)
  const cache = useRef(new Map())

  // keep the address in step so a year can be shared (no page jump)
  useEffect(() => {
    window.history.replaceState(null, '', `/time-machine/${year}`)
  }, [year])

  // which years have stored events at all
  useEffect(() => {
    fetch('/history/years/index.json')
      .then((res) => (res.ok ? res.json() : {}))
      .then((index) => setYearsWithEvents(new Set(Object.keys(index).map(Number))))
      .catch(() => setYearsWithEvents(new Set()))
  }, [])

  // that year's events (fetched a moment after the slider stops moving)
  useEffect(() => {
    if (cache.current.has(year)) {
      setEvents(cache.current.get(year))
      return
    }
    setEvents(null)
    let cancelled = false
    const timer = setTimeout(() => {
      fetch(`/history/years/${year}.json`)
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => [])
        .then((list) => {
          cache.current.set(year, list)
          if (!cancelled) setEvents(list)
        })
    }, 180)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [year])

  const { alive, nextBorn, lastDied } = useMemo(() => {
    const alive = personalities
      .filter((p) => p.born <= year && year <= (p.died ?? CURRENT_YEAR))
      .sort((a, b) => a.born - b.born)
    const nextBorn = personalities
      .filter((p) => p.born > year)
      .sort((a, b) => a.born - b.born)[0]
    const lastDied = personalities
      .filter((p) => p.died != null && p.died < year)
      .sort((a, b) => b.died - a.died)[0]
    return { alive, nextBorn, lastDied }
  }, [year])

  // the nearest years either side that do have events
  const nearby = useMemo(() => {
    if (!yearsWithEvents || (events && events.length)) return []
    const sorted = [...yearsWithEvents].filter((y) => y >= FIRST_YEAR && y <= CURRENT_YEAR).sort((a, b) => a - b)
    const before = sorted.filter((y) => y < year).pop()
    const after = sorted.find((y) => y > year)
    return [before, after].filter(Boolean)
  }, [yearsWithEvents, events, year])

  const openStory = async (item) => {
    const res = await fetch(`/history/${item.d}.json`)
    const day = await res.json()
    setOpenEvent({ ...day[item.i], day: item.d })
  }

  const move = (by) => setYear((y) => Math.min(CURRENT_YEAR, Math.max(FIRST_YEAR, y + by)))

  return (
    <section className="time-machine" id="time-machine">
      <div className="section-head">
        <h2>Time Machine</h2>
        <p>Pick a year and step into it: who was alive, how old they were, and what happened.</p>
      </div>

      {/* ── the dial ── */}
      <div className="tm-dial">
        <p className="tm-century">{ordinal(Math.floor((year - 1) / 100) + 1)} century</p>
        <div className="tm-year-row">
          <button className="icon-button" onClick={() => move(-1)} aria-label="One year earlier">
            ‹
          </button>
          <output className="tm-year" aria-live="polite">
            {year}
          </output>
          <button className="icon-button" onClick={() => move(1)} aria-label="One year later">
            ›
          </button>
        </div>

        <input
          className="tm-slider"
          type="range"
          min={FIRST_YEAR}
          max={CURRENT_YEAR}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="Year"
          style={{ '--fill': `${((year - FIRST_YEAR) / (CURRENT_YEAR - FIRST_YEAR)) * 100}%` }}
        />
        <div className="tm-scale" aria-hidden="true">
          {[1500, 1600, 1700, 1800, 1900, 2000].map((y) => (
            <span key={y} style={{ left: `${((y - FIRST_YEAR) / (CURRENT_YEAR - FIRST_YEAR)) * 100}%` }}>
              {y}
            </span>
          ))}
        </div>

        <div className="tm-stops">
          <span>Jump to</span>
          {STOPS.map((y) => (
            <button key={y} className={y === year ? 'active' : ''} onClick={() => setYear(y)}>
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="tm-columns">
        {/* ── the legends ── */}
        <div className="tm-panel">
          <h3>
            Legends alive in {year} <span>{alive.length}</span>
          </h3>
          {alive.length === 0 ? (
            <p className="tm-empty">
              {lastDied ? `None of our legends were alive in ${year}.` : 'None of our legends had been born yet.'}
              {lastDied && (
                <button className="tm-link" onClick={() => setYear(lastDied.died)}>
                  ← {lastDied.name} died in {lastDied.died}
                </button>
              )}
              {nextBorn && (
                <button className="tm-link" onClick={() => setYear(nextBorn.born)}>
                  {nextBorn.name} arrives in {nextBorn.born} →
                </button>
              )}
            </p>
          ) : (
            <ul className="tm-legends">
              {alive.map((p) => {
                const age = year - p.born
                const moment = momentIn(p, year)
                const badge = p.born === year ? 'Born this year' : p.died === year ? 'Died this year' : null
                return (
                  <li key={p.name}>
                    <button className={`tm-legend ${moment ? 'has-moment' : ''}`} onClick={() => onSelectPerson(p)}>
                      <img src={getPortrait(p)} alt="" width="52" height="60" loading="lazy" decoding="async" />
                      <span className="tm-legend-text">
                        <strong>{p.name}</strong>
                        <span>
                          {age === 0 ? 'Newborn' : `Age ${age}`}
                          {badge && <em>{badge}</em>}
                        </span>
                        {moment && <span className="tm-moment">{moment}</span>}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ── the events ── */}
        <div className="tm-panel">
          <h3>
            Happened in {year} {events && events.length > 0 && <span>{events.length}</span>}
          </h3>
          {!events ? (
            <ul className="tm-events loading" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} />
              ))}
            </ul>
          ) : events.length === 0 ? (
            <p className="tm-empty">
              No stored events for {year}.
              {nearby.map((y) => (
                <button key={y} className="tm-link" onClick={() => setYear(y)}>
                  Try {y} →
                </button>
              ))}
            </p>
          ) : (
            <ul className="tm-events">
              {events.map((item) => (
                <li key={item.d + item.i}>
                  <button onClick={() => openStory(item)}>
                    <span className="tm-date">{dayLabel(item.d)}</span>
                    <span className="tm-event-text">{item.t}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="history-credit">Events adapted from Wikipedia (CC BY-SA 4.0).</p>
        </div>
      </div>

      <EventDialog
        event={openEvent}
        date={openEvent ? dayLabel(openEvent.day) : ''}
        onClose={() => setOpenEvent(null)}
        onSelectPerson={onSelectPerson}
      />
    </section>
  )
}
