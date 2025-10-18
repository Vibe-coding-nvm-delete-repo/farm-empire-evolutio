import { useKV } from '@github/spark/hooks'
import { GameState, PlotState } from '@/lib/types'
import { INITIAL_RESOURCES } from '@/lib/gameData'

const INITIAL_GAME_STATE: GameState = {
  resources: INITIAL_RESOURCES,
  plots: Array.from({ length: 16 }, (_, i) => ({
    id: `plot-${i}`,
    type: 'empty' as const,
    level: 1,
  })),
  queue: [],
  techs: [],
  achievements: [],
  totalHarvested: 0,
  totalGoldEarned: 0,
  prestigeLevel: 0,
  prestigeMultiplier: 1,
  startTime: Date.now(),
  lastSaveTime: Date.now(),
}

export function useGameState() {
  const [state, setState, deleteState] = useKV<GameState>('game-state', INITIAL_GAME_STATE)
  
  return [state || INITIAL_GAME_STATE, setState, deleteState] as const
}
