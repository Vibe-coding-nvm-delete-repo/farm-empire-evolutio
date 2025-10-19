import { GameState, Resources, PlotState, ActivityLogEntry } from './types'
import { CROPS, BUILDINGS, TECH_TREE, ACHIEVEMENTS, ANIMALS } from './gameData'
import { memoize } from './performance'

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

export const getCropById = memoize((id: string) => {
  return CROPS.find(c => c.id === id)
})

export const getAnimalById = memoize((id: string) => {
  return ANIMALS.find(a => a.id === id)
})

export const getBuildingById = memoize((id: string) => {
  return BUILDINGS.find(b => b.id === id)
})

export const getTechById = memoize((id: string) => {
  return TECH_TREE.find(t => t.id === id)
})

export const getAchievementById = memoize((id: string) => {
  return ACHIEVEMENTS.find(a => a.id === id)
})

export const getUnlockedCrops = memoize((techs: string[]) => {
  return CROPS.map(crop => ({
    ...crop,
    unlocked: !crop.requiredTech || techs.includes(crop.requiredTech)
  })).filter(c => c.unlocked)
}, (techs) => techs.sort().join(','))

export const getUnlockedAnimals = memoize((techs: string[]) => {
  return ANIMALS.map(animal => ({
    ...animal,
    unlocked: !animal.requiredTech || techs.includes(animal.requiredTech)
  })).filter(a => a.unlocked)
}, (techs) => techs.sort().join(','))

export const getUnlockedBuildings = memoize((techs: string[]) => {
  return BUILDINGS.map(building => ({
    ...building,
    unlocked: !building.requiredTech || techs.includes(building.requiredTech)
  })).filter(b => b.unlocked)
}, (techs) => techs.sort().join(','))

export const getAvailableTechs = memoize((purchasedTechs: string[]) => {
  return TECH_TREE.map(tech => {
    const prereqsMet = tech.prerequisites.every(prereq => purchasedTechs.includes(prereq))
    const alreadyPurchased = purchasedTechs.includes(tech.id)
    return {
      ...tech,
      unlocked: prereqsMet && !alreadyPurchased,
      purchased: alreadyPurchased,
    }
  }).filter(t => t.unlocked || t.purchased)
}, (techs) => techs.sort().join(','))

export function applyTechEffects(state: GameState): GameState {
  let growthMultiplier = 1
  let yieldMultiplier = 1
  let waterCostMultiplier = 1
  let energyProductionMultiplier = 1
  let fertilizerEfficiency = 1
  let animalProduction = 1
  let animalYield = 1
  let cropRotation = 1
  let masterMultiplier = 1
  let luckLevel = 0

  state.techs.forEach(techId => {
    const tech = getTechById(techId)
    if (!tech) return

    const effectParts = tech.effect.split('_')
    const lastPart = effectParts[effectParts.length - 1]
    const multiplier = parseFloat(lastPart)

    if (tech.effect.startsWith('growth_speed_') && !isNaN(multiplier)) {
      growthMultiplier *= multiplier
    } else if (tech.effect.startsWith('yield_multiplier_') && !isNaN(multiplier)) {
      yieldMultiplier *= multiplier
    } else if (tech.effect.startsWith('water_cost_') && !isNaN(multiplier)) {
      waterCostMultiplier *= multiplier
    } else if (tech.effect.startsWith('energy_production_') && !isNaN(multiplier)) {
      energyProductionMultiplier *= multiplier
    } else if (tech.effect.startsWith('fertilizer_efficiency_') && !isNaN(multiplier)) {
      fertilizerEfficiency *= multiplier
    } else if (tech.effect.startsWith('animal_production_') && !isNaN(multiplier)) {
      animalProduction *= multiplier
    } else if (tech.effect.startsWith('animal_yield_') && !isNaN(multiplier)) {
      animalYield *= multiplier
    } else if (tech.effect.startsWith('crop_rotation_') && !isNaN(multiplier)) {
      cropRotation *= multiplier
    } else if (tech.effect.startsWith('master_multiplier_') && !isNaN(multiplier)) {
      masterMultiplier *= multiplier
    } else if (tech.effect.startsWith('luck_level_') && !isNaN(multiplier)) {
      luckLevel += multiplier
    }
  })

  const totalMultiplier = masterMultiplier

  return {
    ...state,
    luckLevel,
    _modifiers: {
      growthMultiplier: growthMultiplier * totalMultiplier,
      yieldMultiplier: yieldMultiplier * cropRotation * totalMultiplier * state.prestigeMultiplier,
      waterCostMultiplier,
      energyProductionMultiplier: energyProductionMultiplier * totalMultiplier,
      fertilizerEfficiency: fertilizerEfficiency * totalMultiplier,
      animalProduction: animalProduction * totalMultiplier,
      animalYield: animalYield * totalMultiplier,
    }
  } as any
}

export function calculateGrowTime(baseTime: number, modifiers: any): number {
  return Math.floor(baseTime / (modifiers?.growthMultiplier || 1))
}

export function calculateYield(baseYield: Partial<Resources>, modifiers: any): Partial<Resources> {
  const multiplier = modifiers?.yieldMultiplier || 1
  const result: Partial<Resources> = {}
  Object.entries(baseYield).forEach(([key, value]) => {
    result[key as keyof Resources] = Math.floor((value || 0) * multiplier)
  })
  return result
}

