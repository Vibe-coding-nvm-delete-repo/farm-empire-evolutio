import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { ResourceBar } from '@/components/ResourceBar'
import { FarmGrid } from '@/components/FarmGrid'
import { QueuePanel } from '@/components/QueuePanel'
import { TechTree } from '@/components/TechTree'
import { PlacementDialog } from '@/components/PlacementDialog'
import { AchievementsPanel } from '@/components/AchievementsPanel'
import { ActivityLog } from '@/components/ActivityLog'
import { ProgressionSystem } from '@/components/ProgressionSystem'
import { TutorialOverlay } from '@/components/TutorialOverlay'
import { HelpButton } from '@/components/HelpButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Toaster, toast } from 'sonner'
import {
  canAfford,
  deductResources,
  addResources,
  getCropById,
  getAnimalById,
  getBuildingById,
  getTechById,
  getUnlockedCrops,
  getUnlockedAnimals,
  getUnlockedBuildings,
  getAvailableTechs,
  applyTechEffects,
  checkAchievements,
  calculateGrowTime,
  calculateCost,
  calculateAnimalProduction,
  calculateAnimalProductionInterval,
  addActivityLog,
  formatResourceGain,
} from '@/lib/gameEngine'
import { Trophy, TreeStructure, Farm, ListBullets, Sparkle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

function App() {
  const [gameState, setGameState] = useGameState()
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('farm')
  const [hasSeenTutorial, setHasSeenTutorial] = useKV<boolean>('tutorial-completed', false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((current) => {
        if (!current) return gameState
        
        let updated = applyTechEffects(current)
        const modifiers = (updated as any)._modifiers
        const now = Date.now()

        updated.plots = updated.plots.map(plot => {
          if (plot.type === 'building' && plot.buildingId) {
            const building = getBuildingById(plot.buildingId)
            if (building && building.production && Object.keys(building.production).length > 0) {
              const lastProduction = (plot as any).lastProduction || now
              const elapsed = now - lastProduction
              
              if (elapsed >= building.productionRate) {
                const productionAmount = building.production
                let actualProduction = { ...productionAmount }
                
                if (building.id === 'windmill' || building.id === 'solar_panel') {
                  Object.keys(actualProduction).forEach(key => {
                    if (key === 'energy') {
                      actualProduction[key] = Math.floor((actualProduction[key] || 0) * (modifiers?.energyProductionMultiplier || 1))
                    }
                  })
                }
                
                updated.resources = addResources(updated.resources, actualProduction)
                return { ...plot, lastProduction: now } as any
              }
            }
          }
          
          if (plot.type === 'animal' && plot.animalId) {
            const animal = getAnimalById(plot.animalId)
            if (animal) {
              const lastProduction = (plot as any).lastProduction || now
              const lastFed = (plot as any).lastFed || now
              const productionInterval = calculateAnimalProductionInterval(animal.productionInterval, modifiers)
              
              const timeSinceProduction = now - lastProduction
              const timeSinceFed = now - lastFed
              
              if (timeSinceProduction >= productionInterval && timeSinceFed < animal.feedInterval * 2) {
                const production = calculateAnimalProduction(animal.production, modifiers)
                updated.resources = addResources(updated.resources, production)
                updated.totalAnimalProducts++
                return { ...plot, lastProduction: now } as any
              }
              
              if (timeSinceFed >= animal.feedInterval && canAfford(updated.resources, animal.feedCost)) {
                updated.resources = deductResources(updated.resources, animal.feedCost)
                return { ...plot, lastFed: now } as any
              }
            }
          }
          
          return plot
        })

        updated = checkAchievements(updated)
        return updated
      })
    }, 100)

    return () => clearInterval(interval)
  }, [gameState, setGameState])

  const handlePlotClick = (plotId: string) => {
    const plot = gameState.plots.find(p => p.id === plotId)
    if (!plot) return

    if (plot.type === 'empty') {
      setSelectedPlotId(plotId)
      setPlacementDialogOpen(true)
    } else if (plot.type === 'crop' && plot.completesAt && plot.completesAt <= Date.now()) {
      const crop = getCropById(plot.cropId!)
      if (crop) {
        const modifiers = (applyTechEffects(gameState) as any)._modifiers
        const yield_ = calculateYield(crop.yield, modifiers)
        
        setGameState(current => {
          if (!current) return gameState
          
          let updated = {
            ...current,
            resources: addResources(current.resources, yield_),
            totalHarvested: current.totalHarvested + 1,
            totalGoldEarned: current.totalGoldEarned + (yield_.gold || 0),
            plots: current.plots.map(p =>
              p.id === plotId
                ? { ...p, type: 'empty' as const, cropId: undefined, plantedAt: undefined, completesAt: undefined }
                : p
            ),
          }
          
          updated = addActivityLog(updated, {
            type: 'harvest',
            message: `Harvested ${crop.name}`,
            resources: yield_,
            icon: crop.icon,
          })
          
          return checkAchievements(updated)
        })
        
        toast.success(`Harvested ${crop.name}!`, {
          description: formatResourceGain(yield_),
          duration: 2000,
        })
      }
    } else if (plot.type === 'animal' && plot.animalId) {
      const animal = getAnimalById(plot.animalId)
      if (animal) {
        const now = Date.now()
        const lastProduction = (plot as any).lastProduction || now
        const lastFed = (plot as any).lastFed || now
        const timeSinceFed = now - lastFed
        
        if (timeSinceFed >= animal.feedInterval * 0.8) {
          toast.info(`${animal.name} needs feeding soon!`, {
            description: `Feed cost: ${formatResourceGain(animal.feedCost)}`,
            duration: 2000,
          })
        }
      }
    }
  }

  const handlePlaceCrop = (cropId: string) => {
    if (!selectedPlotId) return

    const crop = getCropById(cropId)
    if (!crop) return

    const modifiers = (applyTechEffects(gameState) as any)._modifiers
    const cost = calculateCost(crop.cost, modifiers)
    const growTime = calculateGrowTime(crop.growTime, modifiers)

    if (!canAfford(gameState.resources, cost)) {
      toast.error('Not enough resources!')
      return
    }

    setGameState(current => {
      if (!current) return gameState
      
      const now = Date.now()
      const completesAt = now + growTime

      let updated = {
        ...current,
        resources: deductResources(current.resources, cost),
        plots: current.plots.map(p =>
          p.id === selectedPlotId
            ? { ...p, type: 'crop' as const, cropId, plantedAt: now, completesAt }
            : p
        ),
      }
      
      updated = addActivityLog(updated, {
        type: 'plant',
        message: `Planted ${crop.name}`,
        icon: crop.icon,
      })
      
      return updated
    })

    toast.success(`Planted ${crop.name}!`, { duration: 1500 })
    setSelectedPlotId(null)
    setPlacementDialogOpen(false)
  }

  const handlePlaceAnimal = (animalId: string) => {
    if (!selectedPlotId) return

    const animal = getAnimalById(animalId)
    if (!animal) return

    if (!canAfford(gameState.resources, animal.cost)) {
      toast.error('Not enough resources!')
      return
    }

    setGameState(current => {
      if (!current) return gameState
      
      const now = Date.now()

      let updated = {
        ...current,
        resources: deductResources(current.resources, animal.cost),
        plots: current.plots.map(p =>
          p.id === selectedPlotId
            ? { ...p, type: 'animal' as const, animalId, plantedAt: now, lastProduction: now, lastFed: now } as any
            : p
        ),
      }
      
      updated = addActivityLog(updated, {
        type: 'build',
        message: `Purchased ${animal.name}`,
        icon: animal.icon,
      })
      
      return checkAchievements(updated)
    })

    toast.success(`Purchased ${animal.name}!`, { duration: 1500 })
    setSelectedPlotId(null)
    setPlacementDialogOpen(false)
  }

  const handlePlaceBuilding = (buildingId: string) => {
    if (!selectedPlotId) return

    const building = getBuildingById(buildingId)
    if (!building) return

    if (!canAfford(gameState.resources, building.cost)) {
      toast.error('Not enough resources!')
      return
    }

    setGameState(current => {
      if (!current) return gameState
      
      const now = Date.now()

      let updated = {
        ...current,
        resources: deductResources(current.resources, building.cost),
        plots: current.plots.map(p =>
          p.id === selectedPlotId
            ? { ...p, type: 'building' as const, buildingId, plantedAt: now, lastProduction: now } as any
            : p
        ),
      }
      
      updated = addActivityLog(updated, {
        type: 'build',
        message: `Built ${building.name}`,
        icon: building.icon,
      })
      
      return checkAchievements(updated)
    })

    toast.success(`Built ${building.name}!`, { duration: 1500 })
    setSelectedPlotId(null)
    setPlacementDialogOpen(false)
  }

  const handlePurchaseTech = (techId: string) => {
    const tech = getTechById(techId)
    if (!tech) return

    if (gameState.resources.research < tech.cost) {
      toast.error('Not enough research points!')
      return
    }

    setGameState(current => {
      if (!current) return gameState
      
      let updated = {
        ...current,
        resources: { ...current.resources, research: current.resources.research - tech.cost },
        techs: [...current.techs, techId],
      }
      
      updated = addActivityLog(updated, {
        type: 'unlock',
        message: `Unlocked ${tech.name}`,
        icon: '🔬',
      })
      
      return checkAchievements(updated)
    })

    toast.success(`Unlocked ${tech.name}!`, {
      description: tech.description,
      duration: 2500,
    })
  }

  const handleCancelTask = (taskId: string) => {
    setGameState(current => {
      if (!current) return gameState
      
      return {
        ...current,
        queue: current.queue.filter(t => t.id !== taskId),
      }
    })
    toast.info('Task cancelled', { duration: 1000 })
  }

  const unlockedCrops = getUnlockedCrops(gameState.techs)
  const unlockedAnimals = getUnlockedAnimals(gameState.techs)
  const unlockedBuildings = getUnlockedBuildings(gameState.techs)
  const availableTechs = getAvailableTechs(gameState.techs)

  const achievementProgress: Record<string, number> = {
    first_harvest: gameState.totalHarvested,
    harvest_10: gameState.totalHarvested,
    harvest_50: gameState.totalHarvested,
    harvest_100: gameState.totalHarvested,
    harvest_500: gameState.totalHarvested,
    harvest_1000: gameState.totalHarvested,
    wealth_500: gameState.totalGoldEarned,
    wealth_2000: gameState.totalGoldEarned,
    wealth_10000: gameState.totalGoldEarned,
    wealth_50000: gameState.totalGoldEarned,
    wealth_100000: gameState.totalGoldEarned,
    tech_first: gameState.techs.length,
    tech_5: gameState.techs.length,
    tech_15: gameState.techs.length,
    tech_30: gameState.techs.length,
    first_animal: gameState.plots.filter(p => p.type === 'animal').length,
    animals_5: gameState.plots.filter(p => p.type === 'animal').length,
    animals_15: gameState.plots.filter(p => p.type === 'animal').length,
    animal_products_50: gameState.totalAnimalProducts,
    animal_products_200: gameState.totalAnimalProducts,
    automation_first: gameState.plots.filter(p => p.type === 'building').length,
    automation_5: gameState.plots.filter(p => p.type === 'building').length,
    automation_15: gameState.plots.filter(p => p.type === 'building').length,
    diverse_farm: new Set(gameState.plots.filter(p => p.cropId).map(p => p.cropId)).size,
    diverse_ranch: new Set(gameState.plots.filter(p => p.animalId).map(p => p.animalId)).size,
    empire_builder: gameState.plots.filter(p => p.type === 'building').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" richColors closeButton />
      
      {!hasSeenTutorial && (
        <TutorialOverlay onComplete={() => setHasSeenTutorial(() => true)} />
      )}
      
      <HelpButton />
      
      <div className="container mx-auto p-4 max-w-[1600px]">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-center mb-1 text-primary flex items-center justify-center gap-2">
            🌾 Farm Empire
          </h1>
          <p className="text-center text-sm text-muted-foreground">Build the ultimate farming dynasty</p>
        </div>

        <div className="mb-4">
          <ResourceBar resources={gameState.resources} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
          <div>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-5 mb-3">
                <TabsTrigger value="farm" className="flex items-center gap-1 text-sm">
                  <Farm weight="fill" className="w-4 h-4" />
                  Farm
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex items-center gap-1 text-sm">
                  <TreeStructure weight="fill" className="w-4 h-4" />
                  Tech
                  {availableTechs.length > 0 && (
                    <Badge variant="default" className="ml-1 px-1 py-0 text-xs">
                      {availableTechs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-1 text-sm">
                  <Trophy weight="fill" className="w-4 h-4" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="progression" className="flex items-center gap-1 text-sm">
                  <Sparkle weight="fill" className="w-4 h-4" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="log" className="flex items-center gap-1 text-sm">
                  <ListBullets weight="fill" className="w-4 h-4" />
                  Log
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {gameState.activityLog.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="farm" className="mt-0">
                <FarmGrid plots={gameState.plots} onPlotClick={handlePlotClick} />
              </TabsContent>

              <TabsContent value="tech" className="mt-0 bg-card rounded-lg border p-4">
                <TechTree
                  techs={availableTechs}
                  researchPoints={gameState.resources.research}
                  onPurchase={handlePurchaseTech}
                />
              </TabsContent>

              <TabsContent value="achievements" className="mt-0 bg-card rounded-lg border h-[600px]">
                <AchievementsPanel
                  completedAchievements={gameState.achievements}
                  currentProgress={achievementProgress}
                />
              </TabsContent>

              <TabsContent value="progression" className="mt-0 h-[600px]">
                <ProgressionSystem gameState={gameState} />
              </TabsContent>

              <TabsContent value="log" className="mt-0 h-[600px]">
                <ActivityLog log={gameState.activityLog} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-[600px]">
            <QueuePanel queue={gameState.queue} onCancelTask={handleCancelTask} />
          </div>
        </div>
      </div>

      <PlacementDialog
        open={placementDialogOpen}
        onClose={() => {
          setPlacementDialogOpen(false)
          setSelectedPlotId(null)
        }}
        crops={unlockedCrops}
        animals={unlockedAnimals}
        buildings={unlockedBuildings}
        resources={gameState.resources}
        onPlaceCrop={handlePlaceCrop}
        onPlaceAnimal={handlePlaceAnimal}
        onPlaceBuilding={handlePlaceBuilding}
      />
    </div>
  )
}

function calculateYield(baseYield: Partial<import('@/lib/types').Resources>, modifiers: any) {
  const multiplier = modifiers?.yieldMultiplier || 1
  const result: Partial<import('@/lib/types').Resources> = {}
  Object.entries(baseYield).forEach(([key, value]) => {
    result[key as keyof import('@/lib/types').Resources] = Math.floor((value || 0) * multiplier)
  })
  return result
}

export default App
