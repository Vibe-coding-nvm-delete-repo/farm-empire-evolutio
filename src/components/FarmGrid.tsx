import { PlotState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { getCropById, getBuildingById, getAnimalById } from '@/lib/gameEngine'
import { Progress } from '@/components/ui/progress'
import { Plus, Rows, HandCoins } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

interface FarmGridProps {
  plots: PlotState[]
  onPlotClick: (plotId: string, event: React.MouseEvent) => void
  onCollectAll?: () => void
  onBulkPlantRow?: (rowIndex: number) => void
}

export function FarmGrid({ plots, onPlotClick, onCollectAll, onBulkPlantRow }: FarmGridProps) {
  const now = Date.now()

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }

  const readyToCollect = useMemo(() => 
    plots.filter(p => p.type === 'crop' && p.completesAt && p.completesAt <= now).length,
    [plots, now]
  )

  const renderPlot = (plot: PlotState) => {
    const isGrowing = plot.type === 'crop' && plot.completesAt && plot.completesAt > now
    const isReady = plot.type === 'crop' && plot.completesAt && plot.completesAt <= now
    const isBuilding = plot.type === 'building'
    const isAnimal = plot.type === 'animal'
    const isEmpty = plot.type === 'empty'

    let content: React.ReactNode = null
    let progress = 0
    let tooltipText = ''
    let statusBadge: React.ReactNode = null

    if (plot.type === 'crop' && plot.cropId) {
      const crop = getCropById(plot.cropId)
      if (crop) {
        content = (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">{crop.icon}</span>
            <span className="text-xs font-semibold text-center line-clamp-1">{crop.name}</span>
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
            tooltipText = `${crop.name} is ready to harvest! Click to collect.`
          }
        }
      }
    } else if (plot.type === 'animal' && plot.animalId) {
      const animal = getAnimalById(plot.animalId)
      if (animal) {
        const lastFed = (plot as any).lastFed || now
        const lastProduction = (plot as any).lastProduction || now
        const timeSinceFed = now - lastFed
        const timeSinceProduction = now - lastProduction
        const feedProgress = Math.min((timeSinceFed / animal.feedInterval) * 100, 100)
        const productionProgress = Math.min((timeSinceProduction / animal.productionInterval) * 100, 100)
        const needsFeeding = timeSinceFed >= animal.feedInterval * 0.8
        
        progress = productionProgress
        
        content = (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">{animal.icon}</span>
            <span className="text-xs font-semibold text-center line-clamp-1">{animal.name}</span>
          </div>
        )
        
        if (needsFeeding) {
          statusBadge = <Badge variant="destructive" className="text-xs px-1.5 py-0">Hungry</Badge>
        } else {
          statusBadge = <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {Math.round(productionProgress)}%
          </Badge>
        }
        
        const productionDesc = Object.entries(animal.production)
          .map(([key, val]) => `${val} ${key}`)
          .join(', ')
        tooltipText = `${animal.name} - Produces ${productionDesc} every ${animal.productionInterval / 1000}s. ${needsFeeding ? 'Needs feeding soon!' : 'Producing...'}`
      }
    } else if (plot.type === 'building' && plot.buildingId) {
      const building = getBuildingById(plot.buildingId)
      if (building) {
        const lastProduction = (plot as any).lastProduction || now
        const timeSinceProduction = now - lastProduction
        const productionProgress = Math.min((timeSinceProduction / building.productionRate) * 100, 100)
        
        progress = productionProgress
        
        content = (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">{building.icon}</span>
            <span className="text-xs font-semibold text-center line-clamp-1">{building.name}</span>
          </div>
        )
        
        const hasProduction = building.production && Object.keys(building.production).length > 0
        if (hasProduction) {
          const productionDesc = Object.entries(building.production!)
            .map(([key, val]) => `${val} ${key}`)
            .join(', ')
          tooltipText = `${building.name} - Producing ${productionDesc} every ${building.productionRate / 1000}s`
          statusBadge = <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {Math.round(productionProgress)}%
          </Badge>
        } else {
          tooltipText = `${building.name} - ${building.description}`
          statusBadge = <Badge variant="outline" className="text-xs px-1.5 py-0">Active</Badge>
        }
      }
    } else if (isEmpty) {
      tooltipText = 'Empty plot - Click to place crop, animal, or building'
    }

    return (
      <Tooltip key={plot.id} delayDuration={100}>
        <TooltipTrigger asChild>
          <Card
            className={`
              aspect-square p-2 cursor-pointer transition-all
              ${isEmpty ? 'bg-primary/5 hover:bg-primary/10 border-dashed border-2' : 'bg-card hover:shadow-lg hover:scale-105'}
              ${isReady ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-background' : ''}
              ${isGrowing ? 'border-primary/30' : ''}
            `}
            onClick={(e) => onPlotClick(plot.id, e)}
          >
            <div className="h-full flex flex-col justify-between">
              {isEmpty ? (
                <div className="flex-1 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-primary/40" weight="bold" />
                </div>
              ) : (
                <>
                  <div className={`flex-1 flex items-center justify-center ${isGrowing ? 'animate-sway' : ''}`}>
                    {content}
                  </div>
                  
                  {statusBadge && (
                    <div className="flex justify-center mt-1">
                      {statusBadge}
                    </div>
                  )}
                  
                  {(isGrowing || isBuilding || isAnimal) && (
                    <div className="mt-1 space-y-1">
                      <Progress value={progress} className="h-1.5" />
                      {isGrowing && plot.completesAt && (
                        <div className="text-center text-xs font-semibold text-muted-foreground">
                          {formatTime(plot.completesAt - now)}
                        </div>
                      )}
                    </div>
                  )}
                  {isReady && (
                    <div className="mt-1 text-center">
                      <div className="text-xs font-bold text-green-600">
                        ✨ READY ✨
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="space-y-3">
      {(readyToCollect > 0 || onBulkPlantRow) && (
        <div className="flex items-center gap-2 px-4">
          {readyToCollect > 0 && (
            <Button 
              onClick={onCollectAll} 
              variant="default" 
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <HandCoins weight="fill" className="w-4 h-4" />
              Collect All ({readyToCollect})
            </Button>
          )}
          {onBulkPlantRow && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Rows className="w-3 h-3" />
              Click row buttons to bulk plant
            </span>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-3 px-4">
        <TooltipProvider>
          {[0, 1, 2, 3, 4].map(rowIndex => {
            const rowPlots = plots.slice(rowIndex * 5, (rowIndex + 1) * 5)
            const emptyInRow = rowPlots.filter(p => p.type === 'empty').length
            
            return (
              <div key={`row-${rowIndex}`} className="contents">
                <div className="flex items-center justify-center">
                  {emptyInRow > 0 && onBulkPlantRow ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-full w-8 p-0"
                          onClick={() => onBulkPlantRow(rowIndex)}
                        >
                          <Rows weight="bold" className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Bulk plant row {rowIndex + 1} ({emptyInRow} empty)</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="w-8 h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
                      {rowIndex + 1}
                    </div>
                  )}
                </div>
                
                {rowPlots.map(plot => renderPlot(plot))}
              </div>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
