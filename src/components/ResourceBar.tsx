import { Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Flask } from '@phosphor-icons/react'
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
}

const RESOURCE_COLORS = {
  gold: 'text-accent',
  seeds: 'text-primary',
  water: 'text-blue-500',
  fertilizer: 'text-secondary',
  energy: 'text-yellow-400',
  research: 'text-purple-500',
}

const RESOURCE_DESCRIPTIONS = {
  gold: 'Main currency - Used to build structures and unlock plots. Earned from harvesting crops.',
  seeds: 'Required to plant crops. Gained from harvesting most crops.',
  water: 'Needed for growing crops. Build Wells to produce water automatically.',
  fertilizer: 'Required for advanced crops. Build Compost Heaps to generate fertilizer.',
  energy: 'Powers buildings and automation. Build Windmills to generate energy.',
  research: 'Unlocks technologies in the Tech Tree. Earned from special crops and Research Labs.',
}

export function ResourceBar({ resources }: ResourceBarProps) {
  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-lg">
      <TooltipProvider>
        <div className="flex flex-wrap gap-4 justify-around">
          {Object.entries(resources).map(([key, value]) => {
            const Icon = RESOURCE_ICONS[key as keyof Resources]
            const color = RESOURCE_COLORS[key as keyof Resources]
            const description = RESOURCE_DESCRIPTIONS[key as keyof Resources]
            
            return (
              <Tooltip key={key} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <Icon className={`${color} w-5 h-5`} weight="fill" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground capitalize">{key}</span>
                      <span className="text-lg font-semibold font-numeric">{Math.floor(value)}</span>
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
      </TooltipProvider>
    </Card>
  )
}
