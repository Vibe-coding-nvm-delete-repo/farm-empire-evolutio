import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkle, Gift } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface AchievementPopupProps {
  achievement: {
    name: string
    description: string
    tier: number
    icon?: string
  }
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: 2,
              ease: 'easeInOut',
            }}
            className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-900 rounded-3xl p-8 shadow-2xl border-4 border-amber-300 dark:border-amber-700 max-w-md"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900"
            >
              <Trophy weight="fill" className="w-8 h-8 text-white" />
            </motion.div>

            <div className="text-center pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center justify-center gap-2">
                  <Sparkle weight="fill" className="w-6 h-6 text-yellow-500" />
                  Achievement Unlocked!
                  <Sparkle weight="fill" className="w-6 h-6 text-yellow-500" />
                </h2>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="text-6xl my-4"
              >
                {achievement.icon || '🏆'}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                  {achievement.name}
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mb-4">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-amber-500 text-white border-amber-600">
                    <Gift weight="fill" className="w-3 h-3 mr-1" />
                    Tier {achievement.tier}
                  </Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:from-amber-600 hover:to-yellow-600 transition-all transform hover:scale-105"
                >
                  Awesome!
                </button>
              </motion.div>
            </div>

            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 150,
                    y: Math.sin((i / 12) * Math.PI * 2) * 150,
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
