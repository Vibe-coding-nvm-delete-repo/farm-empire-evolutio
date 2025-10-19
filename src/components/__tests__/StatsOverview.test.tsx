import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsOverview } from '../StatsOverview'
import { GameState } from '@/lib/types'
import { INITIAL_RESOURCES } from '@/lib/gameData'

const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
  resources: INITIAL_RESOURCES,
  plots: Array.from({ length: 20 }, (_, i) => ({
    id: `plot-${i}`,
    type: 'empty' as const,
    level: 1,
  })),
  queue: [],
  techs: [],
  achievements: [],
  activityLog: [],
  totalHarvested: 0,
  totalGoldEarned: 0,
  totalAnimalProducts: 0,
  prestigeLevel: 0,
  prestigeMultiplier: 1,
  startTime: Date.now() - 60000,
  lastSaveTime: Date.now(),
  luckLevel: 0,
  criticalHarvestCount: 0,
  ...overrides,
})

describe('StatsOverview', () => {
  it('renders all stat cards', () => {
    const gameState = createMockGameState()
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText('Total Gold')).toBeDefined()
    expect(screen.getByText('Harvests')).toBeDefined()
    expect(screen.getByText('Technologies')).toBeDefined()
    expect(screen.getByText('Achievements')).toBeDefined()
    expect(screen.getByText('Active Plots')).toBeDefined()
    expect(screen.getByText('Playtime')).toBeDefined()
  })

  it('displays correct harvest count', () => {
    const gameState = createMockGameState({ totalHarvested: 50 })
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText('50')).toBeDefined()
  })

  it('displays correct gold amount with locale formatting', () => {
    const gameState = createMockGameState({ totalGoldEarned: 10000 })
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText('10,000')).toBeDefined()
  })

  it('displays correct tech count', () => {
    const gameState = createMockGameState({ techs: ['tech1', 'tech2', 'tech3'] })
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText('3')).toBeDefined()
  })

  it('calculates playtime correctly', () => {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    const gameState = createMockGameState({ startTime: fiveMinutesAgo })
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText(/5m/)).toBeDefined()
  })

  it('displays active plots ratio correctly', () => {
    const gameState = createMockGameState({
      plots: [
        ...Array.from({ length: 5 }, (_, i) => ({ id: `${i}`, type: 'crop' as const, cropId: 'wheat', level: 1 })),
        ...Array.from({ length: 15 }, (_, i) => ({ id: `${i+5}`, type: 'empty' as const, level: 1 })),
      ]
    })
    render(<StatsOverview gameState={gameState} />)
    
    expect(screen.getByText('5/20')).toBeDefined()
  })
})
