import { useEffect, useRef, useCallback } from 'react'

export function useGameLoop(callback: (deltaTime: number) => void, interval: number = 100) {
  const callbackRef = useRef(callback)
  const lastTimeRef = useRef(Date.now())
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      lastTimeRef.current = now
      
      callbackRef.current(deltaTime)
    }, interval)

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [interval])
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false)
  const lastRun = useRef(Date.now())

  return useCallback(
    ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args)
        lastRun.current = Date.now()
        inThrottle.current = true
        setTimeout(() => {
          inThrottle.current = false
        }, limit)
      }
    }) as T,
    [callback, limit]
  )
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )
}
