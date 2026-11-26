import { useEffect, useState } from 'react'
import { isLiving } from './data/personalities'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
const VOICE_KEY = 'legacy-voice-gender'
const RATE_KEY = 'legacy-voice-rate'

const RATES = [
  { value: 0.8, label: 'Slow' },
  { value: 0.95, label: 'Normal' },
  { value: 1.15, label: 'Fast' },
]

// The story as one script for the browser's built-in voice
function storyText(person) {
  const years = isLiving(person)
    ? `born in ${person.born}`
    : `who lived from ${person.born} to ${person.died}`
  return [
    `${person.name}, ${years}.`,
    `${person.title}.`,
    person.description,
    `Early life. ${person.earlyLife}`,
    `Greatest achievement. ${person.achievement}.`,
    `Legacy. ${person.legacy}`,
  ].join(' ')
}

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

// English voices only
function englishVoices() {
  return window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang))
}

// Known first names, so one female and one male voice can be picked automatically
const FEMALE = /neerja|aria|jenny|sonia|libby|natasha|heera|zira|samantha|female|hazel|susan/i
const MALE = /prabhat|guy|ryan|davis|christopher|eric|ravi|mark|david|daniel|male/i

// The best installed voice for a gender: natural/online first, Indian English next
function pickVoice(voices, gender) {
  const wanted = gender === 'male' ? MALE : FEMALE
  const other = gender === 'male' ? FEMALE : MALE
  const score = (v) =>
    (/natural|neural|online/i.test(v.name) ? 0 : 10) +
    (/en-IN/i.test(v.lang) ? 0 : 2) +
    (/google/i.test(v.name) ? 1 : 0)
  const matches = voices.filter((v) => wanted.test(v.name) && !other.test(v.name.replace(wanted, '')))
  const pool = matches.length ? matches : voices.filter((v) => wanted.test(v.name))
  return [...pool].sort((a, b) => score(a) - score(b))[0] || null
}

export default function ListenButton({ person }) {
  const [state, setState] = useState('idle') // idle | playing | paused
  const [voices, setVoices] = useState(() => (supported ? englishVoices() : []))
  const [gender, setGender] = useState(() => readSetting(VOICE_KEY, 'female'))
  const [rate, setRate] = useState(() => Number(readSetting(RATE_KEY, 0.95)))

  // voices often arrive a moment after the page loads
  useEffect(() => {
    if (!supported) return
    const update = () => setVoices(englishVoices())
    update()
    window.speechSynthesis.addEventListener('voiceschanged', update)
    // some browsers never fire the event, so check a few more times
    let tries = 0
    const timer = setInterval(() => {
      update()
      if (++tries >= 10 || window.speechSynthesis.getVoices().length) clearInterval(timer)
    }, 300)
    return () => {
      clearInterval(timer)
      window.speechSynthesis.removeEventListener('voiceschanged', update)
      window.speechSynthesis.cancel() // stop speaking when this story closes
    }
  }, [])

  if (!supported) return null

  const voiceFor = (g) => pickVoice(voices, g) || voices[0] || null
  const selectedVoice = voiceFor(gender)

  const speak = (voice = selectedVoice, speed = rate) => {
    const synth = window.speechSynthesis
    synth.cancel()
    // speak sentence by sentence: Chrome stops long single utterances
    const text = storyText(person)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    sentences.forEach((sentence, i) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim())
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      }
      utterance.rate = speed
      if (i === sentences.length - 1) utterance.onend = () => setState('idle')
      utterance.onerror = (e) =>
        e.error !== 'interrupted' && e.error !== 'canceled' && setState('idle')
      synth.speak(utterance)
    })
    setState('playing')
  }

  const play = () => {
    if (state === 'paused') {
      window.speechSynthesis.resume()
      setState('playing')
    } else {
      speak()
    }
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setState('paused')
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setState('idle')
  }

  // changing the voice or speed while it's talking restarts with the new setting
  const changeVoice = (g) => {
    setGender(g)
    saveSetting(VOICE_KEY, g)
    if (state !== 'idle') speak(voiceFor(g), rate)
  }

  const changeRate = (value) => {
    setRate(value)
    saveSetting(RATE_KEY, value)
    if (state !== 'idle') speak(selectedVoice, value)
  }

  return (
    <div className="listen" role="group" aria-label="Listen to this story">
      <div className="listen-controls">
        {state === 'playing' ? (
          <button className="secondary-button" onClick={pause}>
            <span aria-hidden="true">❚❚</span> Pause
          </button>
        ) : (
          <button className="secondary-button" onClick={play}>
            <span aria-hidden="true">▶</span>{' '}
            {state === 'paused' ? 'Resume' : 'Listen to their story'}
          </button>
        )}
        {state !== 'idle' && (
          <button className="listen-stop" onClick={stop}>
            Stop
          </button>
        )}
        {state === 'playing' && (
          <span className="listen-wave" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </div>

      {voices.length > 0 && (
        <div className="listen-settings">
          <label>
            <span>Voice</span>
            <select value={gender} onChange={(e) => changeVoice(e.target.value)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>

          <label>
            <span>Speed</span>
            <select value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
              {RATES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}
