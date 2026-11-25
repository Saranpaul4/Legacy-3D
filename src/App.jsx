import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import PersonalityDetails from './PersonalityDetails'
import './App.css'
import './Extras.css'
import LegendTimeline from './LegendTimeline'
import LegendQuiz from './LegendQuiz'
import OnThisDay from './OnThisDay'
import QuoteOfTheDay from './QuoteOfTheDay'
import HistoryToday from './HistoryToday'
import useFavourites from './hooks/useFavourites'
import useTheme from './hooks/useTheme'
import {
  personalities,
  CATEGORIES,
  detectPortraits,
  subscribePortraits,
  getPortraitsVersion,
  getSlug,
} from './data/personalities'

// The 3D parts (three.js) are large, so they load in separate files
// after the rest of the page is already on screen.
const LegacyScene = lazy(() => import('./LegacyScene'))
const PersonalityGallery = lazy(() => import('./PersonalityGallery'))
const Museum = lazy(() => import('./Museum'))
const TimeMachine = lazy(() => import('./TimeMachine'))
const Sky = lazy(() => import('./Sky'))

// Look for portrait photos as soon as the app loads
detectPortraits()

// Each page has its own address, e.g. #/quiz, so links can be shared
// and the browser's Back button moves between pages.
const PAGES = [
  { id: 'home', label: 'Home', title: 'Legacy — The people who changed the world' },
  { id: 'legends', label: 'Legends', title: 'Legends — Legacy' },
  { id: 'museum', label: 'Museum', title: 'Museum — Legacy' },
  { id: 'sky', label: 'Sky', title: 'Sky of Legends — Legacy' },
  { id: 'time-machine', label: 'Time Machine', title: 'Time Machine — Legacy' },
  { id: 'timeline', label: 'Timeline', title: 'Timeline — Legacy' },
  { id: 'quiz', label: 'Quiz', title: 'Quiz — Legacy' },
]
const PAGE_IDS = new Set(PAGES.map((p) => p.id))

// addresses from the old one-page site still lead somewhere sensible
const OLD_ADDRESSES = {
  personalities: 'legends',
  biography: 'legends',
  explore: 'home',
  compare: 'home',
  about: 'home', // About now sits at the bottom of the home page
}

const YEAR = new Date().getFullYear()
const oldest = personalities.reduce((a, b) => (a.born < b.born ? a : b))

// Read the address: "#/quiz" -> quiz page, "#legend/marie-curie" -> her story
function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const legend = /^legend\/([a-z0-9-]+)$/.exec(hash)
  if (legend) {
    const person = personalities.find((p) => getSlug(p) === legend[1])
    if (person) return { page: 'legends', person }
  }
  const first = hash.split('/')[0] // "time-machine/1905" -> "time-machine"
  const id = OLD_ADDRESSES[first] ?? first
  // old "About" links land on the About part at the bottom of Home
  const anchor = hash === 'about' ? 'about' : null
  return { page: PAGE_IDS.has(id) ? id : 'home', person: null, anchor }
}

const go = (hash) => {
  if (window.location.hash === hash) window.scrollTo({ top: 0, behavior: 'smooth' })
  else window.location.hash = hash
}

function Loader({ visible }) {
  return (
    <div className={`legacy-loader ${visible ? '' : 'hidden'}`} aria-hidden={!visible}>
      <div className="logo">
        Legacy<span>.</span>
      </div>
      <div className="legacy-loader-bar">
        <i />
      </div>
    </div>
  )
}

