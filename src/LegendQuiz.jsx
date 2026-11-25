import { useState } from 'react'
import { personalities, getPortrait } from './data/personalities'
import './LegendQuiz.css'

const ROUNDS = 5
const MAX_SCORE = ROUNDS * 2

// Three ways to play. Every mode scores out of 10:
// 2 points without help, 1 point if you needed the hint.
const MODES = {
  clues: {
    label: 'Clues',
    intro: 'Read the clue and choose who it describes.',
    bestKey: 'legacy-quiz-best', // the original quiz's saved score
  },
  photo: {
    label: 'Photo',
    intro: 'A blurred portrait. Name the legend before it comes into focus.',
    bestKey: 'legacy-quiz-best-photo',
  },
  born: {
    label: 'Born first?',
    intro: 'Two legends. Pick the one who was born first.',
    bestKey: 'legacy-quiz-best-born',
  },
}

function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildRounds(mode) {
  if (mode === 'born') {
    // pairs born in different years, so there is always one right answer
    const rounds = []
    const pool = shuffle(personalities)
    for (let i = 0; i + 1 < pool.length && rounds.length < ROUNDS; i += 2) {
      const [a, b] = [pool[i], pool[i + 1]]
      if (a.born === b.born) continue
      rounds.push({ answer: a.born < b.born ? a : b, options: [a, b] })
    }
    return rounds
  }
  return shuffle(personalities)
    .slice(0, ROUNDS)
    .map((answer) => ({
      answer,
      options: shuffle([
        answer,
        ...shuffle(personalities.filter((p) => p.name !== answer.name)).slice(0, 3),
      ]),
    }))
}

function readBest(mode) {
  try {
    return Number(localStorage.getItem(MODES[mode].bestKey)) || 0
  } catch {
    return 0
  }
}

