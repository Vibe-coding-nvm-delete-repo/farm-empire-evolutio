import { PlotState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { getCropById, getBuildingById } from '@/lib/gameEngine'
import { Progress } from '@/components/ui/progress'
import { Plus } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FarmGridProps {
  plots: PlotState[]
  onPlotClick: (plotId: string) => void
}

export function FarmGrid({ plots, onPlotClick }: FarmGridProps) {
  const now = Date.now()

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <TooltipProvider>
        {plots.map((plot) => {
          const isGrowing = plot.type === 'crop' && plot.completesAt && plot.completesAt > now
          const isReady = plot.type === 'crop' && plot.completesAt && plot.completesAt <= now
          const isBuilding = plot.type === 'building'
          const isEmpty = plot.type === 'empty'

          let content: React.ReactNode = null
          let progress = 0
          let tooltipText = ''

          if (plot.type === 'crop' && plot.cropId) {
            const crop = getCropById(plot.cropId)
            if (crop) {
              content = (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{crop.icon}</span>
                  <span className="text-xs font-semibold text-center">{crop.name}</span>
                </div>
              )
              
              if (plot.plantedAt && plot.completesAt) {
                const totalTime = plot.completesAt - plot.plantedAt
                const elapsed = now - plot.plantedAt
                progress = Math.min((elapsed / totalTime) * 100, 100)
                
                const remaining = plot.completesAt - now
                if (remaining > 0) {
                  tooltipText = `Growing ${crop.name}... Ready in ${formatTime(remaining)}`
                } else {
                  tooltipText = `${crop.name} is ready to harvest! Click to collect your rewards.`
                }
              }
            }
          } else if (plot.type === 'building' && plot.buildingId) {
            const building = getBuildingById(plot.buildingId)
            if (building) {
              content = (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{building.icon}</span>
                  <span className="text-xs font-semibold text-center">{building.name}</span>
                </div>
              )
              
              const hasProduction = building.production && Object.keys(building.production).length > 0
              if (hasProduction) {
                const productionDesc = Object.entries(building.production!)
                  .map(([key, val]) => `${val} ${key}`)
                  .join(', ')
                tooltipText = `${building.name} - Producing ${productionDesc} every ${building.productionRate / 1000}s`
              } else {
                tooltipText = `${building.name} - ${building.description}`
              }
            }
          } else if (isEmpty) {
            tooltipText = 'Empty plot - Click to plant a crop or build a structure'
          }

          return (
            <Tooltip key={plot.id} delayDuration={200}>
              <TooltipTrigger asChild>
                <Card
                  className={`
                    aspect-square p-4 cursor-pointer transition-all duration-200
                    ${isEmpty ? 'bg-primary/5 hover:bg-primary/10 border-dashed border-2' : 'bg-card hover:shadow-lg'}
                    ${isReady ? 'ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse-glow' : ''}
                    ${isGrowing ? 'border-primary/30' : ''}
                  `}
                  onClick={() => onPlotClick(plot.id)}
                >
                  <div className="h-full flex flex-col justify-between">
                    {isEmpty ? (
                      <div className="flex-1 flex items-center justify-center">
                        <Plus className="w-12 h-12 text-primary/40" weight="bold" />
                      </div>
                    ) : (
                      <>
                        <div className={`flex-1 flex items-center justify-center ${isGrowing ? 'animate-sway' : ''}`}>
                          {content}
                        </div>
                        {isGrowing && plot.completesAt && (
                          <div className="mt-3 space-y-1">
                            <Progress value={progress} className="h-2" />
                            <div className="text-center text-xs font-semibold text-muted-foreground">
                              {formatTime(plot.completesAt - now)}
                            </div>
                          </div>
                        )}
                        {isReady && (
                          <div className="mt-3 text-center">
                            <div className="text-xs font-bold text-primary animate-pulse">
                              ✨ READY! ✨
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
