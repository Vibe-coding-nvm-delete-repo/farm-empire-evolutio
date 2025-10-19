import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatBot } from '../ChatBot'
import { GameState } from '@/lib/types'
import { INITIAL_RESOURCES } from '@/lib/gameData'

const mockGameState: GameState = {
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
  startTime: Date.now(),
  lastSaveTime: Date.now(),
  luckLevel: 0,
  criticalHarvestCount: 0,
}

;(window as any).spark = {
  llmPrompt: vi.fn((strings, ...values) => strings.join('')),
  llm: vi.fn(async () => 'Test response from AI advisor'),
}

describe('ChatBot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders chat button when closed', () => {
    render(<ChatBot gameState={mockGameState} />)
    const button = screen.getByRole('button')
    expect(button).toBeDefined()
  })

  it('opens chat interface when button is clicked', async () => {
    render(<ChatBot gameState={mockGameState} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('AI Farm Advisor')).toBeDefined()
    })
  })

  it('sends message and receives AI response', async () => {
    render(<ChatBot gameState={mockGameState} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask:/)).toBeDefined()
    })
    
    const input = screen.getByPlaceholderText(/Ask:/)
    fireEvent.change(input, { target: { value: 'How do I get fertilizer?' } })
    
    const sendButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')
    )
    if (sendButton) {
      fireEvent.click(sendButton)
    }
    
    await waitFor(() => {
      expect((window as any).spark.llm).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
})