export function rollHarvestBonus(luckLevel: number = 0): { multiplier: number, isCritical: boolean, rollValue: number } {
  const baseLuckBonus = luckLevel * 0.05
  const criticalChance = 0.1 + (luckLevel * 0.02)
  
  const roll = Math.random()
  
  if (roll < criticalChance) {
    const critMultiplier = 1.5 + (Math.random() * 0.5) + (luckLevel * 0.1)
    return { 
      multiplier: critMultiplier, 
      isCritical: true,
      rollValue: Math.round(critMultiplier * 100)
    }
  }
  
  const normalMultiplier = 0.75 + (Math.random() * 0.75) + baseLuckBonus
  return { 
    multiplier: normalMultiplier, 
    isCritical: false,
    rollValue: Math.round(normalMultiplier * 100)
  }
}

export function applyHarvestBonus(baseYield: Partial<Resources>, bonus: { multiplier: number, isCritical: boolean }): Partial<Resources> {
  const result: Partial<Resources> = {}
  Object.entries(baseYield).forEach(([key, value]) => {
    result[key as keyof Resources] = Math.floor((value || 0) * bonus.multiplier)
  })
  return result
}

export function calculateCost(baseCost: Partial<Resources>, modifiers: any): Partial<Resources> {
  const result: Partial<Resources> = { ...baseCost }
  if (result.water && modifiers?.waterCostMultiplier) {
    result.water = Math.ceil(result.water * modifiers.waterCostMultiplier)
  }
  if (result.fertilizer && modifiers?.fertilizerEfficiency) {
    result.fertilizer = Math.ceil(result.fertilizer / modifiers.fertilizerEfficiency)
  }
  return result
}

export function calculateAnimalProduction(baseProduction: Partial<Resources>, modifiers: any): Partial<Resources> {
  const multiplier = (modifiers?.animalYield || 1)
  const result: Partial<Resources> = {}
  Object.entries(baseProduction).forEach(([key, value]) => {
    result[key as keyof Resources] = Math.floor((value || 0) * multiplier)
  })
  return result
}

export function calculateAnimalProductionInterval(baseInterval: number, modifiers: any): number {
  return Math.floor(baseInterval / (modifiers?.animalProduction || 1))
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

const achievementProgressCache = new Map<string, number>()
let lastAchievementCheck = 0
const ACHIEVEMENT_CHECK_THROTTLE = 1000

export function checkAchievements(state: GameState): GameState {
  const now = Date.now()
  
  if (now - lastAchievementCheck < ACHIEVEMENT_CHECK_THROTTLE) {
    return state
  }
  
  lastAchievementCheck = now
  
  let newState = { ...state }
  let resourcesGained: Partial<Resources> = {}
  let newAchievements: string[] = []
  
  const achievedSet = new Set(newState.achievements)
  let animalCount = -1
  let buildingCount = -1
  let uniqueCrops: Set<string> | null = null
  let uniqueAnimals: Set<string> | null = null

  for (const achievement of ACHIEVEMENTS) {
    if (achievedSet.has(achievement.id)) continue

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
      case 'animals':
        if (animalCount === -1) {
          animalCount = newState.plots.filter(p => p.type === 'animal').length
        }
        currentProgress = animalCount
        break
      case 'production':
        currentProgress = newState.totalAnimalProducts
        break
      case 'automation':
        if (buildingCount === -1) {
          buildingCount = newState.plots.filter(p => 
            p.type === 'building' && p.buildingId && 
            ['windmill', 'compost', 'seed_maker', 'auto_harvester', 'well', 'research_lab', 'solar_panel'].includes(p.buildingId)
          ).length
        }
        currentProgress = buildingCount
        break
      case 'special':
        if (achievement.id === 'diverse_farm') {
          if (!uniqueCrops) {
            uniqueCrops = new Set(newState.plots.filter(p => p.cropId).map(p => p.cropId!))
          }
          currentProgress = uniqueCrops.size
        } else if (achievement.id === 'diverse_ranch') {
          if (!uniqueAnimals) {
            uniqueAnimals = new Set(newState.plots.filter(p => p.animalId).map(p => p.animalId!))
          }
          currentProgress = uniqueAnimals.size
        } else if (achievement.id === 'empire_builder') {
          if (buildingCount === -1) {
            buildingCount = newState.plots.filter(p => p.type === 'building').length
          }
          currentProgress = buildingCount
        } else if (achievement.id.startsWith('lucky_')) {
          currentProgress = newState.criticalHarvestCount
        }
        break
    }

    if (currentProgress >= achievement.requirement) {
      newState.achievements = [...newState.achievements, achievement.id]
      achievedSet.add(achievement.id)
      newAchievements.push(achievement.id)
      resourcesGained = addResources(resourcesGained as Resources, achievement.reward)
    }
  }

  if (Object.keys(resourcesGained).length > 0) {
    newState.resources = addResources(newState.resources, resourcesGained)
  }

  return newState
}

export function addActivityLog(state: GameState, entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): GameState {
  const newEntry: ActivityLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
  }
  
  return {
    ...state,
    activityLog: [newEntry, ...state.activityLog].slice(0, 200),
  }
}

export function formatResourceGain(resources: Partial<Resources>): string {
  return Object.entries(resources)
    .filter(([_, v]) => v && v > 0)
    .map(([k, v]) => `${v} ${k}`)
    .join(', ')
}
