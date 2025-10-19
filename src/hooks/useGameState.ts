import { useKV } from '@github/spark/hooks'
import { useCallback } from 'react'
import { GameState, PlotState } from '@/lib/types'
import { INITIAL_RESOURCES } from '@/lib/gameData'

const INITIAL_GAME_STATE: GameState = {
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

function validateGameState(state: any): GameState {
  if (!state) {
    return INITIAL_GAME_STATE
  }
  
  const validatedResources: any = {}
  if (state.resources) {
    Object.entries(INITIAL_RESOURCES).forEach(([key, defaultValue]) => {
      const value = state.resources[key]
      validatedResources[key] = (typeof value === 'number' && !isNaN(value) && isFinite(value)) 
        ? value 
        : defaultValue
    })
  } else {
    Object.assign(validatedResources, INITIAL_RESOURCES)
  }
  
  return {
    ...INITIAL_GAME_STATE,
    ...state,
    resources: validatedResources,
    plots: (state.plots && state.plots.length > 0) ? state.plots : INITIAL_GAME_STATE.plots,
    queue: state.queue || [],
    techs: state.techs || [],
    achievements: state.achievements || [],
    activityLog: state.activityLog || [],
    luckLevel: state.luckLevel ?? 0,
    criticalHarvestCount: state.criticalHarvestCount ?? 0,
    totalAnimalProducts: state.totalAnimalProducts ?? 0,
    totalHarvested: state.totalHarvested ?? 0,
    totalGoldEarned: state.totalGoldEarned ?? 0,
    prestigeLevel: state.prestigeLevel ?? 0,
    prestigeMultiplier: state.prestigeMultiplier ?? 1,
    startTime: state.startTime || Date.now(),
    lastSaveTime: state.lastSaveTime || Date.now(),
  }
}

export function useGameState() {
  const [state, setStateRaw, deleteState] = useKV<GameState>('game-state', INITIAL_GAME_STATE)
  
  const validatedState = validateGameState(state)
  
  const setState = useCallback((updater: GameState | ((prev: GameState) => GameState)) => {
    setStateRaw((prevState) => {
      const prev = validateGameState(prevState)
      const next = typeof updater === 'function' ? updater(prev) : updater
      return validateGameState(next)
    })
  }, [setStateRaw])
  
  return [validatedState, setState, deleteState] as const
}
