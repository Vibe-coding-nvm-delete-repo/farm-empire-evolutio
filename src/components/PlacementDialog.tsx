import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Crop, Building, Animal, Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Timer, TrendUp } from '@phosphor-icons/react'
import { canAfford } from '@/lib/gameEngine'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PlacementDialogProps {
  open: boolean
  onClose: () => void
  crops: Crop[]
  animals: Animal[]
  buildings: Building[]
  resources: Resources
  onPlaceCrop: (cropId: string) => void
  onPlaceAnimal: (animalId: string) => void
  onPlaceBuilding: (buildingId: string) => void
}

const RESOURCE_ICONS: Record<string, any> = {
  gold: Coin,
  seeds: Plant,
  water: Drop,
  fertilizer: Leaf,
  energy: Lightning,
  hay: Leaf,
  research: TrendUp,
}

export function PlacementDialog({
  open,
  onClose,
  crops,
  animals,
  buildings,
  resources,
  onPlaceCrop,
  onPlaceAnimal,
  onPlaceBuilding,
}: PlacementDialogProps) {
  const renderCost = (cost: Partial<Resources>) => {
    return Object.entries(cost).map(([key, value]) => {
      const Icon = RESOURCE_ICONS[key] || Coin
      const hasEnough = resources[key as keyof Resources] >= (value || 0)
      
      return (
        <Badge
          key={key}
          variant={hasEnough ? "secondary" : "destructive"}
          className="text-xs"
        >
          {value} {key}
        </Badge>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose What to Place</DialogTitle>
          <DialogDescription>
            Select a crop, animal, or building for this plot
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="crops" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crops">🌾 Crops ({crops.length})</TabsTrigger>
            <TabsTrigger value="animals">🐄 Animals ({animals.length})</TabsTrigger>
            <TabsTrigger value="buildings">🏗️ Buildings ({buildings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-2 gap-2">
              {crops.map((crop) => {
                const affordable = canAfford(resources, crop.cost)
                
                return (
                  <TooltipProvider key={crop.id}>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-3 cursor-pointer transition-all ${
                            affordable ? 'hover:border-primary hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (affordable) {
                              onPlaceCrop(crop.id)
                              onClose()
                            }
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-3xl">{crop.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate mb-1">{crop.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{crop.description}</p>
                              
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {renderCost(crop.cost)}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    ⏱ {Math.ceil(crop.growTime / 1000)}s
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-sm">
                        <div>
                          <h4 className="font-bold mb-1">{crop.name}</h4>
                          <p className="text-xs mb-2">{crop.description}</p>
                          <div className="text-xs space-y-1">
                            <p><span className="font-semibold">Yield:</span> {Object.entries(crop.yield).map(([k, v]) => `${v} ${k}`).join(', ')}</p>
                            <p><span className="font-semibold">Category:</span> {crop.category}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="animals" className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-2 gap-2">
              {animals.map((animal) => {
                const affordable = canAfford(resources, animal.cost)
                
                return (
                  <TooltipProvider key={animal.id}>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-3 cursor-pointer transition-all ${
                            affordable ? 'hover:border-primary hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (affordable) {
                              onPlaceAnimal(animal.id)
                              onClose()
                            }
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-3xl">{animal.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate mb-1">{animal.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{animal.description}</p>
                              
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {renderCost(animal.cost)}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    Produces: {Object.entries(animal.production).map(([k, v]) => `${v} ${k}`).join(', ')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-sm">
                        <div>
                          <h4 className="font-bold mb-1">{animal.name}</h4>
                          <p className="text-xs mb-2">{animal.description}</p>
                          <div className="text-xs space-y-1">
                            <p><span className="font-semibold">Production:</span> {Object.entries(animal.production).map(([k, v]) => `${v} ${k}`).join(', ')}</p>
                            <p><span className="font-semibold">Interval:</span> {(animal.productionInterval / 1000).toFixed(0)}s</p>
                            <p><span className="font-semibold">Feed Cost:</span> {Object.entries(animal.feedCost).map(([k, v]) => `${v} ${k}`).join(', ')}</p>
                            <p><span className="font-semibold">Category:</span> {animal.category}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="buildings" className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-2 gap-2">
              {buildings.map((building) => {
                const affordable = canAfford(resources, building.cost)
                const hasProduction = building.production && Object.keys(building.production).length > 0
                
                return (
                  <TooltipProvider key={building.id}>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-3 cursor-pointer transition-all ${
                            affordable ? 'hover:border-primary hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (affordable) {
                              onPlaceBuilding(building.id)
                              onClose()
                            }
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-3xl">{building.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate mb-1">{building.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{building.description}</p>
                              
                              <div className="space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  {renderCost(building.cost)}
                                </div>
                                {hasProduction && (
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      Produces: {Object.entries(building.production!).map(([k, v]) => `${v} ${k}`).join(', ')}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-sm">
                        <div>
                          <h4 className="font-bold mb-1">{building.name}</h4>
                          <p className="text-xs mb-2">{building.description}</p>
                          {hasProduction && (
                            <div className="text-xs space-y-1">
                              <p><span className="font-semibold">Production:</span> {Object.entries(building.production!).map(([k, v]) => `${v} ${k}`).join(', ')}</p>
                              <p><span className="font-semibold">Rate:</span> Every {(building.productionRate / 1000).toFixed(0)}s</p>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
