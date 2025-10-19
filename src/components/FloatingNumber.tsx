import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FloatingNumberProps {
  value: number
  x: number
  y: number
  color?: string
}

export function FloatingNumber({ value, x, y, color = 'text-green-600' }: FloatingNumberProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const prefix = value > 0 ? '+' : ''

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -30, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`fixed pointer-events-none font-bold text-lg ${color} drop-shadow-lg z-[150]`}
          style={{ left: x, top: y }}
        >
          {prefix}{value}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface FloatingNumberContainerProps {
  numbers: Array<{ id: string; value: number; x: number; y: number; color?: string }>
  onRemove: (id: string) => void
}

export function FloatingNumberContainer({ numbers, onRemove }: FloatingNumberContainerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      <AnimatePresence>
        {numbers.map((num) => (
          <FloatingNumber
            key={num.id}
            value={num.value}
            x={num.x}
            y={num.y}
            color={num.color}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
