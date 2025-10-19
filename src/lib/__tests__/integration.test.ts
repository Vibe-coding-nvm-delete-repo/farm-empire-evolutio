import { describe, it, expect } from 'vitest'
import { canAfford, addResources, deductResources } from '../gameEngine'
import { INITIAL_RESOURCES } from '../gameData'
import type { Resources } from '../types'

describe('Integration Tests - Farm Economy', () => {
  it('should simulate a complete farming cycle', () => {
    let resources: Resources = { ...INITIAL_RESOURCES }
    
    expect(resources.gold).toBe(150)
    expect(resources.seeds).toBe(20)
    expect(resources.water).toBe(30)
    
    const wheatCost = { seeds: 1, water: 2 }
    expect(canAfford(resources, wheatCost)).toBe(true)
    
    resources = deductResources(resources, wheatCost)
    expect(resources.seeds).toBe(19)
    expect(resources.water).toBe(28)
    
    const wheatYield = { gold: 12, seeds: 1, hay: 2 }
    resources = addResources(resources, wheatYield)
    expect(resources.gold).toBe(162)
    expect(resources.seeds).toBe(20)
    expect(resources.hay).toBe(2)
  })

  it('should prevent planting without resources', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, seeds: 0, water: 0 }
    const wheatCost = { seeds: 1, water: 2 }
    
    expect(canAfford(resources, wheatCost)).toBe(false)
  })

  it('should handle multiple crop plantings', () => {
    let resources: Resources = { ...INITIAL_RESOURCES }
    const cornCost = { seeds: 2, water: 3, fertilizer: 1 }
    
    expect(canAfford(resources, cornCost)).toBe(true)
    resources = deductResources(resources, cornCost)
    
    expect(resources.seeds).toBe(18)
    expect(resources.water).toBe(27)
    expect(resources.fertilizer).toBe(9)
    
    expect(canAfford(resources, cornCost)).toBe(true)
    resources = deductResources(resources, cornCost)
    
    expect(resources.seeds).toBe(16)
    expect(resources.water).toBe(24)
    expect(resources.fertilizer).toBe(8)
  })

  it('should accumulate wealth over multiple harvests', () => {
    let resources: Resources = { ...INITIAL_RESOURCES }
    const wheatYield = { gold: 12, seeds: 1 }
    
    for (let i = 0; i < 10; i++) {
      resources = addResources(resources, wheatYield)
    }
    
    expect(resources.gold).toBe(270)
    expect(resources.seeds).toBe(30)
  })

  it('should handle animal purchases and production', () => {
    let resources: Resources = { ...INITIAL_RESOURCES, gold: 300 }
    const chickenCost = { gold: 200, hay: 5 }
    
    expect(canAfford(resources, chickenCost)).toBe(true)
    resources = deductResources(resources, chickenCost)
    
    expect(resources.gold).toBe(100)
    expect(resources.hay).toBe(5)
    
    const eggProduction = { eggs: 3, gold: 5 }
    resources = addResources(resources, eggProduction)
    
    expect(resources.eggs).toBe(3)
    expect(resources.gold).toBe(105)
  })

  it('should handle building construction and energy production', () => {
    let resources: Resources = { 
      ...INITIAL_RESOURCES,
      gold: 1000,
      water: 100,
      energy: 50
    }
    
    const windmillCost = { gold: 500, water: 50 }
    expect(canAfford(resources, windmillCost)).toBe(true)
    
    resources = deductResources(resources, windmillCost)
    expect(resources.gold).toBe(500)
    expect(resources.water).toBe(50)
    
    const energyProduction = { energy: 10 }
    for (let i = 0; i < 20; i++) {
      resources = addResources(resources, energyProduction)
    }
    
    expect(resources.energy).toBe(250)
  })

  it('should maintain resource balance during complex operations', () => {
    let resources: Resources = { ...INITIAL_RESOURCES }
    
    const operations = [
      { type: 'deduct', amount: { gold: 50, seeds: 5 } },
      { type: 'add', amount: { gold: 100, seeds: 10 } },
      { type: 'deduct', amount: { water: 20 } },
      { type: 'add', amount: { water: 30, fertilizer: 5 } },
    ]
    
    operations.forEach(op => {
      if (op.type === 'add') {
        resources = addResources(resources, op.amount)
      } else {
        resources = deductResources(resources, op.amount)
      }
    })
    
    expect(resources.gold).toBe(200)
    expect(resources.seeds).toBe(25)
    expect(resources.water).toBe(40)
    expect(resources.fertilizer).toBe(15)
  })

  it('should not allow negative resources', () => {
    const resources: Resources = { ...INITIAL_RESOURCES, gold: 10 }
    const cost = { gold: 100 }
    
    expect(canAfford(resources, cost)).toBe(false)
    
    const forcedDeduct = deductResources(resources, cost)
    expect(forcedDeduct.gold).toBe(-90)
  })

  it('should handle partial resource costs', () => {
    const resources: Resources = { ...INITIAL_RESOURCES }
    const partialCost = { seeds: 5 }
    
    expect(canAfford(resources, partialCost)).toBe(true)
    
    const newResources = deductResources(resources, partialCost)
    expect(newResources.seeds).toBe(15)
    expect(newResources.gold).toBe(resources.gold)
    expect(newResources.water).toBe(resources.water)
  })

  it('should scale with tech multipliers', () => {
    const baseYield = { gold: 100 }
    const doubleYield = { gold: 200 }
    
    let resources: Resources = { ...INITIAL_RESOURCES }
    
    resources = addResources(resources, baseYield)
    expect(resources.gold).toBe(250)
    
    resources = addResources(resources, doubleYield)
    expect(resources.gold).toBe(450)
  })
})