function App() {
  const heroRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(readRoute)
  const { page, person: selectedPerson } = route
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { favourites, isFavourite, toggleFavourite } = useFavourites()
  const { theme, toggleTheme } = useTheme()
  // re-render when a portrait photo is found, so it replaces the monogram
  useSyncExternalStore(subscribePortraits, getPortraitsVersion)

  // LOADING SCREEN — hides once the page has loaded (max ~2.5s)
  useEffect(() => {
    const started = Date.now()
    let timer
    const finish = () => {
      const wait = Math.max(0, 600 - (Date.now() - started))
      timer = setTimeout(() => setLoading(false), wait)
    }
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    const fallback = setTimeout(() => setLoading(false), 2500)
    return () => {
      clearTimeout(timer)
      clearTimeout(fallback)
      window.removeEventListener('load', finish)
    }
  }, [])

  // HERO INTRO — the one orchestrated animation on the page
  useEffect(() => {
    if (loading || !heroRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-content h1 .line', { yPercent: 110, duration: 1.1, stagger: 0.12 })
        .from('.hero-description, .hero-buttons', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('.hero-visual', { opacity: 0, duration: 1.4 }, '-=0.9')
        .from('.hero-bottom', { opacity: 0, duration: 0.8 }, '-=0.8')
    }, heroRef)
    return () => ctx.revert()
  }, [loading])

  // PAGES — follow the address bar; each new page starts at the top
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  // jump to a part of a page once it has been drawn (e.g. About on Home)
  useEffect(() => {
    if (route.anchor) document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth' })
  }, [route])

  // the browser tab shows which page you're on
  useEffect(() => {
    document.title = selectedPerson
      ? `${selectedPerson.name} — Legacy`
      : PAGES.find((p) => p.id === page)?.title ?? PAGES[0].title
  }, [page, selectedPerson])

  // BACK-TO-TOP BUTTON + navbar border after scrolling
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const openPerson = (person) => go(`#legend/${getSlug(person)}`)
  const closePerson = () => go('#/legends')

  // RANDOM LEGEND — never the one already open
  const openRandom = () => {
    const pool = personalities.filter((p) => p.name !== selectedPerson?.name)
    setMenuOpen(false)
    openPerson(pool[Math.floor(Math.random() * pool.length)])
  }

  const navLinks = (onClick) =>
    PAGES.map(({ id, label }) => (
      <a
        key={id}
        href={`#/${id}`}
        className={page === id ? 'active' : ''}
        aria-current={page === id ? 'page' : undefined}
        onClick={onClick}
      >
        {label}
      </a>
    ))

  return (
    <main className="legacy">
      <Loader visible={loading} />

      {/* NAVIGATION */}
      <nav className="navbar" aria-label="Main">
        <a href="#/home" className="logo">
          Legacy<span>.</span>
        </a>

        <div className="nav-links">{navLinks()}</div>

        <div className="nav-right">
          <button className="nav-button" onClick={() => go('#/legends')}>
            Explore the legends
          </button>

          <button className="icon-button" onClick={openRandom} title="Random legend" aria-label="Open a random legend">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>

          <button
            className="icon-button"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark theme' : 'Light theme'}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">{navLinks(() => setMenuOpen(false))}</nav>
      </div>

      {/* one page at a time; the key replays the fade when the page changes */}
      <div className="page" key={selectedPerson ? `legend-${getSlug(selectedPerson)}` : page}>
        {page === 'home' && (
          <>
          {/* HERO */}
          <section className="hero-section" id="home" ref={heroRef}>
            <div className="hero-content">
              <h1>
                <span className="line-mask"><span className="line">Every life leaves</span></span>
                <span className="line-mask"><span className="line">a <em className="legacy-word">Legacy</em>.</span></span>
              </h1>

              <p className="hero-description">
                The stories of the scientists, leaders, artists and champions who
                changed the world — and what they left behind for the rest of us.
              </p>

              <div className="hero-buttons">
                <a href="#/legends" className="primary-button">
                  Meet the legends
                </a>
                <a href="#/timeline" className="secondary-button">
                  See the timeline
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
                <LegacyScene onSelectPerson={openPerson} theme={theme} />
              </Suspense>
              <p className="globe-hint">
                Each light marks where a legend was born. Select one to read their story.
              </p>
            </div>

            <p className="hero-bottom">
              {personalities.length} lives, from {oldest.name} in {oldest.born} to
              the legends still writing their stories today.
            </p>
          </section>


          <OnThisDay onSelectPerson={openPerson} />

          <HistoryToday onSelectPerson={openPerson} />

          <QuoteOfTheDay onSelectPerson={openPerson} />

          {/* ABOUT */}
          <section className="about-section" id="about">
            <h2>Some stories never fade.</h2>
            <p>
              Legacy is an interactive archive of {personalities.length} people across{' '}
              {CATEGORIES.length} fields. Each one changed the world in a different
              way — through a discovery, a painting, a speech, a song or a sprint.
              Explore their lives, follow them through time and test what you know.
            </p>
          </section>
          </>
        )}

        {page === 'legends' && (
          <>
          {selectedPerson ? (
            <PersonalityDetails
              person={selectedPerson}
              onBack={closePerson}
              isFavourite={isFavourite}
              toggleFavourite={toggleFavourite}
            />
          ) : (
            <Suspense fallback={<section className="personality-section gallery-loading" id="personalities" />}>
              <PersonalityGallery
                onSelectPerson={openPerson}
                isFavourite={isFavourite}
                toggleFavourite={toggleFavourite}
                favouriteCount={favourites.length}
              />
            </Suspense>
          )}
          </>
        )}

        {page === 'museum' && (
          <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
            <Museum onSelectPerson={openPerson} theme={theme} />
          </Suspense>
        )}

        {page === 'sky' && (
          <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
            <Sky onSelectPerson={openPerson} />
          </Suspense>
        )}

        {page === 'time-machine' && (
          <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
            <TimeMachine onSelectPerson={openPerson} />
          </Suspense>
        )}

        {page === 'timeline' && <LegendTimeline onSelectPerson={openPerson} />}

        {page === 'quiz' && <LegendQuiz onSelectPerson={openPerson} />}

      </div>

      <footer>
        <a href="#/home" className="logo">Legacy<span>.</span></a>
        <nav aria-label="Footer">{navLinks()}</nav>
        <p>Celebrating the people who changed the world. © {YEAR}</p>
      </footer>

      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </main>
  )
}

export default App
