import { useEffect, useMemo, useRef, useState } from 'react'
import {
  personalities,
  CATEGORIES,
  CATEGORY_COLORS,
  formatYears,
  isLiving,
  CURRENT_YEAR,
  CATEGORY_LABELS,
} from './data/personalities'
import './LegendTimeline.css'

const START = 1440
const END = 2030
const PX_PER_YEAR = 4.2
const LABEL_SPACE_YEARS = 62 // keeps names on one lane from overlapping

// Put each lifespan on the first "lane" where it doesn't collide
function packIntoLanes(people) {
  const laneEnds = []
  return people.map((person) => {
    const end = Math.max(person.died ?? CURRENT_YEAR, person.born + LABEL_SPACE_YEARS)
    let lane = laneEnds.findIndex((laneEnd) => laneEnd < person.born)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(end)
    } else {
      laneEnds[lane] = end
    }
    return { person, lane }
  })
}

export default function LegendTimeline({ onSelectPerson }) {
  const [filter, setFilter] = useState('ALL')
  const scrollRef = useRef(null)

  // open the timeline on the 1800s onward, where most legends are,
  // instead of the near-empty 1400s (wide screens just scroll to the end)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = Math.min((1800 - START) * PX_PER_YEAR, el.scrollWidth - el.clientWidth)
  }, [])

  const rows = useMemo(() => {
    const visible = personalities
      .filter(
        (p) =>
          filter === 'ALL' ||
          (filter === 'LIVING' ? isLiving(p) : p.category === filter)
      )
      .sort((a, b) => a.born - b.born)
    return packIntoLanes(visible)
  }, [filter])

  const laneCount = Math.max(1, ...rows.map((r) => r.lane + 1))
  const width = (END - START) * PX_PER_YEAR
  const ticks = []
  for (let y = 1450; y <= 2000; y += 50) ticks.push(y)

  return (
    <section className="timeline-hub" id="timeline">
      <div className="section-head">
        <h2>Six centuries, one line</h2>
        <p>
          Each bar is a lifetime. Scroll sideways to travel through time and
          select a name to open that person’s story.
        </p>
      </div>

      <div className="filter-tabs" role="group" aria-label="Filter the timeline">
        {['ALL', ...CATEGORIES, 'LIVING'].map((c) => (
          <button
            key={c}
            className={filter === c ? 'active' : ''}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {CATEGORY_COLORS[c] && (
              <i style={{ background: CATEGORY_COLORS[c] }} aria-hidden />
            )}
            {c === 'ALL' ? 'All' : c === 'LIVING' ? 'Living legends' : CATEGORY_LABELS[c]}
            <span className="filter-count">
              {c === 'ALL'
                ? personalities.length
                : c === 'LIVING'
                  ? personalities.filter(isLiving).length
                  : personalities.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="timeline-hub-scroll" ref={scrollRef}>
        <div
          className="timeline-hub-track"
          style={{ width, height: 70 + laneCount * 58 }}
        >
          {ticks.map((year) => (
            <div
              key={year}
              className={`timeline-hub-tick ${year % 100 === 0 ? 'major' : ''}`}
              style={{ left: (year - START) * PX_PER_YEAR }}
            >
              <span>{year}</span>
            </div>
          ))}

          {rows.map(({ person, lane }) => {
            const color = CATEGORY_COLORS[person.category]
            return (
              <button
                key={person.name}
                className={`timeline-hub-bar ${isLiving(person) ? 'living' : ''}`}
                title={`${person.name}, ${formatYears(person)}`}
                onClick={() => onSelectPerson(person)}
                style={{
                  left: (person.born - START) * PX_PER_YEAR,
                  top: 50 + lane * 58,
                  '--bar-width': `${((person.died ?? CURRENT_YEAR) - person.born) * PX_PER_YEAR}px`,
                  '--bar-color': color,
                }}
              >
                <span className="timeline-hub-line" />
                <span className="timeline-hub-label">
                  {person.name}
                  <small>{formatYears(person)}</small>
                </span>
              </button>
            )
          })}
        </div>
      </div>

    </section>
  )
}
