import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  delay: number
}

const COLORS = [
  '#fbbf24', // amber
  '#f97316', // orange
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
]

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.2,
      }))
      setParticles(newParticles)
      setShow(true)

      setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 2000)
    }
  }, [trigger, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]" style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: '-10vh',
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: '110vh',
              x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
              rotate: particle.rotation * 3,
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
