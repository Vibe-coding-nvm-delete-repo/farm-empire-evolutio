import { GameState, Resources, QueueTask, PlotState } from './types'
import { CROPS, BUILDINGS, TECH_TREE, ACHIEVEMENTS } from './gameData'

export function canAfford(resources: Resources, cost: Partial<Resources>): boolean {
  return Object.entries(cost).every(([key, value]) => {
    return resources[key as keyof Resources] >= (value || 0)
  })
}

export function deductResources(resources: Resources, cost: Partial<Resources>): Resources {
  const newResources = { ...resources }
  Object.entries(cost).forEach(([key, value]) => {
    newResources[key as keyof Resources] -= value || 0
  })
  return newResources
}

export function addResources(resources: Resources, gain: Partial<Resources>): Resources {
  const newResources = { ...resources }
  Object.entries(gain).forEach(([key, value]) => {
    newResources[key as keyof Resources] += value || 0
  })
  return newResources
}

export function getCropById(id: string) {
  return CROPS.find(c => c.id === id)
}

export function getBuildingById(id: string) {
  return BUILDINGS.find(b => b.id === id)
}

export function getTechById(id: string) {
  return TECH_TREE.find(t => t.id === id)
}

export function getAchievementById(id: string) {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export function getUnlockedCrops(techs: string[]) {
  return CROPS.map(crop => ({
    ...crop,
    unlocked: !crop.requiredTech || techs.includes(crop.requiredTech)
  })).filter(c => c.unlocked)
}

export function getUnlockedBuildings(techs: string[]) {
  return BUILDINGS.map(building => ({
    ...building,
    unlocked: !building.requiredTech || techs.includes(building.requiredTech)
  })).filter(b => b.unlocked)
}

export function getAvailableTechs(purchasedTechs: string[]) {
  return TECH_TREE.map(tech => {
    const prereqsMet = tech.prerequisites.every(prereq => purchasedTechs.includes(prereq))
    const alreadyPurchased = purchasedTechs.includes(tech.id)
    return {
      ...tech,
      unlocked: prereqsMet && !alreadyPurchased,
      purchased: alreadyPurchased,
    }
  })
}

export function applyTechEffects(state: GameState): GameState {
  let growthMultiplier = 1
  let yieldMultiplier = 1
  let waterCostMultiplier = 1
  let energyProductionMultiplier = 1
  let masterMultiplier = 1

  state.techs.forEach(techId => {
    const tech = getTechById(techId)
    if (!tech) return

    if (tech.effect.startsWith('growth_speed_')) {
      growthMultiplier *= parseFloat(tech.effect.split('_')[2])
    } else if (tech.effect.startsWith('yield_multiplier_')) {
      yieldMultiplier *= parseFloat(tech.effect.split('_')[2])
    } else if (tech.effect.startsWith('water_cost_')) {
      waterCostMultiplier *= parseFloat(tech.effect.split('_')[2])
    } else if (tech.effect.startsWith('energy_production_')) {
      energyProductionMultiplier *= parseFloat(tech.effect.split('_')[2])
    } else if (tech.effect.startsWith('master_multiplier_')) {
      masterMultiplier *= parseFloat(tech.effect.split('_')[2])
    }
  })

  const totalMultiplier = masterMultiplier

  return {
    ...state,
    _modifiers: {
      growthMultiplier: growthMultiplier * totalMultiplier,
      yieldMultiplier: yieldMultiplier * totalMultiplier * state.prestigeMultiplier,
      waterCostMultiplier,
      energyProductionMultiplier: energyProductionMultiplier * totalMultiplier,
    }
  } as any
}

export function calculateGrowTime(baseTime: number, modifiers: any): number {
  return baseTime / (modifiers?.growthMultiplier || 1)
}

export function calculateYield(baseYield: Partial<Resources>, modifiers: any): Partial<Resources> {
  const multiplier = modifiers?.yieldMultiplier || 1
  const result: Partial<Resources> = {}
  Object.entries(baseYield).forEach(([key, value]) => {
    result[key as keyof Resources] = Math.floor((value || 0) * multiplier)
  })
  return result
}

export function calculateCost(baseCost: Partial<Resources>, modifiers: any): Partial<Resources> {
  const result: Partial<Resources> = { ...baseCost }
  if (result.water && modifiers?.waterCostMultiplier) {
    result.water = Math.ceil(result.water * modifiers.waterCostMultiplier)
  }
  return result
}

export function processQueue(state: GameState): GameState {
  const now = Date.now()
  let newState = { ...state }
  
  const completedTasks = newState.queue.filter(task => 
    task.status === 'processing' && task.completesAt <= now
  )

  completedTasks.forEach(task => {
    if (task.type === 'harvest' && task.plotId) {
      const plot = newState.plots.find(p => p.id === task.plotId)
      if (plot && plot.cropId) {
        const crop = getCropById(plot.cropId)
        if (crop) {
          const modifiers = (newState as any)._modifiers
          const yield_ = calculateYield(crop.yield, modifiers)
          newState.resources = addResources(newState.resources, yield_)
          newState.totalHarvested++
          
          const plotIndex = newState.plots.findIndex(p => p.id === task.plotId)
          newState.plots[plotIndex] = {
            ...plot,
            type: 'empty',
            cropId: undefined,
            plantedAt: undefined,
            completesAt: undefined,
          }
        }
      }
    }
  })

  newState.queue = newState.queue.filter(task => task.completesAt > now)

  const queuedTask = newState.queue.find(task => task.status === 'queued')
  if (queuedTask) {
    newState.queue = newState.queue.map(task => 
      task.id === queuedTask.id 
        ? { ...task, status: 'processing' as const, startedAt: now } 
        : task
    )
  }

  return newState
}

export function checkAchievements(state: GameState): GameState {
  let newState = { ...state }
  let resourcesGained: Partial<Resources> = {}

  ACHIEVEMENTS.forEach(achievement => {
    if (newState.achievements.includes(achievement.id)) return

    let currentProgress = 0

    switch (achievement.category) {
      case 'harvest':
        currentProgress = newState.totalHarvested
        break
      case 'wealth':
        currentProgress = newState.totalGoldEarned
        break
      case 'tech':
        currentProgress = newState.techs.length
        break
      case 'automation':
        if (achievement.id === 'automation_first') {
          currentProgress = newState.plots.filter(p => 
            p.type === 'building' && p.buildingId && 
            ['windmill', 'compost', 'seed_maker', 'auto_harvester'].includes(p.buildingId)
          ).length
        } else if (achievement.id === 'queue_master') {
          currentProgress = newState.queue.length
        }
        break
      case 'special':
        if (achievement.id === 'diverse_farm') {
          const uniqueCrops = new Set(
            newState.plots.filter(p => p.cropId).map(p => p.cropId)
          )
          currentProgress = uniqueCrops.size
        } else if (achievement.id === 'prestige_ready') {
          currentProgress = newState.totalGoldEarned
        }
        break
    }

    if (currentProgress >= achievement.requirement) {
      newState.achievements.push(achievement.id)
      resourcesGained = addResources(resourcesGained as Resources, achievement.reward)
    }
  })

  if (Object.keys(resourcesGained).length > 0) {
    newState.resources = addResources(newState.resources, resourcesGained)
  }

  return newState
}
