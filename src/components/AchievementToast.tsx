import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Sparkle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

interface AchievementToastProps {
  achievement: {
    name: string
    description: string
    tier: number
    icon?: string
  }
  onClose: () => void
  duration?: number
}

export function AchievementToast({ achievement, onClose, duration = 4000 }: AchievementToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        onClose()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.8 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-[340px] overflow-hidden"
      >
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/90 dark:via-yellow-950/90 dark:to-orange-950/90 backdrop-blur-xl rounded-xl shadow-2xl border-2 border-amber-400/50 dark:border-amber-600/50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-200 dark:bg-amber-900 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', damping: 10 }}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
              >
                {achievement.icon ? (
                  <span className="text-2xl">{achievement.icon}</span>
                ) : (
                  <Trophy weight="fill" className="w-6 h-6 text-white" />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-1.5 mb-1"
                >
                  <Sparkle weight="fill" className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                    Achievement Unlocked
                  </span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-bold text-amber-950 dark:text-amber-50 mb-1 line-clamp-1"
                >
                  {achievement.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-xs text-amber-700 dark:text-amber-300 line-clamp-2 mb-2"
                >
                  {achievement.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-amber-500/90 text-white border-amber-600 text-xs px-2 py-0.5">
                    Tier {achievement.tier}
                  </Badge>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
              >
                <X className="w-4 h-4 text-amber-700 dark:text-amber-300" />
              </motion.button>
            </div>
          </div>

          <motion.div
            className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-600/10 dark:to-orange-600/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
