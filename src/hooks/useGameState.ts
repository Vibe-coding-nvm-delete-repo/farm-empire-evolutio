import { useKV } from '@github/spark/hooks'
import { useCallback, useState, useEffect, useRef } from 'react'
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
  const [persistedState, setPersistedState, deleteState] = useKV<GameState>('game-state', INITIAL_GAME_STATE)
  const [localState, setLocalState] = useState<GameState>(() => validateGameState(persistedState))
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number>(Date.now())
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveRef = useRef<string>('')
  const isInitializedRef = useRef(false)
  
  useEffect(() => {
    if (!isInitializedRef.current && persistedState) {
      setLocalState(validateGameState(persistedState))
      isInitializedRef.current = true
    }
  }, [persistedState])
  
  const setState = useCallback((updater: GameState | ((prev: GameState) => GameState)) => {
    setLocalState((prevState) => {
      const next = typeof updater === 'function' ? updater(prevState) : updater
      const validated = validateGameState(next)
      
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      
      setIsSaving(true)
      saveTimerRef.current = setTimeout(async () => {
        const stateStr = JSON.stringify(validated)
        if (stateStr !== lastSaveRef.current) {
          lastSaveRef.current = stateStr
          await setPersistedState(() => validated)
          setLastSaved(Date.now())
          setIsSaving(false)
        } else {
          setIsSaving(false)
        }
      }, 1000)
      
      return validated
    })
  }, [setPersistedState])
  
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      const stateStr = JSON.stringify(localState)
      if (stateStr !== lastSaveRef.current) {
        setIsSaving(true)
        lastSaveRef.current = stateStr
        await setPersistedState(() => localState)
        setLastSaved(Date.now())
        setIsSaving(false)
      }
    }, 3000)
    
    return () => {
      clearInterval(saveInterval)
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      const stateStr = JSON.stringify(localState)
      if (stateStr !== lastSaveRef.current) {
        setPersistedState(() => localState)
      }
    }
  }, [localState, setPersistedState])
  
  return [localState, setState, deleteState, { isSaving, lastSaved }] as const
}
