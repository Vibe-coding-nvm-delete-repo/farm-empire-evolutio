import { Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Flask, Coffee, Egg, TShirt, Bag, Pizza } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { memo } from 'react'

interface ResourceBarProps {
  resources: Resources
}

const RESOURCE_ICONS = {
  gold: Coin,
  seeds: Plant,
  water: Drop,
  fertilizer: Leaf,
  energy: Lightning,
  research: Flask,
  hay: Coffee,
  milk: Drop,
  eggs: Egg,
  wool: TShirt,
  leather: Bag,
  meat: Pizza,
}

const RESOURCE_COLORS = {
  gold: 'text-amber-500',
  seeds: 'text-green-600',
  water: 'text-blue-500',
  fertilizer: 'text-emerald-600',
  energy: 'text-yellow-400',
  research: 'text-purple-500',
  hay: 'text-amber-600',
  milk: 'text-slate-300',
  eggs: 'text-orange-300',
  wool: 'text-gray-400',
  leather: 'text-amber-700',
  meat: 'text-red-500',
}

const RESOURCE_DESCRIPTIONS = {
  gold: 'Main currency for building structures and purchasing animals',
  seeds: 'Required to plant crops, gained from harvesting',
  water: 'Essential for crops, produced by Wells',
  fertilizer: '🔥 HOW TO GET: Build a Compost Heap! Unlock "Composting" in Tech tab, then build it. Produces 2 fertilizer every 10s. Needed for corn, tomatoes, and advanced crops.',
  energy: 'Powers buildings and automation, from Windmills',
  research: '🔥 HOW TO GET: 1) Build a Research Lab (available from start), OR 2) Harvest Tomatoes (unlock in Tech tab). Used to unlock technologies.',
  hay: 'Animal feed, from grain crops or Barns',
  milk: 'Produced by cows and goats, valuable commodity',
  eggs: 'Produced by chickens and ducks, steady income',
  wool: 'Produced by sheep and llamas, textile material',
  leather: 'Produced by livestock, crafting material',
  meat: 'Produced by pigs, valuable food product',
}

interface ResourceItemProps {
  resourceKey: keyof Resources
  value: number
  isMain?: boolean
}

const ResourceItem = memo(({ resourceKey, value, isMain }: ResourceItemProps) => {
  const Icon = RESOURCE_ICONS[resourceKey]
  const color = RESOURCE_COLORS[resourceKey]
  const description = RESOURCE_DESCRIPTIONS[resourceKey]
  const isLow = isMain && (resourceKey === 'fertilizer' || resourceKey === 'research') && value < 5
  
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-2 cursor-help relative ${isLow ? 'animate-pulse' : ''}`}>
          <Icon className={`${color} w-4 h-4`} weight="fill" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground capitalize leading-tight">{resourceKey}</span>
            <span className={`text-base font-semibold font-numeric leading-tight ${isLow ? 'text-destructive' : ''}`}>
              {Math.floor(value)}
            </span>
          </div>
          {isLow && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-md">
        <p className="font-semibold capitalize mb-1 text-base">{resourceKey}</p>
        <p className="text-sm leading-relaxed">{description}</p>
        {isLow && (
          <p className="text-xs text-destructive font-bold mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
            ⚠️ LOW! Hover here for help getting more!
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}, (prev, next) => {
  return Math.floor(prev.value) === Math.floor(next.value) && prev.resourceKey === next.resourceKey
})

ResourceItem.displayName = 'ResourceItem'

export const ResourceBar = memo(({ resources }: ResourceBarProps) => {
  const mainResources = ['gold', 'seeds', 'water', 'fertilizer', 'energy', 'research'] as const
  const animalResources = ['hay', 'milk', 'eggs', 'wool', 'leather', 'meat'] as const
  
  return (
    <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-md">
      <TooltipProvider>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start">
            {mainResources.map((key) => (
              <ResourceItem key={key} resourceKey={key} value={resources[key]} isMain />
            ))}
          </div>
          
          <div className="border-t pt-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start">
              {animalResources.map((key) => (
                <ResourceItem key={key} resourceKey={key} value={resources[key]} />
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Card>
  )
})

ResourceBar.displayName = 'ResourceBar'
