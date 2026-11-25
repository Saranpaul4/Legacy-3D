import { useEffect } from 'react'

const MAX_TILT = 9 // degrees

// "Living portraits": the element leans towards the mouse (or follows a
// phone being tilted) as if you were looking into a framed picture.
// It writes CSS variables, so the look lives in the stylesheet:
//   --rx, --ry  the tilt          --gx, --gy  where the gleam sits
export default function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const apply = (x, y) => {
      // x and y run from -1 to 1 across the element
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-y * MAX_TILT).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(x * MAX_TILT).toFixed(2)}deg`)
        el.style.setProperty('--gx', `${50 + x * 40}%`)
        el.style.setProperty('--gy', `${50 + y * 40}%`)
        el.classList.add('tilting')
      })
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.classList.remove('tilting')
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      apply(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)

    // phones: follow the way the device is held (where the browser allows it)
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let base = null
    const onOrient = (e) => {
      if (e.beta == null || e.gamma == null) return
      base ??= { beta: e.beta, gamma: e.gamma } // however they hold it is "straight"
      const clamp = (v) => Math.max(-1, Math.min(1, v))
      apply(clamp((e.gamma - base.gamma) / 25), clamp((e.beta - base.beta) / 25))
    }
    if (coarse) window.addEventListener('deviceorientation', onOrient)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [ref])
}
