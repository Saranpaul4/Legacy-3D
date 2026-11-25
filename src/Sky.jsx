import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import useInView from './hooks/useInView'
import {
  personalities,
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getPortrait,
  formatYears,
  isLiving,
} from './data/personalities'
import './Sky.css'

// ── Where the stars sit ───────────────────────────────────
// Every field is a constellation in its own part of the sky. Its stars
// run in order of birth, so each constellation reads left to right
// through time, and a line joins them like the old star charts.
const RADIUS = 30
const deg = (d) => (d * Math.PI) / 180

// a small, steady "random" number from a name, so the sky never reshuffles
const wobble = (text, salt) => {
  let h = salt
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) % 9973
  return (h / 9973) * 2 - 1 // -1 .. 1
}

const toSky = (azimuth, elevation) =>
  new THREE.Vector3(
    RADIUS * Math.cos(deg(elevation)) * Math.sin(deg(azimuth)),
    RADIUS * Math.sin(deg(elevation)),
    -RADIUS * Math.cos(deg(elevation)) * Math.cos(deg(azimuth))
  )

const CONSTELLATIONS = CATEGORIES.map((category, c) => {
  const members = personalities.filter((p) => p.category === category).sort((a, b) => a.born - b.born)
  const centreAz = c * (360 / CATEGORIES.length)
  const centreEl = c % 2 === 0 ? 8 : 26
  const stars = members.map((person, k) => {
    const az = centreAz + (k - (members.length - 1) / 2) * 9 + wobble(person.name, 7) * 3
    const el = centreEl + Math.sin(k * 1.7 + c) * 6 + wobble(person.name, 13) * 3
    return { person, position: toSky(az, el) }
  })
  return {
    category,
    color: CATEGORY_COLORS[category],
    stars,
    label: toSky(centreAz, centreEl + 14), // where its name is written
    centre: toSky(centreAz, centreEl + 4), // where the view turns to
  }
})

const ALL_STARS = CONSTELLATIONS.flatMap((c) => c.stars.map((s) => ({ ...s, color: c.color })))

// a soft round glow, drawn once and shared by every star
const GLOW = (() => {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.18)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
})()

