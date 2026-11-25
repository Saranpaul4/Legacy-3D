import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import useInView from './hooks/useInView'
import { personalities, getPortrait, formatYears, isLiving, CATEGORY_LABELS } from './data/personalities'
import './Museum.css'

// ── The hall ──────────────────────────────────────────────
// Portraits hang in order of birth, alternating left and right walls,
// so walking forward is walking through time.
const STEP = 3.2 // distance along the hall between one portrait and the next
const WALL_X = 3.3
const EYE = 1.65
const PORTRAIT_W = 1.4
const PORTRAIT_H = 1.6
const HANG_Y = 1.75

const legends = [...personalities].sort((a, b) => a.born - b.born)

// ── Audio guide ───────────────────────────────────────────
// Like a museum headset: a short introduction read aloud at each
// portrait, in the voice and speed chosen on the story pages.
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
const GUIDE_KEY = 'legacy-audio-guide'

function guideScript(person) {
  const years = isLiving(person) ? `born in ${person.born}` : `${person.born} to ${person.died}`
  return `${person.name}, ${years}. ${person.title}. ${person.description}`
}

function speak(text) {
  if (!canSpeak) return
  const synth = window.speechSynthesis
  synth.cancel()
  const line = new SpeechSynthesisUtterance(text)
  try {
    const voiceURI = localStorage.getItem('legacy-voice')
    const voice = synth.getVoices().find((v) => v.voiceURI === voiceURI)
    if (voice) line.voice = voice
    line.rate = Number(localStorage.getItem('legacy-voice-rate')) || 0.95
  } catch {
    /* storage unavailable: the browser's default voice is fine */
  }
  synth.speak(line)
}
const HALL_LENGTH = legends.length * STEP + 12

const placeOf = (i) => {
  const side = i % 2 === 0 ? -1 : 1 // -1 = left wall, 1 = right wall
  return { side, z: -i * STEP - 4 }
}

const PALETTES = {
  dark: { wall: '#2c2e39', floor: '#121318', ceiling: '#17181e', fog: '#0f1117', trim: '#c6a15b', plaque: '#c6a15b', plaqueText: '#17130b' },
  light: { wall: '#e7dfcf', floor: '#b9ae99', ceiling: '#f1ebdf', fog: '#f5f1e8', trim: '#8a6726', plaque: '#8a6726', plaqueText: '#fbf7ee' },
}

// a small brass plaque with the name and years, drawn on a canvas
function usePlaque(person, palette) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = palette.plaque
    ctx.fillRect(0, 0, 512, 128)
    ctx.fillStyle = palette.plaqueText
    ctx.textAlign = 'center'
    ctx.font = '600 46px "Cormorant Garamond", Georgia, serif'
    ctx.fillText(person.name, 256, 58, 480)
    ctx.font = '500 26px Manrope, "Segoe UI", sans-serif'
    ctx.fillText(isLiving(person) ? `Born ${person.born}` : formatYears(person), 256, 100, 480)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [person, palette])
}

function PortraitImage({ person }) {
  const texture = useTexture(getPortrait(person))
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh position={[0, 0, 0.012]}>
      <planeGeometry args={[PORTRAIT_W, PORTRAIT_H]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

function Portrait({ person, index, active, palette, onSelect }) {
  const { side, z } = placeOf(index)
  const plaque = usePlaque(person, palette)
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    // the picture light brightens on the portrait you're standing at
    const m = glowRef.current?.material
    if (m) m.opacity += ((active ? 0.32 : hovered ? 0.2 : 0.1) - m.opacity) * Math.min(1, delta * 4)
  })

  return (
    <group position={[side * (WALL_X - 0.02), HANG_Y, z]} rotation={[0, -side * (Math.PI / 2), 0]}>
      {/* soft cone of light from the lamp above */}
      <mesh ref={glowRef} position={[0, 0.35, 0.002]}>
        <planeGeometry args={[2.4, 2.9]} />
        <meshBasicMaterial color="#ffe3a8" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} alphaMap={GLOW_MAP} />
      </mesh>

      {/* gilt frame */}
      <mesh
        position={[0, 0, -0.02]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(index)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
      >
        <boxGeometry args={[PORTRAIT_W + 0.2, PORTRAIT_H + 0.2, 0.05]} />
        <meshStandardMaterial color={palette.trim} metalness={0.7} roughness={0.35} />
      </mesh>

      <Suspense fallback={null}>
        <PortraitImage person={person} />
      </Suspense>

      {/* picture lamp */}
      <mesh position={[0, PORTRAIT_H / 2 + 0.22, 0.12]}>
        <boxGeometry args={[0.6, 0.05, 0.12]} />
        <meshStandardMaterial color={palette.trim} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* name plaque */}
      <mesh position={[0, -PORTRAIT_H / 2 - 0.32, 0.02]}>
        <planeGeometry args={[0.9, 0.225]} />
        <meshBasicMaterial map={plaque} toneMapped={false} />
      </mesh>
    </group>
  )
}

