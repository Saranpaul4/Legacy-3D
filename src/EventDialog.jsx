import { useEffect, useRef } from 'react'
import { findLegend } from './data/history'
import './HistoryToday.css'

// The full story of one historical event: its photo and credit, what
// happened, and the related articles. Used by "Happened on this day"
// and the Time Machine. It opens whenever `event` is set.
export default function EventDialog({ event, date, onClose, onSelectPerson }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (event && dialog && !dialog.open) dialog.showModal()
  }, [event])

  const legend = event ? event.legend ?? findLegend(event.text) : null

  return (
    <dialog
      className="history-dialog"
      ref={ref}
      aria-labelledby="history-dialog-title"
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      onClose={onClose}
    >
      {event && (
        <article>
          {event.image?.src && (
            <figure className="history-photo">
              <img src={event.image.src} alt={event.image.about || ''} decoding="async" />
              <figcaption>
                {event.image.about && <span>{event.image.about}</span>}
                {(event.image.author || event.image.license) && (
                  <small>
                    Photo: {[event.image.author, event.image.license].filter(Boolean).join(' · ')}
                  </small>
                )}
              </figcaption>
            </figure>
          )}

          <div className="history-dialog-body">
            <p className="history-dialog-date">
              {date} {event.year}
            </p>
            <h2 id="history-dialog-title">{event.text}</h2>

            {(event.details || []).map((d) => (
              <section key={d.title} className="history-detail">
                <h3>{d.title}</h3>
                <p>{d.summary}</p>
              </section>
            ))}

            <div className="history-dialog-actions">
              {legend && (
                <button
                  className="primary-button"
                  onClick={() => {
                    ref.current?.close()
                    onSelectPerson(legend)
                  }}
                >
                  Read {legend.name}’s story
                </button>
              )}
              <form method="dialog">
                <button className="secondary-button">Close</button>
              </form>
            </div>
          </div>
        </article>
      )}
    </dialog>
  )
}
