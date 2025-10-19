import { useState, useEffect, useMemo, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { Resources } from '@/lib/types'
import { ResourceBar } from '@/components/ResourceBar'
import { StatsOverview } from '@/components/StatsOverview'
import { FarmGrid } from '@/components/FarmGrid'
import { QueuePanel } from '@/components/QueuePanel'
import { TechTree } from '@/components/TechTree'
import { PlacementDialog } from '@/components/PlacementDialog'
import { AchievementsPanel } from '@/components/AchievementsPanel'
import { ActivityLog } from '@/components/ActivityLog'
import { ProgressionSystem } from '@/components/ProgressionSystem'
import { TutorialOverlay } from '@/components/TutorialOverlay'
import { HelpButton } from '@/components/HelpButton'
import { ChatBot } from '@/components/ChatBot'
import { ProgressionPath } from '@/components/ProgressionPath'
import { AchievementPopup } from '@/components/AchievementPopup'
import { HarvestRollAnimation } from '@/components/HarvestRollAnimation'
import { ResourceCenter } from '@/components/ResourceCenter'
import { ResourceHelpBanner } from '@/components/ResourceHelpBanner'
import { NotificationsPanel } from '@/components/NotificationsPanel'
import { NotificationsProvider, useNotifications } from '@/contexts/NotificationsContext'
import { UnlockNotificationManager } from '@/components/UnlockNotification'
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
  calculateYield,
  calculateAnimalProduction,
  calculateAnimalProductionInterval,
  addActivityLog,
  formatResourceGain,
  getAchievementById,
  rollHarvestBonus,
  applyHarvestBonus,
} from '@/lib/gameEngine'
import { Trophy, TreeStructure, Farm, ListBullets, Sparkle, Bell, Book } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

