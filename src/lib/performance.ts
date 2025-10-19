export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    return result
  }) as T
}

export const rafThrottle = <T extends (...args: any[]) => any>(fn: T) => {
  let rafId: number | null = null

  return (...args: Parameters<T>) => {
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      fn(...args)
      rafId = null
    })
  }
}

export function measurePerformance(name: string, fn: () => void) {
  if (typeof performance === 'undefined') {
    fn()
    return
  }

  const start = performance.now()
  fn()
  const end = performance.now()
  
  if (end - start > 16) {
    console.warn(`[Performance] ${name} took ${(end - start).toFixed(2)}ms (>16ms frame budget)`)
  }
}
