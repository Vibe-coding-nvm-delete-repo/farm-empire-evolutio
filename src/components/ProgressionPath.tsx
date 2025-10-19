import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CheckCircle, Lock, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { GameState } from '@/lib/types'
import { motion } from 'framer-motion'

interface Milestone {
  id: string
  name: string
  description: string
  icon: string
  requirement: (gs: GameState) => boolean
  hint: string
  tier: number
}

const MILESTONES: Milestone[] = [
  {
    id: 'first_harvest',
    name: 'First Harvest',
    description: 'Plant and harvest your first crop',
    icon: '🌾',
    requirement: (gs) => gs.totalHarvested >= 1,
    hint: 'Click an empty plot and plant Wheat',
    tier: 1,
  },
  {
    id: 'tech_unlock',
    name: 'Research Begins',
    description: 'Unlock your first technology',
    icon: '🔬',
    requirement: (gs) => gs.techs.length >= 1,
    hint: 'Harvest Tomatoes or unlock Root Crops in Tech',
    tier: 1,
  },
  {
    id: 'first_animal',
    name: 'Rancher',
    description: 'Purchase your first animal',
    icon: '🐔',
    requirement: (gs) => gs.plots.some(p => p.type === 'animal'),
    hint: 'Unlock Animal Husbandry in Tech tab',
    tier: 2,
  },
  {
    id: 'automation_start',
    name: 'Automation',
    description: 'Build your first production building',
    icon: '🏭',
    requirement: (gs) => gs.plots.some(p => p.type === 'building'),
    hint: 'Unlock buildings in Tech, then build a Well',
    tier: 2,
  },
  {
    id: 'diverse_farm',
    name: 'Diverse Farm',
    description: 'Grow 5 different crop types',
    icon: '🌱',
    requirement: (gs) => new Set(gs.plots.filter(p => p.cropId).map(p => p.cropId)).size >= 5,
    hint: 'Unlock and plant variety of crops',
    tier: 3,
  },
  {
    id: 'tech_investor',
    name: 'Tech Investor',
    description: 'Unlock 5 technologies',
    icon: '💡',
    requirement: (gs) => gs.techs.length >= 5,
    hint: 'Keep researching and unlocking techs',
    tier: 3,
  },
  {
    id: 'wealthy_farmer',
    name: 'Wealthy Farmer',
    description: 'Earn 2000 total gold',
    icon: '💰',
    requirement: (gs) => gs.totalGoldEarned >= 2000,
    hint: 'Focus on high-value crops',
    tier: 3,
  },
  {
    id: 'empire_builder',
    name: 'Empire Builder',
    description: 'Have 10 buildings operating',
    icon: '🏰',
    requirement: (gs) => gs.plots.filter(p => p.type === 'building').length >= 10,
    hint: 'Automate with multiple buildings',
    tier: 4,
  },
  {
    id: 'master_researcher',
    name: 'Master Researcher',
    description: 'Unlock 15 technologies',
    icon: '🎓',
    requirement: (gs) => gs.techs.length >= 15,
    hint: 'Continue unlocking the tech tree',
    tier: 4,
  },
  {
    id: 'harvest_master',
    name: 'Harvest Master',
    description: 'Complete 100 harvests',
    icon: '⭐',
    requirement: (gs) => gs.totalHarvested >= 100,
    hint: 'Keep planting and harvesting',
    tier: 5,
  },
  {
    id: 'ultimate_farmer',
    name: 'Ultimate Farmer',
    description: 'Unlock all 30+ technologies',
    icon: '👑',
    requirement: (gs) => gs.techs.length >= 30,
    hint: 'Complete the entire tech tree',
    tier: 5,
  },
]

interface ProgressionPathProps {
  gameState: GameState
}

export function ProgressionPath({ gameState }: ProgressionPathProps) {
  const completedMilestones = MILESTONES.filter(m => m.requirement(gameState))
  const currentMilestone = MILESTONES.find(m => !m.requirement(gameState))
  const progressPercent = (completedMilestones.length / MILESTONES.length) * 100

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkle weight="fill" className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Progression Path</h3>
        </div>
        <Badge variant="secondary" className="font-semibold">
          {completedMilestones.length}/{MILESTONES.length}
        </Badge>
      </div>

      <Progress value={progressPercent} className="h-2 mb-4" />

      <div className="relative">
        <div className="flex items-start gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {MILESTONES.map((milestone, index) => {
            const isCompleted = milestone.requirement(gameState)
            const isCurrent = currentMilestone?.id === milestone.id
            const isLocked = !isCompleted && !isCurrent

            return (
              <TooltipProvider key={milestone.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative flex flex-col items-center min-w-[90px]"
                    >
                      <div
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                          isCompleted
                            ? 'bg-primary border-primary shadow-lg shadow-primary/20'
                            : isCurrent
                            ? 'bg-accent border-accent animate-pulse shadow-md'
                            : 'bg-muted border-border'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle weight="fill" className="w-8 h-8 text-primary-foreground" />
                        ) : isLocked ? (
                          <Lock weight="fill" className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <span>{milestone.icon}</span>
                        )}
                      </div>

                      <p className="text-xs font-medium text-center mt-2 leading-tight">
                        {milestone.name}
                      </p>

                      {isCurrent && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[250px]">
                    <div className="space-y-1">
                      <p className="font-semibold">{milestone.name}</p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      {!isCompleted && (
                        <p className="text-xs text-primary font-medium mt-2">
                          💡 {milestone.hint}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        Tier {milestone.tier}
                      </Badge>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
        
        {currentMilestone && (
          <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{currentMilestone.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Next Goal: {currentMilestone.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{currentMilestone.description}</p>
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <ArrowRight className="w-4 h-4" />
                  {currentMilestone.hint}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
