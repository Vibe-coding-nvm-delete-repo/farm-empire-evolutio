import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle, memoize, rafThrottle } from '../performance'

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('debounce', () => {
    it('should delay function execution', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      vi.advanceTimersByTime(50)
      debouncedFn()
      vi.advanceTimersByTime(50)
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn('test', 123)
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should ignore calls within throttle period', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should allow calls after throttle period', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      vi.advanceTimersByTime(100)
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments correctly', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn('test', 123)
      expect(fn).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = vi.fn((a: number, b: number) => a + b)
      const memoizedFn = memoize(fn)

      const result1 = memoizedFn(1, 2)
      const result2 = memoizedFn(1, 2)

      expect(result1).toBe(3)
      expect(result2).toBe(3)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call function again for different arguments', () => {
      const fn = vi.fn((a: number, b: number) => a + b)
      const memoizedFn = memoize(fn)

      memoizedFn(1, 2)
      memoizedFn(2, 3)

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should use custom key function', () => {
      const fn = vi.fn((obj: { id: number }) => obj.id * 2)
      const memoizedFn = memoize(fn, (obj) => String(obj.id))

      memoizedFn({ id: 1 })
      memoizedFn({ id: 1 })

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should limit cache size to 100 items', () => {
      const fn = vi.fn((n: number) => n * 2)
      const memoizedFn = memoize(fn)

      for (let i = 0; i < 150; i++) {
        memoizedFn(i)
      }

      expect(fn).toHaveBeenCalledTimes(150)

      memoizedFn(0)
      expect(fn).toHaveBeenCalledTimes(151)
    })
  })

  describe('rafThrottle', () => {
    it('should use requestAnimationFrame', () => {
      const fn = vi.fn()
      const rafThrottledFn = rafThrottle(fn)

      rafThrottledFn()
      rafThrottledFn()
      rafThrottledFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(16)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
})
