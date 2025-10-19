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
      initial={{ scale: 0, y: 0, opacity: 0 }}
      animate={{ scale: 1, y: -15, opacity: 1 }}
      exit={{ scale: 0.8, y: -30, opacity: 0 }}
      transition={{ duration: 0.15, ease: [0.34, 1.3, 0.64, 1] }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 800)
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
        animate={isCritical ? { 
          rotate: [0, -3, 3, -3, 3, 0],
          scale: [1, 1.05, 1, 1.05, 1]
        } : {}}
        transition={{ duration: 0.4, repeat: isCritical ? 1 : 0 }}
        className={`
          ${isCritical 
            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.6)]' 
            : rollValue >= 125
            ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg'
            : rollValue >= 100
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
            : 'bg-card/98 text-foreground border border-border shadow-md'
          }
          rounded-xl px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-sm
        `}
      >
        {isCritical && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          >
            <Sparkle weight="fill" className="w-4 h-4" />
          </motion.div>
        )}
        <span className="text-lg font-bold font-numeric">{rollValue}%</span>
        {isCritical && (
          <motion.span 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="text-xs font-bold tracking-wide"
          >
            CRIT!
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
