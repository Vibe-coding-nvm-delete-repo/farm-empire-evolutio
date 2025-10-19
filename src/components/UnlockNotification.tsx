import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TreeStructure, Sparkle, X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Confetti } from '@/components/Confetti'

type UnlockType = 'achievement' | 'tech' | 'progression'

type UnlockNotificationProps = {
  type: UnlockType
  title: string
  description: string
  icon?: string
  duration?: number
  onClose: () => void
}

export function UnlockNotification({
  type,
  title,
  description,
  icon,
  duration = 3500,
  onClose,
}: UnlockNotificationProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 200)
  }

  const getIcon = () => {
    if (icon) return <span className="text-4xl">{icon}</span>
    
    switch (type) {
      case 'achievement':
        return <Trophy weight="fill" className="w-10 h-10 text-yellow-500" />
      case 'tech':
        return <TreeStructure weight="fill" className="w-10 h-10 text-blue-500" />
      case 'progression':
        return <Sparkle weight="fill" className="w-10 h-10 text-purple-500" />
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-500/20 via-orange-500/15 to-yellow-500/10'
      case 'tech':
        return 'from-blue-500/20 via-cyan-500/15 to-blue-500/10'
      case 'progression':
        return 'from-purple-500/20 via-pink-500/15 to-purple-500/10'
    }
  }

  const getBorder = () => {
    switch (type) {
      case 'achievement':
        return 'border-yellow-500/60'
      case 'tech':
        return 'border-blue-500/60'
      case 'progression':
        return 'border-purple-500/60'
    }
  }

  const getShine = () => {
    switch (type) {
      case 'achievement':
        return '#fbbf24'
      case 'tech':
        return '#3b82f6'
      case 'progression':
        return '#a855f7'
    }
  }

  return (
    <>
      {(type === 'achievement' || type === 'progression') && (
        <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      )}
      
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ 
              duration: 0.25, 
              type: 'spring', 
              stiffness: 400, 
              damping: 25 
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[420px] max-w-[90vw]"
          >
            <Card className={`relative overflow-hidden border-2 ${getBorder()} shadow-2xl backdrop-blur-sm`}>
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`}
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut",
                  repeat: 0
                }}
              >
                <div 
                  className="w-20 h-full blur-xl opacity-60"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${getShine()}, transparent)`
                  }}
                />
              </motion.div>
              
              <div className="relative p-5">
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-background/60 transition-all hover:scale-110"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start gap-4">
                  <motion.div 
                    className="shrink-0 mt-1"
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 0.5,
                      times: [0, 0.2, 0.5, 0.8, 1]
                    }}
                  >
                    {getIcon()}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.div 
                      className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {type === 'achievement' && '✨ Achievement Unlocked'}
                      {type === 'tech' && '🔬 Technology Researched'}
                      {type === 'progression' && '🌟 New Milestone'}
                    </motion.div>
                    <motion.h3 
                      className="text-lg font-bold mb-1.5 text-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      {title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-muted-foreground leading-snug"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {description}
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: duration / 1000, ease: 'linear' }}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

type QueuedUnlock = {
  id: string
  type: UnlockType
  title: string
  description: string
  icon?: string
}

export function UnlockNotificationManager({ unlocks }: { unlocks: QueuedUnlock[] }) {
  const [currentUnlock, setCurrentUnlock] = useState<QueuedUnlock | null>(null)
  const [queue, setQueue] = useState<QueuedUnlock[]>([])
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (unlocks.length > 0) {
      const newUnlocks = unlocks.filter(u => !processedIds.has(u.id))
      if (newUnlocks.length > 0) {
        setQueue(prev => [...prev, ...newUnlocks])
        setProcessedIds(prev => new Set([...prev, ...newUnlocks.map(u => u.id)]))
      }
    }
  }, [unlocks])

  useEffect(() => {
    if (!currentUnlock && queue.length > 0) {
      const nextUnlock = queue[0]
      setCurrentUnlock(nextUnlock)
      setQueue(prev => prev.slice(1))
    }
  }, [currentUnlock, queue.length])

  const handleClose = () => {
    setCurrentUnlock(null)
  }

  if (!currentUnlock) return null

  return (
    <UnlockNotification
      type={currentUnlock.type}
      title={currentUnlock.title}
      description={currentUnlock.description}
      icon={currentUnlock.icon}
      onClose={handleClose}
    />
  )
}
