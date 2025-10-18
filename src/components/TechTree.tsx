import { Tech } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lock, Check, Flask, Info } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TechTreeProps {
  techs: Tech[]
  researchPoints: number
  onPurchase: (techId: string) => void
}

const CATEGORY_COLORS = {
  crops: 'bg-primary/10 border-primary text-primary',
  automation: 'bg-purple-500/10 border-purple-500 text-purple-500',
  buildings: 'bg-secondary/10 border-secondary text-secondary',
  efficiency: 'bg-blue-500/10 border-blue-500 text-blue-500',
  exotic: 'bg-accent/10 border-accent text-accent-foreground',
}

const CATEGORY_DESCRIPTIONS = {
  crops: 'Unlock new crop varieties to diversify your farm',
  automation: 'Advanced automation technologies for hands-free farming',
  buildings: 'Structures that produce resources automatically',
  efficiency: 'Improve your farm\'s productivity and reduce costs',
  exotic: 'Rare and powerful late-game technologies',
}

export function TechTree({ techs, researchPoints, onPurchase }: TechTreeProps) {
  const groupedTechs = techs.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Tech[]>)

  return (
    <ScrollArea className="h-[550px]">
      <TooltipProvider>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Technology Tree</h2>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500 cursor-help">
                  <Flask weight="fill" className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold font-numeric text-lg">{researchPoints}</span>
                  <span className="text-sm text-muted-foreground">Research</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Earn Research Points by harvesting special crops like Tomatoes or building Research Labs</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {Object.entries(groupedTechs).map(([category, categoryTechs]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" weight="fill" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS]}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryTechs.map((tech) => {
                  const canAfford = researchPoints >= tech.cost
                  const isAvailable = tech.unlocked && !tech.purchased
                  
                  return (
                    <Tooltip key={tech.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`
                            p-4 transition-all duration-200
                            ${tech.purchased ? 'bg-muted border-primary/30' : ''}
                            ${isAvailable && canAfford ? 'border-primary cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
                            ${isAvailable && !canAfford ? 'border-destructive/30 cursor-not-allowed opacity-75' : ''}
                            ${!tech.purchased && !isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                          `}
                          onClick={() => isAvailable && canAfford && onPurchase(tech.id)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{tech.name}</h4>
                                <p className="text-sm text-muted-foreground">{tech.description}</p>
                              </div>
                              {tech.purchased ? (
                                <Check weight="bold" className="w-5 h-5 text-primary shrink-0" />
                              ) : !isAvailable ? (
                                <Lock weight="fill" className="w-5 h-5 text-muted-foreground shrink-0" />
                              ) : null}
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={CATEGORY_COLORS[tech.category]}>
                                {category}
                              </Badge>
                              
                              {!tech.purchased && (
                                <div className="flex items-center gap-1">
                                  <Flask weight="fill" className="w-4 h-4 text-purple-500" />
                                  <span className={`text-sm font-semibold ${canAfford ? 'text-purple-500' : 'text-destructive'}`}>
                                    {tech.cost}
                                  </span>
                                </div>
                              )}
                            </div>

                            {tech.prerequisites.length > 0 && !tech.purchased && (
                              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                <strong>Requires:</strong> {tech.prerequisites.map(id => {
                                  const prereq = techs.find(t => t.id === id)
                                  return prereq?.name || id
                                }).join(', ')}
                              </div>
                            )}
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-sm">
                        <p className="font-semibold mb-1">{tech.name}</p>
                        <p className="text-sm mb-2">{tech.description}</p>
                        {!tech.purchased && !isAvailable && tech.prerequisites.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            🔒 Unlock {tech.prerequisites.map(id => techs.find(t => t.id === id)?.name).join(' and ')} first
                          </p>
                        )}
                        {!tech.purchased && isAvailable && !canAfford && (
                          <p className="text-xs text-destructive">
                            ⚠️ Need {tech.cost - researchPoints} more Research Points
                          </p>
                        )}
                        {!tech.purchased && isAvailable && canAfford && (
                          <p className="text-xs text-primary font-semibold">
                            ✨ Click to unlock!
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </ScrollArea>
  )
}
