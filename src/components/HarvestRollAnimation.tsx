import { motion } from 'framer-motion'
import { Sparkle } from '@phosphor-icons/react'

interface HarvestRollAnimationProps {
  rollValue: number
  isCritical: boolean
  onComplete: () => void
  position: { x: number; y: number }
}

export function HarvestRollAnimation({ rollValue, isCritical, onComplete, position }: HarvestRollAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 1200)
      }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -120%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={isCritical ? { rotate: [0, -2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0, repeatDelay: 0.3 }}
        className={`
          ${isCritical 
            ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' 
            : rollValue >= 125
            ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
            : rollValue >= 100
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
            : 'bg-card/95 text-foreground border border-border'
          }
          rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm
        `}
      >
        {isCritical && (
          <Sparkle weight="fill" className="w-3.5 h-3.5 animate-pulse" />
        )}
        <span className="text-lg font-bold font-numeric">{rollValue}%</span>
        {isCritical && (
          <span className="text-xs font-semibold">CRIT!</span>
        )}
      </motion.div>
    </motion.div>
  )
}
