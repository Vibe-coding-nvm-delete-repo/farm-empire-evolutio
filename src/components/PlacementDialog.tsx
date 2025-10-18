import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Crop, Building, Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning } from '@phosphor-icons/react'
import { canAfford } from '@/lib/gameEngine'

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
          <DialogTitle>What would you like to place?</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="crops" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-2 gap-3">
              {crops.map((crop) => {
                const affordable = canAfford(resources, crop.cost)
                
                return (
                  <Card
                    key={crop.id}
                    className={`p-4 cursor-pointer transition-all ${
                      affordable ? 'hover:border-primary' : 'opacity-60'
                    }`}
                    onClick={() => {
                      if (affordable) {
                        onPlaceCrop(crop.id)
                        onClose()
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{crop.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{crop.name}</h4>
                        <div className="flex flex-wrap gap-2 text-xs mb-2">
                          {renderCost(crop.cost)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>Grow time: {Math.ceil(crop.growTime / 1000)}s</div>
                          <div className="flex items-center gap-2 mt-1">
                            Yield: {Object.entries(crop.yield).map(([key, value]) => {
                              const Icon = RESOURCE_ICONS[key]
                              return (
                                <span key={key} className="flex items-center gap-1">
                                  <Icon className="w-3 h-3" weight="fill" />
                                  {value}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="buildings" className="flex-1 overflow-y-auto mt-4">
            <div className="grid grid-cols-2 gap-3">
              {buildings.map((building) => {
                const affordable = canAfford(resources, building.cost)
                
                return (
                  <Card
                    key={building.id}
                    className={`p-4 cursor-pointer transition-all ${
                      affordable ? 'hover:border-primary' : 'opacity-60'
                    }`}
                    onClick={() => {
                      if (affordable) {
                        onPlaceBuilding(building.id)
                        onClose()
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{building.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{building.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{building.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {renderCost(building.cost)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
