import { useEffect, useRef, useState } from 'react'
import { readAppData, writeAppData } from '../services/appDataDb'

const initial = (value) => typeof value === 'function' ? value() : value

export default function useIndexedDbState(key, initialValue) {
  const [value, setValue] = useState(() => initial(initialValue))
  const loaded = useRef(false)
  const seedValue = useRef(value)

  useEffect(() => {
    let active = true

    readAppData(key)
      .then((storedValue) => {
        if (!active) return
        if (storedValue !== undefined) {
          setValue(storedValue)
        } else {
          writeAppData(key, seedValue.current).catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) loaded.current = true
      })

    return () => {
      active = false
    }
  }, [key])

  useEffect(() => {
    if (loaded.current) writeAppData(key, value).catch(() => {})
  }, [key, value])

  return [value, setValue]
}