function LegendStar({ star, selected, hovered, dimmed, onPick, onHover }) {
  const ref = useRef()
  const phase = useMemo(() => wobble(star.person.name, 3) * Math.PI, [star.person.name])

  useFrame(({ clock }) => {
    if (!ref.current) return
    // a gentle twinkle; the chosen star glows bigger
    const twinkle = 1 + Math.sin(clock.elapsedTime * 2.2 + phase) * 0.12
    const target = (selected ? 2.6 : hovered ? 2.1 : 1.5) * twinkle
    const s = ref.current.scale.x + (target - ref.current.scale.x) * 0.15
    ref.current.scale.set(s, s, s)
    ref.current.material.opacity += ((dimmed ? 0.25 : 1) - ref.current.material.opacity) * 0.1
  })

  return (
    <group position={star.position}>
      <sprite ref={ref} scale={1.5} raycast={() => null}>
        <spriteMaterial map={GLOW} color={star.color} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {/* an invisible, larger target so small stars are easy to click */}
      <sprite
        scale={3.6}
        onClick={(e) => {
          e.stopPropagation()
          onPick(star)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(star)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
      >
        <spriteMaterial transparent opacity={0} depthWrite={false} />
      </sprite>
    </group>
  )
}

// Keeps the name label (an ordinary element over the sky) next to the
// star you point at. 3D-anchored HTML labels clash with React 19, so the
// label is moved by hand each frame instead.
function LabelTracker({ star, labelRef }) {
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const el = labelRef.current
    if (!el) return
    if (!star) {
      el.style.opacity = '0'
      return
    }
    v.copy(star.position).project(camera)
    const behind = v.z > 1
    el.style.opacity = behind ? '0' : '1'
    el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -150%)`
  })
  return null
}

// a word written into the sky, used for each constellation's name
function SkyWord({ text, color, position, active, onClick }) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 96
    const ctx = c.getContext('2d')
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'italic 600 54px "Cormorant Garamond", Georgia, serif'
    ctx.fillText(text.toUpperCase().split('').join(String.fromCharCode(8202)), 256, 50, 500)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [text, color])
  return (
    <sprite
      position={position}
      scale={[8, 1.5, 1]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <spriteMaterial map={texture} transparent opacity={active ? 1 : 0.65} depthWrite={false} />
    </sprite>
  )
}

function ConstellationLines({ constellation, dimmed }) {
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(constellation.stars.map((s) => s.position)),
    [constellation]
  )
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={constellation.color} transparent opacity={dimmed ? 0.08 : 0.35} />
    </line>
  )
}

// turns the view smoothly towards whatever was chosen
function Aim({ target, controls }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    if (!target || !controls.current) return
    // the camera sits at the centre; we turn it by orbiting a point just
    // behind it, so the chosen spot drifts into the middle of the screen
    const wanted = target.clone().normalize().multiplyScalar(-0.01)
    // time-based, so it turns at the same speed on fast and slow screens
    camera.position.lerp(wanted, 1 - Math.exp(-Math.min(delta, 0.2) * 3.5))
    // keep the camera on its tiny sphere (and never exactly at the centre)
    if (camera.position.lengthSq() < 1e-10) camera.position.set(0, 0.001, 0.01)
    camera.position.setLength(0.01)
    controls.current.target.set(0, 0, 0)
    controls.current.update()
  })
  return null
}

export default function Sky({ onSelectPerson }) {
  const [chosen, setChosen] = useState(null) // a star
  const [field, setField] = useState(null) // a category to highlight
  const [aim, setAim] = useState(null)
  const [hovered, setHovered] = useState(null)
  const labelRef = useRef(null)
  const controls = useRef()
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef)

  const pick = (star) => {
    setChosen(star)
    setField(null)
    setAim(star.position)
  }

  const showField = (category) => {
    const c = CONSTELLATIONS.find((x) => x.category === category)
    setField(category)
    setChosen(null)
    setAim(c.centre)
  }

  // stop steering once the visitor drags the sky themselves
  const onStart = () => setAim(null)

  // Escape closes the card
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setChosen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const person = chosen?.person

  return (
    <section className="sky" id="sky" aria-label="Sky of Legends">
      <div className="sky-stage" ref={wrapRef}>
        <Canvas
          camera={{ position: [0, 0, 0.01], fov: 62, near: 0.01, far: 200 }}
          dpr={[1, 1.75]}
          frameloop={inView ? 'always' : 'never'}
          onPointerMissed={() => setChosen(null)}
        >
          <color attach="background" args={['#05070d']} />
          <Stars radius={90} depth={40} count={3500} factor={3} saturation={0} fade speed={0.6} />

          {CONSTELLATIONS.map((c) => (
            <ConstellationLines key={c.category} constellation={c} dimmed={field && field !== c.category} />
          ))}

          {ALL_STARS.map((star) => (
            <LegendStar
              key={star.person.name}
              star={star}
              selected={chosen?.person.name === star.person.name}
              hovered={hovered?.person.name === star.person.name}
              dimmed={field && field !== star.person.category}
              onPick={pick}
              onHover={setHovered}
            />
          ))}

          <LabelTracker star={hovered ?? chosen} labelRef={labelRef} />

          {CONSTELLATIONS.map((c) => (
            <SkyWord
              key={c.category}
              text={CATEGORY_LABELS[c.category]}
              color={c.color}
              position={c.label}
              active={field === c.category}
              onClick={() => showField(c.category)}
            />
          ))}

          <OrbitControls
            ref={controls}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={-0.35}
            autoRotate={!chosen && !aim}
            autoRotateSpeed={0.25}
            onStart={onStart}
          />
          <Aim target={aim} controls={controls} />
        </Canvas>

        {/* the name of the star you point at; LabelTracker moves it */}
        <div className="sky-label" ref={labelRef} aria-hidden="true">
          <strong>{(hovered ?? chosen)?.person.name}</strong>
          <span>
            {(hovered ?? chosen) &&
              (isLiving((hovered ?? chosen).person)
                ? `Born ${(hovered ?? chosen).person.born}`
                : formatYears((hovered ?? chosen).person))}
          </span>
        </div>

        <div className="sky-intro">
          <p className="sky-kicker">Sky of Legends</p>
          <h2>Every legend is a star</h2>
          <p>Drag to look around. Each field is a constellation, its stars joined in order of birth.</p>
        </div>

        <div className="sky-fields" role="group" aria-label="Find a constellation">
          {CONSTELLATIONS.map((c) => (
            <button
              key={c.category}
              className={field === c.category ? 'active' : ''}
              onClick={() => showField(c.category)}
            >
              <i style={{ background: c.color }} aria-hidden />
              {CATEGORY_LABELS[c.category]}
            </button>
          ))}
        </div>

        {person && (
          <div className="sky-card" key={person.name}>
            <img src={getPortrait(person)} alt="" width="84" height="96" decoding="async" />
            <div>
              <p className="sky-kicker" style={{ color: CATEGORY_COLORS[person.category] }}>
                {CATEGORY_LABELS[person.category]} · {isLiving(person) ? `Born ${person.born}` : formatYears(person)}
              </p>
              <h3>{person.name}</h3>
              <p>{person.quote ? `“${person.quote.text}”` : person.title}</p>
              <div className="sky-card-actions">
                <button className="primary-button" onClick={() => onSelectPerson(person)}>
                  Read their story
                </button>
                <button className="secondary-button" onClick={() => setChosen(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
