import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { ResourceBar } from '@/components/ResourceBar'
import { FarmGrid } from '@/components/FarmGrid'
import { QueuePanel } from '@/components/QueuePanel'
import { TechTree } from '@/components/TechTree'
import { PlacementDialog } from '@/components/PlacementDialog'
import { AchievementsPanel } from '@/components/AchievementsPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import {
  canAfford,
  deductResources,
  addResources,
  getCropById,
  getBuildingById,
  getTechById,
  getUnlockedCrops,
  getUnlockedBuildings,
  getAvailableTechs,
  applyTechEffects,
  processQueue,
  checkAchievements,
  calculateGrowTime,
  calculateCost,
} from '@/lib/gameEngine'
import { QueueTask } from '@/lib/types'
import { Trophy, TreeStructure, Farm } from '@phosphor-icons/react'

function App() {
  const [gameState, setGameState] = useGameState()
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('farm')

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((current) => {
        if (!current) return gameState
        
        let updated = applyTechEffects(current)
        updated = processQueue(updated)
        updated = checkAchievements(updated)

        const now = Date.now()
        updated.plots.forEach(plot => {
          if (plot.type === 'building' && plot.buildingId) {
            const building = getBuildingById(plot.buildingId)
            if (building && building.production) {
              const lastProduction = (plot as any).lastProduction || now
              const elapsed = now - lastProduction
              
              if (elapsed >= building.productionRate) {
                updated.resources = addResources(updated.resources, building.production)
                ;(plot as any).lastProduction = now
              }
            }
          }
        })

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
        const yield_ = addResources({ gold: 0, seeds: 0, water: 0, fertilizer: 0, energy: 0, research: 0 }, crop.yield)
        
        setGameState(current => {
          if (!current) return gameState
          
          const updated = {
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
          return checkAchievements(updated)
        })
        
        toast.success(`Harvested ${crop.name}!`, {
          description: `Gained ${Object.entries(yield_).filter(([_, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(', ')}`,
        })
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

      return {
        ...current,
        resources: deductResources(current.resources, cost),
        plots: current.plots.map(p =>
          p.id === selectedPlotId
            ? { ...p, type: 'crop' as const, cropId, plantedAt: now, completesAt }
            : p
        ),
      }
    })

    toast.success(`Planted ${crop.name}!`)
    setSelectedPlotId(null)
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

      return {
        ...current,
        resources: deductResources(current.resources, building.cost),
        plots: current.plots.map(p =>
          p.id === selectedPlotId
            ? { ...p, type: 'building' as const, buildingId, plantedAt: now, lastProduction: now } as any
            : p
        ),
      }
    })

    toast.success(`Built ${building.name}!`)
    setSelectedPlotId(null)
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
      
      return {
        ...current,
        resources: { ...current.resources, research: current.resources.research - tech.cost },
        techs: [...current.techs, techId],
      }
    })

    toast.success(`Unlocked ${tech.name}!`, {
      description: tech.description,
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
    toast.info('Task cancelled')
  }

  const unlockedCrops = getUnlockedCrops(gameState.techs)
  const unlockedBuildings = getUnlockedBuildings(gameState.techs)
  const availableTechs = getAvailableTechs(gameState.techs)

  const achievementProgress: Record<string, number> = {
    first_harvest: gameState.totalHarvested,
    harvest_10: gameState.totalHarvested,
    harvest_100: gameState.totalHarvested,
    harvest_1000: gameState.totalHarvested,
    wealth_1000: gameState.totalGoldEarned,
    wealth_10000: gameState.totalGoldEarned,
    tech_first: gameState.techs.length,
    tech_10: gameState.techs.length,
    automation_first: gameState.plots.filter(p => p.type === 'building').length,
    queue_master: gameState.queue.length,
    diverse_farm: new Set(gameState.plots.filter(p => p.cropId).map(p => p.cropId)).size,
    prestige_ready: gameState.totalGoldEarned,
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-primary">
            🌾 Farm Empire
          </h1>
          <p className="text-center text-muted-foreground">Grow your agricultural dynasty</p>
        </div>

        <div className="mb-4">
          <ResourceBar resources={gameState.resources} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="farm" className="flex items-center gap-2">
                  <Farm weight="fill" className="w-4 h-4" />
                  Farm
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex items-center gap-2">
                  <TreeStructure weight="fill" className="w-4 h-4" />
                  Tech Tree
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy weight="fill" className="w-4 h-4" />
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="farm" className="mt-0">
                <FarmGrid plots={gameState.plots} onPlotClick={handlePlotClick} />
              </TabsContent>

              <TabsContent value="tech" className="mt-0 bg-card rounded-lg border">
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
        buildings={unlockedBuildings}
        resources={gameState.resources}
        onPlaceCrop={handlePlaceCrop}
        onPlaceBuilding={handlePlaceBuilding}
      />
    </div>
  )
}

export default App