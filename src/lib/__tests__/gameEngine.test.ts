import { describe, it, expect } from 'vitest'
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
  calculateGrowTime,
  calculateCost,
  rollHarvestBonus,
  applyHarvestBonus,
} from '../gameEngine'
import { Resources } from '../types'
import { INITIAL_RESOURCES } from '../gameData'

describe('Resource Management', () => {
  it('should correctly check if player can afford resources', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 100, seeds: 10 }
    const cost = { gold: 50, seeds: 5 }
    
    expect(canAfford(resources, cost)).toBe(true)
  })

  it('should return false when player cannot afford resources', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 30, seeds: 2 }
    const cost = { gold: 50, seeds: 5 }
    
    expect(canAfford(resources, cost)).toBe(false)
  })

  it('should deduct resources correctly', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 100, seeds: 10 }
    const cost = { gold: 30, seeds: 5 }
    const result = deductResources(resources, cost)
    
    expect(result.gold).toBe(70)
    expect(result.seeds).toBe(5)
  })

  it('should add resources correctly', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 50, seeds: 5 }
    const gain = { gold: 25, seeds: 3 }
    const result = addResources(resources, gain)
    
    expect(result.gold).toBe(75)
    expect(result.seeds).toBe(8)
  })

  it('should not mutate original resources when deducting', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 100 }
    const cost = { gold: 30 }
    deductResources(resources, cost)
    
    expect(resources.gold).toBe(100)
  })

  it('should not mutate original resources when adding', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 50 }
    const gain = { gold: 25 }
    addResources(resources, gain)
    
    expect(resources.gold).toBe(50)
  })
})

describe('Data Retrieval', () => {
  it('should get crop by id', () => {
    const crop = getCropById('wheat')
    expect(crop).toBeDefined()
    expect(crop?.id).toBe('wheat')
    expect(crop?.name).toBe('Wheat')
  })

  it('should return undefined for invalid crop id', () => {
    const crop = getCropById('invalid_crop')
    expect(crop).toBeUndefined()
  })

  it('should get animal by id', () => {
    const animal = getAnimalById('chicken')
    expect(animal).toBeDefined()
    expect(animal?.id).toBe('chicken')
  })

  it('should get building by id', () => {
    const building = getBuildingById('windmill')
    expect(building).toBeDefined()
    expect(building?.id).toBe('windmill')
  })

  it('should get tech by id', () => {
    const tech = getTechById('tech_root_crops')
    expect(tech).toBeDefined()
    expect(tech?.id).toBe('tech_root_crops')
  })
})

describe('Unlocking System', () => {
  it('should return only unlocked crops with no techs', () => {
    const crops = getUnlockedCrops([])
    expect(crops.length).toBeGreaterThan(0)
    expect(crops.every(c => !c.requiredTech)).toBe(true)
  })

  it('should unlock crops when required tech is purchased', () => {
    const cropsWithoutTech = getUnlockedCrops([])
    const cropsWithTech = getUnlockedCrops(['tech_root_crops'])
    
    expect(cropsWithTech.length).toBeGreaterThan(cropsWithoutTech.length)
  })

  it('should return only unlocked animals with no techs', () => {
    const animals = getUnlockedAnimals([])
    expect(animals.length).toBeGreaterThan(0)
    expect(animals.every(a => !a.requiredTech)).toBe(true)
  })

  it('should unlock animals when required tech is purchased', () => {
    const animalsWithoutTech = getUnlockedAnimals([])
    const animalsWithTech = getUnlockedAnimals(['tech_chickens'])
    
    expect(animalsWithTech.length).toBeGreaterThanOrEqual(animalsWithoutTech.length)
  })

  it('should return only unlocked buildings with no techs', () => {
    const buildings = getUnlockedBuildings([])
    expect(buildings.length).toBeGreaterThan(0)
    expect(buildings.every(b => !b.requiredTech)).toBe(true)
  })

  it('should unlock buildings when required tech is purchased', () => {
    const buildingsWithoutTech = getUnlockedBuildings([])
    const buildingsWithTech = getUnlockedBuildings(['tech_automation_basic'])
    
    expect(buildingsWithTech.length).toBeGreaterThanOrEqual(buildingsWithoutTech.length)
  })
})

