import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Image, useTexture } from '@react-three/drei'
import { Suspense, startTransition, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import useInView from './hooks/useInView'
import * as THREE from 'three'
import {
  personalities,
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatYears,
  getPortrait,
  isLiving,
} from './data/personalities'

const FILTERS = ['ALL', ...CATEGORIES, 'LIVING', 'FAVOURITES']

const SPACING = 4.8 // distance between neighbouring portraits
const FRAME_DIM = new THREE.Color('#3a3528')
const FRAME_LIT = new THREE.Color('#b8955a')

// Where a card should rest, by its distance from the centre:
// 0 = the featured portrait, ±1 = the neighbours, ±2 = just out of view
function slotFor(offset) {
  const away = Math.abs(offset)
  return {
    x: offset * SPACING,
    z: away === 0 ? 0 : away === 1 ? -2.8 : -4,
    rotationY: offset === 0 ? 0 : offset < 0 ? 0.35 : -0.35,
    scale: away === 0 ? 1.08 : away === 1 ? 0.86 : 0.6,
    opacity: away === 0 ? 1 : away === 1 ? 0.55 : 0,
    grayscale: away === 0 ? 0 : 0.6,
  }
}

// One card per person. It keeps its identity as the gallery moves, so
// pressing "next" makes every card glide one slot to the side instead of
// the photos swapping in place.
function PersonalityCard({ person, offset, onClick }) {
  const cardRef = useRef()
  const frameRef = useRef()
  const imageRef = useRef()
  const [hovered, setHovered] = useState(false)
  const reachable = Math.abs(offset) <= 1
  // cards start in their slot (entering ones are invisible there)
  const [initial] = useState(() => {
    const slot = slotFor(offset)
    return { position: [slot.x, 0, slot.z], rotation: [0, slot.rotationY, 0], scale: slot.scale }
  })

  useFrame((_, delta) => {
    const card = cardRef.current
    if (!card) return
    const slot = slotFor(offset)
    // frame-rate independent easing: the same feel at 60 or 144 fps
    const k = 1 - Math.exp(-delta * 7)

    // a card that wraps round the loop jumps instead of crossing the stage
    if (Math.abs(slot.x - card.position.x) > SPACING * 2.5) card.position.x = slot.x
    card.position.x += (slot.x - card.position.x) * k
    card.position.z += (slot.z - card.position.z) * k
    card.rotation.y += (slot.rotationY - card.rotation.y) * k

    const targetScale = hovered && offset !== 0 ? 0.92 : slot.scale
    const s = card.scale.x + (targetScale - card.scale.x) * k
    card.scale.set(s, s, s)

    const frame = frameRef.current?.material
    if (frame) {
      frame.opacity += (Math.min(1, slot.opacity * 2) - frame.opacity) * k
      frame.color.lerp(offset === 0 ? FRAME_LIT : FRAME_DIM, k)
    }
    const image = imageRef.current?.material
    if (image) {
      image.opacity += (slot.opacity - image.opacity) * k
      image.grayscale += (slot.grayscale - image.grayscale) * k
    }
    card.visible = (frame?.opacity ?? 1) > 0.01
  })

  return (
    <group
      ref={cardRef}
      position={initial.position}
      rotation={initial.rotation}
      scale={initial.scale}
      onClick={(e) => {
        if (!reachable) return
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => {
        if (!reachable) return
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ''
      }}
    >
      <Float speed={1.4} floatIntensity={0.25} rotationIntensity={0.05}>
        {/* brass frame */}
        <mesh ref={frameRef} position={[0, 0.2, -0.02]}>
          <planeGeometry args={[3.72, 4.22]} />
          <meshBasicMaterial color={FRAME_DIM} transparent opacity={0} />
        </mesh>

        {/* a photo that is still loading waits here, inside its own frame,
            instead of blanking the whole gallery */}
        <Suspense fallback={null}>
          <Image
            ref={imageRef}
            url={getPortrait(person)}
            position={[0, 0.2, 0]}
            scale={[3.5, 4.0]}
            transparent
            opacity={0}
            grayscale={0.6}
          />
        </Suspense>
      </Float>
    </group>
  )
}

// soft "gallery spotlight" behind the featured portrait
function Spotlight() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.035 + Math.sin(state.clock.elapsedTime * 1.2) * 0.01
  })
  return (
    <mesh ref={ref} position={[0, 0.2, -0.3]}>
      <circleGeometry args={[2.6, 64]} />
      <meshBasicMaterial
        color="#e8c98a"
        transparent
        opacity={0.035}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function PersonalityGallery({
  onSelectPerson,
  initialCategory = 'ALL',
  isFavourite,
  toggleFavourite,
  favouriteCount = 0,
}) {
  const [selected, setSelectedNow] = useState(0)
  // a transition keeps the current portraits on screen until the next
  // photo is ready, so switching never flashes an empty gallery
  const setSelected = (index) => startTransition(() => setSelectedNow(index))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const galleryRef = useRef(null)
  const canvasWrapRef = useRef(null)
  const canvasInView = useInView(canvasWrapRef)

  // load every portrait in the background once the page is idle,
  // so moving through the gallery never has to wait for a download
  useEffect(() => {
    const preload = () => personalities.forEach((p) => useTexture.preload(getPortrait(p)))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preload, 1500)
    return () => clearTimeout(id)
  }, [])

  // fade the portraits in when the selection changes
  useEffect(() => {
    if (!galleryRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-meta',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }, galleryRef)
    return () => ctx.revert()
  }, [selected, selectedCategory])

  const filteredPersonalities = personalities.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'FAVOURITES'
        ? isFavourite(person.name)
        : selectedCategory === 'LIVING'
          ? isLiving(person)
          : person.category === selectedCategory)
    return matchesSearch && matchesCategory
  })

  const total = filteredPersonalities.length
  const isEmpty = total === 0
  const current = Math.max(0, Math.min(selected, total - 1))
  const person = filteredPersonalities[current]
  const prevIndex = (current - 1 + total) % total
  const nextIndex = (current + 1) % total

  // Every person within two places of the centre, measured around the
  // loop, so going from the last legend to the first still slides forward.
  const visibleCards = filteredPersonalities
    .map((p, index) => {
      let offset = (index - current + total) % total
      if (offset > total / 2) offset -= total
      return { person: p, index, offset }
    })
    .filter(({ offset }) => Math.abs(offset) <= 2 && (total > 2 || offset >= 0))

  const filterLabel = (category) => {
    if (category === 'ALL') return 'All'
    if (category === 'LIVING') return 'Living legends'
    if (category === 'FAVOURITES') return 'Favourites'
    return CATEGORY_LABELS[category]
  }

  const filterCount = (category) => {
    if (category === 'ALL') return personalities.length
    if (category === 'LIVING') return personalities.filter(isLiving).length
    if (category === 'FAVOURITES') return favouriteCount
    return personalities.filter((p) => p.category === category).length
  }

  // swipe left/right on the portraits (phones and tablets)
  const swipeStart = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    swipeStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start || isEmpty) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    // a clear sideways move; a mostly-vertical one is the page scrolling
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    setSelected(dx < 0 ? nextIndex : prevIndex)
  }

  // arrow keys move through the gallery
  const onKeyDown = (e) => {
    if (isEmpty || e.target.tagName === 'INPUT') return
    if (e.key === 'ArrowLeft') setSelected(prevIndex)
    if (e.key === 'ArrowRight') setSelected(nextIndex)
  }

  return (
    <section
      className="personality-section"
      id="personalities"
      ref={galleryRef}
      onKeyDown={onKeyDown}
    >
      <div className="section-head centered">
        <h2>Meet the legends</h2>
        <p>Search by name or pick a field, then open any portrait to read their story.</p>
      </div>

      <div className="gallery-toolbar">
        <label className="personality-search">
          <span className="visually-hidden">Search legends</span>
          <input
            type="search"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSelected(0)
            }}
          />
        </label>

        <div className="filter-tabs" role="group" aria-label="Filter legends">
          {FILTERS.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              aria-pressed={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category)
                setSelected(0)
              }}
            >
              {CATEGORY_COLORS[category] && (
                <i style={{ background: CATEGORY_COLORS[category] }} aria-hidden />
              )}
              {category === 'FAVOURITES' && <i className="filter-heart" aria-hidden>♥</i>}
              {filterLabel(category)}
              <span className="filter-count">{filterCount(category)}</span>
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="gallery-empty" id="gallery-portraits">
          <h3>
            {selectedCategory === 'FAVOURITES' && !searchTerm
              ? 'No favourites yet'
              : 'No legends match your search'}
          </h3>
          <p>
            {selectedCategory === 'FAVOURITES' && !searchTerm
              ? 'Open any legend and choose “Save to favourites” to keep them here.'
              : 'Check the spelling, or choose “All” to search every field.'}
          </p>
        </div>
      ) : (
        <>
          <div
            className="gallery-canvas"
            id="gallery-portraits"
            ref={canvasWrapRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              dpr={[1, 2]}
              frameloop={canvasInView ? 'always' : 'never'}
            >
              <ambientLight intensity={1.6} />

              <Spotlight />

              {visibleCards.map(({ person: p, index, offset }) => (
                <PersonalityCard
                  key={p.name}
                  person={p}
                  offset={offset}
                  onClick={() => (offset === 0 ? onSelectPerson(p) : setSelected(index))}
                />
              ))}
            </Canvas>
          </div>

          <div className="gallery-meta">
            <h3>{person.name}</h3>
            <p className="gallery-role">
              {person.role}, {isLiving(person) ? `born ${person.born}` : formatYears(person)}
            </p>
          </div>

          <div className="gallery-controls">
            <button
              className="icon-button"
              onClick={() => setSelected(prevIndex)}
              aria-label="Previous legend"
            >
              ←
            </button>

            <span className="gallery-count" aria-live="polite">
              {current + 1} of {total}
            </span>

            <button
              className="icon-button"
              onClick={() => setSelected(nextIndex)}
              aria-label="Next legend"
            >
              →
            </button>
          </div>

          <div className="gallery-actions">
            <button className="primary-button" onClick={() => onSelectPerson(person)}>
              Read their story
            </button>
            <button
              className={`favourite-button ${isFavourite(person.name) ? 'saved' : ''}`}
              onClick={() => toggleFavourite(person.name)}
              aria-pressed={isFavourite(person.name)}
            >
              {isFavourite(person.name) ? '♥ Saved' : '♡ Save to favourites'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}
