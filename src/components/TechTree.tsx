import { Tech } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, Flask } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TechTreeProps {
  techs: Tech[]
  researchPoints: number
  onPurchase: (techId: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  crops: 'bg-green-500/10 border-green-500/30 text-green-600',
  animals: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
  automation: 'bg-purple-500/10 border-purple-500/30 text-purple-600',
  buildings: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
  efficiency: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600',
  processing: 'bg-pink-500/10 border-pink-500/30 text-pink-600',
  exotic: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
}

const CATEGORY_ICONS: Record<string, string> = {
  crops: '🌾',
  animals: '🐄',
  automation: '🤖',
  buildings: '🏗️',
  efficiency: '⚡',
  processing: '🏭',
  exotic: '💎',
}

export function TechTree({ techs, researchPoints, onPurchase }: TechTreeProps) {
  const groupedTechs = techs.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Tech[]>)

  const sortedCategories = Object.keys(groupedTechs).sort()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Technology Tree</h2>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <Flask weight="fill" className="w-4 h-4 text-purple-500" />
          <span className="font-semibold font-numeric">{researchPoints}</span>
          <span className="text-sm text-muted-foreground">Research Points</span>
        </div>
      </div>

      <ScrollArea className="h-[520px]">
        <div className="space-y-4 pr-4">
          {sortedCategories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedTechs[category].length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {groupedTechs[category].map((tech) => {
                  const canAfford = researchPoints >= tech.cost
                  const isPurchased = tech.purchased
                  
                  return (
                    <TooltipProvider key={tech.id}>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <Card
                            className={`p-3 transition-all ${
                              isPurchased
                                ? 'bg-card/50 opacity-60'
                                : canAfford
                                ? 'border-primary/50 hover:border-primary hover:shadow-md cursor-pointer'
                                : 'opacity-50'
                            }`}
                            onClick={() => {
                              if (canAfford && !isPurchased) {
                                onPurchase(tech.id)
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${CATEGORY_COLORS[tech.category]} flex items-center justify-center border`}>
                                {isPurchased ? (
                                  <Check className="w-5 h-5" weight="bold" />
                                ) : (
                                  <span className="text-lg">{CATEGORY_ICONS[tech.category]}</span>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm">{tech.name}</h4>
                                  {isPurchased && (
                                    <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{tech.description}</p>
                                
                                <div className="flex items-center gap-2">
                                  <Badge variant={canAfford ? "default" : "destructive"} className="text-xs">
                                    <Flask className="w-3 h-3 mr-1" weight="fill" />
                                    {tech.cost}
                                  </Badge>
                                  
                                  <Badge variant="outline" className="text-xs">
                                    Tier {tech.tier}
                                  </Badge>
                                  
                                  {tech.prerequisites.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      Requires {tech.prerequisites.length} tech
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {!isPurchased && canAfford && (
                                <Button size="sm" className="flex-shrink-0">
                                  Unlock
                                </Button>
                              )}
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-sm">
                          <div className="space-y-1">
                            <p className="font-semibold">{tech.name}</p>
                            <p className="text-xs">{tech.description}</p>
                            {tech.prerequisites.length > 0 && (
                              <p className="text-xs text-muted-foreground pt-1">
                                Prerequisites: {tech.prerequisites.length} technologies
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </div>
          ))}
          
          {sortedCategories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No technologies available</p>
              <p className="text-xs mt-1">Keep playing to unlock more!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
