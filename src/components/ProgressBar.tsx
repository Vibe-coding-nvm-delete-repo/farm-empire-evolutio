import { Trophy, TreeStructure } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  achievementsCompleted: number
  totalAchievements: number
  techsUnlocked: number
  totalTechs: number
}

export function ProgressBar({ 
  achievementsCompleted, 
  totalAchievements,
  techsUnlocked,
  totalTechs 
}: ProgressBarProps) {
  const achievementProgress = (achievementsCompleted / totalAchievements) * 100
  const techProgress = (techsUnlocked / totalTechs) * 100

  return (
    <Card className="bg-card/80 backdrop-blur-sm border shadow-sm p-3">
      <div className="flex items-center gap-6">
        <motion.div 
          className="flex items-center gap-3 flex-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Trophy weight="fill" className="w-6 h-6 text-amber-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Achievements</span>
              <span className="text-xs font-bold text-amber-600">
                {achievementsCompleted}/{totalAchievements}
              </span>
            </div>
            <Progress value={achievementProgress} className="h-2 bg-muted" />
          </div>
        </motion.div>

        <div className="w-px h-10 bg-border" />

        <motion.div 
          className="flex items-center gap-3 flex-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TreeStructure weight="fill" className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Technologies</span>
              <span className="text-xs font-bold text-blue-600">
                {techsUnlocked}/{totalTechs}
              </span>
            </div>
            <Progress value={techProgress} className="h-2 bg-muted" />
          </div>
        </motion.div>
      </div>
    </Card>
  )
}
