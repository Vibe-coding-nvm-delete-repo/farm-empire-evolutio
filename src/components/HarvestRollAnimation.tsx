import { motion } from 'framer-motion'
import { Sparkle, TrendUp } from '@phosphor-icons/react'

interface HarvestRollAnimationProps {
  rollValue: number
  isCritical: boolean
  onComplete: () => void
}

export function HarvestRollAnimation({ rollValue, isCritical, onComplete }: HarvestRollAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'backOut' }}
      onAnimationComplete={onComplete}
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${
          isCritical 
            ? 'bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 text-white shadow-2xl shadow-amber-500/50' 
            : rollValue >= 100
            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30'
            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-lg'
        } rounded-2xl px-8 py-6 flex flex-col items-center gap-2 border-4 ${
          isCritical ? 'border-yellow-300 animate-pulse' : 'border-white/30'
        }`}
      >
        <div className="flex items-center gap-2">
          {isCritical ? (
            <Sparkle weight="fill" className="w-8 h-8 animate-spin" />
          ) : rollValue >= 100 ? (
            <TrendUp weight="bold" className="w-7 h-7" />
          ) : null}
          <span className="text-5xl font-bold font-numeric">{rollValue}%</span>
          {isCritical ? (
            <Sparkle weight="fill" className="w-8 h-8 animate-spin" style={{ animationDirection: 'reverse' }} />
          ) : rollValue >= 100 ? (
            <TrendUp weight="bold" className="w-7 h-7" />
          ) : null}
        </div>
        <p className="text-sm font-semibold tracking-wide">
          {isCritical ? '🎉 CRITICAL HARVEST! 🎉' : rollValue >= 125 ? 'Lucky Harvest!' : rollValue >= 100 ? 'Good Harvest' : 'Standard Yield'}
        </p>
      </motion.div>
    </motion.div>
  )
}
