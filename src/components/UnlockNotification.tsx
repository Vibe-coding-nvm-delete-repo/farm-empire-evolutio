import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TreeStructure, Sparkle, X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'

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
  duration = 5000,
  onClose,
}: UnlockNotificationProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
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
        return 'from-yellow-500/20 to-orange-500/20'
      case 'tech':
        return 'from-blue-500/20 to-cyan-500/20'
      case 'progression':
        return 'from-purple-500/20 to-pink-500/20'
    }
  }

  const getBorder = () => {
    switch (type) {
      case 'achievement':
        return 'border-yellow-500/50'
      case 'tech':
        return 'border-blue-500/50'
      case 'progression':
        return 'border-purple-500/50'
    }
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[400px] max-w-[90vw]"
        >
          <Card className={`relative overflow-hidden border-2 ${getBorder()} shadow-xl`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`} />
            
            <div className="relative p-6">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {type === 'achievement' && 'Achievement Unlocked'}
                    {type === 'tech' && 'Technology Researched'}
                    {type === 'progression' && 'New Milestone'}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>

              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-primary"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
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
