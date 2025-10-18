import { QueueTask } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock, Info } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getCropById, getBuildingById } from '@/lib/gameEngine'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface QueuePanelProps {
  queue: QueueTask[]
  onCancelTask: (taskId: string) => void
}

export function QueuePanel({ queue, onCancelTask }: QueuePanelProps) {
  const now = Date.now()

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="flex flex-col h-full bg-card/95 backdrop-blur-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock weight="fill" className="w-5 h-5 text-primary" />
            Active Tasks
          </h3>
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" weight="fill" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This panel shows your growing crops and building construction. Tasks complete automatically - just wait for them to finish!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
            <Clock weight="light" className="w-16 h-16 mb-3 opacity-30" />
            <p className="text-sm font-semibold mb-1">No Active Tasks</p>
            <p className="text-xs px-4">Plant crops or build structures to see your tasks appear here. They'll complete automatically!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((task) => {
              const remaining = Math.max(0, task.completesAt - now)
              const total = task.completesAt - task.startedAt
              const progress = total > 0 ? ((total - remaining) / total) * 100 : 0
              
              let taskName = 'Unknown'
              let taskIcon = '❓'
              
              if (task.type === 'plant' || task.type === 'harvest') {
                const crop = getCropById(task.targetId)
                if (crop) {
                  taskName = `Growing ${crop.name}`
                  taskIcon = crop.icon
                }
              } else if (task.type === 'build') {
                const building = getBuildingById(task.targetId)
                if (building) {
                  taskName = `Building ${building.name}`
                  taskIcon = building.icon
                }
              }

              return (
                <Card key={task.id} className="p-4 bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{taskIcon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold block mb-2">{taskName}</span>
                      
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {remaining > 0 ? 'Time remaining' : 'Complete!'}
                          </span>
                          <span className="font-semibold font-numeric">
                            {remaining > 0 ? formatTime(remaining) : '✓ Done'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
