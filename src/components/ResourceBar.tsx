import { Resources } from '@/lib/types'
import { Coin, Plant, Drop, Leaf, Lightning, Flask } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

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

export function ResourceBar({ resources }: ResourceBarProps) {
  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-lg">
      <div className="flex flex-wrap gap-4 justify-around">
        {Object.entries(resources).map(([key, value]) => {
          const Icon = RESOURCE_ICONS[key as keyof Resources]
          const color = RESOURCE_COLORS[key as keyof Resources]
          
          return (
            <motion.div
              key={key}
              className="flex items-center gap-2"
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className={`${color} w-5 h-5`} weight="fill" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
                <span className="text-lg font-semibold font-numeric">{Math.floor(value)}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