export default function LegendQuiz({ onSelectPerson }) {
  const [mode, setMode] = useState('clues')
  const [rounds, setRounds] = useState(() => buildRounds('clues'))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [picked, setPicked] = useState(null)
  const [best, setBest] = useState(() => readBest('clues'))
  const [started, setStarted] = useState(false)
  const [shared, setShared] = useState('')

  const finished = index >= rounds.length
  const round = rounds[index]
  const modeInfo = MODES[mode]

  const chooseMode = (next) => {
    setMode(next)
    setBest(readBest(next))
  }

  const begin = () => {
    setRounds(buildRounds(mode))
    setIndex(0)
    setScore(0)
    setPicked(null)
    setHintUsed(false)
    setStarted(true)
  }

  const pick = (option) => {
    if (picked) return
    setPicked(option.name)
    if (option.name === round.answer.name) {
      setScore((s) => s + (hintUsed ? 1 : 2))
    }
  }

  const next = () => {
    const nextIndex = index + 1
    setIndex(nextIndex)
    setPicked(null)
    setHintUsed(false)
    if (nextIndex >= rounds.length && score > best) {
      setBest(score)
      try {
        localStorage.setItem(modeInfo.bestKey, String(score))
      } catch {
        /* ignore */
      }
    }
  }

  // phones get the system share sheet; desktops copy the text instead
  const shareScore = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/quiz`
    const text = `I scored ${score}/${MAX_SCORE} on Legacy's "${modeInfo.label}" quiz. Can you beat me?`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Legacy quiz', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setShared('Copied — paste it anywhere')
    } catch (err) {
      if (err?.name === 'AbortError') return // closed the share sheet
      window.prompt('Copy your score:', `${text} ${url}`)
    }
    setTimeout(() => setShared(''), 2500)
  }

  const optionState = (option) => {
    if (!picked) return ''
    if (option.name === round.answer.name) return 'correct'
    if (option.name === picked) return 'wrong'
    return 'dim'
  }

  // the question part of a round, which is what differs between modes
  const renderQuestion = () => {
    if (mode === 'clues') {
      return (
        <div className="quiz-clues">
          {round.answer.clues.slice(0, hintUsed ? 2 : 1).map((clue, i) => (
            <p key={i}>
              <span>Clue {i + 1}</span>“{clue}”
            </p>
          ))}
        </div>
      )
    }
    if (mode === 'photo') {
      const blur = picked ? 0 : hintUsed ? 7 : 16
      return (
        <div className="quiz-photo">
          <img
            src={getPortrait(round.answer)}
            alt={picked ? `Portrait of ${round.answer.name}` : 'A blurred portrait of a legend'}
            width="240"
            height="274"
            style={{ filter: `blur(${blur}px) grayscale(${picked ? 0 : 0.4})` }}
            draggable="false"
          />
        </div>
      )
    }
    return <p className="quiz-born-question">Who was born first?</p>
  }

  const hintLabel =
    mode === 'clues' ? 'Show another clue' : mode === 'photo' ? 'Sharpen the photo' : null
  const canHint =
    hintLabel && !picked && !hintUsed && (mode !== 'clues' || round.answer.clues.length > 1)

  return (
    <section className="quiz-section" id="quiz">
      <div className="section-head">
        <h2>Guess the legend</h2>
        <p>
          {ROUNDS} rounds, three ways to play. 2 points when you get it
          straight away, 1 point if you needed a hint.
        </p>
      </div>

      <div className="quiz-card">
        {!started ? (
          <div className="quiz-start">
            <div className="quiz-modes" role="radiogroup" aria-label="Quiz mode">
              {Object.entries(MODES).map(([key, m]) => (
                <button
                  key={key}
                  role="radio"
                  aria-checked={mode === key}
                  className={`quiz-mode ${mode === key ? 'active' : ''}`}
                  onClick={() => chooseMode(key)}
                >
                  <strong>{m.label}</strong>
                  <span>{m.intro}</span>
                </button>
              ))}
            </div>
            <p className="quiz-best">Best score: {best} of {MAX_SCORE}</p>
            <button className="primary-button quiz-main-button" onClick={begin}>
              Start the quiz
            </button>
          </div>
        ) : finished ? (
          <div className="quiz-result">
            <p className="quiz-meta">Your score · {modeInfo.label}</p>
            <h3>
              {score} <span>/ {MAX_SCORE}</span>
            </h3>
            <p className="quiz-verdict">
              {score >= 9
                ? 'Legendary. You know your history.'
                : score >= 6
                  ? 'Impressive — a true history explorer.'
                  : score >= 3
                    ? 'Good start. Explore the legends and try again.'
                    : 'Every legend starts somewhere. Try again!'}
            </p>
            <p className="quiz-best">Best score: {Math.max(best, score)} of {MAX_SCORE}</p>
            <div className="quiz-result-buttons">
              <button className="primary-button quiz-main-button" onClick={begin}>
                Play again
              </button>
              <button className="secondary-button" onClick={shareScore}>
                {shared || 'Share your score'}
              </button>
              <button className="secondary-button" onClick={() => setStarted(false)}>
                Change mode
              </button>
            </div>
            <p className="visually-hidden" aria-live="polite">{shared}</p>
          </div>
        ) : (
          <>
            <div className="quiz-top">
              <span>
                {modeInfo.label} · Round {index + 1} of {rounds.length}
              </span>
              <span>Score: {score}</span>
            </div>

            <div className="quiz-progress">
              <i style={{ width: `${(index / rounds.length) * 100}%` }} />
            </div>

            {renderQuestion()}

            {mode === 'born' ? (
              <div className="quiz-options quiz-pair">
                {round.options.map((option) => (
                  <button
                    key={option.name}
                    className={`quiz-option quiz-person ${optionState(option)}`}
                    onClick={() => pick(option)}
                    disabled={Boolean(picked)}
                  >
                    <img src={getPortrait(option)} alt="" width="64" height="73" decoding="async" />
                    <span>
                      {option.name}
                      {picked && <small>Born {option.born}</small>}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="quiz-options">
                {round.options.map((option) => (
                  <button
                    key={option.name}
                    className={`quiz-option ${optionState(option)}`}
                    onClick={() => pick(option)}
                    disabled={Boolean(picked)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}

            <div className="quiz-actions">
              {canHint && <button onClick={() => setHintUsed(true)}>{hintLabel}</button>}

              {picked && (
                <>
                  <div className="quiz-reveal">
                    <img src={getPortrait(round.answer)} alt="" width="56" height="64" decoding="async" />
                    <p>
                      {picked === round.answer.name ? 'Correct — it’s ' : 'Not quite. It was '}
                      <strong>{round.answer.name}</strong>
                      {mode === 'born' && `, born ${round.answer.born}`}
                    </p>
                  </div>
                  <div className="quiz-reveal-buttons">
                    <button className="secondary-button" onClick={() => onSelectPerson(round.answer)}>
                      Read their story
                    </button>
                    <button className="primary-button quiz-main-button" onClick={next}>
                      {index + 1 === rounds.length ? 'See your score' : 'Next round'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
