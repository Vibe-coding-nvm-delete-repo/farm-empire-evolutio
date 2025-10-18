import { PlotState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { getCropById, getBuildingById } from '@/lib/gameEngine'
import { Progress } from '@/components/ui/progress'
import { Plus } from '@phosphor-icons/react'

interface FarmGridProps {
  plots: PlotState[]
  onPlotClick: (plotId: string) => void
}

export function FarmGrid({ plots, onPlotClick }: FarmGridProps) {
  const now = Date.now()

  return (
    <div className="grid grid-cols-4 gap-3 p-4">
      {plots.map((plot) => {
        const isGrowing = plot.type === 'crop' && plot.completesAt && plot.completesAt > now
        const isReady = plot.type === 'crop' && plot.completesAt && plot.completesAt <= now
        const isBuilding = plot.type === 'building'
        const isEmpty = plot.type === 'empty'

        let content: React.ReactNode = null
        let progress = 0

        if (plot.type === 'crop' && plot.cropId) {
          const crop = getCropById(plot.cropId)
          if (crop) {
            content = (
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">{crop.icon}</span>
                <span className="text-xs font-medium text-center">{crop.name}</span>
              </div>
            )
            
            if (plot.plantedAt && plot.completesAt) {
              const totalTime = plot.completesAt - plot.plantedAt
              const elapsed = now - plot.plantedAt
              progress = Math.min((elapsed / totalTime) * 100, 100)
            }
          }
        } else if (plot.type === 'building' && plot.buildingId) {
          const building = getBuildingById(plot.buildingId)
          if (building) {
            content = (
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">{building.icon}</span>
                <span className="text-xs font-medium text-center">{building.name}</span>
              </div>
            )
          }
        }

        return (
          <motion.div
            key={plot.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`
                aspect-square p-3 cursor-pointer transition-all duration-300
                ${isEmpty ? 'bg-muted/50 hover:bg-muted border-dashed' : 'bg-card'}
                ${isReady ? 'animate-pulse-glow border-primary' : ''}
                ${isGrowing ? 'border-primary/50' : ''}
              `}
              onClick={() => onPlotClick(plot.id)}
            >
              <div className="h-full flex flex-col justify-between">
                {isEmpty ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" weight="bold" />
                  </div>
                ) : (
                  <>
                    <div className={`flex-1 flex items-center justify-center ${isGrowing ? 'animate-sway' : ''}`}>
                      {content}
                    </div>
                    {isGrowing && (
                      <Progress value={progress} className="h-1.5 mt-2" />
                    )}
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
