import { useEffect, useState } from 'react'

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  // 초기 상태값은 localStorage에서 가져오거나 초기값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 상태가 변경될 때마다 localStorage 동기화
  useEffect(() => {
    try {
      if (storedValue === null) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      }
    } catch (error) {
      console.log(`Error writing localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export { useLocalStorage }
