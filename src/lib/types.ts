export interface Resources {
  gold: number
  seeds: number
  water: number
  fertilizer: number
  energy: number
  research: number
  hay: number
  milk: number
  eggs: number
  wool: number
  leather: number
  meat: number
}

export interface Crop {
  id: string
  name: string
  icon: string
  description: string
  cost: Partial<Resources>
  growTime: number
  yield: Partial<Resources>
  unlocked: boolean
  requiredTech?: string
  tier: number
  category: 'basic' | 'vegetable' | 'fruit' | 'grain' | 'exotic'
}

export interface Animal {
  id: string
  name: string
  icon: string
  description: string
  cost: Partial<Resources>
  feedCost: Partial<Resources>
  feedInterval: number
  production: Partial<Resources>
  productionInterval: number
  unlocked: boolean
  requiredTech?: string
  tier: number
  category: 'poultry' | 'livestock' | 'exotic'
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
  tier: number
  category: 'production' | 'processing' | 'automation' | 'utility'
}

export interface Tech {
  id: string
  name: string
  description: string
  cost: number
  category: 'crops' | 'animals' | 'automation' | 'buildings' | 'efficiency' | 'processing' | 'exotic'
  unlocked: boolean
  purchased: boolean
  prerequisites: string[]
  effect: string
  tier: number
}

export interface PlotState {
  id: string
  type: 'empty' | 'crop' | 'building' | 'animal'
  cropId?: string
  buildingId?: string
  animalId?: string
  plantedAt?: number
  completesAt?: number
  lastFed?: number
  lastProduction?: number
  level: number
}

export interface QueueTask {
  id: string
  type: 'plant' | 'harvest' | 'build' | 'research' | 'feed' | 'collect'
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
  category: 'harvest' | 'wealth' | 'tech' | 'automation' | 'animals' | 'production' | 'special'
  requirement: number
  progress: number
  completed: boolean
  reward: Partial<Resources>
  tier: number
}

export interface ActivityLogEntry {
  id: string
  timestamp: number
  type: 'harvest' | 'plant' | 'build' | 'collect' | 'feed' | 'unlock' | 'achievement' | 'production'
  message: string
  resources?: Partial<Resources>
  icon?: string
}

export interface GameState {
  resources: Resources
  plots: PlotState[]
  queue: QueueTask[]
  techs: string[]
  achievements: string[]
  activityLog: ActivityLogEntry[]
  totalHarvested: number
  totalGoldEarned: number
  totalAnimalProducts: number
  prestigeLevel: number
  prestigeMultiplier: number
  startTime: number
  lastSaveTime: number
}
