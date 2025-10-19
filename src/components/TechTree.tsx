import { useState } from 'react'
import { Tech } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Flask, Lock } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'

interface TechTreeProps {
  techs: Tech[]
  researchPoints: number
  onPurchase: (techId: string) => void
  purchasedTechs: string[]
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

export function TechTree({ techs, researchPoints, onPurchase, purchasedTechs }: TechTreeProps) {
  const [viewMode, setViewMode] = useState<'category' | 'tier'>('category')
  
  const groupedByCategory = techs.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Tech[]>)

  const groupedByTier = techs.reduce((acc, tech) => {
    if (!acc[tech.tier]) acc[tech.tier] = []
    acc[tech.tier].push(tech)
    return acc
  }, {} as Record<number, Tech[]>)

  const sortedCategories = Object.keys(groupedByCategory).sort()
  const sortedTiers = Object.keys(groupedByTier).map(Number).sort()

  const totalTechs = techs.length
  const purchasedCount = techs.filter(t => purchasedTechs.includes(t.id)).length
  const progressPercent = (purchasedCount / totalTechs) * 100

  const renderTechCard = (tech: Tech) => {
    const canAfford = researchPoints >= tech.cost
    const isPurchased = purchasedTechs.includes(tech.id)
    const hasPrereqs = tech.prerequisites.every(p => purchasedTechs.includes(p))
    const isLocked = !hasPrereqs
    
    return (
      <TooltipProvider key={tech.id}>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Card
              className={`p-3 transition-all ${
                isPurchased
                  ? 'bg-primary/5 border-primary/20'
                  : isLocked
                  ? 'opacity-40 cursor-not-allowed'
                  : canAfford
                  ? 'border-primary/50 hover:border-primary hover:shadow-md cursor-pointer'
                  : 'opacity-50'
              }`}
              onClick={() => {
                if (canAfford && !isPurchased && hasPrereqs) {
                  onPurchase(tech.id)
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${CATEGORY_COLORS[tech.category]} flex items-center justify-center border`}>
                  {isPurchased ? (
                    <Check className="w-5 h-5" weight="bold" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" weight="fill" />
                  ) : (
                    <span className="text-lg">{CATEGORY_ICONS[tech.category]}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{tech.name}</h4>
                    {isPurchased && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{tech.description}</p>
                  <p className="text-xs text-primary font-medium mb-2">{tech.effect}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={canAfford ? "default" : "destructive"} className="text-xs">
                      <Flask className="w-3 h-3 mr-1" weight="fill" />
                      {tech.cost}
                    </Badge>
                    
                    <Badge variant="outline" className="text-xs">
                      Tier {tech.tier}
                    </Badge>
                    
                    {tech.prerequisites.length > 0 && (
                      <Badge variant={hasPrereqs ? "secondary" : "destructive"} className="text-xs">
                        Req: {tech.prerequisites.length}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!isPurchased && canAfford && hasPrereqs && (
                  <Button size="sm" className="flex-shrink-0">
                    Unlock
                  </Button>
                )}
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-sm">
            <div className="space-y-2">
              <p className="font-semibold">{tech.name}</p>
              <p className="text-xs">{tech.description}</p>
              <p className="text-xs text-primary">{tech.effect}</p>
              {tech.prerequisites.length > 0 && (
                <p className="text-xs text-muted-foreground pt-1">
                  Prerequisites: {tech.prerequisites.length} technologies {hasPrereqs ? '✓' : '✗'}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Technology Tree</h2>
          <p className="text-sm text-muted-foreground">
            {purchasedCount}/{totalTechs} unlocked
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <Flask weight="fill" className="w-4 h-4 text-purple-500" />
          <span className="font-semibold font-numeric">{researchPoints}</span>
          <span className="text-sm text-muted-foreground">RP</span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'category' | 'tier')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="tier">By Tier</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-4">
          <ScrollArea className="h-[480px]">
            <div className="space-y-4 pr-4">
              {sortedCategories.map((category) => {
                const categoryTechs = groupedByCategory[category]
                const purchasedInCategory = categoryTechs.filter(t => purchasedTechs.includes(t.id)).length
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                      <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {purchasedInCategory}/{categoryTechs.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {categoryTechs.map(renderTechCard)}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tier" className="mt-4">
          <ScrollArea className="h-[480px]">
            <div className="space-y-4 pr-4">
              {sortedTiers.map((tier) => {
                const tierTechs = groupedByTier[tier]
                const purchasedInTier = tierTechs.filter(t => purchasedTechs.includes(t.id)).length
                
                return (
                  <div key={tier}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                      <Badge className="text-base px-3">Tier {tier}</Badge>
                      <Badge variant="secondary" className="ml-auto">
                        {purchasedInTier}/{tierTechs.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {tierTechs.map(renderTechCard)}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {techs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">All technologies unlocked!</p>
          <p className="text-xs mt-1">You're a master researcher!</p>
        </div>
      )}
    </div>
  )
}
