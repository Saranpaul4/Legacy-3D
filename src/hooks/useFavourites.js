import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'legacy-favourites'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Saves favourite legends (by name) in the browser's localStorage
export default function useFavourites() {
  const [favourites, setFavourites] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      /* storage unavailable — keep favourites in memory only */
    }
  }, [favourites])

  const isFavourite = useCallback(
    (name) => favourites.includes(name),
    [favourites]
  )

  const toggleFavourite = useCallback((name) => {
    setFavourites((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name]
    )
  }, [])

  return { favourites, isFavourite, toggleFavourite }
}