// a radial fade used to make the lamp glow soft-edged
const GLOW_MAP = (() => {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d').createRadialGradient(64, 40, 4, 64, 64, 64)
  g.addColorStop(0, '#fff')
  g.addColorStop(1, '#000')
  const ctx = c.getContext('2d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
})()

function Hall({ palette }) {
  const mid = -HALL_LENGTH / 2 + 6
  return (
    <group>
      {/* floor, a little glossy */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, mid]}>
        <planeGeometry args={[WALL_X * 2, HALL_LENGTH]} />
        <meshStandardMaterial color={palette.floor} roughness={0.38} metalness={0.25} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, mid]}>
        <planeGeometry args={[WALL_X * 2, HALL_LENGTH]} />
        <meshStandardMaterial color={palette.ceiling} roughness={1} />
      </mesh>
      {/* walls */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh rotation={[0, -side * (Math.PI / 2), 0]} position={[side * WALL_X, 2.1, mid]}>
            <planeGeometry args={[HALL_LENGTH, 4.2]} />
            <meshStandardMaterial color={palette.wall} roughness={0.95} />
          </mesh>
          {/* brass rail along each wall */}
          <mesh position={[side * (WALL_X - 0.03), 0.9, mid]}>
            <boxGeometry args={[0.03, 0.04, HALL_LENGTH]} />
            <meshStandardMaterial color={palette.trim} metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      ))}
      {/* the far wall closes the hall */}
      <mesh position={[0, 2.1, -HALL_LENGTH + 6]}>
        <planeGeometry args={[WALL_X * 2, 4.2]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
    </group>
  )
}

