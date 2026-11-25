import { useEffect, useState } from 'react'

// true while the element is on screen — used to pause 3D scenes you can't see
export default function useInView(ref, rootMargin = '100px') {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
