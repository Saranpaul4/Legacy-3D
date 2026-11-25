import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Stars, useTexture, Html } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import useInView from './hooks/useInView'
import * as THREE from 'three'
import { personalities, CATEGORY_COLORS } from './data/personalities'

const EARTH_RADIUS = 1.25
const PIN_RADIUS = EARTH_RADIUS * 1.012
const noRaycast = () => null // decorative meshes should never block a click

// latitude/longitude -> a point on the sphere (matches three.js sphere UVs)
function latLngToVector(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function EnergyParticles({ color }) {
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <points ref={particlesRef} raycast={noRaycast}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <pointsMaterial color={color} size={0.02} transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

function BirthplacePin({ person, hovered, onHover, onSelect }) {
  const position = useMemo(
    () => latLngToVector(person.coords[0], person.coords[1], PIN_RADIUS),
    [person.coords]
  )
  const color = CATEGORY_COLORS[person.category]

  return (
    <group position={position}>
      {/* invisible, larger hit area so small pins are easy to hover */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(person)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.(person)
        }}
      >
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh scale={hovered ? 1.9 : 1} raycast={noRaycast}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color={hovered ? '#f3d9a2' : color} />
      </mesh>

      <mesh scale={hovered ? 1.6 : 1} raycast={noRaycast}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
      </mesh>

      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
          <div className="globe-label">
            <strong>{person.name}</strong>
            <span>{person.birthplace}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

function LegacyObject({ hoveredPin, setHoveredPin, onSelectPerson, faint }) {
  const objectRef = useRef()
  const earthTexture = useTexture('/earth.jpg')
  earthTexture.colorSpace = THREE.SRGBColorSpace

  useFrame((state) => {
    if (!objectRef.current || hoveredPin) return // hold still while a pin is hovered
    objectRef.current.rotation.y += 0.003
    objectRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.05
  })

  return (
    <Float speed={1.5} rotationIntensity={hoveredPin ? 0 : 0.15} floatIntensity={hoveredPin ? 0 : 0.3}>
      <group ref={objectRef}>
        {/* Earth */}
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.8}
            metalness={0}
            emissive="#2b3a4a"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* atmosphere */}
        <mesh scale={1.035} raycast={noRaycast}>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshBasicMaterial color="#e8c98a" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* birthplaces */}
        {personalities
          .filter((p) => p.coords)
          .map((person) => (
            <BirthplacePin
              key={person.name}
              person={person}
              hovered={hoveredPin?.name === person.name}
              onHover={setHoveredPin}
              onSelect={onSelectPerson}
            />
          ))}

        {/* orbital rings */}
        <mesh rotation={[1, 0.5, 0]} raycast={noRaycast}>
          <torusGeometry args={[1.8, 0.012, 16, 100]} />
          <meshBasicMaterial color="#c6a15b" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[0.5, 1, 0.5]} raycast={noRaycast}>
          <torusGeometry args={[2.1, 0.008, 16, 100]} />
          <meshBasicMaterial color="#c6a15b" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[1.2, 0.8, 0.3]} raycast={noRaycast}>
          <torusGeometry args={[2.3, 0.009, 16, 120]} />
          <meshBasicMaterial color={faint} transparent opacity={0.18} />
        </mesh>
      </group>
    </Float>
  )
}

export default function LegacyScene({ onSelectPerson, theme = 'dark' }) {
  // on the light page, ivory sparkles would vanish, so they turn to ink
  const faint = theme === 'light' ? '#5c574c' : '#ece6d9'
  const [hoveredPin, setHoveredPin] = useState(null)
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef)
  // on touch screens, dragging the globe would trap the page scroll,
  // so there it just turns by itself (pins can still be tapped)
  const [touch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      dpr={[1, 2]}
      frameloop={inView ? 'always' : 'never'}
    >
      <ambientLight intensity={2} />
      <pointLight position={[3, 4, 5]} intensity={4} color="#ffffff" />
      <pointLight position={[-5, -3, 2]} intensity={1.5} color="#c6a15b" />

      {theme !== 'light' && <Stars radius={80} depth={50} count={900} factor={4} fade speed={1} />}

      <LegacyObject
        hoveredPin={hoveredPin}
        setHoveredPin={setHoveredPin}
        onSelectPerson={onSelectPerson}
        faint={faint}
      />
      <EnergyParticles color={faint} />

      {!touch && <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!hoveredPin}
        autoRotateSpeed={0.3}
        rotateSpeed={0.6}
      />}
    </Canvas>
    </div>
  )
}
