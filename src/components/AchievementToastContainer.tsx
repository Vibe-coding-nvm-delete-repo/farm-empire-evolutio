import { AnimatePresence } from 'framer-motion'
import { AchievementToast } from './AchievementToast'
import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  tier: number
  icon?: string
}

interface AchievementToastContainerProps {
  achievements: Achievement[]
  onRemove: (id: string) => void
}

export function AchievementToastContainer({ achievements, onRemove }: AchievementToastContainerProps) {
  const [displayedAchievements, setDisplayedAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    achievements.forEach(achievement => {
      if (!displayedAchievements.find(a => a.id === achievement.id)) {
        setDisplayedAchievements(prev => [...prev, achievement])
      }
    })
  }, [achievements, displayedAchievements])

  const handleClose = useCallback((id: string) => {
    setDisplayedAchievements(prev => prev.filter(a => a.id !== id))
    onRemove(id)
  }, [onRemove])

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {displayedAchievements.map((achievement) => (
          <div key={achievement.id} className="pointer-events-auto">
            <AchievementToast
              achievement={achievement}
              onClose={() => handleClose(achievement.id)}
              duration={5000}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
