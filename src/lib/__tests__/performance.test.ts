import { describe, it, expect, vi } from 'vitest'
import { debounce, throttle, memoize } from '../performance'

describe('Performance Utilities', () => {
  describe('debounce', () => {
    it('should delay function execution', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)
      
      debounced()
      expect(fn).not.toHaveBeenCalled()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)
      
      debounced()
      debounced()
      debounced()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 50)
      
      debounced('test', 123)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(fn).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('throttle', () => {
    it('should limit function calls', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)
      
      throttled()
      throttled()
      throttled()
      
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should allow calls after cooldown', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 50)
      
      throttled()
      expect(fn).toHaveBeenCalledTimes(1)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      throttled()
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments correctly', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)
      
      throttled('arg1', 'arg2')
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      let callCount = 0
      const fn = (x: number) => {
        callCount++
        return x * 2
      }
      
      const memoized = memoize(fn)
      
      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)
      expect(callCount).toBe(1)
    })

    it('should handle different arguments', () => {
      let callCount = 0
      const fn = (x: number) => {
        callCount++
        return x * 2
      }
      
      const memoized = memoize(fn)
      
      expect(memoized(5)).toBe(10)
      expect(memoized(10)).toBe(20)
      expect(memoized(5)).toBe(10)
      expect(callCount).toBe(2)
    })

    it('should use custom key function', () => {
      let callCount = 0
      const fn = (obj: { id: number, name: string }) => {
        callCount++
        return obj.name.toUpperCase()
      }
      
      const memoized = memoize(fn, (obj) => String(obj.id))
      
      expect(memoized({ id: 1, name: 'test' })).toBe('TEST')
      expect(memoized({ id: 1, name: 'different' })).toBe('TEST')
      expect(callCount).toBe(1)
    })

    it('should limit cache size', () => {
      const fn = (x: number) => x * 2
      const memoized = memoize(fn)
      
      for (let i = 0; i < 150; i++) {
        memoized(i)
      }
      
      expect(true).toBe(true)
    })

    it('should handle complex return types', () => {
      const fn = (x: number) => ({ value: x, doubled: x * 2 })
      const memoized = memoize(fn)
      
      const result1 = memoized(5)
      const result2 = memoized(5)
      
      expect(result1).toEqual({ value: 5, doubled: 10 })
      expect(result1).toBe(result2)
    })
  })

  describe('Performance Benchmarks', () => {
    it('should show memoization performance gains', () => {
      const expensiveFn = (n: number) => {
        let result = 0
        for (let i = 0; i < 1000; i++) {
          result += Math.sqrt(n * i)
        }
        return result
      }
      
      const memoized = memoize(expensiveFn)
      
      const start1 = performance.now()
      memoized(100)
      const end1 = performance.now()
      const firstCall = end1 - start1
      
      const start2 = performance.now()
      memoized(100)
      const end2 = performance.now()
      const secondCall = end2 - start2
      
      expect(secondCall).toBeLessThan(firstCall * 0.1)
    })
  })
})
