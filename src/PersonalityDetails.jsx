import './PersonalityDetails.css'
import { useEffect, useRef, useState } from 'react'
import ListenButton from './ListenButton'
import useTilt from './hooks/useTilt'
import gsap from 'gsap'
import {
  getPortrait,
  formatYears,
  isLiving,
  CATEGORY_LABELS,
  getSlug,
} from './data/personalities'

export default function PersonalityDetails({
  person,
  onBack,
  isFavourite,
  toggleFavourite,
}) {
  const pageRef = useRef(null)
  const photoDialogRef = useRef(null)
  const portraitRef = useRef(null)
  useTilt(portraitRef)
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#legend/${getSlug(person)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link:', url)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // the page opens with the portrait and name settling into place
  useEffect(() => {
    if (!pageRef.current || !person) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.details-image', { opacity: 0, scale: 0.96, duration: 1 })
        .from('.details-content > *', { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, '-=0.7')
    }, pageRef)
    return () => ctx.revert()
  }, [person])

  if (!person) return null
  const saved = isFavourite(person.name)

  return (
    <section className="details-page" id="biography" ref={pageRef}>
      <div className="details-actions">
        <button className="back-button" onClick={onBack}>
          ← Back to the gallery
        </button>
        <div className="details-actions-right">
          <button className="secondary-button" onClick={copyLink} aria-live="polite">
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button
            className={`favourite-button ${saved ? 'saved' : ''}`}
            onClick={() => toggleFavourite(person.name)}
            aria-pressed={saved}
          >
            {saved ? '♥ Saved' : '♡ Save to favourites'}
          </button>
        </div>
      </div>

      <div className="details-hero">
        <figure className="details-image">
          <button
            className="photo-open living-portrait"
            ref={portraitRef}
            onClick={() => photoDialogRef.current?.showModal()}
            aria-label={`About this photo of ${person.name}`}
          >
            <img
              src={getPortrait(person)}
              alt={`Portrait of ${person.name}`}
              width="600"
              height="686"
              decoding="async"
            />
            <span className="photo-hint" aria-hidden="true">ⓘ About this photo</span>
          </button>
          <figcaption>
            {person.name}, {isLiving(person) ? `born ${person.born}` : formatYears(person)}
          </figcaption>
        </figure>

        <dialog
          className="photo-dialog"
          ref={photoDialogRef}
          aria-labelledby="photo-dialog-title"
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        >
          <div className="photo-dialog-inner">
            <img src={getPortrait(person)} alt="" width="240" height="274" decoding="async" />
            <div>
              <p className="photo-dialog-label">About this photo</p>
              <h2 id="photo-dialog-title">{person.name}</h2>
              {person.photo ? (
                <>
                  <dl>
                    {person.photo.taken && (
                      <div>
                        <dt>Taken</dt>
                        <dd>{person.photo.taken}</dd>
                      </div>
                    )}
                    {person.photo.by && (
                      <div>
                        <dt>By</dt>
                        <dd>{person.photo.by}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="photo-dialog-story">{person.photo.story}</p>
                </>
              ) : (
                <p className="photo-dialog-story">
                  We haven’t been able to confirm when or where this photo was
                  taken yet, so we’d rather not guess.
                </p>
              )}
              <form method="dialog">
                <button className="secondary-button">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="details-content">
          <p className="details-field">
            {CATEGORY_LABELS[person.category]}
            {isLiving(person) && <span className="living-badge">Living legend</span>}
          </p>

          <h1>{person.name}</h1>
          <p className="details-title">{person.title}</p>
          <p className="details-description">{person.description}</p>

          <ListenButton key={person.name} person={person} />

          <dl className="details-info">
            <div>
              <dt>Born</dt>
              <dd>{person.bornDate}</dd>
            </div>
            <div>
              <dt>Birthplace</dt>
              <dd>{person.birthplace}</dd>
            </div>
            <div>
              <dt>Known as</dt>
              <dd>{person.profession}</dd>
            </div>
            <div>
              <dt>{isLiving(person) ? 'Status' : 'Lived'}</dt>
              <dd>{isLiving(person) ? 'Living' : formatYears(person)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {person.quote && (
        <figure className="details-quote">
          <blockquote>“{person.quote.text}”</blockquote>
          <figcaption>
            {person.name} · {person.quote.source}
          </figcaption>
        </figure>
      )}

      <div className="biography-section">
        <article>
          <h2>Early life</h2>
          <p>{person.earlyLife}</p>
        </article>
        <article>
          <h2>Greatest achievement</h2>
          <p>{person.achievement}</p>
        </article>
        <article>
          <h2>Legacy</h2>
          <p>{person.legacy}</p>
        </article>
      </div>

      {person.timeline?.length > 0 && (
        <div className="timeline-section">
          <h2>Key moments</h2>
          <ol className="timeline">
            {person.timeline.map((item) => (
              <li className="timeline-item" key={item.year + item.event}>
                <span className="timeline-year">{item.year}</span>
                <p>{item.event}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
