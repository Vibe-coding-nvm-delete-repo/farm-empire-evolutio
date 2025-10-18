import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Crop, Building, Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Timer, TrendUp } from '@phosphor-icons/react'
import { canAfford } from '@/lib/gameEngine'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PlacementDialogProps {
  open: boolean
  onClose: () => void
  crops: Crop[]
  buildings: Building[]
  resources: Resources
  onPlaceCrop: (cropId: string) => void
  onPlaceBuilding: (buildingId: string) => void
}

const RESOURCE_ICONS: Record<string, any> = {
  gold: Coin,
  seeds: Plant,
  water: Drop,
  fertilizer: Leaf,
  energy: Lightning,
}

export function PlacementDialog({
  open,
  onClose,
  crops,
  buildings,
  resources,
  onPlaceCrop,
  onPlaceBuilding,
}: PlacementDialogProps) {
  const renderCost = (cost: Partial<Resources>) => {
    return Object.entries(cost).map(([key, value]) => {
      const Icon = RESOURCE_ICONS[key]
      const hasEnough = resources[key as keyof Resources] >= (value || 0)
      
      return (
        <span key={key} className={`flex items-center gap-1 ${hasEnough ? 'text-muted-foreground' : 'text-destructive'}`}>
          <Icon className="w-3 h-3" weight="fill" />
          {value}
        </span>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose What to Place</DialogTitle>
          <DialogDescription>
            Select a crop to grow or a building to automate your farm
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="crops" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crops">🌾 Crops</TabsTrigger>
            <TabsTrigger value="buildings">🏗️ Buildings</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="flex-1 overflow-y-auto mt-4">
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-3">
                {crops.map((crop) => {
                  const affordable = canAfford(resources, crop.cost)
                  
                  return (
                    <Tooltip key={crop.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-4 cursor-pointer transition-all ${
                            affordable ? 'hover:border-primary hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (affordable) {
                              onPlaceCrop(crop.id)
                              onClose()
                            }
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-5xl">{crop.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-base">{crop.name}</h4>
                                {!affordable && <Badge variant="destructive" className="text-xs">Can't Afford</Badge>}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Coin className="w-3 h-3" weight="fill" /> Cost:
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {renderCost(crop.cost)}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Timer className="w-3 h-3" weight="fill" /> Grow Time:
                                  </div>
                                  <div className="font-semibold">{Math.ceil(crop.growTime / 1000)}s</div>
                                </div>
                                
                                <div className="col-span-2">
                                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <TrendUp className="w-3 h-3" weight="fill" /> Harvest Yield:
                                  </div>
                                  <div className="flex gap-3">
                                    {Object.entries(crop.yield).map(([key, value]) => {
                                      const Icon = RESOURCE_ICONS[key]
                                      return (
                                        <span key={key} className="flex items-center gap-1 font-semibold text-primary">
                                          <Icon className="w-4 h-4" weight="fill" />
                                          +{value}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="font-semibold mb-1">{crop.name}</p>
                        <p className="text-sm">
                          {crop.id === 'wheat' && 'Basic crop. Fast growing, low cost. Perfect for building up resources early game.'}
                          {crop.id === 'corn' && 'Better than wheat. Slightly longer to grow but gives more gold and seeds.'}
                          {crop.id === 'tomato' && 'Unlocked with research. Gives valuable Research Points to unlock more tech!'}
                          {crop.id === 'carrot' && 'Root vegetable. Good balance of speed and profit.'}
                          {crop.id === 'pumpkin' && 'High-value specialty crop. Takes time but gives big research rewards.'}
                          {crop.id === 'grapes' && 'Fruit crop. Requires energy but provides good research and gold.'}
                          {crop.id === 'strawberry' && 'Berry crop. Medium difficulty, good research yield.'}
                          {crop.id === 'exotic_crystal' && 'Legendary crop! Extremely expensive but gives massive rewards. End-game content.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          </TabsContent>

          <TabsContent value="buildings" className="flex-1 overflow-y-auto mt-4">
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-3">
                {buildings.map((building) => {
                  const affordable = canAfford(resources, building.cost)
                  const hasProduction = building.production && Object.keys(building.production).length > 0
                  
                  return (
                    <Tooltip key={building.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-4 cursor-pointer transition-all ${
                            affordable ? 'hover:border-primary hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (affordable) {
                              onPlaceBuilding(building.id)
                              onClose()
                            }
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-5xl">{building.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-base">{building.name}</h4>
                                {!affordable && <Badge variant="destructive" className="text-xs">Can't Afford</Badge>}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">{building.description}</p>
                              
                              <div className="space-y-2 text-sm">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Cost:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {renderCost(building.cost)}
                                  </div>
                                </div>
                                
                                {hasProduction && (
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">Produces Every {building.productionRate / 1000}s:</div>
                                    <div className="flex gap-3">
                                      {Object.entries(building.production!).map(([key, value]) => {
                                        const Icon = RESOURCE_ICONS[key]
                                        return (
                                          <span key={key} className="flex items-center gap-1 font-semibold text-primary">
                                            <Icon className="w-4 h-4" weight="fill" />
                                            +{value}
                                          </span>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="font-semibold mb-1">{building.name}</p>
                        <p className="text-sm mb-2">{building.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {hasProduction ? 'This building produces resources automatically - no clicking needed!' : 'This building provides a passive bonus to your farm.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