// moves the visitor smoothly from portrait to portrait
function Walker({ current }) {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(0, EYE, -20))

  useEffect(() => {
    camera.fov = size.width < size.height ? 62 : 50
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((_, delta) => {
    let pos
    let target
    if (current < 0) {
      // the entrance: looking down the whole hall
      pos = new THREE.Vector3(0, EYE, 3)
      target = new THREE.Vector3(0, EYE, -30)
    } else {
      const { side, z } = placeOf(current)
      // stand back a little and to the side, so the hall stretches away
      pos = new THREE.Vector3(-side * 1.1, EYE, z + 2.3)
      target = new THREE.Vector3(side * WALL_X, HANG_Y - 0.1, z - 0.3)
    }
    const k = 1 - Math.exp(-delta * 2.6) // unhurried, like walking
    camera.position.lerp(pos, k)
    look.current.lerp(target, k)
    camera.lookAt(look.current)
  })
  return null
}

export default function Museum({ onSelectPerson, theme = 'dark' }) {
  const [current, setCurrent] = useState(-1) // -1 = standing at the entrance
  const [guideOn, setGuideOn] = useState(() => {
    try {
      return canSpeak && localStorage.getItem(GUIDE_KEY) === 'on'
    } catch {
      return false
    }
  })
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef)
  const palette = PALETTES[theme === 'light' ? 'light' : 'dark']
  const person = current >= 0 ? legends[current] : null

  const go = (i) => setCurrent(Math.max(-1, Math.min(legends.length - 1, i)))

  // the guide speaks whenever you arrive at a portrait
  useEffect(() => {
    if (!guideOn || current < 0) return
    // a short pause, so walking quickly past portraits doesn't start every one
    const timer = setTimeout(() => speak(guideScript(legends[current])), 700)
    return () => clearTimeout(timer)
  }, [guideOn, current])

  // silence when the guide is switched off or you leave the museum
  useEffect(() => {
    if (!guideOn && canSpeak) window.speechSynthesis.cancel()
    try {
      localStorage.setItem(GUIDE_KEY, guideOn ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [guideOn])
  useEffect(() => () => canSpeak && window.speechSynthesis.cancel(), [])

  // arrow keys walk the hall
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, dialog')) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setCurrent((c) => Math.min(legends.length - 1, c + 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setCurrent((c) => Math.max(-1, c - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // the scroll wheel walks too, one portrait per flick
  const lastWheel = useRef(0)
  const onWheel = (e) => {
    const now = performance.now()
    if (now - lastWheel.current < 450 || Math.abs(e.deltaY) < 8) return
    lastWheel.current = now
    setCurrent((c) => Math.max(-1, Math.min(legends.length - 1, c + (e.deltaY > 0 ? 1 : -1))))
  }

  // and a sideways swipe on phones
  const touch = useRef(null)
  const onTouchStart = (e) => (touch.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    touch.current = null
    if (Math.abs(dx) > 40) setCurrent((c) => Math.max(-1, Math.min(legends.length - 1, c + (dx < 0 ? 1 : -1))))
  }

  return (
    <section className="museum" id="museum" aria-label="The Legacy museum">
      <div
        className="museum-stage"
        ref={wrapRef}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Canvas
          camera={{ position: [0, EYE, 3], fov: 50, near: 0.1, far: 80 }}
          dpr={[1, 1.75]}
          frameloop={inView ? 'always' : 'never'}
          onPointerMissed={() => (document.body.style.cursor = '')}
        >
          <color attach="background" args={[palette.fog]} />
          <fog attach="fog" args={[palette.fog, 8, 30]} />
          <ambientLight intensity={theme === 'light' ? 1.5 : 1.3} />
          <hemisphereLight args={['#fff1d6', palette.floor, 1.1]} />
          <Walker current={current} />
          <Hall palette={palette} />
          {legends.map((p, i) => (
            <Portrait
              key={p.name}
              person={p}
              index={i}
              active={i === current}
              palette={palette}
              onSelect={go}
            />
          ))}
        </Canvas>

        {/* ── what you see over the hall ── */}
        {current < 0 ? (
          <div className="museum-welcome">
            <p className="museum-kicker">The Legacy museum</p>
            <h2>Walk through six centuries</h2>
            <p>
              {legends.length} portraits hang in the order they were born, from{' '}
              {legends[0].name} to {legends[legends.length - 1].name}.
            </p>
            <button className="primary-button" onClick={() => go(0)}>
              Enter the hall
            </button>
            <p className="museum-help">Use the arrows, your scroll wheel, or swipe to walk.</p>
            {canSpeak && (
              <p className="museum-help">Switch on the 🎧 audio guide below to hear about each portrait.</p>
            )}
          </div>
        ) : (
          <div className="museum-card" key={person.name}>
            <p className="museum-kicker">
              {CATEGORY_LABELS[person.category]} · {isLiving(person) ? `Born ${person.born}` : formatYears(person)}
            </p>
            <h2>{person.name}</h2>
            <p>{person.title}</p>
            <button className="secondary-button" onClick={() => onSelectPerson(person)}>
              Read their story
            </button>
          </div>
        )}

        <div className="museum-controls">
          <button className="icon-button" onClick={() => go(current - 1)} disabled={current < 0} aria-label="Walk back">
            ←
          </button>
          <span aria-live="polite">{current < 0 ? 'Entrance' : `${current + 1} of ${legends.length}`}</span>
          <button
            className="icon-button"
            onClick={() => go(current + 1)}
            disabled={current >= legends.length - 1}
            aria-label="Walk forward"
          >
            →
          </button>
          {canSpeak && (
            <button
              className={`museum-guide ${guideOn ? 'on' : ''}`}
              onClick={() => setGuideOn((on) => !on)}
              aria-pressed={guideOn}
              title={guideOn ? 'Turn the audio guide off' : 'Turn the audio guide on'}
              aria-label={guideOn ? 'Audio guide on' : 'Audio guide'}
            >
              <span aria-hidden="true">🎧</span>
              <span className="museum-guide-text">{guideOn ? 'Guide on' : 'Audio guide'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