function AppContent() {
  const [gameState, setGameState] = useGameState()
  const { addNotification } = useNotifications()
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [bulkPlantRowIndex, setBulkPlantRowIndex] = useState<number | null>(null)
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('farm')
  const [hasSeenTutorial, setHasSeenTutorial] = useKV<boolean>('tutorial-completed', false)
  const [achievementPopup, setAchievementPopup] = useState<any>(null)
  const [previousAchievements, setPreviousAchievements] = useState<string[]>([])
  const [previousTechs, setPreviousTechs] = useState<string[]>([])
  const [recentLogCount, setRecentLogCount] = useState(0)
  const [harvestRoll, setHarvestRoll] = useState<{ rollValue: number, isCritical: boolean, position: { x: number, y: number } } | null>(null)
  const [unlockQueue, setUnlockQueue] = useState<Array<{ id: string, type: 'achievement' | 'tech' | 'progression', title: string, description: string, icon?: string }>>([])
  

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((current) => {
        if (!current || !current.resources || !current.plots) return current
        
        const now = Date.now()
        let hasChanges = false
        const modifiers = (applyTechEffects(current) as any)._modifiers
        
        let resourceChanges: Partial<Resources> = {}
        let animalProductCount = 0
        const plotUpdates: Map<string, any> = new Map()

        for (let i = 0; i < current.plots.length; i++) {
          const plot = current.plots[i]
          
          if (plot.type === 'building' && plot.buildingId) {
            const building = getBuildingById(plot.buildingId)
            if (building?.production && Object.keys(building.production).length > 0) {
              const lastProduction = (plot as any).lastProduction || now
              const elapsed = now - lastProduction
              
              if (elapsed >= building.productionRate) {
                hasChanges = true
                let actualProduction = building.production
                
                if (building.id === 'windmill' || building.id === 'solar_panel') {
                  actualProduction = { ...actualProduction }
                  if (actualProduction.energy) {
                    actualProduction.energy = Math.floor(actualProduction.energy * (modifiers?.energyProductionMultiplier || 1))
                  }
                }
                
                Object.entries(actualProduction).forEach(([key, value]) => {
                  resourceChanges[key as keyof Resources] = (resourceChanges[key as keyof Resources] || 0) + (value || 0)
                })
                
                plotUpdates.set(plot.id, { lastProduction: now })
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
                hasChanges = true
                const production = calculateAnimalProduction(animal.production, modifiers)
                Object.entries(production).forEach(([key, value]) => {
                  resourceChanges[key as keyof Resources] = (resourceChanges[key as keyof Resources] || 0) + (value || 0)
                })
                animalProductCount++
                plotUpdates.set(plot.id, { ...(plotUpdates.get(plot.id) || {}), lastProduction: now })
              }
              
              if (timeSinceFed >= animal.feedInterval && canAfford(current.resources, animal.feedCost)) {
                hasChanges = true
                Object.entries(animal.feedCost).forEach(([key, value]) => {
                  resourceChanges[key as keyof Resources] = (resourceChanges[key as keyof Resources] || 0) - (value || 0)
                })
                plotUpdates.set(plot.id, { ...(plotUpdates.get(plot.id) || {}), lastFed: now })
              }
            }
          }
        }

        if (!hasChanges) return current

        const newPlots = current.plots.map(plot => {
          const updates = plotUpdates.get(plot.id)
          return updates ? { ...plot, ...updates } : plot
        })

        let updated = {
          ...current,
          resources: addResources(current.resources, resourceChanges),
          plots: newPlots,
          totalAnimalProducts: current.totalAnimalProducts + animalProductCount
        }
        
        updated = checkAchievements(updated)
        return updated
      })
    }, 200)

    return () => clearInterval(interval)
  }, [setGameState])

  useEffect(() => {
    const newAchievements = gameState.achievements.filter(
      a => !previousAchievements.includes(a)
    )
    
    if (newAchievements.length > 0 && previousAchievements.length > 0) {
      const latestAchievement = newAchievements[0]
      const achievementData = getAchievementById(latestAchievement)
      if (achievementData) {
        const achievementIcon = achievementData.category === 'harvest' ? '🌾' : 
                achievementData.category === 'wealth' ? '💰' :
                achievementData.category === 'tech' ? '🔬' :
                achievementData.category === 'animals' ? '🐄' :
                achievementData.category === 'automation' ? '🏭' : '⭐'
        
        setAchievementPopup({
          name: achievementData.name,
          description: achievementData.description,
          tier: achievementData.tier,
          icon: achievementIcon
        })
        
        addNotification({
          type: 'achievement',
          title: achievementData.name,
          message: achievementData.description,
          icon: achievementIcon
        })
        
        setUnlockQueue(prev => [...prev, {
          id: `ach-${latestAchievement}-${Date.now()}`,
          type: 'achievement',
          title: achievementData.name,
          description: achievementData.description,
          icon: achievementIcon
        }])
      }
    }
    
    setPreviousAchievements(gameState.achievements)
  }, [gameState.achievements.length, gameState.achievements, previousAchievements.length])

  useEffect(() => {
    const newTechs = gameState.techs.filter(
      t => !previousTechs.includes(t)
    )
    
    if (newTechs.length > 0 && previousTechs.length > 0) {
      newTechs.forEach(techId => {
        const tech = getTechById(techId)
        if (tech) {
          addNotification({
            type: 'tech',
            title: `Researched: ${tech.name}`,
            message: tech.description,
          })
          
          setUnlockQueue(prev => [...prev, {
            id: `tech-${techId}-${Date.now()}`,
            type: 'tech',
            title: tech.name,
            description: tech.description,
          }])
        }
      })
    }
    
    setPreviousTechs(gameState.techs)
  }, [gameState.techs.length, gameState.techs, previousTechs.length])

  useEffect(() => {
    if (currentTab === 'log') {
      setRecentLogCount(0)
    }
  }, [currentTab])

  useEffect(() => {
    if (currentTab !== 'log') {
      setRecentLogCount(prev => Math.min(prev + 1, 99))
    }
  }, [gameState.activityLog.length])

  const modifiers = useMemo(() => {
    return (applyTechEffects(gameState) as any)._modifiers
  }, [gameState.techs.length, gameState.prestigeMultiplier])

  const handlePlotClick = useCallback((plotId: string, event: React.MouseEvent) => {
    const plot = gameState.plots.find(p => p.id === plotId)
    if (!plot) return

    if (plot.type === 'empty') {
      setSelectedPlotId(plotId)
      setPlacementDialogOpen(true)
    } else if (plot.type === 'crop' && plot.completesAt && plot.completesAt <= Date.now()) {
      const crop = getCropById(plot.cropId!)
      if (crop) {
        const modifiers = (applyTechEffects(gameState) as any)._modifiers
        const baseYield = calculateYield(crop.yield, modifiers)
        
        const harvestBonus = rollHarvestBonus(gameState.luckLevel)
        const finalYield = applyHarvestBonus(baseYield, harvestBonus)
        
        const clickPosition = {
          x: event.clientX,
          y: event.clientY
        }
        
        setHarvestRoll({ rollValue: harvestBonus.rollValue, isCritical: harvestBonus.isCritical, position: clickPosition })
        
        setGameState(current => {
          if (!current) return gameState
          
          let updated = {
            ...current,
            resources: addResources(current.resources, finalYield),
            totalHarvested: current.totalHarvested + 1,
            totalGoldEarned: current.totalGoldEarned + (finalYield.gold || 0),
            criticalHarvestCount: current.criticalHarvestCount + (harvestBonus.isCritical ? 1 : 0),
            plots: current.plots.map(p =>
              p.id === plotId
                ? { ...p, type: 'empty' as const, cropId: undefined, plantedAt: undefined, completesAt: undefined }
                : p
            ),
          }
          
          updated = addActivityLog(updated, {
            type: 'harvest',
            message: `Harvested ${crop.name} (${harvestBonus.rollValue}% yield${harvestBonus.isCritical ? ' - CRITICAL!' : ''})`,
            resources: finalYield,
            icon: crop.icon,
          })
          
          return checkAchievements(updated)
        })
        
        toast.success(`Harvested ${crop.name}!`, {
          description: `${harvestBonus.isCritical ? '🎉 CRITICAL! ' : ''}${formatResourceGain(finalYield)} (${harvestBonus.rollValue}% yield)`,
          duration: harvestBonus.isCritical ? 2000 : 1200,
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
  }, [gameState, modifiers, setGameState, setHarvestRoll, setSelectedPlotId, setPlacementDialogOpen])

  const handlePlaceCrop = useCallback((cropId: string) => {
    const crop = getCropById(cropId)
    if (!crop) return

    const modifiers = (applyTechEffects(gameState) as any)._modifiers
    const cost = calculateCost(crop.cost, modifiers)
    const growTime = calculateGrowTime(crop.growTime, modifiers)

    let plotIds: string[] = []
    
    if (bulkPlantRowIndex !== null) {
      const rowPlots = gameState.plots.slice(bulkPlantRowIndex * 5, (bulkPlantRowIndex + 1) * 5)
      plotIds = rowPlots.filter(p => p.type === 'empty').map(p => p.id)
    } else if (selectedPlotId) {
      plotIds = [selectedPlotId]
    }

    if (plotIds.length === 0) return

    const totalCost: Partial<import('@/lib/types').Resources> = {}
    Object.entries(cost).forEach(([key, value]) => {
      totalCost[key as keyof import('@/lib/types').Resources] = (value || 0) * plotIds.length
    })

    if (!canAfford(gameState.resources, totalCost)) {
      toast.error(`Not enough resources! Need: ${formatResourceGain(totalCost)}`)
      return
    }

    setGameState(current => {
      if (!current) return gameState
      
      const now = Date.now()
      const completesAt = now + growTime

      let updated = {
        ...current,
        resources: deductResources(current.resources, totalCost),
        plots: current.plots.map(p =>
          plotIds.includes(p.id)
            ? { ...p, type: 'crop' as const, cropId, plantedAt: now, completesAt }
            : p
        ),
      }
      
      updated = addActivityLog(updated, {
        type: 'plant',
        message: plotIds.length > 1 
          ? `Planted ${plotIds.length}x ${crop.name}`
          : `Planted ${crop.name}`,
        icon: crop.icon,
      })
      
      return updated
    })

    toast.success(plotIds.length > 1 
      ? `Planted ${plotIds.length}x ${crop.name}!`
      : `Planted ${crop.name}!`, 
      { duration: 1000 }
    )
    
    setSelectedPlotId(null)
    setBulkPlantRowIndex(null)
    setPlacementDialogOpen(false)
  }, [bulkPlantRowIndex, selectedPlotId, gameState, setGameState])

  const handlePlaceAnimal = useCallback((animalId: string) => {
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

    toast.success(`Purchased ${animal.name}!`, { duration: 1200 })
    setSelectedPlotId(null)
    setPlacementDialogOpen(false)
  }, [selectedPlotId, gameState, setGameState, setSelectedPlotId, setPlacementDialogOpen])

  const handlePlaceBuilding = useCallback((buildingId: string) => {
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

    toast.success(`Built ${building.name}!`, { duration: 1200 })
    setSelectedPlotId(null)
    setPlacementDialogOpen(false)
  }, [selectedPlotId, gameState, setGameState, setSelectedPlotId, setPlacementDialogOpen])

  const handlePurchaseTech = useCallback((techId: string) => {
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
      duration: 2000,
    })
  }, [gameState, setGameState])

  const handleCancelTask = useCallback((taskId: string) => {
    setGameState(current => {
      if (!current) return gameState
      
      return {
        ...current,
        queue: current.queue.filter(t => t.id !== taskId),
      }
    })
    toast.info('Task cancelled', { duration: 1000 })
  }, [gameState, setGameState])

  const handleCollectAll = useCallback(() => {
    const readyPlots = gameState.plots.filter(
      p => p.type === 'crop' && p.completesAt && p.completesAt <= Date.now()
    )

    if (readyPlots.length === 0) return

    let totalGold = 0
    let totalYields: Partial<import('@/lib/types').Resources> = {}
    let criticals = 0

    setGameState(current => {
      if (!current) return gameState

      const modifiers = (applyTechEffects(current) as any)._modifiers
      let updated = { ...current }

      readyPlots.forEach(plot => {
        const crop = getCropById(plot.cropId!)
        if (!crop) return

        const baseYield = calculateYield(crop.yield, modifiers)
        const harvestBonus = rollHarvestBonus(current.luckLevel)
        const finalYield = applyHarvestBonus(baseYield, harvestBonus)

        if (harvestBonus.isCritical) criticals++
        totalGold += finalYield.gold || 0

        Object.entries(finalYield).forEach(([key, value]) => {
          totalYields[key as keyof import('@/lib/types').Resources] = 
            (totalYields[key as keyof import('@/lib/types').Resources] || 0) + (value || 0)
        })

        updated.resources = addResources(updated.resources, finalYield)
      })

      updated.totalHarvested += readyPlots.length
      updated.totalGoldEarned += totalGold
      updated.criticalHarvestCount += criticals
      updated.plots = updated.plots.map(p => 
        readyPlots.some(rp => rp.id === p.id)
          ? { ...p, type: 'empty' as const, cropId: undefined, plantedAt: undefined, completesAt: undefined }
          : p
      )

      updated = addActivityLog(updated, {
        type: 'harvest',
        message: `Bulk harvested ${readyPlots.length} crops${criticals > 0 ? ` (${criticals} criticals!)` : ''}`,
        resources: totalYields,
        icon: '🌾',
      })

      return checkAchievements(updated)
    })

    toast.success(`Collected ${readyPlots.length} crops!`, {
      description: `${criticals > 0 ? `🎉 ${criticals} Critical! ` : ''}${formatResourceGain(totalYields)}`,
      duration: 2000,
    })
  }, [gameState, setGameState])

  const handleBulkPlantRow = useCallback((rowIndex: number) => {
    setBulkPlantRowIndex(rowIndex)
    setPlacementDialogOpen(true)
  }, [])

  const unlockedCrops = useMemo(() => getUnlockedCrops(gameState.techs), [gameState.techs.length])
  const unlockedAnimals = useMemo(() => getUnlockedAnimals(gameState.techs), [gameState.techs.length])
  const unlockedBuildings = useMemo(() => getUnlockedBuildings(gameState.techs), [gameState.techs.length])
  const availableTechs = useMemo(() => getAvailableTechs(gameState.techs), [gameState.techs.length])

  const readyToHarvest = useMemo(() => 
    gameState.plots.filter(
      p => p.type === 'crop' && p.completesAt && p.completesAt <= Date.now()
    ).length,
    [gameState.plots]
  )

  const newAchievements = useMemo(() => 
    gameState.achievements.length - previousAchievements.filter(
      a => gameState.achievements.includes(a)
    ).length,
    [gameState.achievements, previousAchievements]
  )

  const hasResearchLab = useMemo(() => 
    gameState.plots.some(p => p.type === 'building' && p.buildingId === 'research_lab'),
    [gameState.plots]
  )

  const hasCompostHeap = useMemo(() => 
    gameState.plots.some(p => p.type === 'building' && p.buildingId === 'compost'),
    [gameState.plots]
  )

  const achievementProgress = useMemo<Record<string, number>>(() => ({
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
    lucky_first: gameState.criticalHarvestCount,
    lucky_10: gameState.criticalHarvestCount,
    lucky_50: gameState.criticalHarvestCount,
    lucky_100: gameState.criticalHarvestCount,
  }), [gameState.totalHarvested, gameState.totalGoldEarned, gameState.techs.length, 
      gameState.plots, gameState.totalAnimalProducts, gameState.criticalHarvestCount])

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" richColors closeButton duration={2000} />
      
      <UnlockNotificationManager unlocks={unlockQueue} />
      
      {harvestRoll && (
        <HarvestRollAnimation
          rollValue={harvestRoll.rollValue}
          isCritical={harvestRoll.isCritical}
          position={harvestRoll.position}
          onComplete={() => setHarvestRoll(null)}
        />
      )}
      
      {achievementPopup && (
        <AchievementPopup
          achievement={achievementPopup}
          onClose={() => setAchievementPopup(null)}
        />
      )}
      
      {!hasSeenTutorial && (
        <TutorialOverlay onComplete={() => setHasSeenTutorial(() => true)} />
      )}
      
      <HelpButton />
      <ChatBot gameState={gameState} />
      
      <div className="sticky top-0 z-40 bg-background/98 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto p-4 max-w-[1600px]">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1" />
              <h1 className="text-3xl font-bold text-center text-primary flex items-center gap-2">
                🌾 Farm Empire
              </h1>
              <div className="flex-1 flex justify-end">
                <NotificationsPanel />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground font-medium">Build your ultimate farming dynasty</p>
          </div>
          <ResourceBar resources={gameState.resources} />
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-[1600px]">
        <ResourceHelpBanner 
          resources={gameState.resources} 
          hasResearchLab={hasResearchLab}
          hasCompostHeap={hasCompostHeap}
        />
        
        <StatsOverview gameState={gameState} />
        
        <ProgressionPath gameState={gameState} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
          <div>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-6 mb-4 h-auto p-1">
                <TabsTrigger value="farm" className="flex flex-col items-center gap-1 py-2 px-3 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Farm weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Farm</span>
                  {readyToHarvest > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0 text-xs h-5 min-w-[20px] animate-pulse">
                      {readyToHarvest}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex flex-col items-center gap-1 py-2 px-3 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <TreeStructure weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Tech</span>
                  {availableTechs.length > 0 && (
                    <Badge variant="default" className="absolute -top-1 -right-1 px-1.5 py-0 text-xs h-5 min-w-[20px] bg-blue-500">
                      {availableTechs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex flex-col items-center gap-1 py-2 px-3 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Trophy weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Goals</span>
                  {newAchievements > 0 && currentTab !== 'achievements' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse border-2 border-background"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="progression" className="flex flex-col items-center gap-1 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Sparkle weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Progress</span>
                </TabsTrigger>
                <TabsTrigger value="log" className="flex flex-col items-center gap-1 py-2 px-3 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <ListBullets weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Log</span>
                  {recentLogCount > 0 && currentTab !== 'log' && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0 text-xs h-5 min-w-[20px] animate-pulse">
                      {recentLogCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="guide" className="flex flex-col items-center gap-1 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Book weight="fill" className="w-5 h-5" />
                  <span className="text-xs font-semibold">Guide</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="farm" className="mt-0">
                <FarmGrid 
                  plots={gameState.plots} 
                  onPlotClick={handlePlotClick}
                  onCollectAll={handleCollectAll}
                  onBulkPlantRow={handleBulkPlantRow}
                />
              </TabsContent>

              <TabsContent value="tech" className="mt-0 bg-card rounded-lg border p-4">
                <TechTree
                  techs={availableTechs}
                  researchPoints={gameState.resources.research}
                  onPurchase={handlePurchaseTech}
                  purchasedTechs={gameState.techs}
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

              <TabsContent value="guide" className="mt-0 h-[600px]">
                <ResourceCenter />
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
          setBulkPlantRowIndex(null)
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

function App() {
  return (
    <NotificationsProvider>
      <AppContent />
    </NotificationsProvider>
  )
}

export default App
