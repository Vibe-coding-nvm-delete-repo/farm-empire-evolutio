import { Card } from '@/components/ui/card'
import { GameState } from '@/lib/types'
import { Trophy, TreeStructure, Farm, Coin, ChartBar, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { memo } from 'react'

interface StatsOverviewProps {
  gameState: GameState
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  tooltip: string
  color: string
  delay?: number
}

const StatCard = memo(({ icon, label, value, tooltip, color, delay = 0 }: StatCardProps) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Card className="p-3 hover:shadow-md transition-shadow cursor-help">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
                <div className="text-xl font-bold font-numeric">{value}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
})

StatCard.displayName = 'StatCard'

export const StatsOverview = memo(({ gameState }: StatsOverviewProps) => {
  const activeCrops = gameState.plots.filter(p => p.type === 'crop').length
  const activeAnimals = gameState.plots.filter(p => p.type === 'animal').length
  const activeBuildings = gameState.plots.filter(p => p.type === 'building').length
  const playtime = Math.floor((Date.now() - gameState.startTime) / 1000 / 60)

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <StatCard
          icon={<Coin weight="fill" className="w-5 h-5 text-amber-600" />}
          label="Total Gold"
          value={Math.floor(gameState.totalGoldEarned).toLocaleString()}
          tooltip="Total gold earned throughout your farming career"
          color="bg-amber-500/20"
          delay={0}
        />
        <StatCard
          icon={<Farm weight="fill" className="w-5 h-5 text-green-600" />}
          label="Harvests"
          value={gameState.totalHarvested.toLocaleString()}
          tooltip="Total crops harvested since you started"
          color="bg-green-500/20"
          delay={0.05}
        />
        <StatCard
          icon={<TreeStructure weight="fill" className="w-5 h-5 text-blue-600" />}
          label="Technologies"
          value={gameState.techs.length}
          tooltip="Number of technologies researched"
          color="bg-blue-500/20"
          delay={0.1}
        />
        <StatCard
          icon={<Trophy weight="fill" className="w-5 h-5 text-yellow-600" />}
          label="Achievements"
          value={gameState.achievements.length}
          tooltip="Achievements unlocked out of many available"
          color="bg-yellow-500/20"
          delay={0.15}
        />
        <StatCard
          icon={<ChartBar weight="fill" className="w-5 h-5 text-purple-600" />}
          label="Active Plots"
          value={`${activeCrops + activeAnimals + activeBuildings}/${gameState.plots.length}`}
          tooltip={`Crops: ${activeCrops} | Animals: ${activeAnimals} | Buildings: ${activeBuildings}`}
          color="bg-purple-500/20"
          delay={0.2}
        />
        <StatCard
          icon={<Clock weight="fill" className="w-5 h-5 text-slate-600" />}
          label="Playtime"
          value={`${playtime}m`}
          tooltip={`You've been farming for ${playtime} minutes`}
          color="bg-slate-500/20"
          delay={0.25}
        />
      </div>
    </TooltipProvider>
  )
})

StatsOverview.displayName = 'StatsOverview'
