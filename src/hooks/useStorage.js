import { useState, useCallback } from 'react'
import { getItem, setItem } from '../utils/storage'

export function useStorage(key, initialValue = null) {
  const [value, setValue] = useState(() => getItem(key, initialValue))

  const update = useCallback(
    (newVal) => {
      const resolved = typeof newVal === 'function' ? newVal(getItem(key, initialValue)) : newVal
      setItem(key, resolved)
      setValue(resolved)
    },
    [key, initialValue]
  )

  return [value, update]
}
