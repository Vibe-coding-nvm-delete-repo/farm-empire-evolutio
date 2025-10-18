import { QueueTask } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, Clock } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getCropById, getBuildingById } from '@/lib/gameEngine'

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
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className="flex flex-col h-full bg-card/95 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock weight="fill" className="w-5 h-5 text-primary" />
          Task Queue ({queue.length})
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
            <Clock weight="light" className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No tasks in queue</p>
            <p className="text-xs mt-1">Plant crops or build to add tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((task, index) => {
              const remaining = Math.max(0, task.completesAt - now)
              const total = task.completesAt - task.startedAt
              const progress = total > 0 ? ((total - remaining) / total) * 100 : 0
              
              let taskName = 'Unknown'
              let taskIcon = '❓'
              
              if (task.type === 'plant' || task.type === 'harvest') {
                const crop = getCropById(task.targetId)
                if (crop) {
                  taskName = `${task.type === 'plant' ? 'Growing' : 'Harvesting'} ${crop.name}`
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
                <Card key={task.id} className="p-3 bg-muted/50">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{taskIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-medium truncate">{taskName}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 shrink-0"
                          onClick={() => onCancelTask(task.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{task.status === 'processing' ? 'In Progress' : 'Queued'}</span>
                          {task.status === 'processing' && (
                            <span>{formatTime(remaining)}</span>
                          )}
                        </div>
                        {task.status === 'processing' && (
                          <Progress value={progress} className="h-1.5" />
                        )}
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
