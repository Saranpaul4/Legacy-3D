import { useMemo, useState } from 'react'
import {
  personalities,
  getPortrait,
  formatYears,
  isLiving,
  CATEGORY_LABELS,
  CURRENT_YEAR,
} from './data/personalities'
import './LegendCompare.css'

const byName = (name) => personalities.find((p) => p.name === name)
const sortedNames = personalities.map((p) => p.name).sort((a, b) => a.localeCompare(b))

// One sentence about how two lives relate in time
function overlapSentence(a, b) {
  const aEnd = a.died ?? CURRENT_YEAR
  const bEnd = b.died ?? CURRENT_YEAR
  const shared = Math.min(aEnd, bEnd) - Math.max(a.born, b.born)

  if (shared > 0) {
    const bothAlive = a.died == null && b.died == null
    return bothAlive
      ? `Both are alive today, and their lives have overlapped for ${shared} years.`
      : `Their lives overlapped for ${shared} years.`
  }
  const [first, second] = a.born < b.born ? [a, b] : [b, a]
  const gap = second.born - first.died
  return `${second.name} was born ${gap} year${gap === 1 ? '' : 's'} after ${first.name} died.`
}

function ageText(p) {
  return isLiving(p) ? `${CURRENT_YEAR - p.born} (living)` : `${p.died - p.born} years`
}

function PersonColumn({ person, onSelectPerson }) {
  return (
    <div className="compare-person">
      <img
        src={getPortrait(person)}
        alt={`Portrait of ${person.name}`}
        width="140"
        height="160"
        loading="lazy"
        decoding="async"
      />
      <h3>{person.name}</h3>
      <p className="compare-role">{person.role}</p>
      <dl>
        <div>
          <dt>Field</dt>
          <dd>{CATEGORY_LABELS[person.category]}</dd>
        </div>
        <div>
          <dt>{isLiving(person) ? 'Born' : 'Lived'}</dt>
          <dd>{isLiving(person) ? person.born : formatYears(person)}</dd>
        </div>
        <div>
          <dt>{isLiving(person) ? 'Age' : 'Lifespan'}</dt>
          <dd>{ageText(person)}</dd>
        </div>
        <div>
          <dt>Birthplace</dt>
          <dd>{person.birthplace}</dd>
        </div>
        <div>
          <dt>Greatest achievement</dt>
          <dd>{person.achievement}</dd>
        </div>
      </dl>
      <button className="secondary-button" onClick={() => onSelectPerson(person)}>
        Read their story
      </button>
    </div>
  )
}

export default function LegendCompare({ onSelectPerson }) {
  const [leftName, setLeftName] = useState('Lionel Messi')
  const [rightName, setRightName] = useState('Cristiano Ronaldo')
  const left = byName(leftName) ?? personalities[0]
  const right = byName(rightName) ?? personalities[1]

  // merge both timelines into rows by year
  const rows = useMemo(() => {
    const map = new Map()
    const add = (side, items) =>
      (items || []).forEach(({ year, event }) => {
        const row = map.get(year) || { year, left: [], right: [] }
        row[side].push(event)
        map.set(year, row)
      })
    add('left', left.timeline)
    add('right', right.timeline)
    return [...map.values()].sort((a, b) => Number(a.year) - Number(b.year))
  }, [left, right])

  const swap = () => {
    setLeftName(right.name)
    setRightName(left.name)
  }

  const picker = (value, onChange, other, label) => (
    <label className="compare-select">
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {sortedNames.map((name) => (
          <option key={name} value={name} disabled={name === other}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <section className="compare-section" id="compare">
      <div className="section-head">
        <h2>Compare two legends</h2>
        <p>Choose any two people to see their lives side by side, year by year.</p>
      </div>

      <div className="compare-pickers">
        {picker(leftName, setLeftName, rightName, 'First legend')}
        <button className="icon-button" onClick={swap} aria-label="Swap the two legends">
          ⇄
        </button>
        {picker(rightName, setRightName, leftName, 'Second legend')}
      </div>

      <p className="compare-overlap">{overlapSentence(left, right)}</p>

      <div className="compare-grid">
        <PersonColumn person={left} onSelectPerson={onSelectPerson} />
        <PersonColumn person={right} onSelectPerson={onSelectPerson} />
      </div>

      <div className="compare-timeline">
        <h3>Their key moments, year by year</h3>
        <ol>
          {rows.map((row) => (
            <li key={row.year}>
              <div className="ct-left">
                {row.left.map((event) => (
                  <p key={event}>{event}</p>
                ))}
              </div>
              <span className="ct-year">{row.year}</span>
              <div className="ct-right">
                {row.right.map((event) => (
                  <p key={event}>{event}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
