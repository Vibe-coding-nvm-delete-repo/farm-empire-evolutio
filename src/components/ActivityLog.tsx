import { useState } from 'react'
import { ActivityLogEntry } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface ActivityLogProps {
  log: ActivityLogEntry[]
}

const LOG_ICONS: Record<ActivityLogEntry['type'], string> = {
  harvest: '🌾',
  plant: '🌱',
  build: '🏗️',
  collect: '📦',
  feed: '🌽',
  unlock: '🔓',
  achievement: '🏆',
  production: '⚡',
}

const LOG_COLORS: Record<ActivityLogEntry['type'], string> = {
  harvest: 'bg-green-500/10 text-green-600 border-green-500/20',
  plant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  build: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  collect: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  feed: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  unlock: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  achievement: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  production: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
}

export function ActivityLog({ log }: ActivityLogProps) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredLog = log.filter(entry => {
    const matchesFilter = filter === 'all' || entry.type === filter
    const matchesSearch = entry.message.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Activity Log</h3>
          <Badge variant="secondary" className="ml-auto">
            {filteredLog.length} entries
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="harvest">Harvest</SelectItem>
              <SelectItem value="plant">Plant</SelectItem>
              <SelectItem value="collect">Collect</SelectItem>
              <SelectItem value="build">Build</SelectItem>
              <SelectItem value="unlock">Unlock</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredLog.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No activities yet</p>
              <p className="text-xs mt-1">Start farming to see your progress!</p>
            </div>
          ) : (
            filteredLog.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg border ${LOG_COLORS[entry.type]} flex items-center justify-center text-lg`}>
                  {entry.icon || LOG_ICONS[entry.type]}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    {entry.message}
                  </p>
                  
                  {entry.resources && Object.keys(entry.resources).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(entry.resources)
                        .filter(([_, v]) => v && v > 0)
                        .map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="text-xs font-mono px-1.5 py-0"
                          >
                            +{value} {key}
                          </Badge>
                        ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
