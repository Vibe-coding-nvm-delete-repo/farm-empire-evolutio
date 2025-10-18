import { useState } from 'react'
import { GameState } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CROPS, ANIMALS, BUILDINGS, TECH_TREE, ACHIEVEMENTS } from '@/lib/gameData'
import { Lock, Check, Sparkle } from '@phosphor-icons/react'

interface ProgressionSystemProps {
  gameState: GameState
}

export function ProgressionSystem({ gameState }: ProgressionSystemProps) {
  const [selectedTier, setSelectedTier] = useState<number | null>(null)

  const unlockedCrops = CROPS.filter(c => !c.requiredTech || gameState.techs.includes(c.requiredTech))
  const lockedCrops = CROPS.filter(c => c.requiredTech && !gameState.techs.includes(c.requiredTech))
  
  const unlockedAnimals = ANIMALS.filter(a => !a.requiredTech || gameState.techs.includes(a.requiredTech))
  const lockedAnimals = ANIMALS.filter(a => a.requiredTech && !gameState.techs.includes(a.requiredTech))
  
  const unlockedBuildings = BUILDINGS.filter(b => !b.requiredTech || gameState.techs.includes(b.requiredTech))
  const lockedBuildings = BUILDINGS.filter(b => b.requiredTech && !gameState.techs.includes(b.requiredTech))
  
  const purchasedTechs = TECH_TREE.filter(t => gameState.techs.includes(t.id))
  const availableTechs = TECH_TREE.filter(t => {
    const prereqsMet = t.prerequisites.every(p => gameState.techs.includes(p))
    return prereqsMet && !gameState.techs.includes(t.id)
  })
  const lockedTechs = TECH_TREE.filter(t => {
    const prereqsMet = t.prerequisites.every(p => gameState.techs.includes(p))
    return !prereqsMet && !gameState.techs.includes(t.id)
  })

  const getTierColor = (tier: number) => {
    const colors = [
      'bg-gray-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-pink-500',
    ]
    return colors[tier] || colors[0]
  }

  const getTierName = (tier: number) => {
    const names = ['Basic', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
    return names[tier] || 'Unknown'
  }

  const renderCropCard = (crop: typeof CROPS[0], isUnlocked: boolean) => (
    <TooltipProvider key={crop.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-3 rounded-lg border-2 transition-all ${
            isUnlocked 
              ? 'border-primary/30 bg-card hover:border-primary hover:shadow-md cursor-pointer' 
              : 'border-border/50 bg-muted/30 opacity-60'
          }`}>
            <div className="flex items-start gap-2">
              <div className="text-3xl flex-shrink-0">{crop.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{crop.name}</h4>
                  {!isUnlocked && <Lock className="w-3 h-3 flex-shrink-0" />}
                  {isUnlocked && <Check className="w-3 h-3 flex-shrink-0 text-green-500" />}
                </div>
                <Badge variant="secondary" className={`text-xs ${getTierColor(crop.tier)} text-white mb-1`}>
                  T{crop.tier} {getTierName(crop.tier)}
                </Badge>
                <p className="text-xs text-muted-foreground line-clamp-2">{crop.description}</p>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{crop.icon}</span>
              <div>
                <h4 className="font-bold">{crop.name}</h4>
                <p className="text-xs text-muted-foreground">{crop.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-semibold">Grow Time:</p>
                <p>{(crop.growTime / 1000).toFixed(0)}s</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p className="capitalize">{crop.category}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Cost:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(crop.cost).map(([k, v]) => (
                  <Badge key={k} variant="outline" className="text-xs">
                    {v} {k}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Yield:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(crop.yield).map(([k, v]) => (
                  <Badge key={k} variant="secondary" className="text-xs">
                    +{v} {k}
                  </Badge>
                ))}
              </div>
            </div>
            {crop.requiredTech && !isUnlocked && (
              <p className="text-xs text-amber-500 font-medium">
                Requires: {TECH_TREE.find(t => t.id === crop.requiredTech)?.name}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const renderAnimalCard = (animal: typeof ANIMALS[0], isUnlocked: boolean) => (
    <TooltipProvider key={animal.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-3 rounded-lg border-2 transition-all ${
            isUnlocked 
              ? 'border-primary/30 bg-card hover:border-primary hover:shadow-md cursor-pointer' 
              : 'border-border/50 bg-muted/30 opacity-60'
          }`}>
            <div className="flex items-start gap-2">
              <div className="text-3xl flex-shrink-0">{animal.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{animal.name}</h4>
                  {!isUnlocked && <Lock className="w-3 h-3 flex-shrink-0" />}
                  {isUnlocked && <Check className="w-3 h-3 flex-shrink-0 text-green-500" />}
                </div>
                <Badge variant="secondary" className={`text-xs ${getTierColor(animal.tier)} text-white mb-1`}>
                  T{animal.tier} {getTierName(animal.tier)}
                </Badge>
                <p className="text-xs text-muted-foreground line-clamp-2">{animal.description}</p>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{animal.icon}</span>
              <div>
                <h4 className="font-bold">{animal.name}</h4>
                <p className="text-xs text-muted-foreground">{animal.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-semibold">Production Time:</p>
                <p>{(animal.productionInterval / 1000).toFixed(0)}s</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p className="capitalize">{animal.category}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Purchase Cost:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(animal.cost).map(([k, v]) => (
                  <Badge key={k} variant="outline" className="text-xs">
                    {v} {k}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Production:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(animal.production).map(([k, v]) => (
                  <Badge key={k} variant="secondary" className="text-xs">
                    +{v} {k}
                  </Badge>
                ))}
              </div>
            </div>
            {animal.requiredTech && !isUnlocked && (
              <p className="text-xs text-amber-500 font-medium">
                Requires: {TECH_TREE.find(t => t.id === animal.requiredTech)?.name}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const renderBuildingCard = (building: typeof BUILDINGS[0], isUnlocked: boolean) => (
    <TooltipProvider key={building.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-3 rounded-lg border-2 transition-all ${
            isUnlocked 
              ? 'border-primary/30 bg-card hover:border-primary hover:shadow-md cursor-pointer' 
              : 'border-border/50 bg-muted/30 opacity-60'
          }`}>
            <div className="flex items-start gap-2">
              <div className="text-3xl flex-shrink-0">{building.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{building.name}</h4>
                  {!isUnlocked && <Lock className="w-3 h-3 flex-shrink-0" />}
                  {isUnlocked && <Check className="w-3 h-3 flex-shrink-0 text-green-500" />}
                </div>
                <Badge variant="secondary" className={`text-xs ${getTierColor(building.tier)} text-white mb-1`}>
                  T{building.tier} {getTierName(building.tier)}
                </Badge>
                <p className="text-xs text-muted-foreground line-clamp-2">{building.description}</p>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{building.icon}</span>
              <div>
                <h4 className="font-bold">{building.name}</h4>
                <p className="text-xs text-muted-foreground">{building.description}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">Cost:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(building.cost).map(([k, v]) => (
                  <Badge key={k} variant="outline" className="text-xs">
                    {v} {k}
                  </Badge>
                ))}
              </div>
            </div>
            {building.production && Object.keys(building.production).length > 0 && (
              <div>
                <p className="font-semibold text-xs mb-1">Production:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(building.production).map(([k, v]) => (
                    <Badge key={k} variant="secondary" className="text-xs">
                      +{v} {k} every {(building.productionRate / 1000).toFixed(0)}s
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {building.requiredTech && !isUnlocked && (
              <p className="text-xs text-amber-500 font-medium">
                Requires: {TECH_TREE.find(t => t.id === building.requiredTech)?.name}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          <h3 className="text-lg font-semibold">Complete Progression System</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Track all content, unlocks, and progression paths
        </p>
      </div>

      <Tabs defaultValue="crops" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-3 grid grid-cols-5 gap-1">
          <TabsTrigger value="crops" className="text-xs">
            Crops
            <Badge variant="secondary" className="ml-1 text-xs">
              {unlockedCrops.length}/{CROPS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="animals" className="text-xs">
            Animals
            <Badge variant="secondary" className="ml-1 text-xs">
              {unlockedAnimals.length}/{ANIMALS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="buildings" className="text-xs">
            Buildings
            <Badge variant="secondary" className="ml-1 text-xs">
              {unlockedBuildings.length}/{BUILDINGS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tech" className="text-xs">
            Tech
            <Badge variant="secondary" className="ml-1 text-xs">
              {purchasedTechs.length}/{TECH_TREE.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="flex-1 mt-0">
          <ScrollArea className="h-[550px]">
            <div className="p-4 space-y-4">
              {unlockedCrops.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlocked ({unlockedCrops.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {unlockedCrops.map(crop => renderCropCard(crop, true))}
                  </div>
                </div>
              )}
              
              {lockedCrops.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Locked ({lockedCrops.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {lockedCrops.map(crop => renderCropCard(crop, false))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="animals" className="flex-1 mt-0">
          <ScrollArea className="h-[550px]">
            <div className="p-4 space-y-4">
              {unlockedAnimals.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlocked ({unlockedAnimals.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {unlockedAnimals.map(animal => renderAnimalCard(animal, true))}
                  </div>
                </div>
              )}
              
              {lockedAnimals.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Locked ({lockedAnimals.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {lockedAnimals.map(animal => renderAnimalCard(animal, false))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="buildings" className="flex-1 mt-0">
          <ScrollArea className="h-[550px]">
            <div className="p-4 space-y-4">
              {unlockedBuildings.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlocked ({unlockedBuildings.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {unlockedBuildings.map(building => renderBuildingCard(building, true))}
                  </div>
                </div>
              )}
              
              {lockedBuildings.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Locked ({lockedBuildings.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {lockedBuildings.map(building => renderBuildingCard(building, false))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tech" className="flex-1 mt-0">
          <ScrollArea className="h-[550px]">
            <div className="p-4 space-y-3">
              {purchasedTechs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Unlocked ({purchasedTechs.length})</h4>
                  <div className="space-y-2">
                    {purchasedTechs.map(tech => (
                      <div key={tech.id} className="p-3 rounded-lg border bg-card/50">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm">{tech.name}</h5>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {tech.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {availableTechs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Available ({availableTechs.length})</h4>
                  <div className="space-y-2">
                    {availableTechs.map(tech => (
                      <div key={tech.id} className="p-3 rounded-lg border bg-card hover:border-primary transition-colors">
                        <div className="flex items-start gap-2">
                          <Sparkle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm">{tech.name}</h5>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{tech.category}</Badge>
                              <Badge variant="outline" className="text-xs">{tech.cost} research</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lockedTechs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Locked ({lockedTechs.length})</h4>
                  <div className="space-y-2">
                    {lockedTechs.map(tech => (
                      <div key={tech.id} className="p-3 rounded-lg border bg-muted/30 opacity-60">
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm">{tech.name}</h5>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">{tech.category}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="overview" className="flex-1 mt-0">
          <ScrollArea className="h-[550px]">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Crops</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{unlockedCrops.length}/{CROPS.length}</span>
                    </div>
                    <Progress value={(unlockedCrops.length / CROPS.length) * 100} />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Animals</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{unlockedAnimals.length}/{ANIMALS.length}</span>
                    </div>
                    <Progress value={(unlockedAnimals.length / ANIMALS.length) * 100} />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Buildings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{unlockedBuildings.length}/{BUILDINGS.length}</span>
                    </div>
                    <Progress value={(unlockedBuildings.length / BUILDINGS.length) * 100} />
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Technology</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{purchasedTechs.length}/{TECH_TREE.length}</span>
                    </div>
                    <Progress value={(purchasedTechs.length / TECH_TREE.length) * 100} />
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-3">Tier Distribution</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map(tier => {
                    const tierItems = [
                      ...CROPS.filter(c => c.tier === tier && (!c.requiredTech || gameState.techs.includes(c.requiredTech))),
                      ...ANIMALS.filter(a => a.tier === tier && (!a.requiredTech || gameState.techs.includes(a.requiredTech))),
                      ...BUILDINGS.filter(b => b.tier === tier && (!b.requiredTech || gameState.techs.includes(b.requiredTech))),
                    ]
                    const totalTierItems = [
                      ...CROPS.filter(c => c.tier === tier),
                      ...ANIMALS.filter(a => a.tier === tier),
                      ...BUILDINGS.filter(b => b.tier === tier),
                    ]
                    
                    if (totalTierItems.length === 0) return null
                    
                    return (
                      <div key={tier} className="flex items-center gap-2">
                        <Badge className={`${getTierColor(tier)} text-white text-xs w-20`}>
                          Tier {tier}
                        </Badge>
                        <Progress value={(tierItems.length / totalTierItems.length) * 100} className="flex-1" />
                        <span className="text-xs font-mono w-12 text-right">
                          {tierItems.length}/{totalTierItems.length}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
