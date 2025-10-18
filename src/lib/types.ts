export interface Resources {
  gold: number
  seeds: number
  water: number
  fertilizer: number
  energy: number
  research: number
}

export interface Crop {
  id: string
  name: string
  icon: string
  cost: Partial<Resources>
  growTime: number
  yield: Partial<Resources>
  unlocked: boolean
  requiredTech?: string
}

export interface Building {
  id: string
  name: string
  icon: string
  description: string
  cost: Partial<Resources>
  buildTime: number
  production?: Partial<Resources>
  productionRate: number
  unlocked: boolean
  requiredTech?: string
  capacity?: number
}

export interface Tech {
  id: string
  name: string
  description: string
  cost: number
  category: 'crops' | 'automation' | 'buildings' | 'efficiency' | 'exotic'
  unlocked: boolean
  purchased: boolean
  prerequisites: string[]
  effect: string
  x: number
  y: number
}

export interface PlotState {
  id: string
  type: 'empty' | 'crop' | 'building'
  cropId?: string
  buildingId?: string
  plantedAt?: number
  completesAt?: number
  level: number
}

export interface QueueTask {
  id: string
  type: 'plant' | 'harvest' | 'build' | 'research'
  targetId: string
  plotId?: string
  startedAt: number
  completesAt: number
  status: 'queued' | 'processing' | 'completed'
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: 'harvest' | 'wealth' | 'tech' | 'automation' | 'special'
  requirement: number
  progress: number
  completed: boolean
  reward: Partial<Resources>
}

export interface GameState {
  resources: Resources
  plots: PlotState[]
  queue: QueueTask[]
  techs: string[]
  achievements: string[]
  totalHarvested: number
  totalGoldEarned: number
  prestigeLevel: number
  prestigeMultiplier: number
  startTime: number
  lastSaveTime: number
}