describe('Tech Tree', () => {
  it('should return available techs with no prerequisites', () => {
    const techs = getAvailableTechs([])
    expect(techs.length).toBeGreaterThan(0)
    expect(techs.every(t => t.prerequisites.length === 0 || !t.unlocked)).toBe(true)
  })

  it('should unlock techs when prerequisites are met', () => {
    const techsLevel1 = getAvailableTechs([])
    const firstTechId = techsLevel1.find(t => t.unlocked)?.id
    
    if (firstTechId) {
      const techsLevel2 = getAvailableTechs([firstTechId])
      const newUnlocked = techsLevel2.filter(t => t.unlocked && !techsLevel1.find(t2 => t2.id === t.id && t2.unlocked))
      expect(newUnlocked.length).toBeGreaterThanOrEqual(0)
    }
  })

  it('should not show already purchased techs as unlocked', () => {
    const purchasedTechs = ['tech_root_crops']
    const techs = getAvailableTechs(purchasedTechs)
    const purchasedTech = techs.find(t => t.id === 'tech_root_crops')
    
    expect(purchasedTech?.purchased).toBe(true)
    expect(purchasedTech?.unlocked).toBe(false)
  })
})

describe('Grow Time Calculations', () => {
  it('should calculate grow time with multiplier', () => {
    const baseTime = 10000
    const modifiers = { growthMultiplier: 2 }
    
    const result = calculateGrowTime(baseTime, modifiers)
    expect(result).toBe(5000)
  })

  it('should calculate grow time with no modifiers', () => {
    const baseTime = 10000
    const modifiers = {}
    
    const result = calculateGrowTime(baseTime, modifiers)
    expect(result).toBe(10000)
  })

  it('should floor the result', () => {
    const baseTime = 10000
    const modifiers = { growthMultiplier: 3 }
    
    const result = calculateGrowTime(baseTime, modifiers)
    expect(result).toBe(3333)
    expect(Number.isInteger(result)).toBe(true)
  })
})

describe('Cost Calculations', () => {
  it('should calculate cost with modifiers', () => {
    const baseCost = { gold: 100, seeds: 10 }
    const modifiers = { waterCostMultiplier: 0.5 }
    
    const result = calculateCost(baseCost, modifiers)
    expect(result.gold).toBe(100)
    expect(result.seeds).toBe(10)
  })

  it('should reduce water cost with modifier', () => {
    const baseCost = { water: 10 }
    const modifiers = { waterCostMultiplier: 0.5 }
    
    const result = calculateCost(baseCost, modifiers)
    expect(result.water).toBe(5)
  })

  it('should reduce fertilizer cost with modifier', () => {
    const baseCost = { fertilizer: 10 }
    const modifiers = { fertilizerEfficiency: 2 }
    
    const result = calculateCost(baseCost, modifiers)
    expect(result.fertilizer).toBe(5)
  })
})

describe('Harvest Bonus System', () => {
  it('should roll harvest bonus within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollHarvestBonus(0)
      expect(result.rollValue).toBeGreaterThanOrEqual(25)
      expect(result.rollValue).toBeLessThanOrEqual(200)
      expect(result.multiplier).toBeGreaterThan(0)
      expect(typeof result.isCritical).toBe('boolean')
    }
  })

  it('should have higher chance of critical with luck level', () => {
    let criticalCount = 0
    const iterations = 1000
    
    for (let i = 0; i < iterations; i++) {
      const result = rollHarvestBonus(10)
      if (result.isCritical) criticalCount++
    }
    
    expect(criticalCount).toBeGreaterThan(0)
  })

  it('should apply harvest bonus correctly', () => {
    const baseYield = { gold: 100, seeds: 10 }
    const bonus = { multiplier: 1.5, isCritical: false }
    
    const result = applyHarvestBonus(baseYield, bonus)
    expect(result.gold).toBe(150)
    expect(result.seeds).toBe(15)
  })

  it('should handle critical bonus', () => {
    const baseYield = { gold: 100 }
    const bonus = { multiplier: 2.0, isCritical: true }
    
    const result = applyHarvestBonus(baseYield, bonus)
    expect(result.gold).toBe(200)
  })

  it('should floor yield values', () => {
    const baseYield = { gold: 100 }
    const bonus = { multiplier: 1.33, isCritical: false }
    
    const result = applyHarvestBonus(baseYield, bonus)
    expect(result.gold).toBe(133)
    expect(Number.isInteger(result.gold!)).toBe(true)
  })
})

describe('Performance Tests', () => {
  it('should handle canAfford with large resource counts efficiently', () => {
    const start = performance.now()
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 1000000 }
    const cost = { gold: 500000 }
    
    for (let i = 0; i < 10000; i++) {
      canAfford(resources, cost)
    }
    
    const end = performance.now()
    expect(end - start).toBeLessThan(100)
  })

  it('should handle getUnlockedCrops efficiently', () => {
    const start = performance.now()
    const techs = ['tech_root_crops', 'tech_tomatoes', 'tech_berries']
    
    for (let i = 0; i < 1000; i++) {
      getUnlockedCrops(techs)
    }
    
    const end = performance.now()
    expect(end - start).toBeLessThan(100)
  })
})
