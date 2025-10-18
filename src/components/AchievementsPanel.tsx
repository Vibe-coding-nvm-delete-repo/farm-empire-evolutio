import { Achievement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, Check } from '@phosphor-icons/react'
import { ACHIEVEMENTS } from '@/lib/gameData'

interface AchievementsPanelProps {
  completedAchievements: string[]
  currentProgress: Record<string, number>
}

const CATEGORY_COLORS: Record<string, string> = {
  harvest: 'bg-primary/10 text-primary border-primary',
  wealth: 'bg-accent/10 text-accent-foreground border-accent',
  tech: 'bg-purple-500/10 text-purple-500 border-purple-500',
  automation: 'bg-blue-500/10 text-blue-500 border-blue-500',
  special: 'bg-pink-500/10 text-pink-500 border-pink-500',
}

export function AchievementsPanel({ completedAchievements, currentProgress }: AchievementsPanelProps) {
  const achievements = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    completed: completedAchievements.includes(achievement.id),
    progress: currentProgress[achievement.id] || 0,
  }))

  const completedCount = achievements.filter(a => a.completed).length
  const totalCount = achievements.length

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy weight="fill" className="w-6 h-6 text-accent" />
            Achievements
          </h2>
          <Badge variant="outline" className="text-sm">
            {completedCount} / {totalCount}
          </Badge>
        </div>
        <Progress value={(completedCount / totalCount) * 100} className="h-2" />
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const progressPercent = Math.min((achievement.progress / achievement.requirement) * 100, 100)
            
            return (
              <Card
                key={achievement.id}
                className={`p-4 transition-all ${
                  achievement.completed ? 'bg-muted/50 border-primary/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    achievement.completed
                      ? 'bg-primary/20'
                      : 'bg-muted'
                  }`}>
                    {achievement.completed ? (
                      <Trophy weight="fill" className="w-6 h-6 text-primary" />
                    ) : (
                      <Trophy weight="light" className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.completed && (
                        <Check weight="bold" className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={CATEGORY_COLORS[achievement.category]}>
                        {achievement.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress.toLocaleString()} / {achievement.requirement.toLocaleString()}
                      </span>
                    </div>

                    {!achievement.completed && (
                      <Progress value={progressPercent} className="h-1.5" />
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
