import { useEffect, useState } from 'react'
import { isLiving } from './data/personalities'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
const VOICE_KEY = 'legacy-voice'
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

// English voices only, best-sounding first (natural/online voices are clearer)
function englishVoices() {
  const quality = (v) => (/natural|neural|google|online/i.test(v.name) ? 0 : 1)
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^en/i.test(v.lang))
    .sort((a, b) => quality(a) - quality(b) || a.name.localeCompare(b.name))
}

// "Microsoft Neerja Online (Natural) - English (India)" -> "Neerja (India, natural)"
function voiceLabel(v) {
  const region = /\(([^)]+)\)\s*$/.exec(v.name)?.[1] || v.lang
  const name = v.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, '')
    .replace(/\s+Online.*$/i, '')
    .replace(/\s*-\s*English.*$/i, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .trim()
  const natural = /natural|neural/i.test(v.name) ? ', natural' : ''
  return `${name || v.name} (${region.replace(/^English\s*/i, '')}${natural})`
}

export default function ListenButton({ person }) {
  const [state, setState] = useState('idle') // idle | playing | paused
  const [voices, setVoices] = useState(() => (supported ? englishVoices() : []))
  const [voiceURI, setVoiceURI] = useState(() => readSetting(VOICE_KEY, ''))
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

  const selectedVoice =
    voices.find((v) => v.voiceURI === voiceURI) ||
    voices.find((v) => /en-IN/i.test(v.lang) && /natural|google|neural/i.test(v.name)) ||
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices[0] ||
    null

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
  const changeVoice = (uri) => {
    setVoiceURI(uri)
    saveSetting(VOICE_KEY, uri)
    if (state !== 'idle') speak(voices.find((v) => v.voiceURI === uri), rate)
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
            <select
              value={selectedVoice?.voiceURI || ''}
              onChange={(e) => changeVoice(e.target.value)}
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {voiceLabel(v)}
                </option>
              ))}
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
