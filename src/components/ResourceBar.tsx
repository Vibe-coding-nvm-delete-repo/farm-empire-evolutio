import { Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Flask, Coffee, Egg, TShirt, Bag, Pizza } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  fertilizer: 'Needed for advanced crops, produced by Compost Heaps',
  energy: 'Powers buildings and automation, from Windmills',
  research: 'Unlocks technologies in the Tech Tree',
  hay: 'Animal feed, from grain crops or Barns',
  milk: 'Produced by cows and goats, valuable commodity',
  eggs: 'Produced by chickens and ducks, steady income',
  wool: 'Produced by sheep and llamas, textile material',
  leather: 'Produced by livestock, crafting material',
  meat: 'Produced by pigs, valuable food product',
}

export function ResourceBar({ resources }: ResourceBarProps) {
  const mainResources = ['gold', 'seeds', 'water', 'fertilizer', 'energy', 'research'] as const
  const animalResources = ['hay', 'milk', 'eggs', 'wool', 'leather', 'meat'] as const
  
  return (
    <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-md">
      <TooltipProvider>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start">
            {mainResources.map((key) => {
              const Icon = RESOURCE_ICONS[key]
              const color = RESOURCE_COLORS[key]
              const description = RESOURCE_DESCRIPTIONS[key]
              const value = resources[key]
              
              return (
                <Tooltip key={key} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-help">
                      <Icon className={`${color} w-4 h-4`} weight="fill" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground capitalize leading-tight">{key}</span>
                        <span className="text-base font-semibold font-numeric leading-tight">{Math.floor(value)}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold capitalize mb-1">{key}</p>
                    <p className="text-sm">{description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          
          <div className="border-t pt-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start">
              {animalResources.map((key) => {
                const Icon = RESOURCE_ICONS[key]
                const color = RESOURCE_COLORS[key]
                const description = RESOURCE_DESCRIPTIONS[key]
                const value = resources[key]
                
                return (
                  <Tooltip key={key} delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <Icon className={`${color} w-4 h-4`} weight="fill" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground capitalize leading-tight">{key}</span>
                          <span className="text-base font-semibold font-numeric leading-tight">{Math.floor(value)}</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold capitalize mb-1">{key}</p>
                      <p className="text-sm">{description}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Card>
  )
}
